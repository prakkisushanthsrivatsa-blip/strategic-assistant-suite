
import { useState } from "react";
import "./App.css";

const agents = {
  orchestrator: {
    title: "AI Strategy Assistant",
    description:
      "Ask a business question and let AI automatically choose the right agents.",
    placeholder:
      "Ask anything about your customers, competitors, meetings, or strategy...",
    endpoint: "http://localhost:8000/api/orchestrate",
    field: "query",
    example:
      "Customers are unhappy with our pricing. Competitor A is cheaper and our team discussed changing the pricing model next month.",
  },

  feedback: {
    title: "Customer Feedback Agent",
    description:
      "Identify customer pain points, severity, and recommended actions.",
    placeholder: "Paste customer feedback here...",
    endpoint: "http://localhost:8000/api/feedback/analyze",
    field: "feedback",
    example:
      "Customers are complaining that checkout is too slow. The mobile app crashes frequently. Pricing is confusing.",
  },

  competitor: {
    title: "Competitor Intelligence Agent",
    description:
      "Analyze competitors, pricing, features, strengths, weaknesses, and opportunities.",
    placeholder: "Enter competitor information here...",
    endpoint: "http://localhost:8000/api/competitor/analyze",
    field: "competitor_data",
    example:
      "Competitor A: $20/month, AI analytics and mobile app. Competitor B: $30/month, advanced analytics but no mobile app. Our product: $15/month, basic analytics and mobile app.",
  },

  strategy: {
    title: "Meeting & Strategy Agent",
    description:
      "Turn meeting notes into decisions, actions, deadlines, risks, and strategy.",
    placeholder: "Paste meeting notes or transcript here...",
    endpoint: "http://localhost:8000/api/strategy/analyze",
    field: "meeting_text",
    example:
      "The team decided to launch the new product in October. Rahul will prepare the marketing campaign by September 30. Priya will complete product testing by September 25. The main concern is limited development time.",
  },
};

function App() {
  const [selectedAgent, setSelectedAgent] = useState("orchestrator");
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currentAgent = agents[selectedAgent];

  const selectAgent = (agent) => {
    setSelectedAgent(agent);
    setInput("");
    setResult(null);
    setError("");
  };

  const useExample = () => {
    setInput(currentAgent.example);
    setResult(null);
    setError("");
  };

  const analyze = async () => {
    if (!input.trim()) {
      return;
    }

    setLoading(true);
    setResult(null);
    setError("");

    try {
      console.log("Sending request to:", currentAgent.endpoint);
      console.log("Request:", {
        [currentAgent.field]: input,
      });

      const response = await fetch(currentAgent.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          [currentAgent.field]: input,
        }),
      });

      console.log("Response status:", response.status);

      const data = await response.json();

      console.log("Backend response:", data);

      if (!response.ok) {
        throw new Error(
          data.detail || `Server returned status ${response.status}`
        );
      }

      /*
       * Normal agents return:
       *
       * {
       *   "agent": "...",
       *   "result": {...}
       * }
       *
       * Orchestrator returns:
       *
       * {
       *   "query": "...",
       *   "selected_agents": [...],
       *   "routing_reason": "...",
       *   "agent_results": {...},
       *   "final_insight": {...}
       * }
       */

      if (selectedAgent === "orchestrator") {
        setResult(data);
      } else {
        setResult(data.result);
      }
    } catch (error) {
      console.error("API Error:", error);

      setError(error.message);

      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">

      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <header className="hero">

        <div className="badge">
          AI PRODUCT INTELLIGENCE
        </div>

        <h1>
          Product & Strategy AI Assistant
        </h1>

        <p>
          Transform customer feedback, competitor intelligence, and meeting
          data into actionable business insights.
        </p>

      </header>


      <main className="container">

        {/* ================================================= */}
        {/* AGENTS */}
        {/* ================================================= */}

        <section className="agent-grid">

          {/* ORCHESTRATOR */}

          <button
            className={`agent-card ${
              selectedAgent === "orchestrator" ? "selected" : ""
            }`}
            onClick={() => selectAgent("orchestrator")}
          >

            <div className="agent-icon">
              AI
            </div>

            <div>

              <h3>
                AI Strategy Assistant
              </h3>

              <p>
                Automatically choose the right agents.
              </p>

            </div>

          </button>


          {/* FEEDBACK */}

          <button
            className={`agent-card ${
              selectedAgent === "feedback" ? "selected" : ""
            }`}
            onClick={() => selectAgent("feedback")}
          >

            <div className="agent-icon">
              01
            </div>

            <div>

              <h3>
                Customer Feedback
              </h3>

              <p>
                Analyze customer pain points and actions.
              </p>

            </div>

          </button>


          {/* COMPETITOR */}

          <button
            className={`agent-card ${
              selectedAgent === "competitor" ? "selected" : ""
            }`}
            onClick={() => selectAgent("competitor")}
          >

            <div className="agent-icon">
              02
            </div>

            <div>

              <h3>
                Competitor Intelligence
              </h3>

              <p>
                Compare competitors and identify opportunities.
              </p>

            </div>

          </button>


          {/* STRATEGY */}

          <button
            className={`agent-card ${
              selectedAgent === "strategy" ? "selected" : ""
            }`}
            onClick={() => selectAgent("strategy")}
          >

            <div className="agent-icon">
              03
            </div>

            <div>

              <h3>
                Meeting & Strategy
              </h3>

              <p>
                Extract decisions, actions, and strategic insights.
              </p>

            </div>

          </button>

        </section>


        {/* ================================================= */}
        {/* INPUT WORKSPACE */}
        {/* ================================================= */}

        <section className="workspace">

          <div className="workspace-header">

            <div>

              <span className="active-label">
                ACTIVE AGENT
              </span>

              <h2>
                {currentAgent.title}
              </h2>

              <p>
                {currentAgent.description}
              </p>

            </div>


            <button
              className="example-button"
              onClick={useExample}
            >
              Use Example
            </button>

          </div>


          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={currentAgent.placeholder}
          />


          <div className="action-row">

            <span className="character-count">
              {input.length} characters
            </span>


            <button
              className="analyze-button"
              onClick={analyze}
              disabled={loading || !input.trim()}
            >

              {loading
                ? "Analyzing..."
                : "Analyze with AI →"}

            </button>

          </div>

        </section>


        {/* ================================================= */}
        {/* ERROR */}
        {/* ================================================= */}

        {error && !loading && (

          <section className="result-card">

            <div className="summary-box">

              <span className="result-label">
                ERROR
              </span>

              <p>
                {error}
              </p>

            </div>

          </section>

        )}


        {/* ================================================= */}
        {/* LOADING */}
        {/* ================================================= */}

        {loading && (

          <section className="result-card loading-card">

            <div className="spinner"></div>

            <div>

              <h3>
                AI is analyzing your input
              </h3>

              <p>
                Orchestrating specialist agents and generating business
                insights...
              </p>

            </div>

          </section>

        )}


        {/* ================================================= */}
        {/* RESULTS */}
        {/* ================================================= */}

        {result && !loading && (

          <section className="result-card">

            <div className="result-header">

              <div>

                <span className="active-label">
                  AI OUTPUT
                </span>

                <h2>
                  Business Analysis
                </h2>

              </div>

              <span className="status">
                ● Complete
              </span>

            </div>


            {/* ================================================= */}
            {/* ORCHESTRATOR */}
            {/* ================================================= */}

            {selectedAgent === "orchestrator" && (

              <div className="structured-result">

                {/* EXECUTIVE SUMMARY */}

                <div className="summary-box">

                  <span className="result-label">
                    EXECUTIVE SUMMARY
                  </span>

                  <p>
                    {result.final_insight?.executive_summary ||
                      "No executive summary was generated."}
                  </p>

                </div>


                {/* AGENTS USED */}

                <div className="section-block">

                  <h3>
                    Agents Used
                  </h3>

                  <div className="agent-used-list">

                    {result.selected_agents?.map(
                      (agent, index) => (

                        <span
                          className="agent-used"
                          key={index}
                        >
                          {agent}
                        </span>

                      )
                    )}

                  </div>

                </div>


                {/* ROUTING REASON */}

                <div className="summary-box">

                  <span className="result-label">
                    ORCHESTRATOR DECISION
                  </span>

                  <p>
                    {result.routing_reason ||
                      "The orchestrator selected the required specialist agents."}
                  </p>

                </div>


                {/* KEY FINDINGS */}

                <div className="section-block">

                  <h3>
                    Key Findings
                  </h3>

                  <div className="recommendation-list">

                    {result.final_insight?.key_findings?.map(
                      (finding, index) => (

                        <div
                          className="recommendation"
                          key={index}
                        >

                          <span>
                            {index + 1}
                          </span>

                          <p>
                            {finding}
                          </p>

                        </div>

                      )
                    )}

                  </div>

                </div>


                {/* RECOMMENDED ACTIONS */}

                <div className="section-block">

                  <h3>
                    Recommended Actions
                  </h3>

                  <div className="recommendation-list">

                    {result.final_insight?.recommended_actions?.map(
                      (action, index) => (

                        <div
                          className="recommendation"
                          key={index}
                        >

                          <span>
                            {index + 1}
                          </span>

                          <p>
                            {action}
                          </p>

                        </div>

                      )
                    )}

                  </div>

                </div>


                {/* PRIORITY */}

                <div className="priority-box">

                  <span className="result-label">
                    OVERALL PRIORITY
                  </span>

                  <strong>
                    {result.final_insight?.priority || "Unknown"}
                  </strong>

                </div>


                {/* RISKS */}

                <div className="section-block">

                  <h3>
                    Risks & Concerns
                  </h3>

                  <div className="risk-list">

                    {result.final_insight?.risks?.map(
                      (risk, index) => (

                        <div
                          className="risk-item"
                          key={index}
                        >

                          <span className="risk-icon">
                            !
                          </span>

                          <p>
                            {risk}
                          </p>

                        </div>

                      )
                    )}

                  </div>

                </div>

              </div>

            )}


            {/* ================================================= */}
            {/* FEEDBACK */}
            {/* ================================================= */}

            {selectedAgent === "feedback" && (

              <div className="structured-result">

                <div className="summary-box">

                  <span className="result-label">
                    SUMMARY
                  </span>

                  <p>
                    {result.summary}
                  </p>

                </div>


                <div className="priority-box">

                  <span className="result-label">
                    OVERALL PRIORITY
                  </span>

                  <strong>
                    {result.priority}
                  </strong>

                </div>


                <div className="section-block">

                  <h3>
                    Customer Pain Points
                  </h3>

                  <div className="pain-point-list">

                    {result.pain_points?.map(
                      (item, index) => (

                        <div
                          className="pain-point"
                          key={index}
                        >

                          <div className="pain-point-main">

                            <strong>
                              {item.problem}
                            </strong>

                            <span className="frequency">
                              {item.frequency}
                            </span>

                          </div>

                          <span
                            className={`severity ${
                              item.severity?.toLowerCase() || "low"
                            }`}
                          >
                            {item.severity}
                          </span>

                        </div>

                      )
                    )}

                  </div>

                </div>


                <div className="section-block">

                  <h3>
                    Recommended Actions
                  </h3>

                  <div className="recommendation-list">

                    {result.recommendations?.map(
                      (recommendation, index) => (

                        <div
                          className="recommendation"
                          key={index}
                        >

                          <span>
                            {index + 1}
                          </span>

                          <p>
                            {recommendation}
                          </p>

                        </div>

                      )
                    )}

                  </div>

                </div>

              </div>

            )}


            {/* ================================================= */}
            {/* COMPETITOR */}
            {/* ================================================= */}

            {selectedAgent === "competitor" && (

              <div className="structured-result">

                <div className="summary-box">

                  <span className="result-label">
                    MARKET SUMMARY
                  </span>

                  <p>
                    {result.summary}
                  </p>

                </div>


                <div className="section-block">

                  <h3>
                    Competitor Analysis
                  </h3>

                  <div className="competitor-list">

                    {result.competitors?.map(
                      (competitor, index) => (

                        <div
                          className="competitor-card"
                          key={index}
                        >

                          <div className="competitor-header">

                            <h4>
                              {competitor.name}
                            </h4>

                            <span className="pricing">
                              {competitor.pricing}
                            </span>

                          </div>


                          <div className="competitor-columns">

                            <div>

                              <span className="result-label">
                                FEATURES
                              </span>

                              <ul>

                                {competitor.features?.map(
                                  (feature, i) => (

                                    <li key={i}>
                                      {feature}
                                    </li>

                                  )
                                )}

                              </ul>

                            </div>


                            <div>

                              <span className="result-label">
                                STRENGTHS
                              </span>

                              <ul>

                                {competitor.strengths?.map(
                                  (strength, i) => (

                                    <li key={i}>
                                      {strength}
                                    </li>

                                  )
                                )}

                              </ul>

                            </div>


                            <div>

                              <span className="result-label">
                                WEAKNESSES
                              </span>

                              <ul>

                                {competitor.weaknesses?.map(
                                  (weakness, i) => (

                                    <li key={i}>
                                      {weakness}
                                    </li>

                                  )
                                )}

                              </ul>

                            </div>

                          </div>

                        </div>

                      )
                    )}

                  </div>

                </div>


                <div className="section-block">

                  <h3>
                    Market Opportunities
                  </h3>

                  <div className="recommendation-list">

                    {result.opportunities?.map(
                      (opportunity, index) => (

                        <div
                          className="recommendation"
                          key={index}
                        >

                          <span>
                            {index + 1}
                          </span>

                          <p>
                            {opportunity}
                          </p>

                        </div>

                      )
                    )}

                  </div>

                </div>


                <div className="section-block">

                  <h3>
                    Strategic Actions
                  </h3>

                  <div className="recommendation-list">

                    {result.strategic_actions?.map(
                      (action, index) => (

                        <div
                          className="recommendation"
                          key={index}
                        >

                          <span>
                            {index + 1}
                          </span>

                          <p>
                            {action}
                          </p>

                        </div>

                      )
                    )}

                  </div>

                </div>

              </div>

            )}


            {/* ================================================= */}
            {/* STRATEGY */}
            {/* ================================================= */}

            {selectedAgent === "strategy" && (

              <div className="structured-result">

                <div className="summary-box">

                  <span className="result-label">
                    MEETING SUMMARY
                  </span>

                  <p>
                    {result.summary}
                  </p>

                </div>


                <div className="section-block">

                  <h3>
                    Key Decisions
                  </h3>

                  <div className="recommendation-list">

                    {result.decisions?.map(
                      (decision, index) => (

                        <div
                          className="recommendation"
                          key={index}
                        >

                          <span>
                            {index + 1}
                          </span>

                          <p>
                            {decision}
                          </p>

                        </div>

                      )
                    )}

                  </div>

                </div>


                <div className="section-block">

                  <h3>
                    Action Items
                  </h3>

                  <div className="action-item-list">

                    {result.action_items?.map(
                      (item, index) => (

                        <div
                          className="action-item"
                          key={index}
                        >

                          <div className="action-number">
                            {index + 1}
                          </div>

                          <div className="action-details">

                            <strong>
                              {item.task}
                            </strong>

                            <div className="action-meta">

                              <span>
                                Owner: {item.owner}
                              </span>

                              <span>
                                Deadline: {item.deadline}
                              </span>

                            </div>

                          </div>

                        </div>

                      )
                    )}

                  </div>

                </div>


                <div className="section-block">

                  <h3>
                    Risks & Concerns
                  </h3>

                  <div className="risk-list">

                    {result.risks?.map(
                      (risk, index) => (

                        <div
                          className="risk-item"
                          key={index}
                        >

                          <span className="risk-icon">
                            !
                          </span>

                          <p>
                            {risk}
                          </p>

                        </div>

                      )
                    )}

                  </div>

                </div>


                <div className="section-block">

                  <h3>
                    Strategic Recommendations
                  </h3>

                  <div className="recommendation-list">

                    {result.strategic_recommendations?.map(
                      (recommendation, index) => (

                        <div
                          className="recommendation"
                          key={index}
                        >

                          <span>
                            {index + 1}
                          </span>

                          <p>
                            {recommendation}
                          </p>

                        </div>

                      )
                    )}

                  </div>

                </div>

              </div>

            )}

          </section>

        )}

      </main>


      {/* ================================================= */}
      {/* FOOTER */}
      {/* ================================================= */}

      <footer>

        <span>
          Product & Strategy AI Assistant
        </span>

        <span>
          Powered by AI
        </span>

      </footer>

    </div>
  );
}

export default App;

