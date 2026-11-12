from rest_framework import serializers
from .models import DemandeDevis


class DemandeDevisSerializer(serializers.ModelSerializer):
    class Meta:
        model = DemandeDevis
        fields = [
            "id", "nom", "email", "telephone", "message",
            "gamme", "poste", "modele", "reference",
            "status", "created_at",
        ]
        read_only_fields = ["id", "status", "created_at"]

    def validate_nom(self, value):
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Le nom est trop court.")
        return value.strip()

    def validate_message(self, value):
        if value and len(value) > 4000:
            raise serializers.ValidationError("Le message est trop long (4000 car. max).")
        return value