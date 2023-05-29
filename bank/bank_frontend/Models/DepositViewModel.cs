using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace BankFrontend.Models
{
	public class DepositViewModel
	{

        [DisplayName("Titular da conta")]
        public List<SelectListItem> Accounts { get; set; }

        [DisplayName("Montante (em euros €)")]
        [Range(-1000000, 1000000, ErrorMessage = "O montante não deverá ser superior a 1000000€")]
        [Required(ErrorMessage = "O montante é obrigatório")]
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

