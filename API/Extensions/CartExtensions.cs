using System;
using API.DTOs;
using API.Entities;

namespace API.Extensions;

public static class CartExtensions
{
    public static CartDto ToCartDto(this Cart cart)
    {
        return new CartDto
        {
            CartId = cart.CartId,
            Products = cart.Products.Select(x => new CartProductDto
            {
                ProductId = x.ProductId,
                Name = x.Product.Name,
                // IMPORTANT: if Product.Price is decimal dollars, this truncates.
                // Prefer decimal in DTO, or convert to cents properly.
                Price = (int)x.Product.Price,
                PictureUrl = x.Product.PictureUrl,
                Brand = x.Product.Brand,
                Type = x.Product.Type,
                Quantity = x.Quantity
            }).ToList()
        };
    }
}
