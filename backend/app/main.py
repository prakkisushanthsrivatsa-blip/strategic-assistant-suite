from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.agents.synthesis_agent import synthesize_results
from app.agents.feedback_agent import analyze_feedback
from app.agents.competitor_agent import analyze_competitors
from app.agents.strategy_agent import analyze_strategy
from app.agents.orchestrator_agent import route_request
from app.hindsight_memory import remember, recall


app = FastAPI(
    title="Product & Strategy AI Assistant"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# REQUEST MODELS
# =========================================================

class FeedbackRequest(BaseModel):
    feedback: str


class CompetitorRequest(BaseModel):
    competitor_data: str


class StrategyRequest(BaseModel):
    meeting_text: str


class OrchestratorRequest(BaseModel):
    query: str


# =========================================================
# HOME
# =========================================================

@app.get("/")
def home():
    return {
        "message": "Product & Strategy AI Assistant is running!"
    }


# =========================================================
# CUSTOMER FEEDBACK AGENT
# =========================================================

@app.post("/api/feedback/analyze")
def feedback_analysis(request: FeedbackRequest):

    result = analyze_feedback(request.feedback)

    return {
        "agent": "Customer Feedback Agent",
        "result": result
    }


# =========================================================
# COMPETITOR INTELLIGENCE AGENT
# =========================================================

@app.post("/api/competitor/analyze")
def competitor_analysis(request: CompetitorRequest):

    result = analyze_competitors(request.competitor_data)

    return {
        "agent": "Competitor Intelligence Agent",
        "result": result
    }


# =========================================================
# MEETING & STRATEGY AGENT
# =========================================================

@app.post("/api/strategy/analyze")
def strategy_analysis(request: StrategyRequest):

    result = analyze_strategy(request.meeting_text)

    return {
        "agent": "Meeting & Strategy Agent",
        "result": result
    }


# =========================================================
# ORCHESTRATOR AGENT
# =========================================================

@app.post("/api/orchestrate")
def orchestrate(request: OrchestratorRequest):

    # Recall relevant past knowledge from Hindsight
    past_memories = recall(request.query)

    routing = route_request(request.query)
    selected_agents = routing.get("agents", [])

    results = {}

    if "feedback" in selected_agents:
        results["feedback"] = analyze_feedback(request.query)

    if "competitor" in selected_agents:
        results["competitor"] = analyze_competitors(request.query)

    if "strategy" in selected_agents:
        results["strategy"] = analyze_strategy(request.query)

    final_result = synthesize_results(
        request.query,
        results
    )

    # Store the current analysis in Hindsight
    remember(
        content=f"""
User Query:
{request.query}

Selected Agents:
{selected_agents}

Agent Results:
{results}

Final Insight:
{final_result}
""",
        context="Product & Strategy AI Assistant"
    )

    return {
        "query": request.query,
        "selected_agents": selected_agents,
        "routing_reason": routing.get("reason"),
        "past_memories": past_memories,
        "agent_results": results,
        "final_insight": final_result
    }

    # -----------------------------------------
    # 1. Orchestrator decides which agents
    #    are required
    # -----------------------------------------

    routing = route_request(request.query)

    selected_agents = routing.get("agents", [])

    results = {}

    # -----------------------------------------
    # 2. Run Customer Feedback Agent
    # -----------------------------------------

    if "feedback" in selected_agents:

        results["feedback"] = analyze_feedback(
            request.query
        )

    # -----------------------------------------
    # 3. Run Competitor Intelligence Agent
    # -----------------------------------------

    if "competitor" in selected_agents:

        results["competitor"] = analyze_competitors(
            request.query
        )

    # -----------------------------------------
    # 4. Run Meeting & Strategy Agent
    # -----------------------------------------

    if "strategy" in selected_agents:

        results["strategy"] = analyze_strategy(
            request.query
        )

    # -----------------------------------------
    # 5. Final Synthesis
    # -----------------------------------------

    final_result = synthesize_results(
        request.query,
        results
    )

    # -----------------------------------------
    # 6. Return complete agentic result
    # -----------------------------------------

    return {
        "query": request.query,

        "selected_agents": selected_agents,

        "routing_reason": routing.get("reason"),

        "agent_results": results,

        "final_insight": final_result
    }

    # -----------------------------------------
    # 1. Ask orchestrator which agents are needed
    # -----------------------------------------

    routing = route_request(request.query)

    selected_agents = routing.get("agents", [])

    results = {}

    # -----------------------------------------
    # 2. Run Customer Feedback Agent
    # -----------------------------------------

    if "feedback" in selected_agents:

        results["feedback"] = analyze_feedback(
            request.query
        )

    # -----------------------------------------
    # 3. Run Competitor Intelligence Agent
    # -----------------------------------------

    if "competitor" in selected_agents:

        results["competitor"] = analyze_competitors(
            request.query
        )

    # -----------------------------------------
    # 4. Run Meeting & Strategy Agent
    # -----------------------------------------

    if "strategy" in selected_agents:

        results["strategy"] = analyze_strategy(
            request.query
        )

    # -----------------------------------------
    # 5. Return orchestration result
    # -----------------------------------------

    return {
        "query": request.query,
        "selected_agents": selected_agents,
        "routing_reason": routing.get("reason"),
        "results": results
    }