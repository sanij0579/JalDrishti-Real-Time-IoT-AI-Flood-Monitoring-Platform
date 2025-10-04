from django.db import models

class AppTheme(models.Model):
    THEME_CHOICES = (
        ('light', 'Light'),
        ('dark', 'Dark'),
        ('festival', 'Festival'),
        ("diwali", "Diwali"),
    )
    name = models.CharField(max_length=20, choices=THEME_CHOICES, default='light')
    is_active = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} ({'Active' if self.is_active else 'Inactive'})"
