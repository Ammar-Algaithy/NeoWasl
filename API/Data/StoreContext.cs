using API.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class StoreContext(DbContextOptions<StoreContext> options)
    : IdentityDbContext<User>(options)
{
    public required DbSet<Product> Products { get; set; }
    public required DbSet<Cart> Carts { get; set; }

    // ✅ Address entity
    public required DbSet<Address> Addresses { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // ✅ 1:1 User -> ShippingAddress
        builder.Entity<User>()
            .HasOne(u => u.ShippingAddress)
            .WithOne(a => a.User)
            .HasForeignKey<Address>(a => a.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // ✅ Ensure user can only have one address
        builder.Entity<Address>()
            .HasIndex(a => a.UserId)
            .IsUnique();

        // Optional: Keep strings constrained (good practice)
        builder.Entity<Address>(b =>
        {
            b.Property(x => x.FullName).HasMaxLength(200);
            b.Property(x => x.Line1).HasMaxLength(200);
            b.Property(x => x.Line2).HasMaxLength(200);
            b.Property(x => x.City).HasMaxLength(100);
            b.Property(x => x.State).HasMaxLength(50);
            b.Property(x => x.PostalCode).HasMaxLength(20);
            b.Property(x => x.Country).HasMaxLength(2);
            b.Property(x => x.PhoneNumber).HasMaxLength(30);
        });
    }
}
