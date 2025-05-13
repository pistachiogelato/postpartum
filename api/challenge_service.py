from fastapi import FastAPI
from pydantic import BaseModel
import openai
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChallengeRequest(BaseModel):
    user_type: str
    topic: str
    seed: int = None

@app.post("/generate-challenge")
async def generate_challenge(request: ChallengeRequest):
    openai.api_key = os.getenv("PERPLEXITY_API_KEY")
    
    prompt = f"""为{request.user_type}生成一个关于{request.topic}的挑战任务，包含：
    1. 2-3句话的情景描述
    2. 3个选择题选项
    3. 正确答案解释"""
    
    response = openai.ChatCompletion.create(
        model="sonar-pro",
        messages=[
            {"role": "system", "content": "你是一个专业的育儿和心理健康顾问"},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        seed=request.seed or int(time.time())
    )
    
    return {
        "challenge": response.choices[0].message.content,
        "seed": request.seed
    }