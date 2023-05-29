using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace FrontEndP128.Models
{
    public class AuthenticationViewModel
    {
        [Display(Name = "Nome")]
        [Required(ErrorMessage = "O nome de utilizador é obrigatório")]
        public string Name { get; set; }

        [Display(Name = "Palavra-passe")]
        [Required(ErrorMessage = "A palavra-passe é obrigatória")]
        public string Password { get; set; }

        public AuthenticationViewModel()
        {
            Name = "";
            Password = "";
        }
    }
}