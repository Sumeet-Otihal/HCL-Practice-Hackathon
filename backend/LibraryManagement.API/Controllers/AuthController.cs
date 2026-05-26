using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using LibraryManagement.Core.DTOs.User;
using LibraryManagement.Core.Interfaces.Services;

namespace LibraryManagement.API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;

        public AuthController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterDto registerDto)
        {
            var response = await _userService.RegisterAsync(registerDto);
            return StatusCode(201, response);
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto loginDto)
        {
            var response = await _userService.LoginAsync(loginDto);
            return Ok(response);
        }
    }
}
