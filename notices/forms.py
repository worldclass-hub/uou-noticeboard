from django import forms
from .models import Notice, Category


class NoticeForm(forms.ModelForm):
    class Meta:
        model = Notice
        fields = ['title', 'content', 'category', 'attachment',
                  'is_important', 'status', 'expiry_date']
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
                'placeholder': 'Enter notice title'
            }),
            'content': forms.Textarea(attrs={
                'class': 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
                'rows': 8,
                'placeholder': 'Write the full announcement...'
            }),
            'category': forms.Select(attrs={
                'class': 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500'
            }),
            'attachment': forms.FileInput(attrs={
                'class': 'w-full px-4 py-2 border border-gray-300 rounded-lg'
            }),
            'status': forms.Select(attrs={
                'class': 'w-full px-4 py-2 border border-gray-300 rounded-lg'
            }),
            'expiry_date': forms.DateTimeInput(attrs={
                'class': 'w-full px-4 py-2 border border-gray-300 rounded-lg',
                'type': 'datetime-local'
            }),
            'is_important': forms.CheckboxInput(attrs={
                'class': 'h-4 w-4 text-indigo-600 rounded'
            }),
        }


class CategoryForm(forms.ModelForm):
    class Meta:
        model = Category
        fields = ['name', 'slug', 'description', 'color']
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500'
            }),
            'slug': forms.TextInput(attrs={
                'class': 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500',
                'placeholder': 'auto-generated from name if left blank'
            }),
            'description': forms.Textarea(attrs={
                'class': 'w-full px-4 py-2 border border-gray-300 rounded-lg',
                'rows': 3
            }),
            'color': forms.Select(
                attrs={
                    'class': 'w-full px-4 py-2 border border-gray-300 rounded-lg'
                },
                choices=[
                    ('blue', 'Blue'), ('green', 'Green'), ('red', 'Red'),
                    ('yellow', 'Yellow'), ('purple', 'Purple'), ('indigo', 'Indigo'),
                ]
            ),
        }