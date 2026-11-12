from django.contrib import admin
from .models import Realisation


@admin.register(Realisation)
class RealisationAdmin(admin.ModelAdmin):
    list_display = ("title", "phase", "category", "gamme", "year", "order", "is_active")
    list_editable = ("order", "is_active")
    list_filter = ("phase", "category", "gamme")
    search_fields = ("title", "location", "model")
    prepopulated_fields = {"slug": ("title",)}