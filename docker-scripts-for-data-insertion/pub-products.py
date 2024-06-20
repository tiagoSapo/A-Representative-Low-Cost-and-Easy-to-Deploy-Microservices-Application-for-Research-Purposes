import requests
import random

# Base URL of the products service API
base_url = 'http://localhost:7005'

# Sample image file path
PICTURE_PATH = '~/Download/sample-image.jpeg'

# Function to create a category using POST request
def create_category(name, description):
    url = f'{base_url}/categories/'
    data = {
        'name': name,
        'description': description
    }

    try:
        response = requests.post(url, json=data)
        if response.status_code == 201:
            print(f"Category '{name}' created successfully.")
            return response.json()['id']
        else:
            print(f"Failed to create category '{name}'. Status code: {response.status_code}")
            return None
    except requests.exceptions.RequestException as e:
        print(f"Error creating category '{name}': {e}")
        return None

# Function to create a brand using POST request
def create_brand(name, description):
    url = f'{base_url}/brands/'
    data = {
        'name': name,
        'description': description
    }

    try:
        response = requests.post(url, json=data)
        if response.status_code == 201:
            print(f"Brand '{name}' created successfully.")
            return response.json()['id']
        else:
            print(f"Failed to create brand '{name}'. Status code: {response.status_code}")
            return None
    except requests.exceptions.RequestException as e:
        print(f"Error creating brand '{name}': {e}")
        return None

# Function to create a product using POST request
def create_product(name, price, description, category_id, brand_id, image_path):
    url = f'{base_url}/products/'
    data = {
        'name': name,
        'price': price,
        'description': description,
        'category': category_id,
        'brand': brand_id
    }

    try:
        # Open and read the image file
        with open(image_path, 'rb') as file:
            files = {'picture': (image_path, file, 'image/jpeg')}
            response = requests.post(url, data=data, files=files)
        
        if response.status_code == 201:
            print(f"Product '{name}' created successfully.")
        else:
            print(f"Failed to create product '{name}'. Status code: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"Error creating product '{name}': {e}")

# Create categories
categories = [
    {"name": "Playstation", "description": "Gaming consoles and accessories for Sony PlayStation."},
    {"name": "Xbox", "description": "Gaming consoles and accessories for Microsoft Xbox."},
    {"name": "Nintendo", "description": "Gaming consoles and accessories for Nintendo platforms."}
]

category_ids = {}
for category in categories:
    category_id = create_category(category["name"], category["description"])
    if category_id:
        category_ids[category["name"]] = category_id

# Create brands
brands = [
    {"name": "Sony", "description": "Consumer electronics, gaming, and entertainment products."},
    {"name": "Microsoft", "description": "Software, hardware, and gaming products."},
    {"name": "LG", "description": "Home appliances, consumer electronics, and mobile communications."},
    {"name": "Nintendo", "description": "Gaming consoles and software."},
    {"name": "Samsung", "description": "Consumer electronics, mobile phones, and semiconductor products."}
]

brand_ids = {}
for brand in brands:
    brand_id = create_brand(brand["name"], brand["description"])
    if brand_id:
        brand_ids[brand["name"]] = brand_id

# Create products
products = [
    {"name": "PlayStation 5", "price": "499.99", "description": "Next-generation gaming console from Sony.", "category": "Playstation", "brand": "Sony"},
    {"name": "Xbox Series X", "price": "499.99", "description": "High-performance gaming console from Microsoft.", "category": "Xbox", "brand": "Microsoft"},
    {"name": "Nintendo Switch", "price": "299.99", "description": "Hybrid gaming console from Nintendo.", "category": "Nintendo", "brand": "Nintendo"},
    {"name": "LG OLED TV", "price": "1999.99", "description": "High-end OLED TV with superior picture quality.", "category": "Xbox", "brand": "LG"},
    {"name": "Sony Noise-Cancelling Headphones", "price": "249.99", "description": "Wireless headphones with active noise cancellation.", "category": "Playstation", "brand": "Sony"},
    {"name": "Samsung Galaxy S21 Ultra", "price": "1199.99", "description": "Flagship smartphone with advanced camera capabilities.", "category": "Xbox", "brand": "Samsung"},
    {"name": "Nintendo Switch Pro Controller", "price": "69.99", "description": "Official controller for the Nintendo Switch console.", "category": "Nintendo", "brand": "Nintendo"},
    {"name": "Microsoft Surface Laptop 4", "price": "1299.99", "description": "Premium laptop with touch screen and high-performance processor.", "category": "Xbox", "brand": "Microsoft"},
    {"name": "Sony 65-inch 4K Smart TV", "price": "1499.99", "description": "4K HDR TV with smart functionality and voice control.", "category": "Playstation", "brand": "Sony"},
    {"name": "Samsung Galaxy Watch 4", "price": "349.99", "description": "Smartwatch with health monitoring and LTE connectivity.", "category": "Xbox", "brand": "Samsung"}
]

for product in products:
    create_product(product["name"], product["price"], product["description"], category_ids[product["category"]], brand_ids[product["brand"]], PICTURE_PATH)
