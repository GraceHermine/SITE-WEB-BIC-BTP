# contact/management/commands/retry_emails.py
from django.core.management.base import BaseCommand
from contact.services import retry_pending_emails


class Command(BaseCommand):
    help = "Relance les e-mails équipe non envoyés (5 essais max, 10 min d'intervalle)."

    def handle(self, *args, **options):
        result = retry_pending_emails()
        self.stdout.write(self.style.SUCCESS(
            f"Relance : {result['pending']} en attente, {result['sent']} envoyés, {result['failed']} échecs."
        ))