using System;
namespace StoreFrontendFinal.Models
{
	public class ProductAndOpinionsVM
	{
		public Product Product { get; set; }
		public List<Opinion> Opinions { get; set; }

		public ProductAndOpinionsVM(Product product, List<Opinion> opinions)
		{
			this.Product = product;
			this.Opinions = opinions;
		}
	}
}

