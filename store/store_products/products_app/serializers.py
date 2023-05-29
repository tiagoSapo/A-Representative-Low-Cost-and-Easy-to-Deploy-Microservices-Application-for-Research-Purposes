from rest_framework import serializers
from .models import Brand, Category, Opinion, Order, OrderProduct, Product

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']

class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['id', 'name', 'description']
        
class ProductCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    
    # These two are included to get them in JSON format and not in pk formats
    category = CategorySerializer() 
    brand = BrandSerializer()

    class Meta:
        model = Product
        #fields = ['id', 'name', 'price', 'description', 'image_url', 'image', 'size', 'color', 'category', 'brand']
        fields='__all__'


class OrderSerializer(serializers.ModelSerializer):

    class Meta:
        model = Order
        fields = '__all__'
        

class OrderProductSerializer(serializers.ModelSerializer):
    
    #product = ProductSerializer()
    #order = OrderSerializer()

    class Meta:
        model = OrderProduct
        fields = ['id', 'product', 'order', 'quantity']
        
        
class OpinionSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Opinion
        fields = '__all__'
        
        