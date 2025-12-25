using API.DTOs;
using API.Entities;

namespace API.Extensions;

public static class CartExtensions
{
    public static CartDto ToCartDto(this Cart cart)
    {
        return new CartDto
        {
            Id = cart.Id,
            CartId = cart.CartId,
            TotalAmount = cart.TotalAmount,

            Products = cart.Products.Select(x => new CartProductDto
            {
                ProductId = x.ProductId,
                Name = x.Product.Name,
                Price = x.Product.Price,
                TotalPrice = x.TotalPrice,
                PictureUrl = x.Product.PictureUrl,
                Brand = x.Product.Brand,
                Type = x.Product.Type,
                Quantity = x.Quantity
            }).ToList()
        };
    }
}