from django.contrib import admin
from .models import Notice, Category


@admin.register(Notice)
class NoticeAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'author', 'status',
                    'is_important', 'published_at', 'expiry_date')
    list_filter = ('status', 'is_important', 'category')
    search_fields = ('title', 'content')


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'color')
    prepopulated_fields = {'slug': ('name',)}