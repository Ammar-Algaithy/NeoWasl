using API.Entities;

namespace API.DTOs;

public class AccountInfoDto
{
    public string Id { get; set; } = "";
    public string Email { get; set; } = "";
    public string? UserName { get; set; }

    public AccountType AccountType { get; set; }
    public string? TaxId { get; set; }
    public string? BusinessName { get; set; }

    public string? BusinessType { get; set; }
    public string? DeliveryNotes { get; set; }
    public Tier Tier { get; set; }
    public string[]? Extras { get; set; }

    public List<string> Roles { get; set; } = new();

    public AddressDto? ShippingAddress { get; set; }
}
