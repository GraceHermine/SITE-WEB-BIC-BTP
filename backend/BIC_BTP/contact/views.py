from django.conf import settings
from django.core.mail import send_mail
from rest_framework import viewsets, mixins
from rest_framework.permissions import AllowAny, IsAdminUser

from .models import DemandeDevis
from .serializers import DemandeDevisSerializer


class DemandeDevisViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    """
    POST   /api/contact/            → public (formulaire)
    GET    /api/contact/            → admin (liste)
    GET    /api/contact/<id>/       → admin (détail)
    (pas de PUT/PATCH/DELETE exposés pour l'instant)
    """
    queryset = DemandeDevis.objects.all()
    serializer_class = DemandeDevisSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [AllowAny()]
        return [IsAdminUser()]

    def perform_create(self, serializer):
        instance = serializer.save()
        try:
            send_mail(
                subject=f"[BIC BTP] Nouvelle demande — {instance.nom}",
                message=(
                    f"Nom: {instance.nom}\n"
                    f"Email: {instance.email}\n"
                    f"Téléphone: {instance.telephone}\n"
                    f"Gamme: {instance.gamme or '-'}\n"
                    f"Poste: {instance.poste or '-'}\n"
                    f"Modèle: {instance.modele or '-'}\n"
                    f"Référence: {instance.reference or '-'}\n\n"
                    f"Message:\n{instance.message}"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.CONTACT_NOTIFICATION_EMAIL],
                fail_silently=True,
            )
        except Exception:
            pass