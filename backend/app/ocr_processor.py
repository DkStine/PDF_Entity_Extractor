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
        r"\d+\s+[\w\s]+(?:St|Street|Ave|Avenue|Blvd|Boulevard|Rd|Road)(?:,\s*[\w\s]+)*",
        r"PO Box \d+"
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
if __name__ == "__main__":
    test_text = (
        "Name: John Doe\n\nEmail: john.doe-654@example.co.in\n\n"
        "Address: 123 Main St, Springfield, USA-White house\n\nDate: 12th Jan 2023"
    )
    entities = extract_entities(test_text)
    print("Test Results:")
    print(f"Names: {entities['names']}")
    print(f"Emails: {entities['emails']}")
    print(f"Dates: {entities['dates']}")
    print(f"Addresses: {entities['addresses']}")
