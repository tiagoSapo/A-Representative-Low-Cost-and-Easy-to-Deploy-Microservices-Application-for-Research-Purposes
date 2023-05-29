using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.CodeAnalysis;
using Proto;
using StoreFrontendFinal.Models;
using StoreFrontendFinal.Models.Utils;

namespace StoreFrontendFinal.Controllers
{
    public class PurchaseController : Controller
    {
        private readonly ILogger<PurchaseController> _logger;

        /* Backend micro-services that handle users and products */
        private readonly UserServices userService = new UserServices();
        private readonly ProductService productService = new ProductService();

        public PurchaseController(ILogger<PurchaseController> logger)
        {
            _logger = logger;
        }

        public ActionResult Checkout()
        {
            // Check if user is authenticated
            if (!AuthenticationHelper.IsLoggedIn(HttpContext))
            {
                ModelState.AddModelError("", "You must be logged in to add a product to your cart.");
                return RedirectToAction("Login", "Login");
            }

            // Get user's cart (or order with status='cart')
            var clientId = HttpContext.Session.GetInt32("id");
            var cart = productService.GetCartOfClient(clientId);
            if (cart == null)
            {
                _logger.LogWarning("There is no cart for this user ({0})!", clientId);
                return RedirectToAction("Cart");
            }

            var checkoutOk = productService.MarkPaymentPending(cart.id);
            if (!checkoutOk)
            {
                _logger.LogError("Couldn't make the purchase for user {0} with cart {1}", clientId, cart.id);
                return RedirectToAction("Cart");
            }

            // Getting products from the the user's cart
            var products = productService.GetProductsOfOrder(cart.id);
            if (products == null || products.Count() <= 0)
            {
                _logger.LogWarning("There are no products for order = " + cart.id);
                return RedirectToAction("Cart");
            }

            // Getting the respective quantities of each product, and updating image URL (to add the HOST:PORT)
            foreach (var prod in products)
            {
                var orderProducts = productService.GetOrderProducts(orderId: cart.id, productId: prod.id);
                if (orderProducts != null && orderProducts.Count > 0)
                {
                    prod.quantity = orderProducts.First().quantity;
                }

                prod.image = productService.GetServiceUrl() + prod.image;
            }

            // Create a model for the view. This models has the user and his products
            var user = userService.GetUserById(clientId);
            if (user == null)
            {
                _logger.LogWarning("Problem getting user " + clientId);
                return RedirectToAction("Cart");
            }

            var viewModel = new CartViewModel(user: user, products: products, cartId: cart.id);

            ViewBag.PurchaseDate = DateTime.UtcNow;
            return View(viewModel);
        }

        public ActionResult Cart()
        {
            // Check if user is authenticated
            if (!AuthenticationHelper.IsLoggedIn(HttpContext))
            {
                ModelState.AddModelError("", "You must be logged in to view your cart.");
                return RedirectToAction("Login", "Login");
            }

            // Get the authenticated user
            var email = HttpContext.Session.GetString("email");
            var user = userService.GetUserByEmail(email);
            if (user == null)
            {
                _logger.LogWarning("There is no user with email " + email);
                ModelState.AddModelError("", "There was an error retrieving your user information. Please try again later.");
                return RedirectToAction("Index", "Home");
            }

            // Trying to get the cart of the user (it's an 'Order' with status='cart')
            var cart = productService.GetCartOfClient(user.Id);
            if (cart == null)
            {
                _logger.LogWarning("There is no cart for this user ({0}). Recreating a new one...", user.Id);
                var newCart = productService.PostCartForNewClient(user.Id, user.CardNumber, user.Address);
                if (newCart == null)
                {
                    _logger.LogWarning("Couldn't create a cart for user {0}", user.Id);
                    ModelState.AddModelError("", "There is no cart. Problem in the backend 'Products Service'!");
                    return RedirectToAction("Index", "Index");
                }
                cart = newCart;
            }
            else
            {
                _logger.LogInformation("Cart for user {0} found sucessfuly", user.Id);
            }

            // Getting products from the the user's cart
            var products = productService.GetProductsOfOrder(cart.id);
            if (products == null)
            {
                _logger.LogWarning("There are no products for order = " + cart.id);
                ModelState.AddModelError("", "There was an error retrieving the products of your cart. Please try again later.");
                return RedirectToAction("Index", "Home");
            }

            // Getting the respective quantities of each product, and updating image URL (to add the HOST:PORT)
            foreach (var prod in products)
            {
                var orderProducts = productService.GetOrderProducts(orderId: cart.id, productId: prod.id);
                if (orderProducts != null && orderProducts.Count > 0)
                {
                    prod.quantity = orderProducts.First().quantity;
                }
                
                prod.image = productService.GetServiceUrl() + prod.image;
            }

            // Create a model for the view. This models has the user and his products
            var viewModel = new CartViewModel(user: user, products: products, cartId: cart.id);
            userService.GetCountries();

            // Send viewmodel to view
            return View(viewModel);
        }
        
        public ActionResult AddToCart(int productId, int quantity)
        {
            // Check if user is authenticated
            if (!AuthenticationHelper.IsLoggedIn(HttpContext))
            {
                ModelState.AddModelError("", "You must be logged in to add a product to your cart.");
                return RedirectToAction("Login", "Login");
            }

            // Associate the new Product with the existing Order
            var clientId = HttpContext.Session.GetInt32("id");
            var cart = productService.GetCartOfClient(clientId);
            if (cart == null)
            {
                _logger.LogWarning("There is no cart for this user ({0}). Recreating a new one...", clientId);
                var newCart = productService.PostCartForNewClient(clientId, userService);
                if (newCart == null)
                {
                    _logger.LogWarning("Couldn't create a cart for user {0}", clientId);
                    ModelState.AddModelError("", "There is no cart. Problem in the backend 'Products Service'!");
                    return RedirectToAction("Index", "Index");
                }
                cart = newCart;
            }
            else
            {
                _logger.LogInformation("Cart for user {0} found sucessfuly", clientId);
            }

            var addedProduct = productService.PostOrderProduct(cart.id, productId, quantity, _logger);
            if (addedProduct == null)
            {
                _logger.LogError("Couldn't add this product {0} to user {1}", clientId, productId);
            }
            return RedirectToAction("Cart", "Purchase");
        }

        [HttpPost]
        public ActionResult RemoveFromCart(int? productToRemoveId, int? cartId)
        {
            _logger.LogInformation("RemoveFromCart method activated in Controller");

            if (productToRemoveId == null || cartId == null)
            {
                _logger.LogInformation("Invalid parameter in RemoveFromCart method.");
                return RedirectToAction("Cart");
            }

            // Remove the product from user's cart
            var removeOk = productService.RemoveFromCart((int)cartId, (int)productToRemoveId);
            if (!removeOk)
            {
                _logger.LogError("Problem removing product {0} from user's cart/order = {1}", productToRemoveId, cartId);
                return RedirectToAction("Cart");
            }

            // Getting products from the the user's cart
            var products = productService.GetProductsOfOrder(cartId);
            if (products == null)
            {
                _logger.LogError("There are no products for order = " + cartId);
                return RedirectToAction("Cart");
            }

            // Getting the respective quantities of each product, and updating image URL (to add the HOST:PORT)
            foreach (var prod in products)
            {
                var orderProducts = productService.GetOrderProducts(orderId: (int)cartId, productId: prod.id);
                if (orderProducts != null && orderProducts.Count > 0)
                {
                    prod.quantity = orderProducts.First().quantity;
                }

                prod.image = productService.GetServiceUrl() + prod.image;
            }

            // Render partial views as strings
            var partialView1 = RazorHelper.RenderRazorViewToString(this, "_CartTable", products);
            var partialView3 = RazorHelper.RenderRazorViewToString(this, "_CartProducts", products);

            // Return view model containing both partial views
            _logger.LogInformation("RemoveFromCart method ended in Controller");
            return Json(new { view1 = partialView1, view3 = partialView3 });
        }

        private class MyViewModel
        {
            public string? PartialView1 { get; set; }
            public string? PartialView3 { get; set; }
        }
    }
}
