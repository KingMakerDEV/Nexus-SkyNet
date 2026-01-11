

import os
import time
import logging
from typing import Dict, Any, List, Optional

import openai  # Requires: pip install openai
from Backend.app.config import settings  # config.py should expose settings.API_KEY, etc.

logger = logging.getLogger(__name__)


class LLMClient:
    def __init__(
        self,
        model_name: str = "gpt-4",
        temperature: float = 0.2,
        max_tokens: int = 512,
        timeout: int = 30,
        retries: int = 3,
    ):
        self.model_name = model_name
        self.temperature = temperature
        self.max_tokens = max_tokens
        self.timeout = timeout
        self.retries = retries

        # Configure OpenAI client
        openai.api_key = settings.OPENAI_API_KEY

    def _build_messages(self, prompt: str) -> List[Dict[str, str]]:
        """
        Build the messages array for the LLM call.
        """
        return [{"role": "user", "content": prompt}]

    def _execute_request(self, messages: List[Dict[str, str]]) -> Dict[str, Any]:
        """
        Execute the LLM request with retries and error handling.
        """
        attempt = 0
        while attempt < self.retries:
            try:
                response = openai.ChatCompletion.create(
                    model=self.model_name,
                    messages=messages,
                    temperature=self.temperature,
                    max_tokens=self.max_tokens,
                    request_timeout=self.timeout,
                )

                # Standardize response
                text = response["choices"][0]["message"]["content"].strip()
                usage = response.get("usage", {})

                return {"text": text, "usage": usage}

            except openai.error.RateLimitError:
                logger.warning("Rate limit hit, retrying...")
                time.sleep(2 ** attempt)
            except openai.error.Timeout:
                logger.warning("Timeout, retrying...")
                time.sleep(2 ** attempt)
            except Exception as e:
                logger.error(f"LLM request failed: {e}")
                break

            attempt += 1

        return {"text": "", "usage": {}, "error": "LLM request failed after retries"}

    def send_prompt(self, prompt: str) -> Dict[str, Any]:
        """
        Public method to send a prompt to the LLM.
        Returns standardized response.
        """
        messages = self._build_messages(prompt)
        return self._execute_request(messages)
