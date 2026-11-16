import uuid
import logging
from datetime import timedelta
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.throttling import ScopedRateThrottle

from .models import ContactRequest
from .serializers import ContactSerializer
from .services import try_send_team_email, send_client_confirmation

logger = logging.getLogger(__name__)

def _new_reference() -> str:
    return f"DEV-{timezone.now().year}-{uuid.uuid4().hex[:6].upper()}"

class ContactCreateView(APIView):
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "contact"

    def post(self, request):
        serializer = ContactSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"detail": "Validation failed", "errors": serializer.errors},
                status=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

        data = serializer.validated_data

        # Honeypot (anti-bot)
        if data.get("_hp"):
            return Response({"id": 0, "reference": "DEV-0000", "status": "received"}, status=201)

        # Idempotence (évite les doublons sur 2 minutes)
        recent = ContactRequest.objects.filter(
            telephone=data["telephone"],
            created_at__gte=timezone.now() - timedelta(minutes=2),
        ).first()
        
        if recent:
            return Response({"id": recent.id, "reference": recent.reference, "status": recent.status}, status=201)

        # Création de la demande
        record = ContactRequest.objects.create(
            reference=_new_reference(),
            type_projet=data["type_projet"],
            localisation=data["localisation"],
            surface_terrain=data["surface_terrain"],
            budget=data["budget"],
            delai=data["delai"],
            terrain=data.get("terrain"),
            message=data.get("message", ""),
            nom=data["nom"],
            email=data.get("email"),
            telephone=data["telephone"],
            consent=data["consent"],
            ip_address=self._client_ip(request),
        )

        # Envoi e-mail équipe + client
        try_send_team_email(record)
        send_client_confirmation(record)

        return Response(
            {
                "id": record.id,
                "reference": record.reference,
                "status": record.status,
                "message": "Votre demande a bien été reçue.",
            },
            status=status.HTTP_201_CREATED,
        )

    @staticmethod
    def _client_ip(request):
        xff = request.META.get("HTTP_X_FORWARDED_FOR")
        if xff: return xff.split(",")[0].strip()
        return request.META.get("REMOTE_ADDR")