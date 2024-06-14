using Microsoft.AspNetCore.Mvc.Rendering;
using Proto;

namespace StoreFrontendFinal.Models
{
    public class CartViewModel
    {
        public List<Product> Products { get; set; }
        public User User { get; set; }
        public int CartId { get; set; }

        public CartViewModel(User user, List<Product> products, int cartId)
        {
            this.User = user;
            this.Products = products;
            this.CartId = cartId;
        }

        public CartViewModel(CartViewModel model)
        {
            this.User = model.User;
            this.Products = model.Products;
            this.CartId = model.CartId;
        }
    }
}
