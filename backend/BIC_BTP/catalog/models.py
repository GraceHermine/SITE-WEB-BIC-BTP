from django.db import models

# Create your models here.
class HeroSlide(models.Model):
    title = models.CharField(max_length=120)
    image_url = models.URLField(max_length=500)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "Slide hero"
        verbose_name_plural = "Slides hero"

    def __str__(self):
        return self.title


class House(models.Model):
    name = models.CharField(max_length=120)
    surface = models.CharField(max_length=60)
    description = models.CharField(max_length=200)
    price = models.CharField(max_length=60)
    image_url = models.URLField(max_length=500)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.name