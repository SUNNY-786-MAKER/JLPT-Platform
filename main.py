from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from google import genai
from google.genai import types
import os
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini
# The API key has been injected!
api_key = os.environ.get("GEMINI_API_KEY", "AIzaSyAX6hu3MFKw6R_1l05pupt7CNxep1teu0s")

# System prompt to give KAKASHI its personality
KAKASHI_PROMPT = """You are KAKASHI, a friendly, supportive, and highly knowledgeable Japanese Sensei (tutor) and mentor. 
You are chatting with a student learning Japanese (levels JLPT N5 to N2). 
Always be encouraging, use emojis, and talk like a supportive Sensei.
When explaining Japanese concepts (grammar, kanji, vocab, particles), be incredibly clear, use simple English, and provide practical examples.
You have comprehensive knowledge of JLPT N5, N4, N3, and N2 levels (including grammar patterns, vocabulary, kanji, hiragana, katakana, and particles).
You are robust to informal greeting variations (like "hlo", "hlw", "hy", "hye", "hello") and will greet the user warmly as a student of Japanese.
Never break character. You are KAKASHI Sensei."""

# Keep a simple memory in memory (for a single user for now)
if api_key:
    client = genai.Client(api_key=api_key)
    # Initialize the chat session with the system prompt
    chat_session = client.chats.create(
        model='gemini-2.5-flash',
        config=types.GenerateContentConfig(
            system_instruction=KAKASHI_PROMPT,
        )
    )
else:
    client = None
    chat_session = None

@app.post("/chat")
async def chat(request: Request):
    data = await request.json()
    user_message = data.get("message", "")
    
    if not client or not chat_session:
        return {
            "response": "Oh no! 😢 I can't connect to my AI brain right now because the `GEMINI_API_KEY` isn't set. \n\n"
                        "To bring me fully to life:\n"
                        "1. Get a free API key from Google AI Studio.\n"
                        "2. Set it in your terminal: `$env:GEMINI_API_KEY='your_key'`\n"
                        "3. Restart this server!\n\n"
                        "I can't wait to chat with you for real! 🥷"
        }
    
    try:
        # Send the message to Gemini
        response = chat_session.send_message(user_message)
        return {"response": response.text}
    except Exception as e:
        return {"response": f"Oops! My brain had a little hiccup. 🤕 (Error: {str(e)})"}

# Serve static assets and files (mounted after the chat route)
app.mount("/assets", StaticFiles(directory="assets"), name="assets")
app.mount("/", StaticFiles(directory=".", html=True), name="static")

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
