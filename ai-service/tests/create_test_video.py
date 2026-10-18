import cv2

width = 640
height = 480
fps = 30
duration_seconds = 5

output_path = "tests/test_surveillance.mp4"

fourcc = cv2.VideoWriter_fourcc(*"mp4v")

video = cv2.VideoWriter(
    output_path,
    fourcc,
    fps,
    (width, height)
)

for _ in range(fps * duration_seconds):
    frame = 255 * (
        cv2.UMat(height, width, cv2.CV_8UC3).get()
    )

    video.write(frame)

video.release()

print(f"Test video created: {output_path}")