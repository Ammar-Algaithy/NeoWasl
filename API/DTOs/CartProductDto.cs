namespace API.DTOs;

public class CartProductDto
{
    public int ProductId { get; set; }

    public required string Name { get; set; }
    public long Price { get; set; }
    public long TotalPrice { get; set; }

    public required string PictureUrl { get; set; }
    public required string Brand { get; set; }
    public required string Type { get; set; }

    public int Quantity { get; set; }
}