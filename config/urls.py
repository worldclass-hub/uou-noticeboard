from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.auth import views as auth_views


urlpatterns = [
    # Django's built-in admin (for backup / advanced use)
    path('django-admin/', admin.site.urls),

    # Our custom app URLs
    path('', include('notices.urls')),

    # Login / Logout (Django built-in auth views with our custom template)
    path('login/', auth_views.LoginView.as_view(
        template_name='notices/login.html'
    ), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
]


# Serve media files (uploads) during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

    # Also serve static files cleanly in dev
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)