using Microsoft.AspNetCore.Mvc;
using StoreFrontendFinal.Models;
using System.Diagnostics;
using StoreFrontendFinal.Models.Utils;

namespace StoreFrontendFinal.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            string HOST = Environment.GetEnvironmentVariable("STORE_USERS_URL") != null ?
            Environment.GetEnvironmentVariable("STORE_USERS_URL") + "" :
            "store-users";
            string PORT = Environment.GetEnvironmentVariable("STORE_USERS_URL") != null ?
            ":5000" : ":5000";
            string address = string.Format("http://{0}{1}", HOST, PORT);
            _logger.LogInformation(HOST);
            _logger.LogInformation(PORT);
            _logger.LogInformation(address);
            return View("Index", address);
            //return View();
        }

        public IActionResult TvCamera()
        {
            return View();
        }

        public IActionResult HomeAppliances()
        {
            return View();
        }

        public IActionResult Computers()
        {
            return View();
        }
        public IActionResult Gaming()
        {
            return View();
        }

        /*
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
        */

        public IActionResult Error(string? errorMessage) {
            return View("Error", errorMessage);
        }
    }
}