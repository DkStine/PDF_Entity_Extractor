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

@app.post("/process")
async def process_file(file: UploadFile = File(...)):
    return dummy_response