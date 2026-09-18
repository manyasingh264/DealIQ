from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agent import build_agent
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="DealIQ - AI Diagnosis Service (MS2)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

agent = build_agent()

# ── Request model ────────────────────────────────────────────────
class DealInput(BaseModel):
    company: str
    deal_size: str
    outcome: str   # "WON" or "LOST"
    deal_text: str

# ── Routes ───────────────────────────────────────────────────────
@app.get("/health")
@app.get("/api/health")
def health():
    return {"status": "healthy", "service": "ms2-ai-service"}

@app.post("/analyze")
@app.post("/api/analyze")
def analyze(deal: DealInput):
    # Run LangGraph agent
    result = agent.invoke({
        "deal_text": deal.deal_text,
        "outcome": deal.outcome,
        "company": deal.company,
        "deal_size": deal.deal_size,
        "signals": None,
        "root_cause": None,
        "recommendations": None,
        "final_report": None,
    })

    report = result.get("final_report", {})

    return {"success": True, "report": report}
