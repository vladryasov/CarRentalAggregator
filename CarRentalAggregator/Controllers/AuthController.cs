using CarRentalAggregator.Application.Interfaces;
using CarRentalAggregator.DTOs;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto request, CancellationToken cancellationToken)
    {
        try
        {
            var response = await _authService.LoginAsync(request, cancellationToken);

            var expires = request.RememberMe
                ? DateTime.UtcNow.AddDays(30)
                : (DateTime?)null;

            // Установка cookie (HTTP-only для безопасности)
            Response.Cookies.Append("JwtToken", response.Token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = expires
            });

            return Ok(new { message = "Login successful", userId = response.UserDto.Id, 
                role = response.UserDto.Role, token = response.Token });
        }
        catch (Exception ex)
        {
            if (ex.Message.Contains("Invalid email or password"))
                return Unauthorized(new { message = ex.Message });
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] LoginDto request, CancellationToken cancellationToken)
    {
        try
        {
            var response = await _authService.RegisterAsync(request, cancellationToken);

            var expires = request.RememberMe
                ? DateTime.UtcNow.AddDays(30)
                : (DateTime?)null;

            // Установка cookie (как при логине)
            Response.Cookies.Append("JwtToken", response.Token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = expires
            });

            return Ok(new { message = "Registration successful", userId = response.UserDto.Id, 
                role = response.UserDto.Role, token = response.Token });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("auto-login")]
    public async Task<IActionResult> AutoLogin(CancellationToken cancellationToken)
    {
        try
        {
            var jwt = Request.Cookies["JwtToken"];
            var userDto = await _authService.AutoLoginAsync(jwt, cancellationToken);
            return Ok(userDto);
        }
        catch (Exception ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }


    [HttpPost("logout")]
    public IActionResult Logout()
    {
        // Удаляем куку с токеном
        Response.Cookies.Delete("JwtToken", new CookieOptions
        {
            HttpOnly = true,
            SameSite = SameSiteMode.None,
            Secure = true
        });

        return Ok(new { message = "Logout successful" });
    }

}