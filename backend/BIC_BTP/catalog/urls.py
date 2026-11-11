from django.urls import path
from . import views

app_name = "catalog"

urlpatterns = [
    path("hero/", views.HeroSlideListView.as_view(), name="hero-list"),
    path("houses/", views.HouseListView.as_view(), name="house-list"),
]