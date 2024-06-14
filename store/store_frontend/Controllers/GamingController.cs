using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using StoreFrontendFinal.Models;
using StoreFrontendFinal.Models.Utils;
using System.Collections.Generic;

namespace StoreFrontendFinal.Controllers
{
	public class GamingController : Controller
	{
        private readonly ILogger _logger;
		private readonly ProductService productService;

        public GamingController(ILogger<GamingController> logger)
        {
            _logger = logger;
			productService = new ProductService();
        }

        public ActionResult Playstation()
		{
            var products = GetProducts("Playstation");
            _logger.LogInformation("-> " + productService.GetServiceUrl());
			if (products is RedirectToActionResult)
			{
				return (ActionResult)products;
			}

			return View(products);
		}

        public ActionResult Xbox()
        {
            var products = GetProducts("Xbox");
            if (products is RedirectToActionResult)
            {
                return (ActionResult)products;
            }

            return View(products);
        }

        public ActionResult Nintendo()
        {
            var products = GetProducts("Nintendo");
            if (products is RedirectToActionResult)
            {
                return (ActionResult)products;
            }

            return View(products);
        }


        public ActionResult Details(int id)
        {
            // Get Product by its id
            var product = productService.GetProduct(id);
            if (product == null)
            {
                var msg = string.Format("Problem fetching product id = {0} on the backend side.", id);
                _logger.LogWarning(msg);
                return RedirectToAction("Error", "Home", new { errorMessage = msg });
            }

            // Get Product's Opinions, using product's id
            var opinions = productService.GetProductOpinions(id);
            if (opinions == null)
            {
                var msg = string.Format("Problem fetching opinions of product = {0} on the backend side.", id);
                _logger.LogWarning(msg);
                return RedirectToAction("Error", "Home", new { errorMessage = msg });
            }

            // Return a view with Product and its Opinions
            return View("Details", new ProductAndOpinionsVM(product, opinions));
        }

        public ActionResult PostOpinion(int? productId)
        {
            // check if a productId was not provied
            if (productId == null)
            {
                var msg = "Invalid product id";
                _logger.LogInformation(msg);
                return RedirectToAction("Error", "Home", new { errorMessage = msg });
            }

            // check if user is logged in
            if (!AuthenticationHelper.IsLoggedIn(HttpContext))
            {
                _logger.LogInformation("User is not logged in");
                return RedirectToAction("Login", "Login");
            }

            // Get product
            Product? product = productService.GetProduct((int)productId);
            if (product == null)
            {
                _logger.LogInformation("There is no product with id = {0}", productId);
                return RedirectToAction("Login", "Login");
            }

            // Return view with a Product and a blank Opinion (ProductOpinionVM)
            return View(
                nameof(PostOpinion),
                new ProductOpinionVM { ProductId = product.id, ProductImage = product.image, ProductName = product.name });
        }

        [HttpPost]
        public ActionResult PostOpinion(ProductOpinionVM model)
        {
            // check validity of Viewmodel
            if (!ModelState.IsValid)
            {
                _logger.LogInformation("User has given an invalid model");
                return View(model);
            }

            // check model's fields
            if (model.Description == null || model.Title == null)
            {
                var msg = "Invalid description or title " + model.ToString();
                _logger.LogInformation(msg);
                return RedirectToAction("Error", "Home", new { errorMessage = msg });
            }

            // Post new opinion
            bool postOpinionOk = productService.PostOpinion(model.ProductId, model.Title, model.Description, model.Rating);
            if (!postOpinionOk)
            {
                var msg = string.Format("There was problem adding an opinion for product={0} on the Products Service side.", model.ProductId);
                _logger.LogWarning(msg);
                return RedirectToAction("Error", "Home", new { errorMessage = msg });
            }

            // Return view with a Product and a blank Opinion (ProductOpinionVM)
            return RedirectToAction(nameof(Details), new { id = model.ProductId });
        }

        [NonAction]
        private Object GetProducts(string categoryName)
        {
            var category = productService.GetCategory(categoryName);
            if (category == null)
            {
                _logger.LogWarning("Category {0} doesn't exist!", categoryName);
                return new List<Product>();
            }

            var products = productService.GetProducts(category);
            if (products == null)
            {
                _logger.LogWarning("Problem fetching product from category {0} on the backend side.",
                    categoryName);
                return new List<Product>();
            }
            foreach (var prod in products)
            {
                prod.image = productService.GetServiceUrl() + prod.image;
            }

            return products;
        }
    }
}
