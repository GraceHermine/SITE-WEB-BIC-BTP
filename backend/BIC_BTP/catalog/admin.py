from django.contrib import admin
from .models import HeroSlide, House

# Register your models here.

@admin.register(HeroSlide)
class HeroSlideAdmin(admin.ModelAdmin):
    list_display = ("title", "order")
    list_editable = ("order",)


@admin.register(House)
class HouseAdmin(admin.ModelAdmin):
    list_display = ("name", "surface", "price", "order")
    list_editable = ("order",)