# sliders/models.py
from django.db import models

class Slider(models.Model):
    title = models.CharField(max_length=100, blank=True)
    image = models.ImageField(upload_to='sliders/')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title or f"Slider {self.id}"