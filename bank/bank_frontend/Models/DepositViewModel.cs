using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace BankFrontend.Models
{
	public class DepositViewModel
	{

        [DisplayName("Account holder")]
        public List<SelectListItem> Accounts { get; set; }

        [DisplayName("Amount (in euros €)")]
        [Range(-1000000, 1000000, ErrorMessage = "The amount shouldn't be superior to 1000000€")]
        [Required(ErrorMessage = "The amount field is mandatory")]
        public double Amount { get; set; }

        public string Id { get; set; }

        public DepositViewModel()
        {
            Accounts = new List<SelectListItem>();
            Id = "-1";
        }

        public override string ToString()
        {
            return string.Format("{0}", Amount);
        }
    }
}

