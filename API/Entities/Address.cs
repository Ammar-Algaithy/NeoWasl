namespace API.Entities;

public class Address
{
    public int Id { get; set; }

    public string FullName { get; set; } = "";
    public string Line1 { get; set; } = "";
    public string? Line2 { get; set; }
    public string City { get; set; } = "";
    public string State { get; set; } = "";
    public string PostalCode { get; set; } = "";
    public string Country { get; set; } = "US";
    public string PhoneNumber { get; set; } = "";

    // FK to Identity User
    public string UserId { get; set; } = "";
    public User User { get; set; } = null!;
}
