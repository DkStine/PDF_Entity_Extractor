import torch
import base64
from io import BytesIO
from PIL import Image
from transformers import AutoProcessor, Qwen2VLForConditionalGeneration

# Internal state
model = None
processor = None
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Prompt
DEFAULT_PROMPT = (
    "Extract structured data from this document image. "
    "Return output as JSON with a top-level key 'blocks'. "
    "Each block should include 'type' (e.g., 'table', 'paragraph'), "
    "and for tables, include 'children' with 'row_index', 'column_index', and 'text'. "
    "Do not return natural text. Do not include LaTeX formatting. Only return clean JSON."
)


# Lazy loader
def load_olmocr_model():
    global model, processor
    if model is None or processor is None:
        print("[INFO] Loading OLM OCR model...")
        model = Qwen2VLForConditionalGeneration.from_pretrained(
            "allenai/olmOCR-7B-0225-preview",
            torch_dtype=torch.bfloat16
        ).eval().to(device)

        processor = AutoProcessor.from_pretrained("Qwen/Qwen2-VL-7B-Instruct")
        print("[INFO] Model and processor loaded!")

# Converts PIL image to base64 string
def image_to_base64(image: Image) -> str:
    buffered = BytesIO()
    image.save(buffered, format="PNG")
    return base64.b64encode(buffered.getvalue()).decode("utf-8")

# Main OCR processing
def process_olmocr_image(image: Image, prompt: str = DEFAULT_PROMPT, max_tokens: int = 512) -> str:
    load_olmocr_model()

    image_base64 = image_to_base64(image)
    messages = [
        {
            "role": "user",
            "content": [
                {"type": "text", "text": prompt},
                {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{image_base64}"}}
            ],
        }
    ]

    text_prompt = processor.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
    inputs = processor(
        text=[text_prompt],
        images=[image],
        return_tensors="pt",
        padding=True,
    )
    inputs = {k: v.to(device) for k, v in inputs.items()}

    with torch.no_grad():
        output = model.generate(
            **inputs,
            temperature=0.8,
            max_new_tokens=max_tokens,
            do_sample=True,
        )

    prompt_len = inputs["input_ids"].shape[1]
    new_tokens = output[:, prompt_len:]
    decoded = processor.tokenizer.batch_decode(new_tokens, skip_special_tokens=True)

    return decoded[0]
