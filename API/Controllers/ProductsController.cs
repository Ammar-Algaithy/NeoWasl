using API.Data;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController(StoreContext context) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetProducts(
            [FromQuery] ProductParams productParams,
            CancellationToken ct)
        {
            // 1) Build base query (not ordered yet)
            var baseQuery = context.Products
                .AsNoTracking()
                .Search(productParams.SearchTerm)
                .FilterByBrandsAndTypes(productParams.Brands, productParams.Types);

            // 2) Apply ordering and keep it strongly typed as IOrderedQueryable<Product>
            IOrderedQueryable<Product> orderedQuery = baseQuery.Sort(productParams.OrderBy);

            // 3) Add stable tie-breaker
            orderedQuery = orderedQuery.ThenBy(p => p.Id);

            var products = await PagedList<Product>.ToPagedList(
                orderedQuery,
                productParams.PageNumber,
                productParams.PageSize,
                ct
            );

            Response.AddPaginationHeader(products.MetaData);
            return products;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await context.Products.FindAsync(id);
            if (product == null) return NotFound();
            return product;
        }

        [HttpGet("category/{category}")]
        public async Task<ActionResult<List<Product>>> GetProductsByCategory(
            string category,
            [FromQuery] ProductParams productParams,
            CancellationToken ct)
        {
            var baseQuery = context.Products
                .AsNoTracking()
                .FilterByCategoryAndBusiness(category, productParams.BusinessType)
                .Search(productParams.SearchTerm)
                .FilterByBrandsAndTypes(productParams.Brands, productParams.Types);

            IOrderedQueryable<Product> orderedQuery = baseQuery.Sort(productParams.OrderBy);

            orderedQuery = orderedQuery.ThenBy(p => p.Id);

            var paged = await PagedList<Product>.ToPagedList(
                orderedQuery,
                productParams.PageNumber,
                productParams.PageSize,
                ct
            );

            Response.AddPaginationHeader(paged.MetaData);
            return paged;
        }


        [HttpGet("filters")]
        public async Task<IActionResult> GetFilters(
            [FromQuery] string? category,
            [FromQuery] string? businessType,
            [FromQuery] string? searchTerm,
            CancellationToken ct)
        {
            // Base scoped query
            IQueryable<Product> query = context.Products.AsNoTracking();

            // Scope by businessType (case-insensitive)
            if (!string.IsNullOrWhiteSpace(businessType))
            {
                var bt = businessType.Trim().ToLower();
                query = query.Where(p => (p.BusinessType ?? "").ToLower() == bt);
            }

            // Scope by category (ignore if "All")
            if (!string.IsNullOrWhiteSpace(category) &&
                !category.Equals("All", StringComparison.OrdinalIgnoreCase))
            {
                var cat = category.Trim().ToLower();
                query = query.Where(p => (p.Category ?? "").ToLower() == cat);
            }

            // Optional: scope filter options to current search term
            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                var s = searchTerm.Trim().ToLower();
                query = query.Where(p => (p.Name ?? "").ToLower().Contains(s));
            }

            var brands = await query
                .Where(p => p.Brand != null && p.Brand != "")
                .GroupBy(p => p.Brand!)
                .Select(g => new { name = g.Key, count = g.Count() })
                .OrderByDescending(x => x.count)
                .ThenBy(x => x.name)
                .ToListAsync(ct);

            var types = await query
                .Where(p => p.Type != null && p.Type != "")
                .GroupBy(p => p.Type!)
                .Select(g => new { name = g.Key, count = g.Count() })
                .OrderByDescending(x => x.count)
                .ThenBy(x => x.name)
                .ToListAsync(ct);

            return Ok(new { brands, types });
        }
    }
}
