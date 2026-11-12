from django.contrib import admin
from .models import HeroSlide, House, Info


@admin.register(HeroSlide)
class HeroSlideAdmin(admin.ModelAdmin):
    list_display = ("title", "order", "is_active")
    list_editable = ("order", "is_active")
    list_filter = ("is_active",)
    search_fields = ("title",)


@admin.register(House)
class HouseAdmin(admin.ModelAdmin):
    list_display = ("name", "gamme", "surface", "chambres", "price", "order", "is_active")
    list_editable = ("order", "is_active")
    list_filter = ("gamme", "is_active")
    search_fields = ("name", "description")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Info)
class InfoAdmin(admin.ModelAdmin):
    fieldsets = (
        ("Identité", {
            "fields": ("site_name", "logo_url", "baseline", "description")
        }),
        ("Coordonnées", {
            "fields": (
                "address_line1", "address_line2", "city", "country",
                "postal_code", "phone_primary", "phone_secondary",
                "whatsapp_number", "email_primary", "email_secondary",
                "opening_hours",
            )
        }),
        ("Réseaux sociaux", {
            "fields": ("social_links",),
            "description": 'Format : [{"label": "...", "url": "...", "icon": "..."}]'
        }),
        ("Colonnes du footer", {
            "fields": ("footer_columns",),
            "description": 'Format : [{"title": "...", "links": [{"label": "...", "url": "..."}]}]'
        }),
        ("Légal", {
            "fields": (
                "legal_mentions", "privacy_url", "cgu_url",
                "copyright_text", "company_registration",
            )
        }),
        ("Divers", {
            "fields": ("announcement",)
        }),
    )

    def has_add_permission(self, request):
        return not Info.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False