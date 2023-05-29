
from django.contrib import admin
from django.urls import path, include
from . import views

from products_app.views import *

urlpatterns = [
    
    # PRODUCTS
    path('products/', ProductList.as_view(), name="product-list"),
    path('products/<int:pk>', ProductDetails.as_view(), name="product-details"),
    path('products/<int:pk>/opinions', ProductOpinions.as_view(), name="product-opinions"),
    
    
    # CATEGORIES
    path('categories/', CategoryList.as_view(), name="category-list"),
    path('categories/<int:pk>', CategoryDetails.as_view(), name="category-details"),
    path('categories/<int:pk>/products', CategoryDetailsProducts.as_view(), name="category-details-product"),
    
    
    # BRANDS
    path('brands/', BrandList.as_view(), name="brand-list"),
    path('brands/<int:pk>', BrandDetails.as_view(), name="brand-details"),
    path('brands/<int:pk>/products', BrandDetailsProducts.as_view(), name="brand-details-product"),
    
    
    # ORDERS
    path('orders/', OrderList.as_view(), name="order-list"),
    path('orders/<int:pk>', OrderDetails.as_view(), name="order-details"),
    path('orders/<int:pk>/products', OrderDetailsProducts.as_view(), name="order-details-product"),
    path('orders/<int:order_id>/mark_as_payment_pending/', views.mark_as_payment_pending, name='mark_as_payment_pending'),
    path('orders/<int:order_id>/mark_as_payment_received/', views.mark_as_payment_received, name='mark_as_payment_received'),
    path('orders/<int:order_id>/products/<int:product_id>', OrderProducts.as_view(), name="order-products-information-quantities"),
    
    path('orders/client/<int:client_id>', OrderClient.as_view(), name="order-client"),
    
    path('carts/<int:client_id>', CartDetails.as_view(), name="cart-details"),
    path('carts/create/<int:client_id>', views.create_cart, name="cart-create"),
    
    
    # (PRODUCTS <-> ORDERS)
    path('product-orders/', OrderProductList.as_view(), name="products-orders-list"),
    path('product-orders/<int:pk>', OrderProductDetails.as_view(), name="products-orders-details"),
    
    
    # OPINIONS
    path('opinions/', OpinionList.as_view(), name="opinion-list"),
    path('opinions/<int:pk>', OpinionDetails.as_view(), name="opinion-details"),
    
    path('opinions/product/<int:product_id>', OpinionProduct.as_view(), name="product-opinion")
    
    
]
