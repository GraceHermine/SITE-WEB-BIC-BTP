import logging
from typing import Optional, Tuple
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from .models import ContactRequest

logger = logging.getLogger(__name__)

# Dictionnaires pour traduire les codes en texte lisible
LABELS_PROJET = dict(ContactRequest.PROJET_CHOICES)
LABELS_BUDGET = dict(ContactRequest.BUDGET_CHOICES)
LABELS_DELAI = dict(ContactRequest.DELAI_CHOICES)
LABELS_TERRAIN = dict(ContactRequest.TERRAIN_CHOICES)

def _html_team(req: ContactRequest) -> str:
    rows = [
        ("Référence", req.reference),
        ("Type de projet", LABELS_PROJET.get(req.type_projet, req.type_projet)),
        ("Localisation", req.localisation),
        ("Surface terrain", f"{req.surface_terrain} m²"),
        ("Budget", LABELS_BUDGET.get(req.budget, req.budget)),
        ("Délai", LABELS_DELAI.get(req.delai, req.delai)),
        ("Statut terrain", LABELS_TERRAIN.get(req.terrain or "", "—")),
        ("Nom / Société", req.nom),
        ("Téléphone", f'<a href="tel:{req.telephone}">{req.telephone}</a>'),
        ("WhatsApp", f'<a href="https://wa.me/{req.telephone.lstrip("+")}">Ouvrir WhatsApp</a>'),
        ("E-mail", f'<a href="mailto:{req.email}">{req.email}</a>' if req.email else "—"),
        ("Message", (req.message or "—").replace("\n", "<br>")),
    ]
    
    body = "".join(
        f"<tr><td style='padding:8px 12px;border-bottom:1px solid #eee;"
        f"font-weight:600;color:#0E2A5C;width:140px'>{k}</td>"
        f"<td style='padding:8px 12px;border-bottom:1px solid #eee;color:#333'>{v}</td></tr>"
        for k, v in rows
    )
    
    return f"""
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto">
      <h2 style="color:#0E2A5C;margin-bottom:4px">Nouvelle demande de devis</h2>
      <p style="color:#666;margin-top:0">Reçue le {req.created_at:%d/%m/%Y %H:%M}</p>
      <table style="width:100%;border-collapse:collapse">{body}</table>
      <p style="margin-top:24px;padding:12px;background:#fff7e6;border-left:4px solid #E8833A;color:#7a4a10;font-size:13px">
        ⚠️ Répondre au client sous 24 h ouvrées — réf. <strong>{req.reference}</strong>
      </p>
    </div>
    """

def send_team_notification(req: ContactRequest) -> Tuple[bool, Optional[str]]:
    if not settings.CONTACT_TEAM_EMAILS:
        return False, "Aucun destinataire configuré."
    
    subject = f"[Devis] {req.reference} — {req.nom} ({req.type_projet})"
    text = f"Nouvelle demande de devis pour un projet de type {req.type_projet}.\nRéférence : {req.reference}"
    
    try:
        msg = EmailMultiAlternatives(
            subject=subject,
            body=text,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=settings.CONTACT_TEAM_EMAILS,
        )
        msg.attach_alternative(_html_team(req), "text/html")
        msg.send(fail_silently=False)
        return True, None
    except Exception as e:
        logger.exception("Erreur envoi email")
        return False, str(e)

def send_client_confirmation(req: ContactRequest) -> Tuple[bool, Optional[str]]:
    if not req.email:
        return False, "Pas d'e-mail client."
    
    subject = f"Votre demande de devis {req.reference} — BIC BTP"
    text = f"Bonjour {req.nom},\n\nNous avons bien reçu votre demande.\nRéférence : {req.reference}"
    
    try:
        msg = EmailMultiAlternatives(
            subject=subject,
            body=text,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[req.email],
        )
        msg.send(fail_silently=False)
        return True, None
    except Exception as e:
        logger.exception("Erreur envoi email client")
        return False, str(e)

def try_send_team_email(req: ContactRequest) -> None:
    ok, err = send_team_notification(req)
    req.email_attempts += 1
    if ok:
        req.email_sent = True
        req.email_last_error = None
    else:
        req.email_last_error = err
    req.save(update_fields=["email_sent", "email_attempts", "email_last_error"])