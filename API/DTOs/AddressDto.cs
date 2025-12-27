namespace API.DTOs;

public class AddressDto
{
    public string FullName { get; set; } = "";
    public string Line1 { get; set; } = "";
    public string? Line2 { get; set; }
    public string City { get; set; } = "";
    public string State { get; set; } = "";
    public string PostalCode { get; set; } = "";
    public string Country { get; set; } = "US";
    public string PhoneNumber { get; set; } = "";
}
