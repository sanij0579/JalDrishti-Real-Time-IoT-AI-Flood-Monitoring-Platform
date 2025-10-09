# rainfall/models.py
from django.db import models

class RainfallData(models.Model):
    year = models.IntegerField(unique=True)
    jan = models.FloatField(default=0)
    feb = models.FloatField(default=0)
    mar = models.FloatField(default=0)
    apr = models.FloatField(default=0)
    may = models.FloatField(default=0)
    june = models.FloatField(default=0)
    july = models.FloatField(default=0)
    aug = models.FloatField(default=0)
    sept = models.FloatField(default=0)
    oct = models.FloatField(default=0)
    nov = models.FloatField(default=0)
    dec = models.FloatField(default=0)
    total = models.FloatField(default=0)

    def __str__(self):
        return str(self.year)