from django.db import models
from django.utils import timezone

class ContactRequest(models.Model):
    STATUS_CHOICES = [
        ("received", "Reçue"),
        ("processed", "Traitée"),
        ("archived", "Archivée"),
    ]
    PROJET_CHOICES = [
        ("construction", "Construction neuve"),
        ("renovation", "Rénovation"),
        ("extension", "Extension"),
        ("amenagement", "Aménagement intérieur"),
        ("indecis", "Je ne sais pas encore"),
    ]
    BUDGET_CHOICES = [
        ("moins-50", "< 50 M FCFA"),
        ("50-70", "50 – 70 M FCFA"),
        ("70-100", "70 – 100 M FCFA"),
        ("plus-100", "> 100 M FCFA"),
        ("indecis", "Je ne sais pas"),
    ]
    DELAI_CHOICES = [
        ("urgent", "Dès que possible"),
        ("3mois", "Dans 3 mois"),
        ("6mois", "Dans 6 mois"),
        ("annee", "Dans l'année"),
        ("reflechi", "Je me renseigne"),
    ]
    TERRAIN_CHOICES = [
        ("oui-titre", "Oui, avec titre foncier"),
        ("oui-sans", "Oui, sans titre"),
        ("non", "Non, pas encore"),
        ("recherche", "En recherche"),
    ]

    reference = models.CharField(max_length=32, unique=True, db_index=True, editable=False)

    # --- CHAMPS ALIGNÉS SUR LE DEVIS PDF ---
    type_projet = models.CharField(max_length=32, choices=PROJET_CHOICES, default="construction")
    localisation = models.CharField(max_length=255, help_text="Ville / Commune / Quartier")
    surface_terrain = models.PositiveIntegerField(help_text="Surface en m²")
    
    budget = models.CharField(max_length=32, choices=BUDGET_CHOICES)
    delai = models.CharField(max_length=32, choices=DELAI_CHOICES)
    terrain = models.CharField(max_length=32, choices=TERRAIN_CHOICES, blank=True, null=True)
    message = models.TextField(blank=True, default="", help_text="Détails supplémentaires")

    # --- COORDONNÉES ---
    nom = models.CharField(max_length=120, help_text="Nom ou Raison sociale")
    email = models.EmailField(blank=True, null=True)
    telephone = models.CharField(max_length=32)
    consent = models.BooleanField(default=False)

    # --- SUIVI TECHNIQUE ---
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.CharField(max_length=512, blank=True, default="")
    status = models.CharField(max_length=32, choices=STATUS_CHOICES, default="received")
    
    # Suivi e-mail
    email_sent = models.BooleanField(default=False)
    email_attempts = models.PositiveIntegerField(default=0)
    email_last_error = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.reference} — {self.nom} ({self.type_projet})"