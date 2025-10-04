from django.db import models

class Booking(models.Model):
    user_id = models.IntegerField()
    service_id = models.IntegerField()
    latitude = models.FloatField()
    longitude = models.FloatField()
    address = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=50, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Booking {self.id} by User {self.user_id}"