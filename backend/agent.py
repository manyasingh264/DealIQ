from langgraph.graph import StateGraph, END
from langchain_groq import ChatGroq
from typing import TypedDict, Optional
import json, os
from dotenv import load_dotenv

load_dotenv()

llm = ChatGroq(model=os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile"), temperature=0,
               groq_api_key=os.getenv("GROQ_API_KEY"))

class DealState(TypedDict):
    deal_text: str
    outcome: str
    company: str
    deal_size: str
    signals: Optional[dict]
    root_cause: Optional[dict]
    recommendations: Optional[dict]
    final_report: Optional[dict]

def ask(prompt: str) -> dict:
    try:
        full_prompt = prompt + "\n\nIMPORTANT: Respond ONLY with valid JSON. No markdown, just JSON."
        resp = llm.invoke(full_prompt)
        text = resp.content.strip()
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        return json.loads(text)
    except Exception as e:
        print(f"[ask] ERROR: {e}")
        return {}

def parse_and_detect(state: DealState) -> DealState:
    data = ask(f"""Analyze this sales deal.
Company: {state["company"]} | Outcome: {state["outcome"]}
Notes: {state["deal_text"]}

Return JSON with:
- "objections": list of objections raised
- "competitors_mentioned": list of competitors
- "positive_signals": list of positive signals
- "pricing_concern": true or false
- "timing_issue": true or false
- "stakeholders": list of roles mentioned""")
    return {**state, "signals": {
        "objections": data.get("objections", []),
        "competitors_mentioned": data.get("competitors_mentioned", []),
        "positive_signals": data.get("positive_signals", []),
        "pricing_concern": data.get("pricing_concern", False),
        "timing_issue": data.get("timing_issue", False),
        "stakeholders": data.get("stakeholders", [])
    }}

def find_root_cause(state: DealState) -> DealState:
    data = ask(f"""Find root cause of this {state["outcome"]} deal.
Objections: {state["signals"].get("objections", [])}
Competitors: {state["signals"].get("competitors_mentioned", [])}
Notes: {state["deal_text"]}

Return JSON with:
- "primary_reason": one of [pricing, product_gap, timing, relationship, competition, budget_freeze, other]
- "primary_explanation": 2 sentences
- "secondary_reason": same options
- "in_our_control": list of 2-3 items
- "not_in_our_control": list of 1-2 items""")
    return {**state, "root_cause": {
        "primary_reason": data.get("primary_reason", "other"),
        "primary_explanation": data.get("primary_explanation", ""),
        "secondary_reason": data.get("secondary_reason", "other"),
        "in_our_control": data.get("in_our_control", []),
        "not_in_our_control": data.get("not_in_our_control", [])
    }}

def generate_recommendations(state: DealState) -> DealState:
    data = ask(f"""Generate recommendations for this {state["outcome"]} deal.
Reason: {state["root_cause"].get("primary_reason")}
Explanation: {state["root_cause"].get("primary_explanation")}

Return JSON with:
- "coaching_note": 2-sentence advice for the salesman
- "strategic_insight": 2-sentence insight for manager
- "next_time": list of exactly 3 action items
- "what_worked": list of 2 things done well""")
    return {**state, "recommendations": {
        "coaching_note": data.get("coaching_note", ""),
        "strategic_insight": data.get("strategic_insight", ""),
        "next_time": data.get("next_time", []),
        "what_worked": data.get("what_worked", [])
    }}

def build_final_report(state: DealState) -> DealState:
    return {**state, "final_report": {
        "company": state["company"],
        "deal_size": state["deal_size"],
        "outcome": state["outcome"],
        "primary_reason": state["root_cause"].get("primary_reason", "other"),
        "primary_explanation": state["root_cause"].get("primary_explanation", ""),
        "secondary_reason": state["root_cause"].get("secondary_reason", ""),
        "in_our_control": state["root_cause"].get("in_our_control", []),
        "not_in_our_control": state["root_cause"].get("not_in_our_control", []),
        "competitors": state["signals"].get("competitors_mentioned", []),
        "objections": state["signals"].get("objections", []),
        "positive_signals": state["signals"].get("positive_signals", []),
        "coaching_note": state["recommendations"].get("coaching_note", ""),
        "strategic_insight": state["recommendations"].get("strategic_insight", ""),
        "next_time": state["recommendations"].get("next_time", []),
        "what_worked": state["recommendations"].get("what_worked", []),
    }}

def build_agent():
    g = StateGraph(DealState)
    g.add_node("parse_and_detect", parse_and_detect)
    g.add_node("find_root_cause", find_root_cause)
    g.add_node("generate_recommendations", generate_recommendations)
    g.add_node("build_final_report", build_final_report)
    g.set_entry_point("parse_and_detect")
    g.add_edge("parse_and_detect", "find_root_cause")
    g.add_edge("find_root_cause", "generate_recommendations")
    g.add_edge("generate_recommendations", "build_final_report")
    g.add_edge("build_final_report", END)
    return g.compile()