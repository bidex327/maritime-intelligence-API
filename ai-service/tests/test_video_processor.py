from services.video_processor import inspect_video

video_path = "tests/test_surveillance.mp4"

result = inspect_video(video_path)

print("Video inspection successful")
print(f"FPS: {result['fps']}")
print(f"Frame count: {result['frame_count']}")
print(f"Width: {result['width']}")
print(f"Height: {result['height']}")
print(f"Duration: {result['duration_seconds']} seconds")