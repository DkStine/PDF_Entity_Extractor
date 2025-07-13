# PDF_Entity_Extractor

## Technology Stack

### Backend

![Static Badge](https://img.shields.io/badge/Python-3.9%252B-blue)
![Static Badge](https://img.shields.io/badge/FastAPI-0.88.0-green)
![Static Badge](https://img.shields.io/badge/OlmOCR-1.0.0-orange)
![Static Badge](https://img.shields.io/badge/spaCy-3.5.0-lightgrey)

### Frontend

![Static Badge](https://img.shields.io/badge/React-18.2.0-blue)
![Static Badge](https://img.shields.io/badge/React_Flow-11.7.0-green)
![Static Badge](https://img.shields.io/badge/Tailwind_CSS-3.3.0-blueviolet)

## Directory Structure

![Directory Structure](<Directory Structure.png>)

## Installation

## Prerequisites

- Python 3.9+
- Node.js 16+
- Git

### Setup Instructions

1.  **Clone the repository:**

```bash
git clone https://github.com/your-username/document-data-extractor.git
cd document-data-extractor
```

2.  **Set up backend:**

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3.  **Set up frontend:**

```bash
cd ../frontend
npm install
```

## Running the Application

1.  **Start Backend server**
    ```bash
    cd backend
    fastapi dev app/main.py
    ```
2.  **Start frontend development server**
    ```bash
    cd frontend
    npm run dev
    ```
3.  **Access the application:**

    _Open http://localhost:3000 in your browser_

## Usage Guide

1.  **Upload a document:**

    - Drag and drop a PDF or image file
    - Maximum file size: 10MB

2.  **View processing pipeline**
3.  **Explore extracted data:**

    - Entities (names, dates, addresses)

4.  **Export results:**
    - Export tables as CSV for spreadsheets

## API Endpoints

    /process    POST    Process uploaded document
    /docs       GET     Interactive API documentation (Swagger UI)

**Example Request:**

```bash
curl -X POST http://localhost:8000/process
    -F "file=@sample.pdf"
    -H "Content-Type: multipart/form-data"
```

**Example Response:**

```json
{
  "process_id": "a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8",
  "pages": [
    {
      "entities": {
        "names": ["John Doe"],
        "dates": ["2023-01-15"],
        "addresses": ["123 Main St, Springfield"]
      },
      "tables": [],
      "raw_text": "Invoice for John Doe..."
    }
  ],
  "partial": false,
  "page_count": 1
}
```

Acknowledgements
----------------

*   AllenAI for the [OlmOCR](https://github.com/allenai/olmocr) library
    
*   React Flow team for the visualization framework
    
*   spaCy for advanced NLP capabilities