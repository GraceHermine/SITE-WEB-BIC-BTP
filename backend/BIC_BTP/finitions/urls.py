from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register("finitions/gammes", views.GammeViewSet, basename="gamme")
router.register("finitions/postes", views.PosteViewSet, basename="poste")
router.register("finitions/options", views.PosteOptionViewSet, basename="poste-option")
router.register("finitions/ambiances", views.AmbianceViewSet, basename="ambiance")

urlpatterns = [
    # Bundle consommé par Finitions.jsx (AVANT le router pour ne pas être capté)
    path("finitions/", views.FinitionsBundleView.as_view(), name="finitions-bundle"),
    path("", include(router.urls)),
]