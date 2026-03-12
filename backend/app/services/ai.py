import json
import logging

from openai import AsyncAzureOpenAI
from langfuse import Langfuse
from langfuse.openai import AsyncAzureOpenAI as LangfuseAzureOpenAI

from app.config import get_settings

settings = get_settings()
logger = logging.getLogger(__name__)

_langfuse: Langfuse | None = None
_client: AsyncAzureOpenAI | None = None

REASONING_MODELS = {"o1", "o1-mini", "o3", "o3-mini", "o3-pro", "GPT5Mini"}


def _is_reasoning_model(model: str) -> bool:
    return model in REASONING_MODELS or model.lower().startswith(("o1", "o3", "gpt5"))


def get_langfuse() -> Langfuse | None:
    """
    Initialize Langfuse if keys are configured. If not, return None so the
    rest of the app can continue without tracing.
    """
    global _langfuse
    if _langfuse is not None:
        return _langfuse

    if not settings.langfuse_public_key or not settings.langfuse_secret_key:
        return None

    try:
        _langfuse = Langfuse(
            public_key=settings.langfuse_public_key,
            secret_key=settings.langfuse_secret_key,
            host=settings.langfuse_host,
        )
    except Exception:
        _langfuse = None
    return _langfuse


def get_openai_client():
    global _client
    if _client is None:
        _client = LangfuseAzureOpenAI(
            azure_endpoint=settings.azure_openai_endpoint,
            api_key=settings.azure_openai_api_key,
            api_version=settings.azure_openai_api_version,
        )
    return _client


async def generate_completion(
    system_prompt: str,
    user_prompt: str,
    trace_name: str,
    metadata: dict | None = None,
    json_mode: bool = False,
    temperature: float = 1.0,
    max_tokens: int = 16000,
) -> str:
    client = get_openai_client()
    langfuse = get_langfuse()
    model = settings.azure_openai_deployment
    reasoning = _is_reasoning_model(model)

    trace_id: str | None = None
    if langfuse is not None and hasattr(langfuse, "trace"):
        try:
            trace = langfuse.trace(
                name=trace_name,
                metadata=metadata or {},
            )
            trace_id = getattr(trace, "id", None)
        except Exception:
            trace_id = None

    extra_args: dict = {}
    if trace_id:
        extra_args["langfuse_trace_id"] = trace_id

    if json_mode:
        extra_args["response_format"] = {"type": "json_object"}

    # Reasoning models use "developer" role; standard models use "system".
    role = "developer" if reasoning else "system"

    messages = [
        {"role": role, "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ]

    # Reasoning models only accept temperature=1 and use max_completion_tokens.
    # Standard models accept both temperature and max_tokens.
    if reasoning:
        extra_args["max_completion_tokens"] = max_tokens
    else:
        extra_args["temperature"] = temperature
        extra_args["max_tokens"] = max_tokens

    response = await client.chat.completions.create(
        model=model,
        messages=messages,
        **extra_args,
    )

    message = response.choices[0].message

    if json_mode:
        parsed = getattr(message, "parsed", None)
        if parsed is not None:
            return json.dumps(parsed)

        if message.content and message.content.strip():
            return message.content

        logger.error(
            "JSON mode returned empty response. finish_reason=%s, refusal=%s",
            response.choices[0].finish_reason,
            getattr(message, "refusal", None),
        )
        raise ValueError(
            "JSON mode enabled but model returned neither parsed JSON nor content. "
            f"finish_reason={response.choices[0].finish_reason}"
        )

    return message.content or ""


async def generate_completion_with_image(
    system_prompt: str,
    user_prompt: str,
    image_base64: str | list[str],
    trace_name: str,
    metadata: dict | None = None,
    json_mode: bool = False,
    max_tokens: int = 4096,
) -> str:
    """
    Call the same deployment (e.g. GPT-5 Mini) with image(s) in the user message.
    image_base64: one base64-encoded PNG string, or a list of them (e.g. page 1, page 2).
    """
    client = get_openai_client()
    langfuse = get_langfuse()
    model = settings.azure_openai_deployment
    reasoning = _is_reasoning_model(model)

    trace_id: str | None = None
    if langfuse is not None and hasattr(langfuse, "trace"):
        try:
            trace = langfuse.trace(
                name=trace_name,
                metadata=metadata or {},
            )
            trace_id = getattr(trace, "id", None)
        except Exception:
            trace_id = None

    extra_args: dict = {}
    if trace_id:
        extra_args["langfuse_trace_id"] = trace_id

    if json_mode:
        extra_args["response_format"] = {"type": "json_object"}

    role = "developer" if reasoning else "system"

    images = image_base64 if isinstance(image_base64, list) else [image_base64]
    user_content: list = [{"type": "text", "text": user_prompt}]
    for b64 in images:
        user_content.append({
            "type": "image_url",
            "image_url": {"url": f"data:image/png;base64,{b64}"},
        })

    messages = [
        {"role": role, "content": system_prompt},
        {"role": "user", "content": user_content},
    ]

    if reasoning:
        extra_args["max_completion_tokens"] = max_tokens
    else:
        extra_args["temperature"] = 0.3
        extra_args["max_tokens"] = max_tokens

    response = await client.chat.completions.create(
        model=model,
        messages=messages,
        **extra_args,
    )

    message = response.choices[0].message

    if json_mode:
        parsed = getattr(message, "parsed", None)
        if parsed is not None:
            return json.dumps(parsed)

        if message.content and message.content.strip():
            return message.content

        logger.error(
            "JSON mode (vision) returned empty response. finish_reason=%s, refusal=%s",
            response.choices[0].finish_reason,
            getattr(message, "refusal", None),
        )
        raise ValueError(
            "JSON mode enabled but model returned neither parsed JSON nor content. "
            f"finish_reason={response.choices[0].finish_reason}"
        )

    return message.content or ""
