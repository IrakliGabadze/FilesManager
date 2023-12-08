using FilesManager.Server.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;

namespace FilesManager.Server.Services;

public class AuthService
{
    public async Task<AuthUserResponse?> SignInUserAsync(HttpContext httpContext, LoginRequest loginRequest)
    {
        //TODO in real scenario, check user in db and get roles
        if (loginRequest.Username != "Admin" && loginRequest.Password != "Admin")
            return null;

        var claims = new List<Claim>()
        {
            new(ClaimTypes.Name, loginRequest.Username),
            new(ClaimTypes.Role, "Administrator")
        };

        var roles = GetCurrentAuthUserRoles(claims);

        var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

        var authProperties = new AuthenticationProperties
        {
            IsPersistent = true
        };

        await httpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity), authProperties);

        return new AuthUserResponse(loginRequest.Username, roles);
    }

    public async Task<AuthUserResponse?> GetCurrentUserAsync(HttpContext httpContext)
    {
        if(httpContext.User.Identity?.IsAuthenticated != true)
        {
            await httpContext.SignOutAsync();

            return null;
        }

        return new AuthUserResponse(httpContext.User.Identity.Name!, GetCurrentAuthUserRoles(httpContext.User.Claims));
    }

    private static IEnumerable<string> GetCurrentAuthUserRoles(IEnumerable<Claim> claims) => claims .Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value);
}
