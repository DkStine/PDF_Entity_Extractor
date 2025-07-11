import json
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
            images = convert_from_path(tmp.name, first_page=1, last_page=3)
        except:
            images = [Image.open(tmp.name)]

        for page_num, img in enumerate(images, start=1):
            try:
                img = auto_rotate_image(img)

                # Debugging/main process starts here
                raw_text = process_olmocr_image(img)

                # OLMOCR returns the below
                """
                {"blocks": [{"type": "paragraph", "text": "NAME: Diganta Das\n\nEMAIL: Das9@gmail.com\n\nAddress: Kamkole, Woxsen University, HYD-202345\n\nDate: 31st December 2012\n\nTable of Project:\n\n| Sl No. | Name       | Projects     | Remarks |\n|--------|------------|--------------|---------|\n| 1.     | Topper     | AI summer    | High    |\n| 2.     | Backbencher| AI Subtractor| Low     |"}
                """
                print(f"OCR Raw Output: {raw_text}")

                # Step 1: Try parsing the OCR string
                try:
                    parsed_json = json.loads(raw_text)
                except json.JSONDecodeError:
                    parsed_json = {"blocks": [{"type": "paragraph", "text": raw_text}]}

                # Somehow we are not being able to convert it properly into JSON
                # Step 2: Extract all 'text' fields into plain string
                combined_text = "\n".join([blk.get("text", "") for blk in parsed_json.get("blocks", [])])

                # Step 3: Entity & Table Extraction
                entities = extract_entities(combined_text)
                tables = extract_tables(parsed_json)

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
