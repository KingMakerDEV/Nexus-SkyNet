

from typing import Dict, Any


class Explainer:
    def __init__(self):
        pass

    def explain_normalization(self, normalized_payload: Dict[str, Any]) -> str:
        """
        Explain what normalization did in human-friendly terms.
        """
        return (
            "Normalization took raw, inconsistent values and converted them into a "
            "standard format. This ensures that units, scales, and labels are aligned "
            "so datasets can be compared fairly. In short, it makes the data speak the "
            "same language."
        )

    def explain_comparison(self, comparison_result: Dict[str, Any]) -> str:
        """
        Explain what a comparison result means.
        """
        similarity = comparison_result.get("similarity_score")
        return (
            f"The comparison shows how closely two datasets align. "
            f"A similarity score of {similarity} means they share patterns but also "
            f"have differences worth noting. This matters because it highlights where "
            f"datasets agree and where they diverge."
        )

    def explain_metric(self, metric_name: str, metric_value: Any) -> str:
        """
        Explain a metric in beginner-friendly language.
        """
        explanations = {
            "mean": "The mean is the average — it tells you the central value of the data.",
            "std_dev": "Standard deviation shows how spread out the data is. "
                       "A small value means data points are close together, "
                       "while a large value means they vary widely.",
            "similarity_score": "This score measures how alike two datasets are. "
                                "Closer to 1 means very similar, closer to 0 means very different.",
        }

        base_explanation = explanations.get(metric_name, f"{metric_name} is a key metric.")
        return f"{base_explanation} In this case, the value is {metric_value}."

    def why_does_this_matter(self, context: str) -> str:
        """
        Provide context-aware clarification: why the result matters.
        """
        return (
            f"This matters because {context}. "
            "Understanding this helps you interpret results correctly and spot meaningful patterns."
        )

    def how_to_interpret(self, context: str) -> str:
        """
        Provide guidance on interpretation (not instructions).
        """
        return (
            f"You should interpret this as {context}. "
            "It’s about understanding the significance, not taking action."
        )
