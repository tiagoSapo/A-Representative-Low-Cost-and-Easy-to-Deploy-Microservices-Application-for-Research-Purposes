using Newtonsoft.Json.Linq;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace BankFrontend.Models
{
    public class Account
    {
        
        [Key]
        [DisplayName("Número de conta")]
        public long id { get; set; }

        [DisplayName("Nome")]
        [StringLength(100, ErrorMessage = "Até 100 caracteres")]
        [Required(ErrorMessage = "O nome é obrigatório")]
        public string? holderName { get; set; }

        [DisplayName("Endereço de e-mail")]
        [Required(ErrorMessage = "O e-mail é obrigatório")]
        [EmailAddress(ErrorMessage = "Endereço de e-mail inválido!")]
        public string? holderEmail { get; set; }

        [DisplayName("Montante (em euros €)")]
        [Range(-1000000, 1000000, ErrorMessage = "O montante não deverá ser superior a 1000000€")]
        [Required(ErrorMessage = "O montante é obrigatório")]
        public double balance { get; set; }

        public override string ToString()
        {
            return string.Format("[{0}, {1}, {2}, {3}]", id, balance, holderName, holderEmail);
        }


    }
}
