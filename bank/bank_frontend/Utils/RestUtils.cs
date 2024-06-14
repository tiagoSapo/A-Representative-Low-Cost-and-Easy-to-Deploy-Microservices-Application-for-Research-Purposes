using BankFrontend.Models;
using Newtonsoft.Json;
using System.Net;
using System.Security.Principal;
using System.Text;
using System.Text.Json;

namespace BankFrontend.Utils
{
    public class RestUtils
    {
        /*private static readonly string CLIENTS_SERVICE_URL = "http://bank-clients:8080";
        private static readonly string NOTIFICATIONS_SERVICE_URL = "http://bank-notifications:8080";
        */
        public static readonly string CLIENTS_SERVICE_URL = Environment.GetEnvironmentVariable("BANK_CLIENTS_URL") != null ?
            "http://" + Environment.GetEnvironmentVariable("BANK_CLIENTS_URL") :
            "http://bank-clients:5000";
        public static readonly string NOTIFICATIONS_SERVICE_URL = Environment.GetEnvironmentVariable("BANK_NOTIFICATIONS_URL") != null ?
            "http://" + Environment.GetEnvironmentVariable("BANK_NOTIFICATIONS_URL") :
            "http://bank-notifications:8080";

        /**
         * Funcao para realizar pedidos HTTP GET
         **/
        private static async Task<string?> GetApi(string url)
        {

            using (var httpClient = new HttpClient())
            {
                var response = await httpClient.GetAsync(url);

                if (!response.IsSuccessStatusCode)
                {
                    return null;
                }
                var accounts = await response.Content.ReadAsStringAsync();
                return accounts;
            }

        }
        /**
         * Funcao para realizar pedidos HTTP POST
         **/
        private static async Task<string?> PostApi(string url, string json)
        {

            using (var httpClient = new HttpClient())
            {
                var responseMessage = await httpClient.PostAsync(url, new StringContent(json, Encoding.UTF8, "application/json"));

                if (responseMessage.StatusCode != HttpStatusCode.Created)
                {
                    return null;
                }

                var responseContent = await responseMessage.Content.ReadAsStringAsync();
                return responseContent;
            }

        }
        /**
         * Funcao para realizar pedidos HTTP PUT
         **/
        private static async Task<string?> PutApi(string url, string json)
        {

            using (var httpClient = new HttpClient())
            {
                var responseMessage = await httpClient.PutAsync(url, new StringContent(json, Encoding.UTF8, "application/json"));

                if (responseMessage.StatusCode != HttpStatusCode.OK ||
                    responseMessage.StatusCode != HttpStatusCode.Accepted ||
                    responseMessage.StatusCode != HttpStatusCode.Created)
                {
                    return null;
                }

                var responseContent = await responseMessage.Content.ReadAsStringAsync();
                return responseContent;
            }

        }

        /**
         * Funcao para realizar pedidos HTTP GET
         **/
        private static async Task<string?> DeleteApi(string url)
        {

            using (var httpClient = new HttpClient())
            {
                var responseMessage = await httpClient.DeleteAsync(url);

                if (responseMessage.StatusCode != HttpStatusCode.OK ||
                    responseMessage.StatusCode != HttpStatusCode.Accepted ||
                    responseMessage.StatusCode != HttpStatusCode.Created)
                {
                    return null;
                }

                var responseContent = await responseMessage.Content.ReadAsStringAsync();
                return responseContent;
            }

        }

        public static List<Account>? ListAccounts()
        {
            var url = CLIENTS_SERVICE_URL + "/accounts";
            try
            {
                var json = GetApi(url);
                if (json == null || json.Result == null)
                    return null;

                return JsonConvert.DeserializeObject<List<Account>>(json.Result);

            }
            catch (Exception)
            {
                return null;
            }
        }

        public static string? SaveAccount(Account account)
        {
            var url = CLIENTS_SERVICE_URL + "/accounts";

            try
            {
                var opt = new JsonSerializerOptions() { WriteIndented = true };
                var strJson = System.Text.Json.JsonSerializer.Serialize<Account>(account, opt);

                return PostApi(url, strJson).Result;

            }
            catch (Exception)
            {
                return null;
            }
        }

        public static Account? GetAccount(int id)
        {
            var url = string.Format("{0}/accounts/{1}", CLIENTS_SERVICE_URL, id);
            try
            {
                var json = GetApi(url);
                if (json == null || json.Result == null)
                {
                    return null;
                }
                    

                var account = JsonConvert.DeserializeObject<Account>(json.Result);
                if (account == null)
                {
                    return null;
                }   

                return account;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public static string? UpdateAccount(int id, Account account)
        {
            var url = string.Format("{0}/accounts", CLIENTS_SERVICE_URL);
           
            try
            {
                var opt = new JsonSerializerOptions() { WriteIndented = true };

                account.id = id;
                var strJson = System.Text.Json.JsonSerializer.Serialize<Account>(account, opt);

                return PutApi(url, strJson).Result;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public static string? DeleteAccount(int id)
        {
            var url = string.Format("{0}/accounts/{1}", CLIENTS_SERVICE_URL, id);

            try
            {
                return DeleteApi(url).Result;
            }
            catch (Exception)
            {
                return null;
            }
        }
    }
}
