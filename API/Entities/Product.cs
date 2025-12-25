namespace API.Entities;

public class Product
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Category { get; set; }
    public required string Description { get; set; }
    public long Price { get; set; }
    public required string PictureUrl { get; set; }
    public required string Type { get; set; }
    public required string Brand { get; set; }
    public int QuantityInStock { get; set; }
    public required string BusinessType { get; set; }
    public decimal? DiscountAmount { get; set; }
    public DateTime? DiscountStartUtc { get; set; }
    public DateTime? DiscountEndUtc { get; set; }
    public List<string> Tags { get; set; } = [];
    public bool IsActive { get; set; } = true;
    public bool IsFeatured { get; set; } = false;
    public string? Supplier { get; set; }
    public int? SupplierId { get; set; }
    public int SoldQuantity { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

}
