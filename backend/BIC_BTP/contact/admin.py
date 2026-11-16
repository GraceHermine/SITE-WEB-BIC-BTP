from django.contrib import admin
from .models import ContactRequest
from .services import try_send_team_email


@admin.register(ContactRequest)
class ContactRequestAdmin(admin.ModelAdmin):
    list_display = (
        "reference",
        "nom",
        "telephone",
        "type_projet",   # remplace "modele"
        "budget",
        "email_sent",
        "status",
        "created_at",
    )
    list_filter = (
        "status",
        "email_sent",
        "type_projet",   # remplace "modele"
        "budget",
        "delai",
    )
    search_fields = ("reference", "nom", "telephone", "email")
    readonly_fields = (
        "reference",
        "created_at",
        "email_attempts",
        "email_last_error",
    )
    actions = ["action_retry_email"]

    @admin.action(description="Relancer l'envoi de l'e-mail équipe")
    def action_retry_email(self, request, queryset):
        for req in queryset:
            try_send_team_email(req)
        self.message_user(request, f"Relance effectuée pour {queryset.count()} demande(s).")