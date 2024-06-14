using System;
using System.ComponentModel.DataAnnotations;

namespace StoreFrontendFinal.Models
{
	public class ProductOpinionVM
	{
        [Required]
        [StringLength(20, MinimumLength = 4, ErrorMessage = "Must be at least 4 characters long.")]
        public string? Title { get; set; }

        [Required]
        [StringLength(50, MinimumLength = 10, ErrorMessage = "Must be at least 10 characters long.")]
        public string? Description { get; set; }

        [Required]
        [Display(Name = "Number of stars")]
        [Range(1, 5, ErrorMessage = "{0} must be between {1} and {2}.")]
        public int Rating { get; set; }

        public int ProductId { get; set; }
        public string? ProductName { get; set; }
        public string? ProductImage { get; set; }

        public override string ToString()
        {
            return string.Format("{0}, {1}, {2}, {3}, {4}, {5}", Title, Description, Rating, ProductId, ProductName, ProductImage);
        }
    }
}

