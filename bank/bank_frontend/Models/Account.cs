using Newtonsoft.Json.Linq;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace BankFrontend.Models
{
    public class Account
    {
        
        [Key]
        [DisplayName("Account number")]
        public long id { get; set; }

        [DisplayName("Name")]
        [StringLength(100, ErrorMessage = "100 characters max")]
        [Required(ErrorMessage = "Name is mandatory")]
        public string? holderName { get; set; }

        [DisplayName("E-mail address")]
        [Required(ErrorMessage = "E-mail address is mandatory")]
        [EmailAddress(ErrorMessage = "Invalid E-mail address")]
        public string? holderEmail { get; set; }

        [DisplayName("Amount (in euros €)")]
        [Range(-1000000, 1000000, ErrorMessage = "The amount shouldn't be superior to 1000000€")]
        [Required(ErrorMessage = "The amount field is mandatory")]
        public double balance { get; set; }

        public override string ToString()
        {
            return string.Format("[{0}, {1}, {2}, {3}]", id, balance, holderName, holderEmail);
        }


    }
}
