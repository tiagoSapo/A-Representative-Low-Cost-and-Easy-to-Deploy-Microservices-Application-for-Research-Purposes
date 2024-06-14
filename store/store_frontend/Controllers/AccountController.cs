using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Grpc.Core;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Proto;
using StoreFrontendFinal.Models;
using StoreFrontendFinal.Models.Utils;

namespace StoreFrontendFinal.Controllers
{
    public class AccountController : Controller
    {
        private ILogger<AccountController> _logger;

        /* Backend micro-services that handle users and products */
        private readonly UserServices userService;
        private readonly ProductService productService;

        public AccountController(ILogger<AccountController> logger)
        {
            userService = new UserServices();
            productService = new ProductService();
            _logger = logger;
        }

        public IActionResult Index()
        {
            return GetView(nameof(Index));
        }

        public IActionResult Details()
        {
            return GetView(nameof(Details));
        }

        public IActionResult Delete()
        {
            return GetView(nameof(Delete));
        }

        public IActionResult Edit()
        {
            return GetEditView();
        }

        public IActionResult Orders()
        {
            // Get authenticated user
            User? user = AuthenticationHelper.GetUser(userService, HttpContext);
            if (user == null)
            {
                _logger.LogInformation("User is not authenticated");
                return RedirectToAction("Login", "Login");
            }

            // Get user's orders
            List<Order>? orders = productService.GetUserOrders(productService, user.Id);
            if (orders == null)
            {
                _logger.LogInformation("Problem fetching user's {0} orders from 'products-microservice'", user.Id);
                return RedirectToAction("Error", "Home");
            }

            // Return view with the user's orders
            return View(nameof(Orders), orders);
        }

        [HttpPost]
        public IActionResult Delete(User user)
        {
            _logger.LogInformation(user.ToString());
            int userId = user.Id;

            // Delete the user
            bool deleteOk = AuthenticationHelper.DeleteUser(HttpContext, userService, userId);
            if (!deleteOk)
            {
                var msg = "Couldn't delete the user " + userId;
                _logger.LogInformation(msg);
                return RedirectToAction("Error", "Home", new { errorMessage = msg });
            }

            // Remove user session

            return RedirectToAction("Index", "Home");
        }

        [HttpPost]
        public IActionResult Edit(UserViewModel user)
        {
            if (!ModelState.IsValid || !user.IsValid())
            {
                // Get Countries
                var countries = userService.GetCountries();
                if (countries == null)
                {
                    var error = "There are no countries in 'user grpc service'";
                    _logger.LogWarning(error);
                    return RedirectToAction("Error", "Home", new { errorMessage = error });
                }

                // Get Countries' names
                var countryOptions = new List<SelectListItem>();
                foreach (var country in countries)
                {
                    countryOptions.Add(new SelectListItem { Text = country.Name, Value = country.Id.ToString() });
                }

                // Set countries for user
                user.Countries = countryOptions;

                _logger.LogInformation("Invalid model in method Edit for user " + user.ToString());
                return View("Edit", user);
            }

            // Get authenticated user
            try
            {
                bool updateOk = AuthenticationHelper.UpdateUser(userService, user.ToUser(true));
                if (!updateOk)
                {
                    var msg = "Couldn't update user " + user.Id;
                    _logger.LogInformation(msg);
                    return RedirectToAction("Error", "Home", new { errorMessage = msg });
                }
            }
            catch (Exception ex)
            {
                var msg = "Problem on 'user service grpc' updating user: " + ex;
                _logger.LogInformation(msg);
                return RedirectToAction("Error", "Home", new { errorMessage = msg });
            }

            return RedirectToAction(nameof(Index));
        }

        [NonAction]
        public IActionResult GetView(string viewName)
        {
            // Get authenticated user
            var user = AuthenticationHelper.GetUser(userService, HttpContext);
            if (user == null)
            {
                _logger.LogInformation("User is not authenticated");
                return RedirectToAction("Login", "Login");
            }

            return View(viewName, user);
        }

        [NonAction]
        public IActionResult GetEditView()
        {
            // Get authenticated user
            var user = AuthenticationHelper.GetUser(userService, HttpContext);
            if (user == null)
            {
                _logger.LogInformation("User is not authenticated");
                return RedirectToAction("Login", "Login");
            }

            // Get Countries
            var countries = userService.GetCountries();
            if (countries == null)
            {
                var msg = "There are no countries in 'user grpc service'";
                _logger.LogWarning(msg);
                return RedirectToAction("Error", "Home", new { errorMessage = msg });
            }

            // Get Countries' names
            var countryOptions = new List<SelectListItem>();
            foreach (var country in countries)
            {
                countryOptions.Add(new SelectListItem { Text = country.Name, Value = country.Id.ToString() });
            }

            var model = new UserViewModel()
            {
                Id = user.Id,
                Address = user.Address,
                CardNumber = user.CardNumber,
                CountryId = user.Country,
                Email = user.Email,
                Name = user.Name,
                Password = user.Password,
                Phone = user.Phone,
                Countries = countryOptions
            };

            // Return view with user data and countries to choose
            return View("Edit", model);
        }


        public IActionResult OrderDetails(int? orderId)
        {
            // Check validity of order
            if (orderId == null)
            {
                string errorMsg = "It wasn't provied an orderId and/or its products";
                _logger.LogWarning(errorMsg);
                return RedirectToAction("Error", "Home", new { errorMessage = errorMsg });
            }

            // Get Order's products using the orderId provided
            Order? order = productService.GetOrder(orderId);
            if (order == null)
            {
                string errorMsg = "There is no order with id = " + orderId;
                _logger.LogWarning(errorMsg);
                return RedirectToAction("Error", "Home", new { errorMessage = errorMsg });
            }

            // Get Order's products using the orderId provided
            List<Product>? products = productService.GetProductsOfOrder(orderId);
            if (products == null)
            {
                string errorMsg = "There is no order with id = " + orderId;
                _logger.LogWarning(errorMsg);
                return RedirectToAction("Error", "Home", new { errorMessage = errorMsg });
            }

            // Getting the respective quantities for each product, and updating image URL (to add the HOST:PORT)
            foreach (var prod in products)
            {
                var orderProducts = productService.GetOrderProducts(orderId: orderId.Value, productId: prod.id);
                if (orderProducts != null && orderProducts.Count > 0)
                {
                    prod.quantity = orderProducts.First().quantity;
                }

                prod.image = /*productService.GetServiceUrl()*/ "http://localhost:5005" + prod.image;
            }

            // Preparting viewModel with Products and orderId
            var viewModel = new OrderViewModel { Products = products, Order = order };

            // Return View with viewModel
            return View(viewModel);
        }
    }
}
