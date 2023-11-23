using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;

using System.Security.Claims;

using Uni.Authentication;
using Uni.Database;
using Uni.Models.Database;

namespace Uni.Pages.Account;

public class LoginModel(
    UniContext uniContext
    ) : PageModel
{
    public bool WrongCredentials { get; set; }

    public async Task<IActionResult> OnPost(string username, string password, bool remember = false, [FromQuery] string? returnUrl = null)
    {
        User? user = await uniContext.Users.FirstOrDefaultAsync(x => x.Login == username);

        if (user is null)
        {
            WrongCredentials = true;
            return Page();
        }

        if (!BCrypt.Net.BCrypt.EnhancedVerify(password, user.PasswordHash))
        {
            WrongCredentials = true;
            return Page();
        }

        List<Claim> claims =
        [
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Login),
            new Claim(ClaimTypes.Role, RoleNames.Admin)
        ];

        ClaimsIdentity identity = new(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        ClaimsPrincipal claimsPrincipal = new(identity);

        await HttpContext.SignInAsync(claimsPrincipal, new AuthenticationProperties
        {
            IsPersistent = remember
        });

        return RedirectToPage(returnUrl ?? "/Index");
    }
}