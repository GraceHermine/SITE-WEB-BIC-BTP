from django.contrib import admin
from .models import DemandeDevis


@admin.register(DemandeDevis)
class DemandeDevisAdmin(admin.ModelAdmin):
    list_display = ("nom", "email", "gamme", "poste", "modele", "status", "created_at")
    list_filter = ("status", "gamme", "poste")
    search_fields = ("nom", "email", "telephone", "message")
    readonly_fields = ("created_at", "updated_at")
    date_hierarchy = "created_at"