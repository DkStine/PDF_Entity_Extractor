import re, spacy

# Load spaCy model (optimized for NER)
# Disable unnecessary pipeline components for faster processing
try:
    nlp = spacy.load("en_core_web_sm", disable=["parser", "lemmatizer"])
except OSError:
    from spacy.cli import download
    download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm", disable=["parser", "lemmatizer"])

# USP: Enhanced auto-correction
OCR_CORRECTIONS = {
    "0": "O", "1": "I", "5t": "St", "|": "I",
    "vv": "w", "[]": "o", "``": "\"", "''": "\""
}

def correct_ocr_text(text: str) -> str:
    for wrong, right in OCR_CORRECTIONS.items():
        text = text.replace(wrong, right)
    return text

# USP: Address validation
def validate_address(addr: str) -> bool:
    patterns = [
        r"\d+\s+[\w\s]+St(?:reet)?", 
        r"\d+\s+[\w\s]+Ave(?:nue)?",
        r"\d+\s+[\w\s]+Blvd",
        r"PO Box \d+"
    ]
    return any(re.search(p, addr, re.IGNORECASE) for p in patterns)

# Core entity extraction
def extract_entities(text: str) -> dict:
    doc = nlp(text)
    entities = {"names": [], "dates": [], "addresses": []}
    
    # Names extraction
    entities["names"] = [ent.text for ent in doc.ents if ent.label_ == "PERSON"]
    
    # Date extraction
    date_patterns = [
        r"\b\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b",
        r"\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2}, \d{4}\b"
    ]
    for pattern in date_patterns:
        entities["dates"].extend(re.findall(pattern, text))
    
    # Address extraction with validation
    address_candidates = re.findall(r"\d+ [\w\s,]{10,50}", text)
    entities["addresses"] = [addr.strip() for addr in address_candidates if validate_address(addr)]
    
    return entities

"""
# Quick test

if __name__ == "__main__":
    test_text = "John Doe will visit on 12/31/2023. Address: 123 Main St, Springfield."
    entities = extract_entities(test_text)
    print("Test Results:")
    print(f"Names: {entities['names']}")  # Should be ['John Doe']
    print(f"Dates: {entities['dates']}")  # Should be ['12/31/2023']
    print(f"Addresses: {entities['addresses']}")  # Should be ['123 Main St, Springfield.']
"""