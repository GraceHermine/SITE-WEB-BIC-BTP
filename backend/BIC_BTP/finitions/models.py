from django.db import models


class Gamme(models.Model):
    slug = models.SlugField(max_length=40, unique=True)
    name = models.CharField(max_length=60)
    tagline = models.CharField(max_length=120)
    description = models.TextField()
    color = models.CharField(max_length=20, default="#1E5BD8")
    coef = models.FloatField(default=1.0)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "Gamme"
        verbose_name_plural = "Gammes"

    def __str__(self):
        return self.name


class Poste(models.Model):
    slug = models.SlugField(max_length=40, unique=True)
    title = models.CharField(max_length=120)
    icon = models.CharField(max_length=10, default="◆")
    description = models.TextField()
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "Poste de finition"
        verbose_name_plural = "Postes de finition"

    def __str__(self):
        return self.title


class PosteOption(models.Model):
    """Une option = (poste, gamme) → label. Contrainte unique."""
    poste = models.ForeignKey(
        Poste, on_delete=models.CASCADE, related_name="options"
    )
    gamme = models.ForeignKey(
        Gamme, on_delete=models.CASCADE, related_name="poste_options"
    )
    label = models.CharField(max_length=200)

    class Meta:
        unique_together = ("poste", "gamme")
        ordering = ["poste__order", "gamme__order"]

    def __str__(self):
        return f"{self.poste.title} — {self.gamme.name}"


class Ambiance(models.Model):
    gamme = models.OneToOneField(
        Gamme, on_delete=models.CASCADE, related_name="ambiance"
    )
    label = models.CharField(max_length=160)
    swatches = models.JSONField(default=list, blank=True)

    def __str__(self):
        return f"Ambiance {self.gamme.name}"