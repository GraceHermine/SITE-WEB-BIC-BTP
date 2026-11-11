from rest_framework import serializers
from .models import HeroSlide, House


class HeroSlideSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeroSlide
        fields = ["id", "title", "image_url", "order"]


class HouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = House
        fields = ["id", "name", "surface", "description", "price", "image_url", "order"]