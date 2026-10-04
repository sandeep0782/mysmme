from PIL import Image
from pathlib import Path

IMAGE_DIR = Path("public/images")

FILES = [
    "saree-1.jpg",
    "saree-2.jpg",
    "saree-3.jpg",
    "saree-4.jpg",
    "saree-5.jpg",
    "saree-6.jpg",
]

MAX_WIDTH = 1600
QUALITY = 82

for filename in FILES:
    source = IMAGE_DIR / filename

    if not source.exists():
        print(f"SKIPPED: {source} not found")
        continue

    output = source.with_suffix(".webp")

    with Image.open(source) as img:
        img = img.convert("RGB")

        width, height = img.size

        if width > MAX_WIDTH:
            new_height = round(height * MAX_WIDTH / width)
            img = img.resize(
                (MAX_WIDTH, new_height),
                Image.Resampling.LANCZOS,
            )

        img.save(
            output,
            "WEBP",
            quality=QUALITY,
            method=6,
            optimize=True,
        )

        print(
            f"{filename}: "
            f"{width}x{height} -> "
            f"{img.width}x{img.height} -> "
            f"{output.name}"
        )
