using BankFrontend.Models;
using FrontEndP128.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Diagnostics;
using System.Web;

namespace BankFrontend.Controllers
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
            return View();
        }

        

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        /**
         * Authentication 
         **/
        public ActionResult Login()
        {
            return View(new AuthenticationViewModel());
        }

        [HttpPost]
        public ActionResult Login(AuthenticationViewModel auth)
        {

            if (!ModelState.IsValid)
            {
                ViewBag.Message = "Internal C# error - ModelState is not valid";
                return View(new AuthenticationViewModel());
            }

            if (!(auth.Name.Equals("admin") && auth.Password.Equals("admin")))
            {
                ViewBag.Message = "Invalid credentials"; /* (you should use user:ADMIN password:ADMIN) */
                return View(new AuthenticationViewModel());
            }

            HttpContext.Session.SetInt32("login", 1);
            return RedirectToAction(nameof(Index));
        }

        public ActionResult Logout()
        {
            HttpContext.Session.SetInt32("login", 0);
            return RedirectToAction(nameof(Index));
        }
    }
}