from pathlib import Path
import random
import shutil

# Original dataset and separate output dataset
SOURCE = Path(__file__).resolve().parent / "datasets"
DESTINATION = SOURCE / "five_class_poc"

# Original class ID -> new class ID
TARGET_CLASSES = {
    4: 0,   # Container
    17: 1,  # Sampan
    19: 2,  # Tanker
    21: 3,  # Tugboat
    23: 4,  # Yacht
}

CLASS_NAMES = [
    "Container",
    "Sampan",
    "Tanker",
    "Tugboat",
    "Yacht",
]

IMAGE_EXTENSIONS = {
    ".jpg", ".jpeg", ".png", ".bmp", ".webp"
}

random.seed(42)


def find_image(image_dir, stem):
    """Find an image efficiently using its filename."""
    for extension in IMAGE_EXTENSIONS:
        candidate = image_dir / f"{stem}{extension}"
        if candidate.is_file():
            return candidate

    # Fallback for filenames with different extension casing.
    for image in image_dir.iterdir():
        if image.stem.lower() == stem.lower():
            if image.suffix.lower() in IMAGE_EXTENSIONS:
                return image

    return None


def convert_annotation(parts):
    """
    Convert a target annotation to YOLO bounding-box format.

    Supports:
    - YOLO bounding boxes: class x_center y_center width height
    - YOLO polygons: class x1 y1 x2 y2 ... xn yn
    """
    if not parts:
        return None

    try:
        original_id = int(parts[0])
    except ValueError:
        return None

    if original_id not in TARGET_CLASSES:
        return None

    try:
        coords = [float(value) for value in parts[1:]]
    except ValueError:
        return None

    if len(coords) == 4:
        # Already a YOLO bounding box.
        cx, cy, width, height = coords

    elif len(coords) >= 6 and len(coords) % 2 == 0:
        # Polygon coordinates: calculate the enclosing bounding box.
        xs = coords[0::2]
        ys = coords[1::2]

        if not all(0 <= value <= 1 for value in coords):
            return None

        x_min = min(xs)
        x_max = max(xs)
        y_min = min(ys)
        y_max = max(ys)

        cx = (x_min + x_max) / 2
        cy = (y_min + y_max) / 2
        width = x_max - x_min
        height = y_max - y_min

    else:
        return None

    if not all(0 <= value <= 1 for value in (cx, cy, width, height)):
        return None

    if width <= 0 or height <= 0:
        return None

    new_id = TARGET_CLASSES[original_id]

    return (
        f"{new_id} {cx:.6f} {cy:.6f} "
        f"{width:.6f} {height:.6f}"
    )


def main():
    if DESTINATION.exists():
        print(f"Output folder already exists: {DESTINATION}")
        print("Stop here. Do not delete anything manually yet.")
        return

    selected = []
    missing_images = 0
    invalid_annotations = 0
    counts = {name: 0 for name in CLASS_NAMES}

    print("Scanning original dataset...")

    for split in ("train", "valid", "test"):
        label_dir = SOURCE / split / "labels"
        image_dir = SOURCE / split / "images"

        if not label_dir.exists() or not image_dir.exists():
            print(f"ERROR: Missing image or label folder for {split}.")
            return

        for label_file in label_dir.glob("*.txt"):
            image_file = find_image(image_dir, label_file.stem)

            if image_file is None:
                missing_images += 1
                continue

            target_lines = []

            for line in label_file.read_text(
                encoding="utf-8"
            ).splitlines():
                parts = line.split()

                if not parts:
                    continue

                try:
                    original_id = int(parts[0])
                except ValueError:
                    continue

                if original_id not in TARGET_CLASSES:
                    continue

                converted = convert_annotation(parts)

                if converted is None:
                    invalid_annotations += 1
                    continue

                target_lines.append(converted)
                new_id = TARGET_CLASSES[original_id]
                counts[CLASS_NAMES[new_id]] += 1

            if target_lines:
                selected.append((image_file, target_lines))

    if not selected:
        print("No usable images with the target classes were found.")
        print("Check the dataset labels before proceeding.")
        return

    # Shuffle and split selected images.
    random.shuffle(selected)

    total = len(selected)

    if total < 3:
        print(f"Only {total} usable images were found.")
        print("There are not enough images for train/validation/test splits.")
        print("No output dataset was created.")
        return

    train_end = max(1, int(total * 0.70))
    valid_end = max(train_end + 1, int(total * 0.85))
    valid_end = min(valid_end, total - 1)

    splits = {
        "train": selected[:train_end],
        "valid": selected[train_end:valid_end],
        "test": selected[valid_end:],
    }

    # Create the separate dataset.
    for split, records in splits.items():
        image_out = DESTINATION / split / "images"
        label_out = DESTINATION / split / "labels"

        image_out.mkdir(parents=True, exist_ok=True)
        label_out.mkdir(parents=True, exist_ok=True)

        for image_file, target_lines in records:
            shutil.copy2(
                image_file,
                image_out / image_file.name,
            )

            (label_out / f"{image_file.stem}.txt").write_text(
                "\n".join(target_lines) + "\n",
                encoding="utf-8",
            )

    # Write the YOLO configuration.
    yaml_lines = [
        f"path: {DESTINATION.resolve().as_posix()}",
        "train: train/images",
        "val: valid/images",
        "test: test/images",
        "nc: 5",
        "names:",
    ]

    for index, name in enumerate(CLASS_NAMES):
        yaml_lines.append(f"  {index}: {name}")

    (DESTINATION / "data.yaml").write_text(
        "\n".join(yaml_lines) + "\n",
        encoding="utf-8",
    )

    print("\nDataset preparation complete.")
    print("Images selected:", total)

    for split, records in splits.items():
        print(f"{split.capitalize()} images:", len(records))

    print("\nTarget annotations converted:")
    for name, count in counts.items():
        print(f"  {name}: {count}")

    print("Images without matching files:", missing_images)
    print("Invalid target annotations skipped:", invalid_annotations)
    print("\nOutput location:", DESTINATION.resolve())
    print("Original dataset was not modified.")


if __name__ == "__main__":
    main()