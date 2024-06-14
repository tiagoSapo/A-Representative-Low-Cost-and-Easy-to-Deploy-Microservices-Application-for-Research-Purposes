using System;
using System.Net;
using System.Security.Policy;
using System.Security.Principal;
using System.Text.Json;
using Microsoft.CodeAnalysis;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Proto;
using StoreFrontendFinal.Controllers;
using StoreFrontendFinal.Utils;
using static NuGet.Packaging.PackagingConstants;

namespace StoreFrontendFinal.Models.Utils
{
    public class ProductService
    {
        public static readonly string HOST = Environment.GetEnvironmentVariable("STORE_PRODUCTS_URL") != null ?
            Environment.GetEnvironmentVariable("STORE_PRODUCTS_URL") + "" :
            "store-products";
        public static readonly string PORT = Environment.GetEnvironmentVariable("STORE_PRODUCTS_URL") != null ?
            "" : ":8000";
        private readonly string PRODUCTS_SERVICE_URL;

        public ProductService()
        {
            PRODUCTS_SERVICE_URL = string.Format("http://{0}{1}", HOST, PORT);
        }

        public string GetServiceUrl()
        {
            return PRODUCTS_SERVICE_URL;
        }

        public List<Product>? GetProducts(int categoryId)
        {
            string URL = string.Format("{0}/categories/{1}/products", PRODUCTS_SERVICE_URL, categoryId);
            try
            {
                var json = RestUtils.HttpGet(URL);
                if (json == null || json.Result == null)
                    return null;

                return JsonConvert.DeserializeObject<List<Product>>(json.Result);

            }
            catch (Exception)
            {
                return null;
            }
        }

        public List<Product>? GetProducts(Category category)
        {
            return GetProducts(category.id);
        }

        public Category? GetCategory(string categoryName)
        {
            string URL = string.Format("{0}/categories?name={1}", PRODUCTS_SERVICE_URL, categoryName);
            try
            {
                var json = RestUtils.HttpGet(URL);
                if (json == null || json.Result == null)
                    return null;

                var listCategory = JsonConvert.DeserializeObject<List<Category>>(json.Result);
                if (listCategory == null || listCategory.Count <= 0)
                    return null;

                return listCategory.First();
            }
            catch (Exception)
            {
                return null;
            }
        }

        public Product? GetProduct(int id)
        {
            string URL = string.Format("{0}/products/{1}", PRODUCTS_SERVICE_URL, id);
            try
            {
                var json = RestUtils.HttpGet(URL);
                if (json == null || json.Result == null)
                    return null;

                var product = JsonConvert.DeserializeObject<Product>(json.Result);
                return product;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public Brand? GetBrand(int? id)
        {
            if (id == null)
                return null;

            string URL = string.Format("{0}/brands/{1}", PRODUCTS_SERVICE_URL, id);
            try
            {
                var json = RestUtils.HttpGet(URL);
                if (json == null || json.Result == null)
                    return null;

                return JsonConvert.DeserializeObject<Brand>(json.Result);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public Order? GetOrder(int? id)
        {
            if (id == null)
                return null;

            string URL = string.Format("{0}/orders/{1}", PRODUCTS_SERVICE_URL, id);
            try
            {
                var json = RestUtils.HttpGet(URL);
                if (json == null || json.Result == null)
                    return null;

                return JsonConvert.DeserializeObject<Order>(json.Result);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public Order? GetCartOfClient(int? clientId)
        {
            if (clientId == null)
                return null;

            string URL = string.Format("{0}/carts/{1}", PRODUCTS_SERVICE_URL, clientId);
            try
            {
                var json = RestUtils.HttpGet(URL);
                if (json == null || json.Result == null)
                    return null;

                return JsonConvert.DeserializeObject<Order>(json.Result);
            }
            catch (Exception)
            {
                return null;
            }
        }

        internal List<Product>? GetProductsOfOrder(int? orderId)
        {
            if (orderId == null)
                return null;

            string URL = string.Format("{0}/orders/{1}/products", PRODUCTS_SERVICE_URL, orderId);
            try
            {
                var json = RestUtils.HttpGet(URL);
                if (json == null || json.Result == null)
                    return null;

                return JsonConvert.DeserializeObject<List<Product>>(json.Result);
            }
            catch (Exception)
            {
                return null;
            }
        }

        internal List<OrderProducts>? GetOrderProducts(int orderId, int productId)
        {

            string URL = string.Format("{0}/orders/{1}/products/{2}", PRODUCTS_SERVICE_URL, orderId, productId);
            try
            {
                var json = RestUtils.HttpGet(URL);
                if (json == null || json.Result == null)
                    return null;

                return JsonConvert.DeserializeObject<List<OrderProducts>>(json.Result);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public Order? PostCartForNewClient(int clientId, int cardNumber, string address)
        {
            return PostOrder(clientId, cardNumber, address);
        }

        public Order? PostCartForNewClient(int? clientId, UserServices userServices)
        {
            var user = userServices.GetUserById(clientId);
            if (user == null)
                return null;

            return this.PostCartForNewClient(user.Id, user.CardNumber, user.Address);
        }

        public Order? PostOrder(int clientId, int cardNumber, string address)
        {
            string URL = string.Format("{0}/orders/", PRODUCTS_SERVICE_URL);

            try
            {
                Order order = new Order
                {
                    address = address,
                    client_card = cardNumber,
                    client_id = clientId,
                    status = "cart",
                    total_cost = 0
                };
                var orderJson = System.Text.Json.JsonSerializer.Serialize<Order>(
                    order,
                    new JsonSerializerOptions() { WriteIndented = true });

                var json = RestUtils.HttpPost(URL, orderJson);
                if (json == null || json.Result == null)
                    return null;

                return JsonConvert.DeserializeObject<Order>(json.Result);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public OrderProducts? PostOrderProduct(int orderId, int productId, int quantity, ILogger _logger)
        {
            string URL = string.Format("{0}/product-orders/", PRODUCTS_SERVICE_URL);

            try
            {
                OrderProducts order = new OrderProducts
                {
                    order = orderId,
                    product = productId,
                    quantity = quantity
                };
                var orderJson = System.Text.Json.JsonSerializer.Serialize<OrderProducts>(
                    order,
                    new JsonSerializerOptions() { WriteIndented = true });

                var json = RestUtils.HttpPost(URL, orderJson);
                if (json == null || json.Result == null)
                    return null;

                return JsonConvert.DeserializeObject<OrderProducts>(json.Result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return null;
            }
        }

        internal bool PostOpinion(int productId, string title, string description, int numberOfStars)
        {
            string URL = string.Format("{0}/opinions/", PRODUCTS_SERVICE_URL);

            try
            {
                // create a new Opinion
                Opinion opinion = new Opinion {
                    title = title,
                    description = description,
                    number_of_stars = numberOfStars,
                    product = productId
                };

                var orderJson = System.Text.Json.JsonSerializer.Serialize<Opinion>(
                    opinion,
                    new JsonSerializerOptions() { WriteIndented = true });

                var json = RestUtils.HttpPost(URL, orderJson);
                if (json == null || json.Result == null)
                    return false;

                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public bool DeleteOrderProduct(int orderId, int productId)
        {
            string URL = string.Format("{0}/orders/{1}/products/{2}", PRODUCTS_SERVICE_URL, orderId, productId);
            try
            {
                var json = RestUtils.HttpDelete(URL);
                if (json == null || json.Result == null)
                    return false;

                return true;
            }
            catch (Exception)
            {
                return false;
            }

        }

        public bool RemoveFromCart(int orderId, int productToRemoveId)
        {
            return DeleteOrderProduct(orderId, productToRemoveId);
        }

        public bool MarkPaymentPending(int cartId)
        {
            string URL = string.Format("{0}/orders/{1}/mark_as_payment_pending/", PRODUCTS_SERVICE_URL, cartId);
            try
            {
                var json = RestUtils.HttpGet(URL);
                if (json == null || json.Result == null)
                    return false;

                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        internal List<Order>? GetUserOrders(ProductService productService, int clientId)
        {
            string URL = string.Format("{0}/orders/client/{1}", PRODUCTS_SERVICE_URL, clientId);
            try
            {
                var json = RestUtils.HttpGet(URL);
                if (json == null || json.Result == null)
                    return null;

                return JsonConvert.DeserializeObject<List<Order>>(json.Result);
            }
            catch (Exception)
            {
                return null;
            }
        }

        internal List<Opinion>? GetProductOpinions(int productId)
        {

            string URL = string.Format("{0}/opinions/product/{1}", PRODUCTS_SERVICE_URL, productId);
            try
            {
                var json = RestUtils.HttpGet(URL);
                if (json == null || json.Result == null)
                    return null;

                return JsonConvert.DeserializeObject<List<Opinion>>(json.Result);
            }
            catch (Exception)
            {
                return null;
            }

        }
    }
}

