using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using LibraryManagement.Core.DTOs.User;
using LibraryManagement.Core.Exceptions;
using LibraryManagement.Core.Interfaces.Services;

namespace LibraryManagement.API.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        [Authorize(Roles = "Librarian")]
        public async Task<ActionResult<IEnumerable<UserResponseDto>>> GetAll()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpGet("{id:int}")]
        [Authorize]
        public async Task<ActionResult<UserResponseDto>> GetById(int id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            var roleClaim = User.FindFirst(ClaimTypes.Role);

            if (userIdClaim == null || roleClaim == null)
                throw new UnauthorizedException("Unauthorized access.");

            var currentUserId = int.Parse(userIdClaim.Value);
            var isLibrarian = roleClaim.Value == "Librarian";

            if (!isLibrarian && currentUserId != id)
                throw new UnauthorizedException("You are not authorized to view another user's profile.");

            var user = await _userService.GetUserByIdAsync(id);
            return Ok(user);
        }

        [HttpGet("{id:int}/validity")]
        [Authorize]
        public async Task<ActionResult<CardValidityResponseDto>> GetValidity(int id)
        {
            var validity = await _userService.CheckCardValidityAsync(id);
            return Ok(validity);
        }

        [HttpGet("expiring-soon")]
        [Authorize(Roles = "Librarian")]
        public async Task<ActionResult<IEnumerable<UserResponseDto>>> GetExpiringSoon()
        {
            var users = await _userService.GetExpiringCardsAsync(7);
            return Ok(users);
        }

        [HttpPut("{id:int}")]
        [Authorize]
        public async Task<ActionResult<UserResponseDto>> Update(int id, [FromBody] UpdateUserDto updateUserDto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            var roleClaim = User.FindFirst(ClaimTypes.Role);

            if (userIdClaim == null || roleClaim == null)
                throw new UnauthorizedException("Unauthorized access.");

            var currentUserId = int.Parse(userIdClaim.Value);
            var isLibrarian = roleClaim.Value == "Librarian";

            if (!isLibrarian && currentUserId != id)
                throw new UnauthorizedException("You are not authorized to update another user's profile.");

            var response = await _userService.UpdateUserAsync(id, updateUserDto);
            return Ok(response);
        }
    }
}
