

from typing import Dict, Any, List
from Backend.AI_assistant.llm_client import LLMClient


class InsightGenerator:
    def __init__(self):
        self.llm = LLMClient(model_name="gpt-4", temperature=0.2, max_tokens=400)

    def _build_prompt(self, analytics_results: Dict[str, Any]) -> str:
        """
        Construct a factual, grounded prompt for the LLM.
        """
        return f"""
You are an insight generator. You must ONLY use the analytics results provided below.
Do NOT invent facts or speculate beyond the data.

Analytics Results:
{analytics_results}

Tasks:
- Identify clear trends (growth, decline, stability).
- Highlight anomalies (unexpected spikes, missing values).
- Point out high-impact differences (major gaps between datasets).
- Note patterns worth attention (correlations, clusters).

Output Requirements:
- Bullet-point insights (short, factual).
- One short executive summary (2–3 sentences).
- End with a confidence disclaimer: "Insights are based solely on provided analytics results."
"""

    def generate_insights(self, analytics_results: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate structured insights from analytics results.
        """
        prompt = self._build_prompt(analytics_results)
        response = self.llm.send_prompt(prompt)

        # Standardize output
        return {
            "status": "success" if response.get("text") else "error",
            "insights_text": response.get("text", ""),
            "usage": response.get("usage", {}),
        }
