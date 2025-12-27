using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class DbInitializer
{
    public static async Task InitDbAsync(WebApplication app)
    {
        using var scope = app.Services.CreateScope();

        var context = scope.ServiceProvider.GetRequiredService<StoreContext>()
            ?? throw new InvalidOperationException("StoreContext not found");

        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>()
            ?? throw new InvalidOperationException("UserManager not found");

        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>()
            ?? throw new InvalidOperationException("RoleManager not found");

        await SeedDataAsync(context, userManager, roleManager);
    }

    private static async Task SeedDataAsync(
        StoreContext context,
        UserManager<User> userManager,
        RoleManager<IdentityRole> roleManager)
    {
        // 1) Apply migrations
        await context.Database.MigrateAsync();

        // 2) Seed Products
        await SeedProductsAsync(context);

        // 3) Seed Roles + Users (exactly 3 accounts)
        await SeedIdentityAsync(userManager, roleManager);
    }

    private static async Task SeedProductsAsync(StoreContext context)
    {
        var products = new List<Product>
        {
            // --- EXISTING ITEMS ---
            new() {
                Name = "Angular Speedster Board 2000",
                Description = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                Price = 20000,
                PictureUrl = "/images/products/sb-ang1.png",
                Brand = "Angular",
                Type = "Boards",
                Category = "Equipment",
                BusinessType = "B2C",
                QuantityInStock = 100,
                Tags = ["Fast", "Angular", "New"],
                IsFeatured = true
            },
            new() {
                Name = "Green Angular Board 3000",
                Description = "Nunc viverra imperdiet enim. Fusce est. Vivamus a tellus.",
                Price = 15000,
                PictureUrl = "/images/products/sb-ang2.png",
                Brand = "Angular",
                Type = "Boards",
                Category = "Equipment",
                BusinessType = "B2C",
                QuantityInStock = 100,
                DiscountAmount = 15000 * 0.02m,
                DiscountStartUtc = DateTime.UtcNow,
                DiscountEndUtc = DateTime.UtcNow.AddDays(30)
            },
            new() {
                Name = "Core Board Speed Rush 3",
                Description = "Suspendisse dui purus, scelerisque at, vulputate vitae, pretium mattis, nunc. Mauris eget neque at sem venenatis eleifend. Ut nonummy.",
                Price = 18000,
                PictureUrl = "/images/products/sb-core1.png",
                Brand = "NetCore",
                Type = "Boards",
                Category = "Equipment",
                BusinessType = "B2C",
                QuantityInStock = 100,
                Tags = ["Core", "Speed"]
            },
            new() {
                Name = "Net Core Super Board",
                Description = "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin pharetra nonummy pede. Mauris et orci.",
                Price = 30000,
                PictureUrl = "/images/products/sb-core2.png",
                Brand = "NetCore",
                Type = "Boards",
                Category = "Equipment",
                BusinessType = "B2C",
                QuantityInStock = 100,
                IsFeatured = true
            },
            new() {
                Name = "React Board Super Whizzy Fast",
                Description = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                Price = 25000,
                PictureUrl = "/images/products/sb-react1.png",
                Brand = "React",
                Type = "Boards",
                Category = "Equipment",
                BusinessType = "B2C",
                QuantityInStock = 100,
                Tags = ["React", "Top Seller"]
            },
            new() {
                Name = "Typescript Entry Board",
                Description = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                Price = 12000,
                PictureUrl = "/images/products/sb-ts1.png",
                Brand = "TypeScript",
                Type = "Boards",
                Category = "Beverages",
                BusinessType = "B2C",
                QuantityInStock = 100
            },
            new() {
                Name = "Core Blue Hat",
                Description = "Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                Price = 1000,
                PictureUrl = "/images/products/hat-core1.png",
                Brand = "NetCore",
                Type = "Hats",
                Category = "Beverages",
                BusinessType = "Merchandise",
                QuantityInStock = 100
            },
            new() {
                Name = "Green React Woolen Hat",
                Description = "Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                Price = 8000,
                PictureUrl = "/images/products/hat-react1.png",
                Brand = "React",
                Type = "Hats",
                Category = "Beverages",
                BusinessType = "Merchandise",
                QuantityInStock = 100,
                Tags = ["Winter", "Wool"]
            },
            new() {
                Name = "Purple React Woolen Hat",
                Description = "Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                Price = 1500,
                PictureUrl = "/images/products/hat-react2.png",
                Brand = "React",
                Type = "Hats",
                Category = "Beverages",
                BusinessType = "Merchandise",
                QuantityInStock = 100
            },
            new() {
                Name = "Blue Code Gloves",
                Description = "Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                Price = 1800,
                PictureUrl = "/images/products/glove-code1.png",
                Brand = "VS Code",
                Type = "Gloves",
                Category = "Beverages",
                BusinessType = "Merchandise",
                QuantityInStock = 100
            },
            new() {
                Name = "Green Code Gloves",
                Description = "Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                Price = 1500,
                PictureUrl = "/images/products/glove-code2.png",
                Brand = "VS Code",
                Type = "Gloves",
                Category = "Beverages",
                BusinessType = "Merchandise",
                QuantityInStock = 100
            },
            new() {
                Name = "Purple React Gloves",
                Description = "Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                Price = 1600,
                PictureUrl = "/images/products/glove-react1.png",
                Brand = "React",
                Type = "Gloves",
                Category = "Beverages",
                BusinessType = "Merchandise",
                QuantityInStock = 100
            },
            new() {
                Name = "Green React Gloves",
                Description = "Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                Price = 1400,
                PictureUrl = "/images/products/glove-react2.png",
                Brand = "React",
                Type = "Gloves",
                Category = "Beverages",
                BusinessType = "Merchandise",
                QuantityInStock = 100
            },
            new() {
                Name = "Redis Red Boots",
                Description = "Suspendisse dui purus, scelerisque at, vulputate vitae, pretium mattis, nunc. Mauris eget neque at sem venenatis eleifend. Ut nonummy.",
                Price = 25000,
                PictureUrl = "/images/products/boot-redis1.png",
                Brand = "Redis",
                Type = "Boots",
                Category = "Beverages",
                BusinessType = "Merchandise",
                QuantityInStock = 100,
                Tags = ["Waterproof", "Red"]
            },
            new() {
                Name = "Core Red Boots",
                Description = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                Price = 18999,
                PictureUrl = "/images/products/boot-core2.png",
                Brand = "NetCore",
                Type = "Boots",
                Category = "Beverages",
                BusinessType = "Merchandise",
                QuantityInStock = 100
            },
            new() {
                Name = "Core Purple Boots",
                Description = "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin pharetra nonummy pede. Mauris et orci.",
                Price = 19999,
                PictureUrl = "/images/products/boot-core1.png",
                Brand = "NetCore",
                Type = "Boots",
                Category = "Wraps",
                BusinessType = "Smoke",
                QuantityInStock = 100
            },
            new() {
                Name = "Angular Purple Boots",
                Description = "Aenean nec lorem. In porttitor. Donec laoreet nonummy augue.",
                Price = 15000,
                PictureUrl = "/images/products/boot-ang2.png",
                Brand = "Angular",
                Type = "Boots",
                Category = "Wraps",
                BusinessType = "Smoke Gear",
                QuantityInStock = 100
            },
            new() {
                Name = "Angular Blue Boots",
                Description = "Suspendisse dui purus, scelerisque at, vulputate vitae, pretium mattis, nunc. Mauris eget neque at sem venenatis eleifend. Ut nonummy.",
                Price = 18000,
                PictureUrl = "/images/products/boot-ang1.png",
                Brand = "Angular",
                Type = "Boots",
                Category = "Hookah",
                BusinessType = "Smoke Gear",
                QuantityInStock = 100
            },

            // --- NEW ITEMS ADDED BELOW ---
            new() {
                Name = "ALOEVINE WATERMELON 16.9OZ 20CT",
                Description = "Refreshing watermelon flavored Aloe drink with real aloe pulp.",
                Price = 1999,
                PictureUrl = "https://neowaslstorage.blob.core.windows.net/images/beverages/ALOEDRINKWATERMELON16point9OZ20CT.png",
                Brand = "AloeVine",
                Type = "Beverages",
                Category = "Beverages",
                BusinessType = "Grocery",
                QuantityInStock = 100
            },
            new() {
                Name = "ALOEVINE KIWE 16.9OZ 20CT",
                Description = "Delicious Kiwi flavored Aloe drink with real aloe pulp.",
                Price = 1999,
                PictureUrl = "https://neowaslstorage.blob.core.windows.net/images/beverages/ALOEVINE KIWE 16.9OZ 20CT.jpg",
                Brand = "AloeVine",
                Type = "Beverages",
                Category = "Beverages",
                BusinessType = "Grocery",
                QuantityInStock = 100
            },
            new() {
                Name = "AIRHEADS BITES BOUCHEES ORIGINAL FRUIT 18CT",
                Description = "Chewy, fruity bites in assorted original fruit flavors.",
                Price = 1599,
                PictureUrl = "https://neowaslstorage.blob.core.windows.net/images/candy/AIRHEADSBITESBOUCHEESORIGINALFRUIT18CT.jpg",
                Brand = "Airheads",
                Type = "Candy",
                Category = "Beverages",
                BusinessType = "Grocery",
                QuantityInStock = 100
            },
            new() {
                Name = "AIRHEADS XTREME RAINBOW 2OZ 18CT",
                Description = "Sour and sweet rainbow berry flavored belts.",
                Price = 2199,
                PictureUrl = "https://neowaslstorage.blob.core.windows.net/images/candy/AIRHEADSXTREMERAINBOW2oz18CT.jpg",
                Brand = "Airheads",
                Type = "Candy",
                Category = "Beverages",
                BusinessType = "Grocery",
                QuantityInStock = 100
            },
            new() {
                Name = "CHEEZ-IT ORIGINAL 45 CT",
                Description = "Baked snack crackers made with 100% real cheese.",
                Price = 1499,
                PictureUrl = "https://neowaslstorage.blob.core.windows.net/images/snack/CHEEZITOriginal45CT.jpg",
                Brand = "Cheez-It",
                Type = "Snacks",
                Category = "Beverages",
                BusinessType = "Grocery",
                QuantityInStock = 100
            },
            new() {
                Name = "OVEN DELIGHTS FRENCH VANILLA DANISH 6CT",
                Description = "Soft and flaky French Vanilla Danish pastries.",
                Price = 650,
                PictureUrl = "https://neowaslstorage.blob.core.windows.net/images/cakes/OVENDELIGHTSFRENCHVANILLADANISH6CT.jpg",
                Brand = "Oven Delights",
                Type = "Danish",
                Category = "Beverages",
                BusinessType = "Grocery",
                QuantityInStock = 100
            },
            new() {
                Name = "5 GUM SPEARMINT RAIN 10CT",
                Description = "Sugar-free Spearmint gum that stimulates your senses.",
                Price = 1499,
                PictureUrl = "https://neowaslstorage.blob.core.windows.net/images/candy/5GUMSPEARMINTRAIN10CT.jpg",
                Brand = "5 Gum",
                Type = "Gum",
                Category = "Gum",
                BusinessType = "Grocery",
                QuantityInStock = 100
            }
        };

        foreach (var product in products)
        {
            var existingProduct = await context.Products
                .FirstOrDefaultAsync(p => p.Name == product.Name);

            if (existingProduct == null)
            {
                context.Products.Add(product);
            }
            else
            {
                existingProduct.Category = product.Category;
                existingProduct.BusinessType = product.BusinessType;
                existingProduct.Tags = product.Tags;
                existingProduct.IsFeatured = product.IsFeatured;
                existingProduct.DiscountAmount = product.DiscountAmount;
                existingProduct.DiscountStartUtc = product.DiscountStartUtc;
                existingProduct.DiscountEndUtc = product.DiscountEndUtc;
                existingProduct.Price = product.Price;
                existingProduct.Description = product.Description;
                existingProduct.PictureUrl = product.PictureUrl;
                existingProduct.Brand = product.Brand;
                existingProduct.Type = product.Type;
            }
        }

        await context.SaveChangesAsync();
    }

    private static async Task SeedIdentityAsync(
        UserManager<User> userManager,
        RoleManager<IdentityRole> roleManager)
    {
        // Roles that match your AccountType
        var roles = new[] { "User", "Business", "Admin" };

        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                var roleResult = await roleManager.CreateAsync(new IdentityRole(role));
                if (!roleResult.Succeeded)
                {
                    var errors = string.Join("; ", roleResult.Errors.Select(e => $"{e.Code}: {e.Description}"));
                    throw new InvalidOperationException($"Failed to create role '{role}': {errors}");
                }
            }
        }

        // Must satisfy your password policy
        const string password = "TestUser1"; 

        // ✅ EXACTLY 3 accounts total: 1 Public, 1 Business, 1 Admin
        await EnsureUserAsync(
            userManager,
            email: "public@test.com",
            password: password,
            accountType: AccountType.Public,
            role: "User",
            businessName: null,
            taxId: null,
            address: new Address
            {
                FullName = "Public User",
                Line1 = "100 Public St",
                City = "New York",
                State = "NY",
                PostalCode = "10001",
                Country = "US",
                PhoneNumber = "555-000-0001"
            });

        await EnsureUserAsync(
            userManager,
            email: "business@test.com",
            password: password,
            accountType: AccountType.Business,
            role: "Business",
            businessName: "NeoWasl Business LLC",
            taxId: "11-1111111",
            address: new Address
            {
                FullName = "Business Owner",
                Line1 = "200 Business Ave",
                Line2 = "Suite 10",
                City = "Bronx",
                State = "NY",
                PostalCode = "10459",
                Country = "US",
                PhoneNumber = "555-100-0001"
            });

        await EnsureUserAsync(
            userManager,
            email: "admin@test.com",
            password: password,
            accountType: AccountType.Admin,
            role: "Admin",
            businessName: null,
            taxId: null,
            address: new Address
            {
                FullName = "Admin User",
                Line1 = "1 Admin Plaza",
                City = "New York",
                State = "NY",
                PostalCode = "10005",
                Country = "US",
                PhoneNumber = "555-900-0001"
            });
    }

    private static async Task EnsureUserAsync(
        UserManager<User> userManager,
        string email,
        string password,
        AccountType accountType,
        string role,
        string? businessName,
        string? taxId,
        Address? address)
    {
        var existing = await userManager.FindByEmailAsync(email);
        if (existing != null)
        {
            // Keep role synced
            if (!await userManager.IsInRoleAsync(existing, role))
            {
                var addRoleResult = await userManager.AddToRoleAsync(existing, role);
                if (!addRoleResult.Succeeded)
                {
                    var errors = string.Join("; ", addRoleResult.Errors.Select(e => $"{e.Code}: {e.Description}"));
                    throw new InvalidOperationException($"Failed to add role '{role}' to '{email}': {errors}");
                }
            }

            // Keep AccountType synced (optional but useful)
            if (existing.AccountType != accountType)
            {
                existing.AccountType = accountType;
                existing.BusinessName = businessName;
                existing.TaxId = taxId;
                await userManager.UpdateAsync(existing);
            }

            // NOTE: We do not overwrite the address if user already exists.
            // If you want to overwrite it, tell me and I will add the update logic safely.
            return;
        }

        var user = new User
        {
            UserName = email,
            Email = email,
            AccountType = accountType,
            BusinessName = businessName,
            TaxId = taxId,
            ShippingAddress = address
        };

        var result = await userManager.CreateAsync(user, password);
        if (!result.Succeeded)
        {
            var errors = string.Join("; ", result.Errors.Select(e => $"{e.Code}: {e.Description}"));
            throw new InvalidOperationException($"Failed to create user '{email}': {errors}");
        }

        var roleResult2 = await userManager.AddToRoleAsync(user, role);
        if (!roleResult2.Succeeded)
        {
            var errors = string.Join("; ", roleResult2.Errors.Select(e => $"{e.Code}: {e.Description}"));
            throw new InvalidOperationException($"Failed to add role '{role}' to '{email}': {errors}");
        }
    }
}
