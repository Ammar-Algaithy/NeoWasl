using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController(
    SignInManager<User> signInManager,
    RoleManager<IdentityRole> roleManager
) : BaseApiController
{
    [HttpPost("register")]
    public async Task<ActionResult> RegisterUser(RegisterDto registerDto)
    {
        if (string.IsNullOrWhiteSpace(registerDto.Email))
            return BadRequest("Email is required.");

        if (string.IsNullOrWhiteSpace(registerDto.Password))
            return BadRequest("Password is required.");

        var existing = await signInManager.UserManager.FindByEmailAsync(registerDto.Email);
        if (existing != null)
            return BadRequest("Email is already in use.");

        var user = new User
        {
            UserName = registerDto.Email.Trim(),
            Email = registerDto.Email.Trim(),
            AccountType = AccountType.Public,
            BusinessName = string.IsNullOrWhiteSpace(registerDto.BusinessName)
                ? null
                : registerDto.BusinessName.Trim(),
        };

        if (registerDto.ShippingAddress != null)
        {
            user.ShippingAddress = new Address
            {
                FullName = string.IsNullOrWhiteSpace(registerDto.ShippingAddress.FullName)
                    ? (registerDto.FullName ?? "")
                    : registerDto.ShippingAddress.FullName,

                Line1 = registerDto.ShippingAddress.Line1,
                Line2 = registerDto.ShippingAddress.Line2,
                City = registerDto.ShippingAddress.City,
                State = registerDto.ShippingAddress.State,
                PostalCode = registerDto.ShippingAddress.PostalCode,
                Country = registerDto.ShippingAddress.Country,
                PhoneNumber = registerDto.ShippingAddress.PhoneNumber
            };
        }

        var result = await signInManager.UserManager.CreateAsync(user, registerDto.Password);

        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
                ModelState.AddModelError(error.Code, error.Description);

            return ValidationProblem();
        }

        // ✅ Ensure Public role exists
        const string roleName = "Public";
        if (!await roleManager.RoleExistsAsync(roleName))
        {
            var createRole = await roleManager.CreateAsync(new IdentityRole(roleName));
            if (!createRole.Succeeded)
            {
                foreach (var error in createRole.Errors)
                    ModelState.AddModelError(error.Code, error.Description);

                return ValidationProblem();
            }
        }

        // ✅ Assign role
        var roleResult = await signInManager.UserManager.AddToRoleAsync(user, roleName);
        if (!roleResult.Succeeded)
        {
            foreach (var error in roleResult.Errors)
                ModelState.AddModelError(error.Code, error.Description);

            return ValidationProblem();
        }

        return Ok(new
        {
            user.Id,
            user.Email,
            user.AccountType,
            user.BusinessName
        });
    }

    [Authorize]
    [HttpGet("user-info")]
    public async Task<ActionResult<AccountInfoDto>> GetUserInfo()
    {
        // Load user + address in one query
        var user = await signInManager.UserManager.Users
            .Include(x => x.ShippingAddress)
            .FirstOrDefaultAsync(x => x.UserName == User.Identity!.Name);

        if (user == null) return Unauthorized();

        var roles = await signInManager.UserManager.GetRolesAsync(user);

        return Ok(new AccountInfoDto
        {
            Id = user.Id,
            Email = user.Email ?? "",
            UserName = user.UserName,

            AccountType = user.AccountType,
            TaxId = user.TaxId,
            BusinessName = user.BusinessName,

            BusinessType = user.BusinessType,
            DeliveryNotes = user.DeliveryNotes,
            Tier = user.Tier,
            Extras = user.Extras,

            Roles = roles.ToList(),

            ShippingAddress = user.ShippingAddress == null ? null : new AddressDto
            {
                FullName = user.ShippingAddress.FullName,
                Line1 = user.ShippingAddress.Line1,
                Line2 = user.ShippingAddress.Line2,
                City = user.ShippingAddress.City,
                State = user.ShippingAddress.State,
                PostalCode = user.ShippingAddress.PostalCode,
                Country = user.ShippingAddress.Country,
                PhoneNumber = user.ShippingAddress.PhoneNumber
            }
        });
    }

    
    [Authorize]
    [HttpPost("address")]
    public async Task<ActionResult<AddressDto>> CreateOrUpdate(AddressDto dto)
    {
        var user = await signInManager.UserManager.Users
            .Include(x => x.ShippingAddress)
            .FirstOrDefaultAsync(x => x.UserName == User.Identity!.Name);

        if (user == null) return Unauthorized();

        if (user.ShippingAddress == null)
        {
            user.ShippingAddress = new Address
            {
                UserId = user.Id
            };
        }

        user.ShippingAddress.FullName = dto.FullName;
        user.ShippingAddress.Line1 = dto.Line1;
        user.ShippingAddress.Line2 = dto.Line2;
        user.ShippingAddress.City = dto.City;
        user.ShippingAddress.State = dto.State;
        user.ShippingAddress.PostalCode = dto.PostalCode;
        user.ShippingAddress.Country = dto.Country;
        user.ShippingAddress.PhoneNumber = dto.PhoneNumber;

        var result = await signInManager.UserManager.UpdateAsync(user);
        if (!result.Succeeded) return BadRequest("Problem updating user address");

        // ✅ Return DTO (no cycle)
        return Ok(new AddressDto
        {
            FullName = user.ShippingAddress.FullName,
            Line1 = user.ShippingAddress.Line1,
            Line2 = user.ShippingAddress.Line2,
            City = user.ShippingAddress.City,
            State = user.ShippingAddress.State,
            PostalCode = user.ShippingAddress.PostalCode,
            Country = user.ShippingAddress.Country,
            PhoneNumber = user.ShippingAddress.PhoneNumber
        });
    }


    [Authorize]
    [HttpGet("address")]
    public async Task<ActionResult<AddressDto?>> GetSavedAddress()
    {
        var address = await signInManager.UserManager.Users
            .AsNoTracking()
            .Where(x => x.UserName == User.Identity!.Name)
            .Select(x => x.ShippingAddress)
            .FirstOrDefaultAsync();

        if (address == null) return Ok(null);

        return Ok(new AddressDto
        {
            FullName = address.FullName,
            Line1 = address.Line1,
            Line2 = address.Line2,
            City = address.City,
            State = address.State,
            PostalCode = address.PostalCode,
            Country = address.Country,
            PhoneNumber = address.PhoneNumber
        });
    }

    // Remove [Authorize] here so even expired users can "log out" safely
    [HttpPost("logout")] 
    public async Task<ActionResult> Logout()
    {
        await signInManager.SignOutAsync();

        // Expire the CartId cookie
        Response.Cookies.Append(
            "CartId",
            "",
            new CookieOptions
            {
                Expires = DateTimeOffset.UtcNow.AddDays(-1),
                Path = "/",
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Lax
            }
        );

        return NoContent();
    }
}
