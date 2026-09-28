# Product & Strategy AI Assistant

An AI-powered multi-agent business intelligence assistant that analyzes customer feedback, competitor intelligence, and meeting/strategy information to generate actionable product and business insights.

The system uses **Hindsight as its persistent memory layer**, allowing the assistant to retain and recall relevant business context across interactions.

## 🚀 Key Features

### 1. Customer Feedback Agent

Analyzes customer feedback to identify:

* Customer pain points
* Severity
* Frequency
* Recommendations
* Priority

### 2. Competitor Intelligence Agent

Analyzes competitor information including:

* Competitor features
* Pricing
* Strengths
* Weaknesses
* Market opportunities
* Strategic actions

### 3. Meeting & Strategy Agent

Processes meeting notes or transcripts to extract:

* Meeting summary
* Decisions
* Action items
* Owners
* Deadlines
* Risks
* Strategic recommendations

### 4. Orchestrator Agent

The orchestrator analyzes the user's request and determines which specialist agents are required.

It can route a request to:

* Feedback Agent
* Competitor Intelligence Agent
* Meeting & Strategy Agent
* Multiple agents when the request requires cross-domain analysis

### 5. Final Synthesis Agent

Combines the outputs from the selected specialist agents and generates:

* Executive summary
* Key findings
* Recommended actions
* Overall priority
* Risks and concerns

### 6. Hindsight Persistent Memory

Hindsight is integrated into the agent workflow as the system's persistent memory layer.

The application:

1. Recalls relevant previous memories before processing a request.
2. Routes the request to the appropriate specialist agents.
3. Generates the business analysis.
4. Stores useful analysis and context back into Hindsight.

This enables the assistant to maintain business context across interactions.

---

## 🧠 System Architecture

```text
                         USER
                           │
                           ▼
                  ┌────────────────┐
                  │  ORCHESTRATOR  │
                  │     AGENT      │
                  └───────┬────────┘
                          │
                    Hindsight Recall
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
     FEEDBACK         COMPETITOR       STRATEGY
       AGENT            AGENT            AGENT
          │               │               │
          └───────────────┼───────────────┘
                          ▼
                  ┌────────────────┐
                  │    SYNTHESIS   │
                  │      AGENT     │
                  └───────┬────────┘
                          │
                          ▼
                    FINAL INSIGHT
                          │
                          ▼
                  Hindsight Retain
```

---

## 🛠️ Technology Stack

### Frontend

* React
* Vite
* JavaScript
* CSS

### Backend

* Python
* FastAPI
* Uvicorn

### AI

* Groq API
* `openai/gpt-oss-120b` for application agents
* `openai/gpt-oss-20b` for local Hindsight LLM operations

### Memory

* Hindsight
* Hindsight Python Client
* Local Hindsight API
* Embedded PostgreSQL / pgvector

---

## 📁 Project Structure

```text
strategic-assistant-suite/
│
├── backend/
│   ├── app/
│   │   ├── agents/
│   │   │   ├── feedback_agent.py
│   │   │   ├── competitor_agent.py
│   │   │   ├── strategy_agent.py
│   │   │   ├── orchestrator_agent.py
│   │   │   └── synthesis_agent.py
│   │   │
│   │   ├── hindsight_memory.py
│   │   └── main.py
│   │
│   └── test_hindsight.py
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

---

## ⚙️ Setup

### Prerequisites

* Python 3.10+
* Node.js
* npm
* Git
* Groq API key

### 1. Clone the repository

```bash
git clone https://github.com/prakkisushanthsrivatsa-blip/strategic-assistant-suite.git
cd strategic-assistant-suite
```

### 2. Create and activate Python virtual environment

Windows PowerShell:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

### 3. Install backend dependencies

```powershell
python -m pip install fastapi "uvicorn[standard]" groq python-dotenv hindsight-client hindsight-api
```

### 4. Configure environment variables

Create a `.env` file in the project root:

```env
GROQ_API_KEY=your_groq_api_key
HINDSIGHT_BANK_ID=product-strategy-assistant-local
```

**Never commit `.env` or API keys to GitHub.**

---

## 🧠 Running Hindsight Locally

Start Hindsight in a separate terminal.

```powershell
$env:HINDSIGHT_API_LLM_PROVIDER="groq"
$env:HINDSIGHT_API_LLM_API_KEY="YOUR_GROQ_API_KEY"
$env:HINDSIGHT_API_LLM_MODEL="openai/gpt-oss-20b"
$env:HINDSIGHT_API_LLM_GROQ_SERVICE_TIER="on_demand"
hindsight-api
```

The Hindsight API runs at:

```text
http://localhost:8888
```

---

## ▶️ Running the Backend

Open another terminal:

```powershell
cd backend
..\ .venv\Scripts\Activate.ps1
```

If needed, activate from the project root first:

```powershell
.\.venv\Scripts\Activate.ps1
cd backend
```

Then:

```powershell
uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

---

## 💻 Running the Frontend

Open another terminal:

```powershell
cd frontend
npm install
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

## 🔄 Example Workflow

### User Query

```text
Customers are complaining about slow performance,
competitors are offering better pricing, and our team
discussed improving performance next month.
```

### Processing

```text
User Query
    ↓
Hindsight Recall
    ↓
Orchestrator
    ↓
Feedback + Competitor + Strategy Agents
    ↓
Synthesis Agent
    ↓
Final Business Insight
    ↓
Hindsight Retain
```

### Final Output

The system produces:

* Executive summary
* Key findings
* Recommended actions
* Priority
* Risks and concerns

---

## 🔐 Security

Sensitive credentials are intentionally excluded from this repository.

The `.gitignore` prevents files such as:

```text
.env
.venv/
node_modules/
__pycache__/
```

from being committed.

API keys should always be supplied through environment variables.

---

## 🎯 Project Objective

The goal of the Product & Strategy AI Assistant is to provide a unified AI-driven system that can transform unstructured business information into actionable strategic insights while maintaining useful context through persistent AI memory.

---

## 🧩 Role of Hindsight

Hindsight provides the persistent memory capability of the system.

Instead of treating every request as an isolated interaction, the application can:

```text
RECALL → ANALYZE → SYNTHESIZE → RETAIN
```

This allows relevant historical business context to participate in future analyses.

---

## 📌 Project Status

**Prototype / Hackathon Project**

Core multi-agent analysis, orchestration, synthesis, and Hindsight memory integration are implemented.
