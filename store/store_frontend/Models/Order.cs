using System;
namespace StoreFrontendFinal.Models
{
    public class Order
    {
        public int id { get; set; }
        public int client_id { get; set; }
        public int client_card { get; set; }
        public string? address { get; set; }
        public double total_cost { get; set; }
        public string? status { get; set; }

        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
        public List<int> products { get; set; }

        public Order()
        {
            products = new List<int>();
        }
    }
}
