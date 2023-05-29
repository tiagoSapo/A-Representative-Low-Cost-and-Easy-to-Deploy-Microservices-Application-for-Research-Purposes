using Newtonsoft.Json;
using StoreFrontendFinal.Models;
using System.Net;
using System.Security.Principal;
using System.Text;
using System.Text.Json;

namespace StoreFrontendFinal.Utils
{
    public class RestUtils
    {
        /**
         * Funcao para realizar pedidos HTTP GET
         **/
        public static async Task<string?> HttpGet(string url)
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
        public static async Task<string?> HttpPost(string url, string json)
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
        public static async Task<string?> HttpPut(string url, string json)
        {

            using (var httpClient = new HttpClient())
            {
                var responseMessage = await httpClient.PutAsync(url, new StringContent(json, Encoding.UTF8, "application/json"));

                if (responseMessage.StatusCode != HttpStatusCode.OK &&
                    responseMessage.StatusCode != HttpStatusCode.Accepted &&
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
        public static async Task<string?> HttpDelete(string url)
        {

            using (var httpClient = new HttpClient())
            {
                var responseMessage = await httpClient.DeleteAsync(url);
                var status = responseMessage.StatusCode;

                if (status != HttpStatusCode.OK && status != HttpStatusCode.NoContent)
                {
                    return null;
                }

                return await responseMessage.Content.ReadAsStringAsync();
            }

        }
    }
}
