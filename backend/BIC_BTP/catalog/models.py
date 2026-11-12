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