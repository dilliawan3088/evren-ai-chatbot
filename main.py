import os
from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI
from fastapi.middleware.cors import CORSMiddleware




# Load environment variables
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=api_key)
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Query(BaseModel):
    question: str

# Load system prompt from file
with open("prompt_template.txt", "r", encoding="utf-8") as f:
    base_prompt = f.read()

# Global in-memory conversation history
memory = []  # stores {"role": ..., "content": ...}
MAX_MEMORY_LENGTH = 40  # Increase if you want better retention

@app.post("/chat")
async def chat(query: Query):
    user_question = query.question.strip()

    # Construct the message list: system + memory + latest user question
    messages = [{"role": "system", "content": base_prompt}] + memory
    messages.append({"role": "user", "content": user_question})

    # Ask GPT
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        temperature=0.3,
        max_tokens=500
    )

    assistant_reply = response.choices[0].message.content.strip()

    # Add both user & assistant messages to memory
    memory.append({"role": "user", "content": user_question})
    memory.append({"role": "assistant", "content": assistant_reply})

    # Keep memory within limits
    memory[:] = memory[-MAX_MEMORY_LENGTH:]

    return {"response": assistant_reply}
