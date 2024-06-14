using System;
namespace StoreFrontendFinal.Models
{
	public class Cart
	{
        // <ID of the product, quantity of product>
        public Dictionary<int, int> Products { get; set; }

        public Cart()
        {
            Products = new Dictionary<int, int>();
        }
    }
}

