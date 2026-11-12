from django.db import models


class DemandeDevis(models.Model):
    GAMME_CHOICES = [
        ("", "Non précisée"),
        ("essentiel", "Essentiel"),
        ("confort", "Confort"),
        ("prestige", "Prestige"),
    ]
    POSTE_CHOICES = [
        ("", "Non précisé"),
        ("sols", "Sols & carrelage"),
        ("cuisine", "Cuisine équipée"),
        ("sdb", "Salle de bain"),
        ("menuiseries", "Menuiseries"),
        ("peinture", "Peinture & décor"),
        ("eclairage", "Éclairage"),
    ]
    STATUS_CHOICES = [
        ("nouveau", "Nouveau"),
        ("en_cours", "En cours"),
        ("traite", "Traité"),
        ("archive", "Archivé"),
    ]

    nom = models.CharField(max_length=120)
    email = models.EmailField()
    telephone = models.CharField(max_length=40, blank=True)
    message = models.TextField(blank=True)

    # Contexte de la demande (query params du front)
    gamme = models.CharField(max_length=20, choices=GAMME_CHOICES, blank=True, default="")
    poste = models.CharField(max_length=20, choices=POSTE_CHOICES, blank=True, default="")
    modele = models.CharField(max_length=80, blank=True)     # ex: f3, duplex
    reference = models.CharField(max_length=80, blank=True)  # ex: id réalisation

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="nouveau")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Demande de devis"
        verbose_name_plural = "Demandes de devis"

    def __str__(self):
        return f"{self.nom} — {self.created_at:%d/%m/%Y}"