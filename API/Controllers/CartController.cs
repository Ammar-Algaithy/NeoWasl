using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class CartController(StoreContext context) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<CartDto>> GetCart()
    {
        var cartId = Request.Cookies["CartId"];
        if (string.IsNullOrWhiteSpace(cartId))
            return NoContent();

        var cart = await context.Carts
            .Include(x => x.Products)
            .ThenInclude(x => x.Product)
            .FirstOrDefaultAsync(x => x.CartId == cartId);

        if (cart == null)
            return NoContent();

        return cart.ToCartDto();
    }

    [HttpPost]
    public async Task<ActionResult<CartDto>> AddProductToCart([FromQuery] int productId, [FromQuery] int quantity)
    {
        if (quantity <= 0)
            return BadRequest("Quantity must be greater than zero.");

        var cart = await RetrieveCart();
        cart ??= CreateCart();

        var product = await context.Products.FindAsync(productId);
        if (product == null)
            return BadRequest("Problem Adding Product to Cart");

        cart.AddProduct(product, quantity);

        var saved = await context.SaveChangesAsync() > 0;
        if (!saved)
            return BadRequest("Problem Updating Cart");

        // Return the same shape as GetCart
        return Ok(CartExtensions.ToCartDto(cart));
    }

    [HttpDelete]
    public async Task<IActionResult> RemoveCartItem(int productId, [FromQuery] int? quantity = null)
    {
        var cart = await RetrieveCart();
        if (cart == null)
            return NoContent();

        cart.RemoveProduct(productId, quantity);

        var saved = await context.SaveChangesAsync() > 0;
        if (!saved)
            return BadRequest("Problem Removing Product from Cart");

        return Ok(CartExtensions.ToCartDto(cart));
    }

    private async Task<Cart?> RetrieveCart()
    {
        var cartId = Request.Cookies["CartId"];
        if (string.IsNullOrWhiteSpace(cartId))
            return null;

        return await context.Carts
            .Include(x => x.Products)
            .ThenInclude(x => x.Product)
            .FirstOrDefaultAsync(x => x.CartId == cartId);
    }

    private Cart CreateCart()
    {
        var cartId = Guid.NewGuid().ToString();

        var cookieOptions = new CookieOptions
        {
            IsEssential = true,
            Expires = DateTime.UtcNow.AddDays(30)
        };

        Response.Cookies.Append("CartId", cartId, cookieOptions);

        var cart = new Cart { CartId = cartId };
        context.Carts.Add(cart);

        return cart;
    }
}
