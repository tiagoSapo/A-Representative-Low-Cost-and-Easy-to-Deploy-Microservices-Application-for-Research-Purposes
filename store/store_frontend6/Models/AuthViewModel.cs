using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace StoreFrontendFinal.Models
{
    public class AuthViewModel
    {
        [Display(Name = "E-mail")]
        [Required(ErrorMessage = "Email is mandatory")]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; }

        [Display(Name = "Password")]
        [Required(ErrorMessage = "Password is mandatory")]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        public AuthViewModel()
        {
            Email = "";
            Password = "";
        }
    }
}
