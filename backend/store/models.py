from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    image_url = models.URLField(max_length=1000, blank=True, null=True, default="https://via.placeholder.com/400")

    def __str__(self):
        return self.name

class Review(models.Model):
    product = models.ForeignKey(Product, related_name='reviews', on_delete=models.CASCADE)
    author = models.CharField(max_length=100, default="Anonymous Executive")
    text = models.TextField()
    # NEW: Standard Star Rating Data (Defaults to 5 stars for older AI reviews to prevent database crashes)
    rating = models.IntegerField(default=5) 
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product.name} - {self.rating} Stars"