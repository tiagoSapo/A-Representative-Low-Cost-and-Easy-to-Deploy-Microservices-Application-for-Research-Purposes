from decimal import Decimal
from django.db import models

    
class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField()

    def __str__(self):
        return self.name
    
    
class Brand(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = description = models.TextField()
    
    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    description = models.TextField()
    image = models.ImageField(upload_to='product_images', null=True)
    
    # These attributes are optional (Clothing only)
    SIZES = (
        ('32', '32\'\' inches'),
        ('48', '48\'\' inches'),
        ('55', '55\'\' inches'),
        ('65', '65\'\' inches'),
        ('75', '75\'\' inches'),
    )
    COLORS = (
        ('Black', 'Black'),
        ('Blue', 'Blue'),
        ('Green', 'Green'),
        ('Red', 'Red'),
        ('White', 'White'),
        ('Yellow', 'Yellow'),
        ('Multiple', 'Multiple colors'),
        ('Other', 'Other')
    )
    size = models.CharField(max_length=10, null=True, blank=True, choices=SIZES)
    color = models.CharField(max_length=10, null=True, blank=True, choices=COLORS)

    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.name
    

class Order(models.Model):
    client_id = models.IntegerField()  # client's id in micro-service: 'store-user-service'
    client_card = models.IntegerField() # client's id (similiar to an IBAN) in micro-service 'bank-clients'
    address = models.TextField()
    total_cost = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    
    status = models.CharField(max_length=20, choices=(
        ('cart', 'Cart'),
        ('payment_pending', 'Payment Pending'),
        ('payment_received', 'Payment Received')
    ), default='cart')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    products = models.ManyToManyField(Product, through='OrderProduct')

    def __str__(self):
        return f'Order {self.pk} - Client {self.client_id}'
    

class OrderProduct(models.Model):
    """Intermediate Table that results from the M to N relationship between Order and Product

    Args:
        models (_type_): _description_
    """
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    
    class Meta:
        unique_together = (('product', 'order'),)


class Opinion(models.Model):
    STARS = (
        (1, '1 Star'),
        (2, '2 Stars'),
        (3, '3 Stars'),
        (4, '4 Stars'),
        (5, '5 Stars')
    )
    number_of_stars = models.IntegerField(choices=STARS)
    title = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    

