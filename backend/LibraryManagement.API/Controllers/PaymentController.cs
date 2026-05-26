using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using LibraryManagement.Core.DTOs.Payment;
using LibraryManagement.Core.Exceptions;
using LibraryManagement.Core.Interfaces.Services;

namespace LibraryManagement.API.Controllers
{
    [ApiController]
    [Route("api/payments")]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpGet("user/{userId:int}")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<PaymentResponseDto>>> GetByUserId(int userId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            var roleClaim = User.FindFirst(ClaimTypes.Role);

            if (userIdClaim == null || roleClaim == null)
                throw new UnauthorizedException("Unauthorized access.");

            var currentUserId = int.Parse(userIdClaim.Value);
            var isLibrarian = roleClaim.Value == "Librarian";

            if (!isLibrarian && currentUserId != userId)
                throw new UnauthorizedException("You are not authorized to view another user's payment records.");

            var payments = await _paymentService.GetPaymentsByUserAsync(userId);
            return Ok(payments);
        }

        [HttpPost]
        [Authorize(Roles = "Librarian")]
        public async Task<ActionResult<PaymentResponseDto>> Add([FromBody] AddPaymentDto addPaymentDto)
        {
            var response = await _paymentService.AddPaymentAsync(addPaymentDto);
            return StatusCode(201, response);
        }
    }
}
