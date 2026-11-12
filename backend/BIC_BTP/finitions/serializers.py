from rest_framework import serializers
from .models import Gamme, Poste, PosteOption, Ambiance


class GammeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gamme
        fields = ["id", "slug", "name", "tagline", "description", "color", "coef", "order"]


class AmbianceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ambiance
        fields = ["label", "swatches"]


class PosteOptionSerializer(serializers.ModelSerializer):
    gamme_id = serializers.CharField(source="gamme.slug", read_only=True)

    class Meta:
        model = PosteOption
        fields = ["gamme_id", "label"]


class PosteSerializer(serializers.ModelSerializer):
    """
    `options` renvoyé en dict { "essentiel": "...", "confort": "...", "prestige": "..." }
    → exactement ce que Finitions.jsx attend (poste.options[gammeId]).
    """
    options = serializers.SerializerMethodField()

    class Meta:
        model = Poste
        fields = ["id", "slug", "title", "icon", "description", "options", "order"]

    def get_options(self, obj):
        return {opt.gamme.slug: opt.label for opt in obj.options.select_related("gamme")}