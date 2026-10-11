from pathlib import Path

import cv2
import numpy as np
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO


app = FastAPI(
    title="Maritime Intelligence AI Service",
    description="AI inference service for object detection.",
    version="0.1.0",
)

# Development configuration for frontend integration.
# Restrict allowed origins before production deployment.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = Path(__file__).resolve().parent.parent / "vessel_poc_best.pt"

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


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "maritime-intelligence-ai",
        "model": "vessel_poc_best.pt",
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
        raise HTTPException(
            status_code=400,
            detail="The uploaded image is empty.",
        )

    # Prevent excessively large uploads during development.
    if len(image_bytes) > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=413,
            detail="Image size must not exceed 10 MB.",
        )

    image_array = np.frombuffer(image_bytes, dtype=np.uint8)
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

    if image is None:
        raise HTTPException(
            status_code=400,
            detail="The uploaded file could not be decoded as an image.",
        )

    detector = get_model()

    try:
        results = detector.predict(
            source=image,
            imgsz=320,
            conf=0.25,
            verbose=False,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="Object detection failed.",
        ) from exc

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

    return {
        "success": True,
         "model": "vessel_poc_best.pt",
        "image": {
            "width": int(image.shape[1]),
            "height": int(image.shape[0]),
        },
        "detection_count": len(detections),
        "detections": detections,
    }