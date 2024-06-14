using System.ComponentModel.DataAnnotations;
using System.Xml.Linq;

namespace StoreFrontendFinal.Models
{
    public class Product
	{
		public int id { get; set; }

        [Display(Name = "Name")]
        public string? name { get; set; }

        [Display(Name = "Price")]
        public double price { get; set; }

        public string? description { get; set; }
        public string? image { get; set; }
        public string? size { get; set; }
		public string? color { get; set; }

        [Display(Name = "Brand")]
        public Brand? brand { get; set; }

        [Display(Name = "Category")]
        public Brand? category { get; set; }

        // [JUST FOR VIEWS!] Just to show
        public int? quantity { get; internal set; }
        public int? orderId { get; internal set; }
    }
}
