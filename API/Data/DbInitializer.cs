using System;
using System.Collections.Generic;
using System.Linq;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class DbInitializer
{
    public static void InitDb(WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<StoreContext>()
            ?? throw new InvalidOperationException("StoreContext not found");

        SeedData(context);
    }

    private static void SeedData(StoreContext context)
    {
        // 1. Apply any pending migrations
        context.Database.Migrate();

        // 2. Define the master list of data
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
                Category = "Beverages",
                BusinessType = "Merchandise",
                QuantityInStock = 100
            },
            new() {
                Name = "Angular Purple Boots",
                Description = "Aenean nec lorem. In porttitor. Donec laoreet nonummy augue.",
                Price = 15000,
                PictureUrl = "/images/products/boot-ang2.png",
                Brand = "Angular",
                Type = "Boots",
                Category = "Beverages",
                BusinessType = "Merchandise",
                QuantityInStock = 100
            },
            new() {
                Name = "Angular Blue Boots",
                Description = "Suspendisse dui purus, scelerisque at, vulputate vitae, pretium mattis, nunc. Mauris eget neque at sem venenatis eleifend. Ut nonummy.",
                Price = 18000,
                PictureUrl = "/images/products/boot-ang1.png",
                Brand = "Angular",
                Type = "Boots",
                Category = "Beverages",
                BusinessType = "Merchandise",
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
                Price = 1999, // Adjusted from 0.00 to match sibling product
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

        // 3. Loop through the list to Add or Update
        foreach (var product in products)
        {
            var existingProduct = context.Products
                .FirstOrDefault(p => p.Name == product.Name);

            if (existingProduct == null)
            {
                // New Product: Add it
                context.Products.Add(product);
            }
            else
            {
                // Existing Product: Update fields
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

        // 4. Commit changes
        context.SaveChanges();
    }
}