from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import HeroSlide, House, Info
from .serializers import HeroSlideSerializer, HouseSerializer, InfoSerializer


class HeroSlideViewSet(viewsets.ModelViewSet):
    queryset = HeroSlide.objects.all()
    serializer_class = HeroSlideSerializer

    def get_permissions(self):
        if self.request.method in ("GET", "HEAD", "OPTIONS"):
            return [AllowAny()]
        return [IsAdminUser()]


class HouseViewSet(viewsets.ModelViewSet):
    queryset = House.objects.all()
    serializer_class = HouseSerializer
    lookup_field = "slug"

    def get_permissions(self):
        if self.request.method in ("GET", "HEAD", "OPTIONS"):
            return [AllowAny()]
        return [IsAdminUser()]


class InfoView(APIView):
    """Objet unique — GET public, PATCH réservé aux admins."""

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [IsAdminUser()]

    def get(self, request):
        return Response(InfoSerializer(Info.load()).data)

    def patch(self, request):
        info = Info.load()
        s = InfoSerializer(info, data=request.data, partial=True)
        s.is_valid(raise_exception=True)
        s.save()
        return Response(s.data)


class ApiIndexView(APIView):
    """GET /api/ — index de toutes les APIs disponibles."""
    permission_classes = [AllowAny]

    def get(self, request):
        base = request.build_absolute_uri("/")
        return Response({
            "service": "BIC BTP API",
            "version": "1.0",
            "admin": f"{base}admin/",
            "documentation": f"{base}api/",
            "endpoints": {
                "health": f"{base}api/health/",
                "hero": f"{base}api/hero/",
                "houses": f"{base}api/houses/",
                "house_detail": f"{base}api/houses/{{slug}}/",
                "info": f"{base}api/info/",
                "finitions": f"{base}api/finitions/",
                "finitions_gammes": f"{base}api/finitions/gammes/",
                "finitions_postes": f"{base}api/finitions/postes/",
                "finitions_ambiances": f"{base}api/finitions/ambiances/",
                "realisations": f"{base}api/realisations/",
                "realisation_detail": f"{base}api/realisations/{{slug}}/",
                "realisations_stats": f"{base}api/realisations/stats/",
                "contact": f"{base}api/contact/",
                "contact_demandes": f"{base}api/contact/demandes/",
            },
            "methodes": {
                "GET": "lecture publique",
                "POST/PUT/PATCH/DELETE": "réservé aux admins (session ou token)",
                "POST /api/contact/": "public (formulaire de devis)",
            },
            "filtres": {
                "realisations": "?phase=livre|chantier|process&category=maison|villa|process&gamme=Essentiel|Confort|Prestige",
            },
        })