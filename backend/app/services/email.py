from datetime import datetime, timezone

import resend
from typing import Any, Dict, List, Optional, Union

from app.config import get_settings

settings = get_settings()


def _get_client():
    resend.api_key = settings.email_api_key
    return resend


def send_magic_link(to_email: str, token: str):
    client = _get_client()
    link = f"{settings.frontend_url}/auth/magic-link/verify?token={token}"
    client.Emails.send({
        "from": settings.email_from,
        "to": [to_email],
        "subject": "Sign in to WadeCV",
        "html": f"""
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
            <h2>Sign in to WadeCV</h2>
            <p>Click the button below to sign in to your account. This link expires in 15 minutes.</p>
            <a href="{link}" style="display: inline-block; background: #2563eb; color: white;
               padding: 12px 24px; border-radius: 6px; text-decoration: none; margin: 16px 0;">
                Sign In
            </a>
            <p style="color: #6b7280; font-size: 14px;">
                If you didn't request this, you can safely ignore this email.
            </p>
        </div>
        """,
    })


def send_verification_email(to_email: str, token: str):
    client = _get_client()
    link = f"{settings.frontend_url}/auth/verify-email?token={token}"
    client.Emails.send({
        "from": settings.email_from,
        "to": [to_email],
        "subject": "Verify your WadeCV email",
        "html": f"""
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
            <h2>Verify your email</h2>
            <p>Thanks for signing up to WadeCV! Please verify your email address.</p>
            <a href="{link}" style="display: inline-block; background: #2563eb; color: white;
               padding: 12px 24px; border-radius: 6px; text-decoration: none; margin: 16px 0;">
                Verify Email
            </a>
        </div>
        """,
    })


def send_deletion_confirmation(to_email: str):
    client = _get_client()
    client.Emails.send({
        "from": settings.email_from,
        "to": [to_email],
        "subject": "Your WadeCV account has been deleted",
        "html": """
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
            <h2>Account Deleted</h2>
            <p>Your WadeCV account and all associated data have been permanently deleted.</p>
            <p>If you did not request this, please contact us immediately.</p>
        </div>
        """,
    })


def send_signup_notification(
    user_email: str,
    signup_method: str = "password_register",
    user_id: Optional[str] = None,
) -> None:
    """Notify the site owner (support_forward_to) when a new user signs up."""
    to = settings.support_forward_to
    if not to:
        return
    client = _get_client()
    timestamp = datetime.now(timezone.utc).isoformat()
    id_line = f"<p><strong>User ID:</strong> {user_id}</p>" if user_id else ""
    html = f"""
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>New WadeCV signup</h2>
        <p><strong>Email:</strong> {user_email}</p>
        {id_line}
        <p><strong>Signup method:</strong> {signup_method}</p>
        <p><strong>Signed up at:</strong> {timestamp}</p>
    </div>
    """
    client.Emails.send({
        "from": settings.email_from,
        "to": [to],
        "subject": "New WadeCV signup",
        "html": html,
    })


def forward_inbound_support_email(payload: Dict[str, Any]):
    client = _get_client()

    email_id: Optional[str] = payload.get("email_id")
    original_from: Optional[str] = payload.get("from")
    original_to: Optional[Union[str, List[str]]] = payload.get("to")
    subject: Optional[str] = payload.get("subject")
    text: Optional[str] = payload.get("text")
    html: Optional[str] = payload.get("html")
    message_id: Optional[str] = payload.get("id") or payload.get("message_id")

    if isinstance(original_to, list):
        original_to_str = ", ".join(original_to)
    else:
        original_to_str = original_to or ""

    if email_id and (not text and not html):
        try:
            email = client.Emails.get(email_id=email_id)  # type: ignore[arg-type]
            text = email.get("text")  # type: ignore[assignment]
            html = email.get("html")  # type: ignore[assignment]
        except Exception:
            # If fetching full content fails, continue with whatever we have.
            pass

    meta_lines = []
    if original_from:
        meta_lines.append(f"Original From: {original_from}")
    if original_to_str:
        meta_lines.append(f"Original To: {original_to_str}")
    if message_id:
        meta_lines.append(f"Resend Message-ID: {message_id}")

    meta_block = "\n".join(meta_lines) if meta_lines else "Inbound support email via Resend"

    effective_subject = subject or "New support message"
    target = settings.support_forward_to

    if html:
        meta_html = meta_block.replace("\n", "<br />")
        body_html = f"<p>{meta_html}</p><hr />{html}"
        body_text = f"{meta_block}\n\n{text or ''}"
        client.Emails.send({
            "from": settings.email_from,
            "to": [target],
            "subject": f"[Support] {effective_subject}",
            "text": body_text,
            "html": body_html,
        })
    else:
        body_text = f"{meta_block}\n\n{text or ''}"
        client.Emails.send({
            "from": settings.email_from,
            "to": [target],
            "subject": f"[Support] {effective_subject}",
            "text": body_text,
        })
