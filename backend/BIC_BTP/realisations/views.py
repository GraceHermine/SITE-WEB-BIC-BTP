from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Realisation
from .serializers import RealisationSerializer


class RealisationViewSet(viewsets.ModelViewSet):
    serializer_class = RealisationSerializer
    lookup_field = "slug"

    def get_queryset(self):
        qs = Realisation.objects.all()
        phase = self.request.query_params.get("phase")
        category = self.request.query_params.get("category")
        gamme = self.request.query_params.get("gamme")
        if phase:
            qs = qs.filter(phase=phase)
        if category:
            qs = qs.filter(category=category)
        if gamme:
            qs = qs.filter(gamme=gamme)
        return qs

    def get_permissions(self):
        if self.request.method in ("GET", "HEAD", "OPTIONS"):
            return [AllowAny()]
        return [IsAdminUser()]


class RealisationStatsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        qs = Realisation.objects.all()
        counts = {"phase": {}, "category": {}, "gamme": {}, "total": qs.count()}
        for r in qs:
            counts["phase"][r.phase] = counts["phase"].get(r.phase, 0) + 1
            counts["category"][r.category] = counts["category"].get(r.category, 0) + 1
            counts["gamme"][r.gamme] = counts["gamme"].get(r.gamme, 0) + 1
        return Response(counts)