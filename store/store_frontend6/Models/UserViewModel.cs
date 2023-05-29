using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Proto;
using System.ComponentModel.DataAnnotations;
using System.Xml.Linq;
using Google.Protobuf.WellKnownTypes;

namespace StoreFrontendFinal.Models
{
    public class UserViewModel
    {
        [Required]
        public int Id { get; set; }

        [Required]
        [StringLength(50, MinimumLength = 5, ErrorMessage = "Must be at least 5 characters long.")]
        public string ?Name { get; set; }

        [Required]
        [StringLength(50, MinimumLength = 5, ErrorMessage = "Must be at least 5 characters long.")]
        [DataType(DataType.EmailAddress)]
        [Display(Name = "E-mail")]
        public string ?Email { get; set; }

        [Required]
        [StringLength(50, MinimumLength = 6, ErrorMessage = "Must be at least 6 characters long.")]
        [DataType(DataType.Password)]
        public string ?Password { get; set; }

        [Required]
        [StringLength(9, MinimumLength = 9, ErrorMessage = "Must be 9 characters long.")]
        [DataType(DataType.PhoneNumber)]
        public string ?Phone { get; set; }

        [Required]
        [StringLength(50, MinimumLength = 10, ErrorMessage = "Must be at least 10 characters long.")]
        public string ?Address { get; set; }
        
        [Required]
        [Display(Name = "Your card number ('id' in the bank)")]
        public int CardNumber { get; set; }

        public List<SelectListItem> ?Countries { get; set; }
        
        [Display(Name = "Your country")]
        public int CountryId { get; set; }
        
        internal User ToUser(bool? isUpdate)
        {
            var user = new User
            {
                Id = this.Id,
                Address = this.Address,
                Country = this.CountryId,
                Email = this.Email,
                Name = this.Name,
                Password = this.Password,
                Phone = this.Phone,
                CardNumber = this.CardNumber,
                UpdatedAt = Timestamp.FromDateTime(DateTime.UtcNow)
            };

            if (isUpdate == null || isUpdate == false)
            {
                user.CreatedAt = Timestamp.FromDateTime(DateTime.UtcNow);
            }

            return user;
        }

        public override string ToString()
        {
            return string.Format("{0} {1} {2} {3} {4} {5} {6} {7}", Id, Name, Password, Email, Phone, Address, CardNumber, CountryId);
        }

        internal bool IsValid()
        {
            return (
                Name != null &&
                Email != null &&
                Password != null &&
                Phone != null &&
                Address != null);
        }
    }
}
