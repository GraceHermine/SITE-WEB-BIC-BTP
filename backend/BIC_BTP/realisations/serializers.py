from rest_framework import serializers
from .models import Realisation


class RealisationSerializer(serializers.ModelSerializer):
    durationShort = serializers.CharField(source="duration_short", read_only=True)

    class Meta:
        model = Realisation
        fields = [
            "id", "slug", "title", "location", "year", "model",
            "surface", "duration", "durationShort", "phase", "category",
            "gamme", "client", "description", "highlights", "tags",
            "image_url", "before_url", "order",
        ]