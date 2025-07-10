from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import tempfile, uuid
from PIL import Image
from pdf2image import convert_from_path

from .olm_wrapper import process_olmocr_image
from .ocr_processor import extract_entities
from .table_parser import extract_tables

app = FastAPI()

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auto-rotate scanned docs
def auto_rotate_image(image: Image) -> Image:
    try:
        exif = image.getexif()
        orientation = exif.get(0x0112)
        rotate_values = {
            3: Image.ROTATE_180,
            6: Image.ROTATE_270,
            8: Image.ROTATE_90
        }
        if orientation in rotate_values:
            return image.transpose(rotate_values[orientation])
    except:
        pass
    return image

@app.post("/process")
async def process_file(file: UploadFile = File(...)):
    process_id = str(uuid.uuid4())

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(await file.read())
        tmp.flush()

        results = []
        try:
            # Try converting PDF to image (first 3 pages)
            images = convert_from_path(tmp.name, first_page=1, last_page=3)
        except:
            # Fallback to single image
            images = [Image.open(tmp.name)]

        for page_num, img in enumerate(images, start=1):
            try:
                img = auto_rotate_image(img)
                raw_text = process_olmocr_image(img)

                # Parse the raw_text as plain text, send to extractors
                entities = extract_entities(raw_text)
                tables = extract_tables({"blocks": []})  # Replace with parsed JSON if needed

                results.append({
                    "page": page_num,
                    "text": raw_text,
                    "entities": entities,
                    "tables": tables,
                })

            except Exception as e:
                results.append({
                    "page": page_num,
                    "error": str(e)
                })

    return {
        "process_id": process_id,
        "pages": results,
        "partial": len(results) < 3,
        "page_count": len(results)
    }
