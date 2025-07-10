from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dummy response structure -> OLM OCR response to be replaced here
dummy_response = {
    "entities": {
        "names": ["John Doe"],
        "dates": ["2023-01-01"],
        "addresses": ["123 Main St"]
    },
    "tables": [{
        "headers": ["Product", "Price"],
        "rows": [["Book", "$10"], ["Pen", "$1"]]
    }]
}

# USP: Auto-rotation for scanned docs
def auto_rotate_image(image: Image) -> Image:
    try:
        exif = image.getexif()
        if exif:
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
    # USP: Unique process ID for tracing
    process_id = str(uuid.uuid4())
    
    # USP: Multi-page handling (first 3 pages)
    images = []
    if file.filename.lower().endswith('.pdf'):
        images = convert_from_path(temp_file.name, first_page=1, last_page=3)
        partial = len(images) > 3  # Flag if document truncated
    else:
        images = [Image.open(temp_file.name)]
        partial = False
    
    results = []
    for img in images:
        # USP: Auto-rotation
        img = auto_rotate_image(img)
        
        # Run OCR
        img_np = np.array(img)  # Convert to numpy array
        ocr_result = OlmOcr()(img_np)
        corrected_text = correct_ocr_text(ocr_result.get("text", ""))
        
        # Extract data
        entities = extract_entities(corrected_text)
        tables = extract_tables(ocr_result)
        
        results.append({
            "entities": entities,
            "tables": tables,
            "raw_text": corrected_text[:500] + "..."  # Partial preview
        })
    
    return {
        "process_id": process_id,
        "pages": results,
        "partial": partial,
        "page_count": len(images)
    }

@app.post("/process")
async def process_file(file: UploadFile = File(...)):
    return dummy_response