using System;
using Proto;

namespace StoreFrontendFinal.Models
{
	public class OrderViewModel
	{
        public List<Product>? Products { get; set; }
        public Order? Order { get; set; }
    }
}

