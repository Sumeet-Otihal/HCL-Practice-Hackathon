using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using LibraryManagement.Core.DTOs.Borrow;
using LibraryManagement.Core.Exceptions;
using LibraryManagement.Core.Interfaces.Services;

namespace LibraryManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BorrowController : ControllerBase
    {
        private readonly IBorrowService _borrowService;

        public BorrowController(IBorrowService borrowService)
        {
            _borrowService = borrowService;
        }

        [HttpGet]
        [Authorize(Roles = "Librarian")]
        public async Task<ActionResult<IEnumerable<BorrowResponseDto>>> GetAll()
        {
            var borrows = await _borrowService.GetAllBorrowsAsync();
            return Ok(borrows);
        }

        [HttpGet("overdue")]
        [Authorize(Roles = "Librarian")]
        public async Task<ActionResult<IEnumerable<BorrowResponseDto>>> GetOverdue()
        {
            var borrows = await _borrowService.GetOverdueBorrowsAsync();
            return Ok(borrows);
        }

        [HttpGet("my-borrows")]
        [Authorize(Roles = "Reader")]
        public async Task<ActionResult<IEnumerable<BorrowResponseDto>>> GetMyBorrows()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
                throw new UnauthorizedException("Invalid or missing user ID in token.");

            var borrows = await _borrowService.GetBorrowsByUserAsync(userId);
            return Ok(borrows);
        }

        [HttpPost]
        [Authorize(Roles = "Librarian")]
        public async Task<ActionResult<BorrowResponseDto>> Borrow([FromBody] BorrowBookDto borrowBookDto)
        {
            var response = await _borrowService.BorrowBookAsync(borrowBookDto);
            return StatusCode(201, response);
        }

        [HttpPut("{id:int}/return")]
        [Authorize(Roles = "Librarian")]
        public async Task<ActionResult<BorrowResponseDto>> ReturnBook(int id)
        {
            var returnBookDto = new ReturnBookDto { BorrowId = id };
            var response = await _borrowService.ReturnBookAsync(returnBookDto);
            return Ok(response);
        }
    }
}
