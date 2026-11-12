from django.db import models
from django.utils.text import slugify


class Realisation(models.Model):
    PHASE_CHOICES = [
        ("livre", "Livré"),
        ("chantier", "En cours"),
        ("process", "Procédé"),
    ]
    CATEGORY_CHOICES = [
        ("maison", "Maison"),
        ("villa", "Villa"),
        ("process", "Procédé"),
    ]
    GAMME_CHOICES = [
        ("—", "—"),
        ("Essentiel", "Essentiel"),
        ("Confort", "Confort"),
        ("Prestige", "Prestige"),
    ]

    slug = models.SlugField(max_length=80, unique=True, null=True, blank=True)
    title = models.CharField(max_length=160)
    location = models.CharField(max_length=120)
    year = models.CharField(max_length=8)

    model = models.CharField(max_length=80)  # F3 / F4 / Duplex / Démonstration
    surface = models.PositiveIntegerField(null=True, blank=True)
    duration = models.CharField(max_length=60)
    duration_short = models.CharField(max_length=20, blank=True)

    phase = models.CharField(max_length=20, choices=PHASE_CHOICES, default="livre")
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default="maison")
    gamme = models.CharField(max_length=20, choices=GAMME_CHOICES, default="—")
    client = models.CharField(max_length=120, blank=True)

    description = models.TextField()
    highlights = models.JSONField(default=list, blank=True)
    tags = models.JSONField(default=list, blank=True)

    image_url = models.URLField(max_length=500)
    before_url = models.URLField(max_length=500, null=True, blank=True)

    order = models.PositiveSmallIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "-year", "id"]
        verbose_name = "Réalisation"
        verbose_name_plural = "Réalisations"

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug and self.title:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)