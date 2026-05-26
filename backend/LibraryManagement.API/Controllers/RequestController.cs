using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using LibraryManagement.Core.DTOs.Request;
using LibraryManagement.Core.Exceptions;
using LibraryManagement.Core.Interfaces.Services;

namespace LibraryManagement.API.Controllers
{
    [ApiController]
    [Route("api/requests")]
    public class RequestController : ControllerBase
    {
        private readonly IRequestService _requestService;

        public RequestController(IRequestService requestService)
        {
            _requestService = requestService;
        }

        [HttpGet]
        [Authorize(Roles = "Librarian")]
        public async Task<ActionResult<IEnumerable<RequestResponseDto>>> GetAll()
        {
            var requests = await _requestService.GetAllRequestsAsync();
            return Ok(requests);
        }

        [HttpGet("my-requests")]
        [Authorize(Roles = "Reader")]
        public async Task<ActionResult<IEnumerable<RequestResponseDto>>> GetMyRequests()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
                throw new UnauthorizedException("Invalid or missing user ID in token.");

            var requests = await _requestService.GetRequestsByUserAsync(userId);
            return Ok(requests);
        }

        [HttpPost]
        [Authorize(Roles = "Reader")]
        public async Task<ActionResult<RequestResponseDto>> Create([FromBody] AddRequestDto addRequestDto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
                throw new UnauthorizedException("Invalid or missing user ID in token.");

            var response = await _requestService.AddRequestAsync(userId, addRequestDto);
            return StatusCode(201, response);
        }

        [HttpPut("{id:int}/status")]
        [Authorize(Roles = "Librarian")]
        public async Task<ActionResult<RequestResponseDto>> UpdateStatus(int id, [FromBody] UpdateRequestStatusDto dto)
        {
            var response = await _requestService.UpdateRequestStatusAsync(id, dto);
            return Ok(response);
        }
    }
}
