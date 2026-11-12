from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register("hero", views.HeroSlideViewSet, basename="hero")
router.register("houses", views.HouseViewSet, basename="house")

urlpatterns = [
    path("", views.ApiIndexView.as_view(), name="api-index"),
    path("info/", views.InfoView.as_view(), name="info"),
    path("", include(router.urls)),
]