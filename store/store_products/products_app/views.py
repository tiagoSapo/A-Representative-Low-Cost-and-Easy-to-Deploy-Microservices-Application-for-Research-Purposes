import django.shortcuts
from rest_framework.generics import ListCreateAPIView, ListAPIView, RetrieveUpdateDestroyAPIView, RetrieveAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework import status
from .models import Brand, Category, Opinion, Order, OrderProduct, Product
from .mqtt import client, Message
from .serializers import (BrandSerializer, CategorySerializer, OpinionSerializer,
    OrderProductSerializer, OrderSerializer, ProductCreateSerializer, ProductSerializer)
from django.http import JsonResponse

from .mqtt import TOPIC_READ, TOPIC_WRITE, MQTT_HOST, MQTT_PORT, MQTT_CLIENT_ID
import paho.mqtt.publish as publish
import json
import datetime
import logging

# Products
class ProductList(ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ProductCreateSerializer
        return ProductSerializer


class ProductDetails(RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class ProductOpinions(APIView):
    def get(self, request, pk):
        product = get_object_or_404(Product, pk=pk)
        opinions = Opinion.objects.filter(product=product)
        serializer = OpinionSerializer(opinions, many=True)
        return Response(serializer.data)


# Categories
class CategoryList(ListCreateAPIView):
    serializer_class = CategorySerializer

    def get_queryset(self):
        name_param = self.request.query_params.get('name', None)
        if name_param is not None:
            queryset = Category.objects.filter(name=name_param).first()
            if queryset is None:
                return Category.objects.none()
            else:
                return Category.objects.filter(name=name_param)
        else:
            return Category.objects.all()

class CategoryDetails(RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class CategoryDetailsProducts(APIView):
    def get(self, request, pk):
        category = get_object_or_404(Category, pk=pk)
        products = category.product_set.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
    

# Brands
class BrandList(ListCreateAPIView):
    serializer_class = BrandSerializer

    def get_queryset(self):
        name_param = self.request.query_params.get('name', None)
        if name_param is not None:
            queryset = Brand.objects.filter(name=name_param).first()
            if queryset is None:
                return Brand.objects.none()
            else:
                return Brand.objects.filter(name=name_param)
        else:
            return Brand.objects.all()


class BrandDetails(RetrieveUpdateDestroyAPIView):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer

class BrandDetailsProducts(APIView):
    def get(self, request, pk):
        brand = get_object_or_404(Brand, pk=pk)
        products = brand.product_set.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
    

# Orders
class OrderList(ListCreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def create(self, request, *args, **kwargs):
        # Get the client ID from the request
        client_id = request.data.get('client_id')

        # Check if an existing order with status="cart" exists for the user
        existing_order = Order.objects.filter(client_id = client_id, status = 'cart').first()
        if existing_order:
            return Response({'error': 'User already has an open cart'}, status=status.HTTP_400_BAD_REQUEST)

        # Create the new order
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class OrderDetails(RetrieveUpdateDestroyAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    
    def get(self, request, pk):
        order = get_object_or_404(Order, pk=pk)
        serializer = self.serializer_class(order)
        return Response(serializer.data)


class CartDetails(RetrieveAPIView):
    serializer_class = OrderSerializer
    
    def get_object(self):
        client_id = self.kwargs.get('client_id')
        order = get_object_or_404(Order.objects.filter(client_id=client_id, status='cart'))
        return order
    
class OrderProducts(APIView):
    
    serializer_class = OrderProductSerializer
    
    def get(self, request, order_id, product_id):
        queryset = OrderProduct.objects.filter(order_id=order_id, product_id=product_id)
        if not queryset.exists():
            return Response({'error': f'There is no relationship between order {order_id} and product {product_id}'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)
    
    def delete(self, request, order_id, product_id):
        queryset = OrderProduct.objects.filter(order_id=order_id, product_id=product_id)
        if not queryset.exists():
            return Response({'error': f'There is no relationship between order {order_id} and product {product_id}'}, status=status.HTTP_400_BAD_REQUEST)
        
        queryset.delete()
        return Response({'message': f'Relationship between order {order_id} and product {product_id} deleted.'}, status=status.HTTP_204_NO_CONTENT)


class OrderClient(APIView):
    serializer_class = OrderSerializer
    
    def get(self, request, client_id):
        queryset = Order.objects.filter(client_id=client_id)
        if not queryset.exists():
            return Response({'error': f'There are no orders for client {client_id}'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = self.serializer_class(queryset.exclude(status='cart'), many=True)
        return Response(serializer.data)
    
    

class OrderDetailsProducts(APIView):
    serializer_class = ProductSerializer

    def get(self, request, pk):
        order = get_object_or_404(Order, pk=pk)
        products = order.products.all()
        serializer = self.serializer_class(products, many=True)
        return Response(serializer.data)
  
def set_status(request, order_id, new_status, previous_status):
    orders = Order.objects.filter(id=order_id, status=previous_status)
    if len(orders) == 0:
        return JsonResponse({'error': 'There is no order with id=' + str(order_id) + ' and status=' + previous_status + "'"})
    
    # checking if Cart is empty 
    # (a cart is an order with a cart status) 
    # (this can be done checking if given order has products)
    orderProducts = OrderProduct.objects.filter(order_id=order_id)

    if (not orderProducts.exists()):
        return JsonResponse({'error': 'There are no products associated with order=' + str(order_id) + ' and status=' + previous_status + "'. The cart is empty!"})

    # set the new status for the Order
    order = orders.first()
    order.status = new_status
    order.save()
        
    if new_status == 'payment_pending':
        
        # calculate the order's total cost 
        import decimal
        order_cost = 0
        orderProducts = OrderProduct.objects.filter(order_id=order_id)
        for op in orderProducts:
            order_cost += decimal.Decimal(op.product.price) * decimal.Decimal(op.quantity)
        order.total_cost = order_cost
        
        # save order, after setting its total-cost
        order.save()
        
        # send WITHDRAW message to Bank
        topic = TOPIC_WRITE
        mqtt_host = MQTT_HOST
        mqtt_port = MQTT_PORT
        mqtt_client_id = MQTT_CLIENT_ID
        
        # create a message object
        message = Message(
            ibanReceiver=str(-1), # store bank account
            ibanSender=str(order.client_card), # client bank account
            amount=str(order.total_cost), 
            date=str(datetime.datetime.now()), 
            orderId=order_id,
            confirmationTopic=TOPIC_READ
        )

        # convert the message object to a JSON string
        message_json = json.dumps(message.__dict__)
        
        # send the JSON message via MQTT
        logging.info("Sending status of order " + str(order_id) + " to MQTT: " + message_json)
        publish.single(topic, message_json, hostname=mqtt_host, port=mqtt_port, client_id=mqtt_client_id)
        
        # If the order has been made, then create a new cart (it's an order with no items (status='cart'))
        create_new_cart(order.client_id, order.client_card, order.address)

    return JsonResponse({'status': new_status})

def mark_as_payment_pending(request, order_id):
    return set_status(request, order_id, 'payment_pending', 'cart')

def mark_as_payment_received(request, order_id):
    return set_status(request, order_id, 'payment_received', 'payment_pending')

def create_cart(request, client_id, client_card, address):
    create_new_cart(client_id=client_id, client_card=client_card, address=address)

def create_new_cart(client_id, client_card, address):
    order = Order(
        client_id=client_id, 
        client_card=client_card, 
        address=address, 
        total_cost=0,
        status='cart')
    order.save()
    
    
# OrderProduct
class OrderProductList(ListCreateAPIView):
    queryset = OrderProduct.objects.all()
    serializer_class = OrderProductSerializer

class OrderProductDetails(RetrieveUpdateDestroyAPIView):
    queryset = OrderProduct.objects.all()
    serializer_class = OrderProductSerializer
    
    
# Opinions
class OpinionList(ListCreateAPIView):
    queryset = Opinion.objects.all()
    serializer_class = OpinionSerializer
    
class OpinionDetails(RetrieveUpdateDestroyAPIView):
    queryset = Opinion.objects.all()
    serializer_class = OpinionSerializer
    
class OpinionProduct(APIView):
    serializer_class = OpinionSerializer
    
    def get(self, request, product_id):
        queryset = Opinion.objects.filter(product_id=product_id)
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)