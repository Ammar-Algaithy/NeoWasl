using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions;

public static class ProductExtensions
{
    public static IOrderedQueryable<Product> Sort(this IQueryable<Product> query, string? orderBy)
    {
        if (string.IsNullOrWhiteSpace(orderBy))
            return query.OrderBy(p => p.Name);

        return orderBy switch
        {
            "price" => query.OrderBy(p => p.Price),
            "priceDesc" => query.OrderByDescending(p => p.Price),
            _ => query.OrderBy(p => p.Name)
        };
    }

    public static IQueryable<Product> Search(this IQueryable<Product> query, string? searchTerm)
    {
        if (string.IsNullOrWhiteSpace(searchTerm)) return query;

        var term = searchTerm.Trim();

        // Better than ToLower().Contains for EF + avoids null crash
        return query.Where(x => x.Name != null && EF.Functions.Like(x.Name, $"%{term}%"));
    }

    public static IQueryable<Product> FilterByBrandsAndTypes(
    this IQueryable<Product> query,
    string? brands,
    string? types)
{
    var brandList = new List<string>();
    var typeList = new List<string>();

    if (!string.IsNullOrWhiteSpace(brands))
        brandList.AddRange(
            brands.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                  .Select(x => x.ToLower())
        );

    if (!string.IsNullOrWhiteSpace(types))
        typeList.AddRange(
            types.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                 .Select(x => x.ToLower())
        );

    if (brandList.Count > 0)
        query = query.Where(x => x.Brand != null && brandList.Contains(x.Brand.ToLower()));

    if (typeList.Count > 0)
        query = query.Where(x => x.Type != null && typeList.Contains(x.Type.ToLower()));

    return query;
}



    public static IQueryable<Product> FilterByCategoryAndBusiness(
        this IQueryable<Product> query,
        string? category,
        string? businessType)
    {
        if (!string.IsNullOrWhiteSpace(businessType))
            query = query.Where(p => p.BusinessType == businessType);

        if (!string.IsNullOrWhiteSpace(category) && !category.Equals("All", StringComparison.OrdinalIgnoreCase))
            query = query.Where(p => p.Category == category);

        return query;
    }
}
