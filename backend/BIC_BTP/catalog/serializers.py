from rest_framework import serializers
from .models import HeroSlide, House, Info


class HeroSlideSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeroSlide
        fields = ["id", "title", "subtitle", "image_url", "order"]


class HouseSerializer(serializers.ModelSerializer):
    # Alias camelCase pour coller au front (Maisons.jsx / Home.jsx)
    sallesBain = serializers.IntegerField(source="salles_bain", read_only=True)
    longDescription = serializers.CharField(source="long_description", read_only=True)
    priceLabel = serializers.CharField(source="price_label", read_only=True)

    class Meta:
        model = House
        fields = [
            "id", "slug", "name", "tagline", "surface",
            "chambres", "sallesBain", "niveaux",
            "description", "longDescription",
            "price", "priceLabel",
            "badge", "gamme", "image_url", "features", "order",
        ]


class InfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Info
        fields = "__all__"