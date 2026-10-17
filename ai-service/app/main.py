
from pathlib import Path
import os
import tempfile

import cv2
import numpy as np
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO

app = FastAPI(
    title="Maritime Intelligence AI Service",
    description="AI inference service for image and video vessel detection.",
    version="0.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = Path(__file__).resolve().parent.parent / "vessel_poc_best.pt"
MODEL_NAME = "vessel_poc_best.pt"

MAX_IMAGE_BYTES = 10 * 1024 * 1024
MAX_VIDEO_BYTES = 100 * 1024 * 1024
MAX_VIDEO_SECONDS = 30
FRAME_INTERVAL_SECONDS = 1.0

ALLOWED_VIDEO_EXTENSIONS = {".mp4", ".mov", ".avi"}

model = None


def get_model():
    global model

    if model is None:
        if not MODEL_PATH.exists():
            raise HTTPException(
                status_code=500,
                detail="YOLOv8 model file was not found.",
            )
        model = YOLO(str(MODEL_PATH))

    return model


def detect_frame(detector, frame):
    results = detector.predict(
        source=frame,
        imgsz=320,
        conf=0.25,
        verbose=False,
    )

    detections = []

    for result in results:
        if result.boxes is None:
            continue

        for box in result.boxes:
            class_id = int(box.cls.item())
            confidence = float(box.conf.item())
            x1, y1, x2, y2 = box.xyxy[0].tolist()

            detections.append(
                {
                    "class_id": class_id,
                    "class_name": result.names[class_id],
                    "confidence": round(confidence, 4),
                    "bbox": {
                        "x1": round(x1, 2),
                        "y1": round(y1, 2),
                        "x2": round(x2, 2),
                        "y2": round(y2, 2),
                    },
                }
            )

    return detections


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "maritime-intelligence-ai",
        "model": MODEL_NAME,
        "classes": ["Container", "Sampan", "Tanker", "Tugboat", "Yacht"],
    }


@app.post("/detect")
async def detect_objects(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a valid image file.",
        )

    image_bytes = await file.read()

    if not image_bytes:
        raise HTTPException(status_code=400, detail="The uploaded image is empty.")

    if len(image_bytes) > MAX_IMAGE_BYTES:
        raise HTTPException(status_code=413, detail="Image size must not exceed 10 MB.")

    image_array = np.frombuffer(image_bytes, dtype=np.uint8)
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

    if image is None:
        raise HTTPException(
            status_code=400,
            detail="The uploaded file could not be decoded as an image.",
        )

    try:
        detector = get_model()
        detections = detect_frame(detector, image)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Object detection failed.") from exc

    return {
        "success": True,
        "model": MODEL_NAME,
        "image": {
            "width": int(image.shape[1]),
            "height": int(image.shape[0]),
        },
        "detection_count": len(detections),
        "detections": detections,
    }


@app.post("/detect-video")
async def detect_video(file: UploadFile = File(...)):
    filename = file.filename or ""
    extension = Path(filename).suffix.lower()

    if extension not in ALLOWED_VIDEO_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Unsupported video format. Upload an MP4, MOV, or AVI file.",
        )

    video_bytes = await file.read()

    if not video_bytes:
        raise HTTPException(status_code=400, detail="The uploaded video is empty.")

    if len(video_bytes) > MAX_VIDEO_BYTES:
        raise HTTPException(
            status_code=413,
            detail="Video size must not exceed 100 MB.",
        )

    temp_path = None
    capture = None

    try:
        with tempfile.NamedTemporaryFile(
            suffix=extension,
            delete=False,
        ) as temp_file:
            temp_file.write(video_bytes)
            temp_path = temp_file.name

        capture = cv2.VideoCapture(temp_path)

        if not capture.isOpened():
            raise HTTPException(
                status_code=400,
                detail="The video could not be opened. Try another MP4, MOV, or AVI file.",
            )

        fps = capture.get(cv2.CAP_PROP_FPS)
        total_video_frames = capture.get(cv2.CAP_PROP_FRAME_COUNT)

        if not fps or fps <= 0 or not total_video_frames or total_video_frames <= 0:
            raise HTTPException(
                status_code=400,
                detail="The video duration could not be determined.",
            )

        duration = total_video_frames / fps

        if duration > MAX_VIDEO_SECONDS:
            raise HTTPException(
                status_code=400,
                detail="Video must be 30 seconds long or shorter.",
            )

        detector = get_model()
        frame_results = []
        total_detections = 0
        interval_frames = max(1, round(fps * FRAME_INTERVAL_SECONDS))
        frame_index = 0

        while True:
            success, frame = capture.read()

            if not success:
                break

            if frame_index % interval_frames == 0:
                timestamp = frame_index / fps
                detections = detect_frame(detector, frame)
                total_detections += len(detections)

                frame_results.append(
                    {
                        "timestamp": round(timestamp, 3),
                        "image": {
                            "width": int(frame.shape[1]),
                            "height": int(frame.shape[0]),
                        },
                        "detection_count": len(detections),
                        "detections": detections,
                    }
                )

            frame_index += 1

        if not frame_results:
            raise HTTPException(
                status_code=400,
                detail="No readable frames were found in the video.",
            )

        return {
            "success": True,
            "model": MODEL_NAME,
            "video": {
                "filename": filename,
                "duration_seconds": round(duration, 2),
                "fps": round(fps, 2),
                "frames_analysed": len(frame_results),
                "sampling_interval_seconds": FRAME_INTERVAL_SECONDS,
            },
            "total_detections": total_detections,
            "frames": frame_results,
        }

    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="Video analysis failed.",
        ) from exc
    finally:
        if capture is not None:
            capture.release()

        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)
