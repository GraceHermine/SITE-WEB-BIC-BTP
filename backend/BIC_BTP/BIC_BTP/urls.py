from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse


def health(_request):
    return JsonResponse({"status": "ok", "service": "BIC BTP API"})


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health/", health, name="health"),
    # ⚠️ catalog EN PREMIER : il contient la route "" = /api/
    path("api/", include("catalog.urls")),
    path("api/", include("finitions.urls")),
    path("api/", include("realisations.urls")),
    path("api/", include("contact.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)