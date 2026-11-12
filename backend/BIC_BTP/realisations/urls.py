from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register("realisations", views.RealisationViewSet, basename="realisation")

urlpatterns = [
    # Stats AVANT le router (sinon "stats" serait interprété comme un slug)
    path("realisations/stats/", views.RealisationStatsView.as_view(), name="stats"),
    path("", include(router.urls)),
]