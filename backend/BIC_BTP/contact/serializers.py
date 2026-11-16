import re
from rest_framework import serializers
from .models import ContactRequest

PHONE_RE = re.compile(r"^\+?\d{8,15}$")

class ContactSerializer(serializers.ModelSerializer):
    _hp = serializers.CharField(required=False, allow_blank=True, write_only=True)

    class Meta:
        model = ContactRequest
        fields = [
            "type_projet", "localisation", "surface_terrain", "budget", "delai", 
            "terrain", "message", "nom", "email", "telephone", "consent", "_hp"
        ]

    def validate_telephone(self, value: str) -> str:
        cleaned = re.sub(r"[\s\-().]", "", value or "")
        if not PHONE_RE.match(cleaned):
            raise serializers.ValidationError("Format de téléphone invalide.")
        return cleaned

    def validate_consent(self, value: bool) -> bool:
        if not value:
            raise serializers.ValidationError("Le consentement est obligatoire.")
        return value