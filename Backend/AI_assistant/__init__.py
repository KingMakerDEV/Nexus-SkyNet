# ai/__init__.py
"""
AI Layer initializer.

Exposes core AI infrastructure and services:
- LLMClient: Gateway to the language model provider
- InsightGenerator: Structured insight generation from analytics results
- Explainer: Human-friendly explanations of metrics, comparisons, and normalization
"""

from AI_assistant.llm_client import LLMClient
from AI_assistant.insight_generator import InsightGenerator
from AI_assistant.explainer import Explainer

__all__ = [
    "LLMClient",
    "InsightGenerator",
    "Explainer",
]
