using Microsoft.AspNetCore.Identity;

namespace API.Entities;

public enum AccountType
{
    Public = 0,
    Business = 1,
    Admin = 7
}
public enum Tier
{
    Bronze = 3,
    Silver = 2,
    Gold = 1,
    Platinum = 0
}

public class User : IdentityUser
{
    public AccountType AccountType { get; set; } = AccountType.Public;

    // Required when AccountType == Business
    public string? TaxId { get; set; }
    public string? BusinessName { get; set; }

    // 1:1 Address (recommended as separate entity)
    public Address? ShippingAddress { get; set; }
    public string? BusinessType { get; set; } = string.Empty;
    public string? DeliveryNotes { get; set; } = string.Empty;
    public string[]? Extras { get; set; }
    public Tier Tier { get; set; } = Tier.Bronze;
}
