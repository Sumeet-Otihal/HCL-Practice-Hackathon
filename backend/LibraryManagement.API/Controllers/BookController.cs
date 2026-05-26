using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using LibraryManagement.Core.DTOs.Book;
using LibraryManagement.Core.Interfaces.Services;

namespace LibraryManagement.API.Controllers
{
    [ApiController]
    [Route("api/books")]
    public class BookController : ControllerBase
    {
        private readonly IBookService _bookService;

        public BookController(IBookService bookService)
        {
            _bookService = bookService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookSummaryDto>>> GetAll()
        {
            var books = await _bookService.GetAllBooksAsync();
            return Ok(books);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<BookResponseDto>> GetById(int id)
        {
            var book = await _bookService.GetBookByIdAsync(id);
            return Ok(book);
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<BookSummaryDto>>> Search([FromQuery] string q)
        {
            var books = await _bookService.SearchBooksAsync(q);
            return Ok(books);
        }

        [HttpPost]
        [Authorize(Roles = "Librarian")]
        public async Task<ActionResult<BookResponseDto>> Add([FromBody] AddBookDto addBookDto)
        {
            var response = await _bookService.AddBookAsync(addBookDto);
            return StatusCode(201, response);
        }

        [HttpPut("{id:int}")]
        [Authorize(Roles = "Librarian")]
        public async Task<ActionResult<BookResponseDto>> Update(int id, [FromBody] UpdateBookDto updateBookDto)
        {
            var response = await _bookService.UpdateBookAsync(id, updateBookDto);
            return Ok(response);
        }

        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Librarian")]
        public async Task<IActionResult> Delete(int id)
        {
            await _bookService.DeleteBookAsync(id);
            return NoContent();
        }
    }
}
