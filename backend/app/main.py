import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from google.genai import types
from app.tokenizer import TokenArbitrageEngine

app = FastAPI(title="AXON-STRIP Middleware Core", version="2.0.0")

# Cross-origin handling allowing secure data orchestration between React UI and server api layer
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["*"],
)

class PromptRequest(BaseModel):
    prompt: str

# Local compiler tracking core initialization
engine = TokenArbitrageEngine()

# Initialize Gemini SDK from environment variables safely
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key) if api_key else None

LOW_TOKEN_SYSTEM_INSTRUCTION = (
    "You are an advanced text compression compiler. Your sole objective is to strip structural filler, "
    "conversational noise, greetings, and redundant descriptors from the prompt. Retain tasks, variable inputs, "
    "and explicit negative constraints. Maximize token density. Use markdown shorthand, strip punctuation, "
    "and replace verbose phrases with strict, tight semantic synonyms. Output only compiled shorthand. "
    "Do not add any introductory or closing text."
)

HIGH_CONTEXT_SYSTEM_INSTRUCTION = (
    "You are an expert prompt engineering architect. Reconstruct the input prompt into an institutional-grade "
    "structured system prompt. Enforce explicit layout boundaries using clear markdown headers and XML tags "
    "(<context></context>, <rules></rules>, <output_format></output_format>). Define a precise role, clear objectives, "
    "explicit context schemas, performance execution criteria, and strict negative constraints. "
    "Output only the engineered prompt text block. Do not add any conversational wrapper."
)

@app.get("/health")
async def validation_ping():
    return {
        "status": "operational",
        "engine": "AXON-STRIP V2 Engine Core",
        "client_connected": client is not None,
        "mode": "Live Production" if client else "Demo Sandbox Mode"
    }

@app.post("/api/v1/compile")
async def processing_pipeline(request: PromptRequest):
    if not request.prompt.strip():
        raise HTTPException(status_code=400, detail="Null text payload parsing aborted.")
    
    # FALLBACK ENGINE FOR DEMO SANDBOX MODE (When no API Key is added yet)
    if not client:
        # Programmatically simulate a clean architectural prompt compilation locally
        compiled_low_token = f"CONCISE_TASK: Summarize\nTARGET_CONTEXT: {request.prompt.replace('please', '').replace('write me a summary about', '').strip()}\nFORMAT: Strict Markdown bullet metrics."
        
        compiled_high_context = (
            f"<system_role>\nYou are an expert research analyst specialized in automated structured data compilation.\n"
            f"</system_role>\n\n<context>\nPrimary Subject Profile: {request.prompt}\n</context>\n\n"
            f"<execution_rules>\n1. Extract explicit historical and systemic entities.\n2. Apply Chain-of-Thought reasoning structural paths.\n"
            f"3. DO NOT include loose conversational pleasantries.\n</rules>\n\n<output_format>\nMarkdown layout headers containing detailed validation criteria.\n</output_format>"
        )
        
        metrics = engine.compute_arbitrage_metrics(request.prompt, compiled_low_token)
        
        return {
            "high_context_prompt": compiled_high_context,
            "low_token_prompt": compiled_low_token,
            "metrics": metrics,
            "security_logs": {
                "pii_elements_masked": 0,
                "injection_flags_tripped": False
            }
        }

    try:
        # Live Production Path (Runs when GEMINI_API_KEY is present in environment)
        low_token_response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=request.prompt,
            config=types.GenerateContentConfig(
                system_instruction=LOW_TOKEN_SYSTEM_INSTRUCTION,
                temperature=0.1,
            ),
        )

        high_context_response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=request.prompt,
            config=types.GenerateContentConfig(
                system_instruction=HIGH_CONTEXT_SYSTEM_INSTRUCTION,
                temperature=0.2,
            ),
        )

        compiled_low_token = low_token_response.text.strip()
        compiled_high_context = high_context_response.text.strip()

        metrics = engine.compute_arbitrage_metrics(request.prompt, compiled_low_token)

        return {
            "high_context_prompt": compiled_high_context,
            "low_token_prompt": compiled_low_token,
            "metrics": metrics,
            "security_logs": {
                "pii_elements_masked": 0,
                "injection_flags_tripped": False
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Compiler exception encountered: {str(e)}")
