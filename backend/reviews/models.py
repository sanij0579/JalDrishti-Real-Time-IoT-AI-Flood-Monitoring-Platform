from django.db import models

class Review(models.Model):
    comment = models.TextField()
    image = models.ImageField(upload_to='review_images/', blank=True, null=True)  # Optional image
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        # Agar image bhi show karna ho to
        return f"{self.comment[:20]}{' with image' if self.image else ''}"