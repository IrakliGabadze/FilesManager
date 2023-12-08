using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using FilesManager.Server.Models;
using FilesManager.Server.Services;

namespace FilesManager.Server.Controllers;
[Route("[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("Login")]
    public Task<AuthUserResponse?> LoginAsync([FromBody] LoginRequest loginRequest) => _authService.SignInUserAsync(HttpContext, loginRequest);

    [HttpGet("GetCurrentUser")]
    public Task<AuthUserResponse?> GetCurrentUserAsync() => _authService.GetCurrentUserAsync(HttpContext);

    [HttpGet("Logout")]
    public Task Logout() => HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
}
