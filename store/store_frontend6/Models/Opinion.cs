using System;
namespace StoreFrontendFinal.Models
{
	public class Opinion
	{
		public int number_of_stars { get; set; }
		public string title { get; set; }
		public string description { get; set; }
		public DateTime created_at { get; set; }
		public int product { get; set; }

		public Opinion()
		{
			title = "";
			description = "";
		}
	}
}

