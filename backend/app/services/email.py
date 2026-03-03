import resend

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
