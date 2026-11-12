from django.db import models
from django.utils.text import slugify


class HeroSlide(models.Model):
    title = models.CharField(max_length=120)
    subtitle = models.CharField(max_length=200, blank=True)
    image_url = models.URLField(max_length=500)
    order = models.PositiveSmallIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "Slide hero"
        verbose_name_plural = "Slides hero"

    def __str__(self):
        return self.title


class House(models.Model):
    GAMME_CHOICES = [
        ("Essentiel", "Essentiel"),
        ("Confort", "Confort"),
        ("Prestige", "Prestige"),
    ]

    # Identité
    slug = models.SlugField(max_length=80, unique=True, null=True, blank=True)
    name = models.CharField(max_length=120)
    tagline = models.CharField(max_length=160, blank=True)
    description = models.CharField(max_length=200)
    long_description = models.TextField(blank=True)

    # Specs numériques (utilisées par les filtres de Maisons.jsx)
    surface = models.PositiveIntegerField(default=0)
    chambres = models.PositiveSmallIntegerField(default=0)
    salles_bain = models.PositiveSmallIntegerField(default=0)
    niveaux = models.PositiveSmallIntegerField(default=1)

    # Prix
    price = models.BigIntegerField(default=0)          # en FCFA
    price_label = models.CharField(max_length=60, blank=True)

    # Méta
    badge = models.CharField(max_length=60, blank=True)
    gamme = models.CharField(max_length=20, choices=GAMME_CHOICES, default="Confort")
    image_url = models.URLField(max_length=500)
    features = models.JSONField(default=list, blank=True)
    order = models.PositiveSmallIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.price_label and self.price:
            self.price_label = f"{self.price:,}".replace(",", " ") + " FCFA"
        if not self.slug and self.name:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


from django.db import models
from django.utils.text import slugify


# ... HeroSlide et House existants ...


class Info(models.Model):
    """
    Singleton : une seule ligne en base.
    Centralise toutes les informations du footer (et du site en général).
    Modifiable depuis l'admin Django.
    """

    # ─── Identité ───────────────────────────────────────────
    site_name = models.CharField(max_length=120, default="BIC BTP")
    logo_url = models.URLField(max_length=500, blank=True)
    baseline = models.CharField(
        max_length=200,
        blank=True,
        help_text="Ex : Le béton ne ment pas. Votre intérieur, si.",
    )
    description = models.TextField(
        blank=True,
        help_text="Courte description affichée sous le logo dans le footer.",
    )

    # ─── Coordonnées ────────────────────────────────────────
    address_line1 = models.CharField(max_length=200, blank=True)
    address_line2 = models.CharField(max_length=200, blank=True)
    city = models.CharField(max_length=120, blank=True)
    country = models.CharField(max_length=120, blank=True, default="Côte d'Ivoire")
    postal_code = models.CharField(max_length=20, blank=True)

    phone_primary = models.CharField(max_length=40, blank=True)
    phone_secondary = models.CharField(max_length=40, blank=True)
    whatsapp_number = models.CharField(
        max_length=40,
        blank=True,
        help_text="Format international sans +, ex : 22500000000",
    )
    email_primary = models.EmailField(blank=True)
    email_secondary = models.EmailField(blank=True)

    # ─── Horaires ───────────────────────────────────────────
    opening_hours = models.CharField(
        max_length=200,
        blank=True,
        help_text="Ex : Lun–Ven 8h–18h · Sam 9h–13h",
    )

    # ─── Réseaux sociaux ────────────────────────────────────
    # Liste de dicts : [{"label": "Instagram", "url": "...", "icon": "instagram"}, ...]
    social_links = models.JSONField(
        default=list,
        blank=True,
        help_text='Format : [{"label": "...", "url": "...", "icon": "..."}]',
    )

    # ─── Liens utiles du footer (colonnes) ──────────────────
    # Ex : [{"title": "Entreprise", "links": [{"label": "À propos", "url": "/about"}]}, ...]
    footer_columns = models.JSONField(
        default=list,
        blank=True,
        help_text='Format : [{"title": "...", "links": [{"label": "...", "url": "..."}]}]',
    )

    # ─── Légal ──────────────────────────────────────────────
    legal_mentions = models.TextField(
        blank=True,
        help_text="Mentions légales (texte libre ou lien).",
    )
    privacy_url = models.URLField(max_length=500, blank=True)
    cgu_url = models.URLField(max_length=500, blank=True)
    copyright_text = models.CharField(
        max_length=200,
        blank=True,
        help_text="Ex : © 2025 BIC BTP. Tous droits réservés.",
    )
    company_registration = models.CharField(
        max_length=120,
        blank=True,
        help_text="Ex : RCCM CI-ABJ-2024-B-XXXX · NCC XXXXXXX",
    )

    # ─── Divers ─────────────────────────────────────────────
    # Bandeau d'alerte éventuel en haut du site (facultatif)
    announcement = models.CharField(
        max_length=200,
        blank=True,
        help_text="Bandeau d'annonce éventuel. Laisser vide pour masquer.",
    )

    # ─── Méta ───────────────────────────────────────────────
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Informations du site"
        verbose_name_plural = "Informations du site"

    def __str__(self):
        return f"Infos — {self.site_name}"

    # ─── Singleton helpers ──────────────────────────────────
    def save(self, *args, **kwargs):
        # Force une seule ligne : pk = 1
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj

    def delete(self, *args, **kwargs):
        # Interdit la suppression : on garde toujours la ligne unique
        pass        