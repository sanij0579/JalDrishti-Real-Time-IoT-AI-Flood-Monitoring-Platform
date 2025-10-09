from django.db import models

class WaterData(models.Model):
    water_level = models.FloatField(null=True, blank=True)
    location = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.location}: {self.water_level} cm"