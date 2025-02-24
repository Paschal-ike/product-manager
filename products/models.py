from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_now = models.IntegerField()
    created_at = models.DateTimeField(  auto_now_add=True)

    def __str__(self):
        return self.name