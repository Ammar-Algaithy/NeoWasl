namespace API.Entities;

public class Cart
{
    public int Id { get; set; }

    public required string CartId { get; set; }

    public List<CartProduct> Products { get; set; } = new();

    // -----------------------------
    // Added fields
    // -----------------------------
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAtUtc { get; set; }

    public byte[] RowVersion { get; set; } = Array.Empty<byte>();

    public string Status { get; set; } = "Active";

    public long TotalAmount => Products.Sum(p => p.TotalPrice);

    // -----------------------------
    // Existing logic
    // -----------------------------
    public void AddProduct(Product product, int quantity)
    {
        ArgumentNullException.ThrowIfNull(product);

        if (quantity <= 0)
            throw new ArgumentException("Quantity must be greater than zero.", nameof(quantity));

        var existing = FindProductById(product.Id);

        if (existing is null)
        {
            Products.Add(new CartProduct
            {
                Product = product,
                ProductId = product.Id,
                Quantity = quantity,
                CartId = Id
            });
            return;
        }

        existing.Quantity += quantity;
    }

    public void RemoveProduct(int productId, int? quantity = null)
    {
        var existing = FindProductById(productId);
        if (existing is null) return;

        if (quantity is null || quantity <= 0 || quantity >= existing.Quantity)
        {
            Products.Remove(existing);
            return;
        }

        existing.Quantity -= quantity.Value;
    }

    private CartProduct? FindProductById(int productId)
    {
        return Products.FirstOrDefault(p => p.ProductId == productId);
    }
}