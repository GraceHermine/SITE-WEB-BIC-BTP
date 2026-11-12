from django.contrib import admin
from .models import Gamme, Poste, PosteOption, Ambiance


class PosteOptionInline(admin.TabularInline):
    model = PosteOption
    extra = 1


@admin.register(Gamme)
class GammeAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "coef", "order")
    list_editable = ("order",)
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Poste)
class PosteAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "icon", "order")
    list_editable = ("order",)
    prepopulated_fields = {"slug": ("title",)}
    inlines = [PosteOptionInline]


@admin.register(Ambiance)
class AmbianceAdmin(admin.ModelAdmin):
    list_display = ("gamme", "label")