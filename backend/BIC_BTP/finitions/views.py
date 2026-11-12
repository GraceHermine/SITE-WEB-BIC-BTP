from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Gamme, Poste, PosteOption, Ambiance
from .serializers import (
    GammeSerializer, PosteSerializer, PosteOptionSerializer, AmbianceSerializer,
)


class GammeViewSet(viewsets.ModelViewSet):
    queryset = Gamme.objects.all()
    serializer_class = GammeSerializer
    lookup_field = "slug"

    def get_permissions(self):
        if self.request.method in ("GET", "HEAD", "OPTIONS"):
            return [AllowAny()]
        return [IsAdminUser()]


class PosteViewSet(viewsets.ModelViewSet):
    queryset = Poste.objects.prefetch_related("options__gamme")
    serializer_class = PosteSerializer
    lookup_field = "slug"

    def get_permissions(self):
        if self.request.method in ("GET", "HEAD", "OPTIONS"):
            return [AllowAny()]
        return [IsAdminUser()]


class PosteOptionViewSet(viewsets.ModelViewSet):
    queryset = PosteOption.objects.select_related("poste", "gamme")
    serializer_class = PosteOptionSerializer

    def get_permissions(self):
        if self.request.method in ("GET", "HEAD", "OPTIONS"):
            return [AllowAny()]
        return [IsAdminUser()]


class AmbianceViewSet(viewsets.ModelViewSet):
    queryset = Ambiance.objects.select_related("gamme")
    serializer_class = AmbianceSerializer

    def get_permissions(self):
        if self.request.method in ("GET", "HEAD", "OPTIONS"):
            return [AllowAny()]
        return [IsAdminUser()]


class FinitionsBundleView(APIView):
    """
    GET /api/finitions/
    → { "gammes": [...], "postes": [...], "ambiances": {...} }
    Format attendu par Finitions.jsx.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        gammes = GammeSerializer(Gamme.objects.all(), many=True).data
        postes = PosteSerializer(
            Poste.objects.prefetch_related("options__gamme"), many=True
        ).data
        ambiances = {}
        for amb in Ambiance.objects.select_related("gamme"):
            ambiances[amb.gamme.slug] = AmbianceSerializer(amb).data
        return Response({
            "gammes": gammes,
            "postes": postes,
            "ambiances": ambiances,
        })