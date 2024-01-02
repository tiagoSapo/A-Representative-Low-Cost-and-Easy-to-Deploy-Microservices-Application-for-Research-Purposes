using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace FrontEndP128.Models
{
    public class AuthenticationViewModel
    {
        [Display(Name = "Name")]
        [Required(ErrorMessage = "Account name mandatory")]
        public string Name { get; set; }

        [Display(Name = "Password")]
        [Required(ErrorMessage = "Password mandatory")]
        public string Password { get; set; }

        public AuthenticationViewModel()
        {
            Name = "";
            Password = "";
        }
    }
}