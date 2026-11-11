from django.shortcuts import render
from rest_framework import generics
from .models import HeroSlide, House
from .serializers import HeroSlideSerializer, HouseSerializer

# Create your views here.

class HeroSlideListView(generics.ListAPIView):
    queryset = HeroSlide.objects.all()
    serializer_class = HeroSlideSerializer
    pagination_class = None  # renvoie un tableau JSON simple


class HouseListView(generics.ListAPIView):
    queryset = House.objects.all()
    serializer_class = HouseSerializer
    pagination_class = None