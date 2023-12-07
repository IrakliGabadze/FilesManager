using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using FilesManager.Server.Models;
using FilesManager.Server.Services;

namespace FilesManager.Server.Controllers;
[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("Login")]
    public async Task<IActionResult> LoginAsync([FromBody] LoginRequest loginRequest)
    {
        var authUserResponse = await _authService.SignInUserAsync(HttpContext, loginRequest);

        return Ok(authUserResponse);
    }

    [HttpGet("GetCurrentUser")]
    public async Task<IActionResult> GetCurrentUserAsync()
    {
        var authUserResponse = await _authService.GetCurrentUserAsync(HttpContext);

        return Ok(authUserResponse);
    }

    [HttpPost("Logout")]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

        return Ok();
    }
}
