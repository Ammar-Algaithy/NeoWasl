using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities;

[Table("CartProducts")]
public class CartProduct
{
    public int Id { get; set; }

    public int Quantity { get; set; }

    public int ProductId { get; set; }
    public required Product Product { get; set; }

    public int CartId { get; set; }
    public Cart Cart { get; set; } = null!;

    // -----------------------------
    // Added fields
    // -----------------------------
    [NotMapped]
    public long TotalPrice => Product.Price * Quantity;

    public byte[] RowVersion { get; set; } = Array.Empty<byte>();
}