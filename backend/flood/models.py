from django.db import models

class VulnerabilityPoint(models.Model):
    RISK_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]
    name = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()
    risk_level = models.CharField(max_length=10, choices=RISK_CHOICES)

    def __str__(self):
        return f"{self.name} - {self.risk_level}"