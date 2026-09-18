# 🧠 DealIQ — Sales Intelligence & Deal Diagnostics Agent

> An agentic AI platform that analyzes sales deals to uncover why they win or lose — delivering multi-node LangGraph pattern detection, tactical coaching notes, competitor intelligence, and executive strategic insights.

**Built for AIONOS Agentic AI Factory | Sales & Alliances Department**

---

## 🎯 Problem

Sales organizations close and lose deals every week — but rarely possess a systematic framework to learn *why*. 
- The same avoidable objections repeat across quarters.
- Emerging competitors gain ground before leadership detects the pattern.
- Account Executives lack tailored tactical coaching on missed opportunities.
- Strategic decisions are too often guided by gut feeling rather than objective deal signal analysis.

## 💡 Solution

**DealIQ** operates as an intelligent multi-agent pipeline. By ingesting deal context (CRM notes, meeting transcripts, prospect communications), DealIQ synthesizes a structured intelligence dossier:
- **Root Cause Determination**: Pinpoints the decisive factor behind a WIN or LOSS.
- **AE Coaching Directives**: Actionable guidance for the sales rep on how the deal could have been steered or maximized.
- **Managerial Strategic Insights**: High-level observations on product-market fit, pricing tolerance, and competitor positioning.
- **Cross-Deal Pattern Recognition**: Surfaces recurring win/loss trends across the entire organization.

---

## 🏗️ System Architecture

DealIQ is built on a clean, decoupled microservices architecture:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       Frontend: React 18 (Vite)                         │
│                               Port: 5173                                │
│  • Modern Tailwind CSS UI + Lucide Icons                                │
│  • JWT Session Management & Dual-Mode Auth (Sign In / Sign Up)          │
│  • Interactive Deal Diagnostics & Live LangGraph Step Inspector         │
│  • Executive Dashboard with Trend Charts & Competitor Frequency Tracker │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     │ HTTP (REST + JWT Bearer)
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     MS1: Core API (Node.js / Express)                   │
│                               Port: 3000                                │
│  • Single Source of Truth for Data & SQLite (`dealiq.db`)               │
│  • JWT Authentication, Password Hashing (bcrypt), Role-Based Access     │
│  • Deals & CRM Analytics CRUD & Aggregations                            │
│  • Zod Payload Validation & AI Service Orchestration                    │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     │ Internal HTTP (POST /api/analyze)
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     MS2: AI Service (FastAPI / Python)                  │
│                               Port: 8000                                │
│  • Stateless AI Engine with Zero Database Coupling                      │
│  • 4-Node LangGraph Decision Graph                                      │
│  • High-Performance ChatGroq LLM (`openai/gpt-oss-120b`)                │
│  • Deterministic Structured JSON Output Validation                      │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🤖 LangGraph Multi-Agent Pipeline

The AI diagnosis engine (`backend/agent.py`) executes a 4-stage sequential state graph:

```
                  ┌──────────────────────┐
                  │      Deal Input      │
                  │ (Text, Size, Outcome)│
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │ Node 1: Signal Parser│ → Extracts signals, objections, key topics,
                  │  (parse_and_detect)  │   and detected competitors.
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │ Node 2: Root Cause   │ → Identifies the primary decisive reason,
                  │  (find_root_cause)   │   contributing factors, and competitor edge.
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │ Node 3: Recommendations → Produces tactical AE coaching notes and
                  │   (generate_recs)    │   leadership strategic initiatives.
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │ Node 4: Synthesizer  │ → Compiles complete, typed JSON intelligence
                  │    (build_report)    │   dossier delivered to MS1.
                  └──────────┬───────────┘
                             │
                             ▼
                         END REPORT
```

---

## 🚀 Tech Stack

| Layer | Component | Technologies |
|---|---|---|
| **Frontend** | Client Application | React 18, Vite, Tailwind CSS, Lucide Icons |
| **Core API (MS1)** | Business Logic & Data | Node.js, Express.js, SQLite (`better-sqlite3`), Zod, JWT, bcrypt |
| **AI Engine (MS2)** | Agent Pipeline | Python 3.10+, FastAPI, Uvicorn, LangGraph, LangChain, ChatGroq |
| **Database** | Persistence Layer | SQLite (owned strictly by MS1 Core API) |
| **LLM Provider** | Inference Model | Groq API (`openai/gpt-oss-120b` or configurable via `GROQ_MODEL`) |

---

## ✨ Features

- **🔐 Dual-Mode Authentication**: Full JWT sign-in and sign-up with organization onboarding and pre-filled quick demo accounts.
- **📊 Executive Dashboard**: Real-time win rates, deal velocity metrics, monthly win/loss trend charts, and top loss reason distributions.
- **🥊 Competitor Tracker**: Quantifies competitor appearance frequencies across lost deals to uncover battleground threats.
- **🔍 Interactive Deal Diagnostics**: Submit deal narratives to watch the multi-node LangGraph agent reason in real time.
- **📋 Deal Dossier & History**: Search, sort, and inspect 30+ pre-seeded enterprise deals with complete historical AI reports.
- **💡 Dual-Tier Actionable Insights**: Generates rep-level tactical coaching notes alongside executive-level strategic takeaways.

---

## 🔑 Quick Demo Credentials

For quick testing, pre-configured demo credentials are automatically available on the Sign In page:

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Demo Admin** *(Default)* | `admin@dealiq.com` | `admin123` | Full organization data, analytics, and deal management |
| **Demo AE** | `ae@dealiq.com` | `ae123456` | Standard deal submission and diagnostics access |

---

## ⚙️ Local Development Setup

To run DealIQ locally, start all three services in separate terminals.

### Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.10 or higher)
- **Groq API Key** ([Get one here](https://console.groq.com/))

---

### Step 1: Start MS2 — AI Service (FastAPI)

```bash
cd backend

# Create and activate a Python virtual environment
python -m venv .venv
# On Windows (PowerShell):
.\.venv\Scripts\Activate.ps1
# On macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Open .env and insert your GROQ_API_KEY:
# GROQ_API_KEY=gsk_...
# GROQ_MODEL=openai/gpt-oss-120b

# Start the service on port 8000
uvicorn main:app --port 8000 --reload
```
*Health check available at: `http://localhost:8000/health`*

---

### Step 2: Start MS1 — Core API Service (Express.js)

```bash
cd ms1-core-api

# Install Node dependencies
npm install

# Configure environment variables
cp .env.example .env

# Start the service on port 3000
npm start
```
*Health check available at: `http://localhost:3000/health`*

---

### Step 3: Start the Frontend (React + Vite)

```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Ensures: VITE_API_URL=http://localhost:3000

# Launch the Vite development server
npm run dev
```
*Frontend will be running at: `http://localhost:5173`*

---

## 📡 API Reference Overview

### MS1: Core API (`http://localhost:3000`)
- `GET  /health` — Core API health check
- `POST /api/auth/register` — Register user & organization
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET  /api/auth/me` — Retrieve current authenticated user profile
- `GET  /api/deals` — List and filter deals (query params: `stage`, `status`, `search`, `limit`, `offset`)
- `GET  /api/deals/:id` — Retrieve specific deal details with AI diagnosis report
- `POST /api/deals` — Create a new deal record
- `POST /api/analyze` — Trigger LangGraph diagnosis through MS2 and persist report
- `GET  /api/analytics` — High-level organization KPI aggregations
- `GET  /api/stats` — Full dashboard metrics, trend chart data, and competitor stats

### MS2: AI Engine (`http://localhost:8000`)
- `GET  /health` — AI service health check
- `POST /api/analyze` — Execute 4-node LangGraph pipeline for a deal payload

---

## 🔮 Roadmap

- [ ] **Direct CRM Sync**: Webhook integration with Salesforce and HubSpot for automated ingestion.
- [ ] **Call Audio Transcripts**: Whisper STT pipeline to extract objections directly from sales call recordings.
- [ ] **Slack & Teams Bot**: Instant `/dealiq-analyze` command for sales reps after closing or losing a deal.
- [ ] **Managerial Weekly Digest**: Automated Monday morning briefing summarising emerging deal patterns.
- [ ] **Competitive Playbooks**: Auto-generated battlecards based on aggregated competitor loss signals.

---

## 📄 License

Internal use — Built for AIONOS Agentic AI Factory.
