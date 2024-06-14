using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using StoreFrontendFinal.Models;
using StoreFrontendFinal.Models.Utils;
using Proto;
using Grpc.Core;
using System.Diagnostics.Metrics;
using System.Xml.Linq;
using StoreFrontendFinal.Utils;
using Microsoft.Extensions.Logging;

namespace StoreFrontendFinal.Controllers
{
    public class LoginController : Controller
    {
        /* Logger */
        private readonly ILogger<LoginController> _logger;

        /* Backend micro-services that handle users and products */
        private readonly UserServices userService = new UserServices();
        private readonly ProductService productService = new ProductService();

        public LoginController(ILogger<LoginController> logger)
        {
            _logger = logger;
        }
        
        /**
         * Authentication 
         **/
        public ActionResult Register()
        {
            try
            {
                var countries = userService.GetCountries();
                var countryOptions = new List<SelectListItem>();
                foreach (var country in countries)
                {
                    countryOptions.Add(new SelectListItem { Text = country.Name, Value = country.Id.ToString() });
                }

                var user = new UserViewModel()
                {
                    Countries = countryOptions
                };

                return View(user);
            }
            catch (RpcException)
            {
                var msg = "GRPC backend problem";
                return RedirectToAction("Error", "Home", new { errorMessage = msg });
            }
        }

        [HttpPost]
        public ActionResult Register(UserViewModel model)
        {
            // Check if model is valid
            if (!ModelState.IsValid)
            {
                var msg = "GRPC backend problem (model is not valid)";
                _logger.LogError(msg);
                return RedirectToAction("Error", "Home", new { errorMessage = msg });
            }


            // Register new User in microservice "store-users"
            var user = model.ToUser(false);
            try
            {
                userService.Register(user);
            }
            catch (RpcException)
            {
                var msg = "Invalid registration. It may exist an user with that email";
                _logger.LogError(msg);
                return RedirectToAction("InvalidCredentials", "Login", new { errorMessage = msg });
            }

            try
            {
                user = userService.GetUserByEmail(user.Email);
                if (user == null)
                {
                    var msg = "User doesn't exist";
                    _logger.LogError(msg);
                    return RedirectToAction("Error", "Home", new { errorMessage = msg });
                }
            }
            catch (RpcException)
            {
                var msg = string.Format("GRPC backend problem (getting user)");
                _logger.LogError(msg);
                return RedirectToAction("Error", "Home", new { errorMessage = msg });
            }


            // Create new cart for the new user in microserivce "store-products"
            try
            {
                var cart = productService.PostCartForNewClient(user.Id, user.CardNumber, user.Address);
                if (cart == null)
                {
                    ViewData["Message"] = string.Format("Problem creating a cart for: {0}, {1}, {2}. That user may already have a cart.", user.Id, user.CardNumber, user.Address);
                    _logger.LogWarning((string?)ViewData["Message"]);
                }
            }
            catch (Exception)
            {
                ViewData["Message"] = string.Format("GRPC backend problem (getting user {0})", user.Email);
                _logger.LogWarning((string?)ViewData["Message"]);
            }


            // Authenticate user
            AuthenticationHelper.Login(HttpContext, user);


            // Redirect user to homepage
            return RedirectToAction("Index", "Home");
        }


        public ActionResult Login()
        {
            return View(new AuthViewModel());
        }

        [HttpPost]
        public ActionResult Login(AuthViewModel auth)
        {
            if (!ModelState.IsValid)
            {
                ViewData["Message"] = "Invalid AuthViewModel";
                return View(new AuthViewModel());
            }

            // Checks whether the user exists or not
            User? user = userService.GetUserByEmail(auth.Email);
            if (user == null)
            {
                var msg = "There is no user with email = " + auth.Email;
                _logger.LogWarning(msg);
                return RedirectToAction("InvalidCredentials", "Login", new { errorMessage = "Invalid credentials, please try again" });
            }

            // Check user's password
            bool validUser = userService.IsValidUser(auth);
            if (!validUser)
            {
                var msg = "Invalid password credentials";
                _logger.LogWarning(msg);
                return RedirectToAction("InvalidCredentials", "Login", new { errorMessage = "Invalid credentials, please try again" });
            }

            // Authenticate user
            AuthenticationHelper.Login(HttpContext, user);

            // returning to the main page
            return RedirectToAction("Index", "Home");
        }


        public ActionResult Logout()
        {
            // terminating session (logout)
            AuthenticationHelper.Logout(HttpContext);

            // returning to the main page
            return RedirectToAction("Index", "Home");
        }

        // Shows the page if authentication fails
        public IActionResult InvalidCredentials(string? errorMessage)
        {
            return View("InvalidCredentials", errorMessage);
        }

    }
}
