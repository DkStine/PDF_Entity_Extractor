# PDF_Entity_Extractor

### Directory Structure

olmocr-extractor/  
├── .gitignore                # Git ignore rules  
├── README.md                 # Project documentation  
│  
├── backend/                  👨‍💻 Member 1's Domain  
│   ├── venv/                 # Python virtual environment  
│   ├── app/  
│   │   ├── __init__.py  
│   │   ├── main.py           # FastAPI entry point (updated)  
│   │   ├── ocr_processor.py  # OCR processing logic  
│   │   ├── table_parser.py   # Table extraction module  
│   │   └── utils.py          # Utility functions  
│   ├── requirements.txt      # Python dependencies  
│   └── test.py               # API test script  
│  
├── frontend/                 💻 Member 2 & 3's Domain  
│   ├── node_modules/         # NPM packages  
│   ├── public/  
│   ├── src/  
│   │   ├── components/  
│   │   │   ├── FileUpload.jsx  # Upload widget (Member 2)  
│   │   │   ├── Pipeline.jsx    # React Flow diagram (Member 3)  
│   │   │   ├── ResultsViewer.jsx # JSON display (Member 2)  
│   │   │   ├── DocumentPreview.jsx # USP feature (Member 2)  
│   │   │   └── NodeInspector.jsx  # USP feature (Member 3)  
│   │   ├── services/  
│   │   │   └── api.js        # Axios API client  
│   │   ├── App.jsx           # Main component  
│   │   ├── main.jsx          # Entry point  
│   │   └── index.css         # Global styles  
│   ├── package.json          # NPM config  
│   └── vite.config.js        # Build config  
│  
└── sample-documents/         # Test assets (shared)  
    ├── invoice.pdf  
    ├── receipt.jpg  
    ├── form.png  
    └── multi-page.pdf  