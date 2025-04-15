using AuthService.Data;
using AuthService.DTOs;
using AuthService.Models;
using AuthService.Services;
using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AuthService.Controllers;

[ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly JwtService _jwt;

    public AuthController(AppDbContext db, JwtService jwt)
    {
        _db = db;
        _jwt = jwt;
    }

    [HttpPost("register")]
public IActionResult Register(RegisterDto dto)
{
     if (!ModelState.IsValid)
        return BadRequest(ModelState);

    try
    {
        if (_db.Users.Any(u => u.Username == dto.Username))
            return Conflict(new { message = "Username already exists" });

        if (_db.Users.Any(u => u.Email == dto.Email))
            return Conflict(new { message = "Email already exists" });

        var user = new User
        {
            Username = dto.Username,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
        };

        _db.Users.Add(user);
        _db.SaveChanges();

        return Ok(new { message = "User created" });
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { message = "Unexpected error occurred", detail = ex.Message });
    }
}

    [HttpPost("login")]
    public IActionResult Login(LoginDto dto)
    {
         if (!ModelState.IsValid)
        return BadRequest(ModelState);
        
        var user = _db.Users.FirstOrDefault(u => u.Username == dto.Username);
        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return Unauthorized(new { message = "Invalid credentials" });

        var token = _jwt.Generate(user);
        return Ok(new { token });
    }

    [Authorize]
    [HttpGet("me")]
    public IActionResult Me()
    {
        return Ok(new { user = User.Identity?.Name });
    }
}
