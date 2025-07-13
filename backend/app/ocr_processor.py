import re, spacy

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm", disable=["parser", "lemmatizer"])
except OSError:
    from spacy.cli import download
    download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm", disable=["parser", "lemmatizer"])

# OCR correction
OCR_CORRECTIONS = {
    "5t": "St", "|": "I", "vv": "w", "[]": "o", "``": "\"", "''": "\""
}

def correct_ocr_text(text: str) -> str:
    for wrong, right in OCR_CORRECTIONS.items():
        text = text.replace(wrong, right)
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{2,}", "\n", text)
    return text.strip()

# Address validation
def validate_address(addr: str) -> bool:
    patterns = [
        # US-style
        r"(?i)\b\d{1,5}(?:\s*-\s*\d{1,5})?\s+[\w\s.,#-]+,\s*[A-Za-z\s]+,\s*[A-Za-z]{2}\s*\d{5}(?:-\d{4})?\b",
        r"(?i)\b\d{1,5}(?:[/-]?\d{0,5})?\s*[\w\s.,#-]+,\s*[A-Za-z\s]+,\s*[A-Za-z\s]{2,}\s*\d{6}\b",
        # r"^(\d+) ?([A-Za-z](?= ))? (.?) ([^ ]+?) ?((?<= )APT)? ?((?<= )\d)?$",
        # r"\d+\s+[\w\s]+(?:St|Street|Ave|Avenue|Blvd|Boulevard|Rd|Road)(?:,\s*[\w\s]+)*",
        # r"PO Box \d+",
        # # Indian-style with city + PIN (e.g., HYD-500001 or Hyderabad 500001)
        r"(?:[A-Za-z\s]+,)\s[A-Za-z\s]\s(?:[A-Z]{2,}-)?\d{6}\b",  
        # # Optional: Generic comma-separated with PIN
        r"([A-Za-z0-9\s,-]+),?\s+\d{6}"
    ]
    addr = addr.strip()
    return any(re.search(p, addr, re.IGNORECASE) for p in patterns)

# Entity extraction
def extract_entities(text: str) -> dict:
    corrected_text = correct_ocr_text(text)
    doc = nlp(corrected_text)
    entities = {"names": [], "emails": [], "dates": [], "addresses": []}

    # Extract names
    if not entities["names"]:
        doc = nlp(corrected_text)
        for ent in doc.ents:
            if ent.label_ == "PERSON":
                name = ent.text.strip()
                if "\n" not in name and any(char.isalpha() for char in name):
                    entities["names"].append(name)

    # Emails
    email_pattern = r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
    entities["emails"] = re.findall(email_pattern, corrected_text)

    # Dates and addresses line-by-line
    for line in corrected_text.splitlines():
        line = line.strip()
        if line.lower().startswith("name:"):
            name_value = line.split(":", 1)[-1].strip()
            if name_value and all(part.isalpha() or part == '.' for part in name_value.split()):
                entities["names"].append(name_value)
        if line.lower().startswith(("date:",)):
            date_value = line.split(":", 1)[-1].strip()
            entities["dates"].append(date_value)
        elif line.lower().startswith(("address:", "addresses:")):
            address_value = line.split(":", 1)[-1].strip()
            if validate_address(address_value):
                entities["addresses"].append(address_value)

    return entities

# Test
"""
if __name__ == "__main__":
    test_text = (
        "NAME: Diganta Das\n\nEMAIL: Das9@gmail.com\n\nAddress: Woxsen, HYD-456822\n\nDate: 31st December 201 2\n\nTable of Project:\n\n] Sl No. | Name ❘ Projects | Remarks |\n|--------|- -| - ----|\n| 1. Topper | AI summer | High | Backbencher AI Subtractor| Low |"
    )
    entities = extract_entities(test_text)
    print("Test Results:")
    print(f"Names: {entities['names']}")
    print(f"Emails: {entities['emails']}")
    print(f"Dates: {entities['dates']}")
    print(f"Addresses: {entities['addresses']}")
"""