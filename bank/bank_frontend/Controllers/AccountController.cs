using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using System.Security.Cryptography.Xml;
using System;
using BankFrontend.Utils;
using BankFrontend.Models;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Console;
using System.Xml.Linq;

using MQTTnet;
using MQTTnet.Client;
using System;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System;
using Newtonsoft.Json;
using MQTTnet.Protocol;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace BankFrontend.Controllers
{
    public class AccountController : Controller
    {
        private readonly ILogger _logger;

        private readonly MqttFactory factory;
        private readonly IMqttClient mqttClient;
        private readonly MqttClientOptions options;

        private readonly string TOPIC = "tiago-bank/transactions";
        private readonly string BROKER = "broker.hivemq.com";

        public AccountController(ILogger<HomeController> logger)
        {
            _logger = logger;

            // Create a new MqttFactory instance
            factory = new MqttFactory();
            mqttClient = factory.CreateMqttClient();

            // Define the MQTT broker address
            options = new MqttClientOptionsBuilder()
                .WithClientId(Guid.NewGuid().ToString())
                .WithTcpServer(BROKER)
                .Build();

            // Connect to the MQTT broker
            mqttClient.ConnectAsync(options).Wait();
        }

        [NonAction]
        private bool LoggedIn()
        {
            var auth = HttpContext.Session.GetInt32("login");
            if (auth != null && auth == 1)
                return true;
            else
                return false;
        }

        // GET: AccountController
        public ActionResult Index()
        {
            if (!LoggedIn())
                return RedirectToAction("Login", "Home");

            var accounts = RestUtils.ListAccounts();
            if (accounts == null)
            {
                string msg = "Problema ao contactar com o backend para obter as contas";
                TempData["Message"] = msg + " " + RestUtils.CLIENTS_SERVICE_URL;
                _logger.LogWarning(msg);

                return View(new List<Account>());
            }
            if (accounts.Count <= 0)
            {
                string errorBackend = "Ainda nao existem registos de contas";
                TempData["Message"] = errorBackend;
                _logger.LogWarning(errorBackend);

                return View(new List<Account>());
            }

            return View(accounts);
        }

        // GET: AccountController/Details/5
        public ActionResult Details(int id)
        {
            if (!LoggedIn())
                return RedirectToAction("Login", "Home");

            var account = RestUtils.GetAccount(id);
            if (account == null)
            {
                var error = string.Format("Problema ao contactar com o backend para obter a conta {0}", id);
                _logger.LogWarning(error);
                TempData["Message"] = error;
                return RedirectToAction(nameof(Index));
            }


            return View(account);
        }

        // GET: AccountController/Create
        public ActionResult Create()
        {
            if (!LoggedIn()) 
                return RedirectToAction("Login", "Home");

            return View();
        }

        // POST: AccountController/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(Account account)
        {
            if (!LoggedIn())
                return RedirectToAction("Login", "Home");

            if (!ModelState.IsValid)
            {
                TempData["Message"] = string.Format("Conta com dados inválidos");
                return View();
            }

            try
            {
                string? result = RestUtils.SaveAccount(account);
                if (result == null)
                {
                    TempData["Message"] = string.Format("Problema ao gravar a conta no backend");
                    return View();
                }
            } 
            catch (Exception ex)
            {
                TempData["Message"] = string.Format("Não foi possível contactar o serviço de backend \"BankClients\": {0}", ex);
                return View();
            }

            return RedirectToAction(nameof(Index));
        }

        // GET: AccountController/Edit/5
        public ActionResult Edit(int id)
        {
            if (!LoggedIn())
                return RedirectToAction("Login", "Home");

            var account = RestUtils.GetAccount(id);
            if (account == null)
            {
                string errorBackend = string.Format("Problema ao contactar com o backend para obter a conta {0}", id);
                _logger.LogWarning(errorBackend);
                TempData["Message"] = errorBackend;
                return RedirectToAction(nameof(Index));
            }
            return View(account);
        }

        // POST: AccountController/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(int id, Account newAccount)
        {
            if (!LoggedIn())
                return RedirectToAction("Login", "Home");

            try
            {
                RestUtils.UpdateAccount(id, newAccount);
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View(newAccount);
            }
        }

        // GET: AccountController/Delete/5
        public ActionResult Delete(int id)
        {
            if (!LoggedIn())
                return RedirectToAction("Login", "Home");

            var account = RestUtils.GetAccount(id);
            if (account == null)
            {
                string errorBackend = string.Format("Problema ao contactar com o backend para obter a conta {0}", id);
                _logger.LogWarning(errorBackend);
                TempData["Message"] = errorBackend;
                return RedirectToAction(nameof(Index));
            }
            return View(account);
        }

        // POST: AccountController/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id, Account account)
        {
            if (!LoggedIn())
                return RedirectToAction("Login", "Home");

            try
            {
                RestUtils.DeleteAccount(id);
                return RedirectToAction(nameof(Index));
            }
            catch (Exception ex)
            {
                TempData["Message"] = ex.Message;
                return View(account);
            }
        }

        // GET: AccountController/Deposit
        public ActionResult Deposit()
        {
            if (!LoggedIn())
                return RedirectToAction("Login", "Home");

            var accounts = RestUtils.ListAccounts();
            if (accounts == null)
            {
                string errorBackend = "Problema ao contactar com o backend para obter as contas";
                TempData["Message"] = errorBackend;
                _logger.LogWarning(errorBackend);
                return RedirectToAction(nameof(Index));
            }
            if (accounts.Count <= 0)
            {
                string errorBackend = "Ainda nao existem registos de contas";
                TempData["Message"] = errorBackend;
                _logger.LogWarning(errorBackend);

                return RedirectToAction(nameof(Index));
            }


            var model = new DepositViewModel();
            var selectListItems = new List<SelectListItem>();
            foreach (var item in accounts)
            {
                selectListItems.Add(new SelectListItem
                {
                    Text = string.Format("{0}: {1}", item.id.ToString(), item.holderName),
                    Value = item.id.ToString()
                });
            }
            model.Accounts = selectListItems;

            return View(model);
        }

        // POST: AccountController/Deposit
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Deposit(DepositViewModel depositViewModel)
        {
            if (!LoggedIn())
                return RedirectToAction("Login", "Home");

            if (!ModelState.IsValid)
            {
                _logger.LogInformation("Modelo invalido");
                TempData["Message"] = "Modelo invalido";
                return RedirectToAction(nameof(Index));
            }

            try
            {
                Message Message = new Message
                {
                    ibanSender = -1L,
                    ibanReceiver = long.Parse(depositViewModel.Id),
                    amount = depositViewModel.Amount
                };

                _logger.LogInformation("Mensagem a enviar para o MQTT: " + Message.ToString());

                
                // Convert Message to JSON
                string Json = JsonConvert.SerializeObject(Message);

                // Send the JSON string to the MQTT topic
                var Topic = TOPIC;
                var Payload = Encoding.UTF8.GetBytes(Json);
                var QosLevel = MqttQualityOfServiceLevel.AtMostOnce;
                var ApplicationMessage = new MqttApplicationMessageBuilder()
                .WithTopic(Topic)
                .WithPayload(Payload)
                .WithQualityOfServiceLevel(QosLevel)
                .Build();

                mqttClient.PublishAsync(ApplicationMessage).Wait();
            }
            catch (Exception ex)
            {
                string msg = string.Format("Problema enviar o pedido de deposito para o MQTT: {0}", ex);
                _logger.LogWarning(msg);
                TempData["Message"] = msg;
            }

            return RedirectToAction(nameof(Index));
        }
    }
}
