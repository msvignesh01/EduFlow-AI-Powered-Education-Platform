from pypdf import PdfReader
from io import BytesIO
import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def parse_pdf(contents: bytes) -> str:
    reader = PdfReader(BytesIO(contents))
    text = ""
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text
    return text

def generate_content(text: str, output_type: str) -> str:
    prompt_map = {
        "short_notes": "Summarize this text into concise short notes:",
        "long_notes": "Explain this content in detailed long notes:",
        "quiz": "Create a quiz from this content:",
    }

    prompt = prompt_map.get(output_type, "Summarize this text:")
    full_prompt = f"You are an educational content assistant. {prompt}\n\n{text}"

    try:
        # Use Gemini 2.0 Flash model
        model = genai.GenerativeModel('gemini-2.0-flash-exp')
        response = model.generate_content(full_prompt)

        if not response.text:
            raise Exception("No content generated from Gemini API")

        return response.text.strip()
    except Exception as e:
        raise Exception(f"Failed to generate content with Gemini: {str(e)}")
