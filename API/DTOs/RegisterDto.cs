namespace API.DTOs;

public class RegisterDto
{
    public string Email { get; set; } = "";
    public string Password { get; set; } = "";

    // Optional profile fields (keep or remove as you prefer)
    public string? FullName { get; set; }
    public string? BusinessName { get; set; }

    public AddressDto? ShippingAddress { get; set; }
}
