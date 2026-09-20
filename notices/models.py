from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.urls import reverse


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    color = models.CharField(
        max_length=20, default='blue',
        help_text='Tailwind color: blue, green, red, yellow, purple, indigo'
    )

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['name']

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('dashboard') + f'?category={self.slug}'


class Notice(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
    ]

    title = models.CharField(max_length=200)
    content = models.TextField()
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='notices'
    )
    author = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='notices'
    )
    attachment = models.FileField(upload_to='attachments/', blank=True, null=True)
    is_important = models.BooleanField(default=False)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='published')
    published_at = models.DateTimeField(default=timezone.now)
    expiry_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_important', '-published_at']

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('notice_detail', args=[self.pk])

    @property
    def is_expired(self):
        if self.expiry_date and timezone.now() > self.expiry_date:
            return True
        return False

    @property
    def is_active(self):
        return self.status == 'published' and not self.is_expired