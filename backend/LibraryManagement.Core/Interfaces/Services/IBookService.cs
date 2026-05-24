using System.Collections.Generic;
using System.Threading.Tasks;
using LibraryManagement.Core.DTOs.Book;

namespace LibraryManagement.Core.Interfaces.Services
{
    public interface IBookService
    {
        Task<IEnumerable<BookSummaryDto>> GetAllBooksAsync();
        Task<BookResponseDto> GetBookByIdAsync(int id);
        Task<IEnumerable<BookSummaryDto>> SearchBooksAsync(string q);
        Task<BookResponseDto> AddBookAsync(AddBookDto addBookDto);
        Task<BookResponseDto> UpdateBookAsync(int id, UpdateBookDto updateBookDto);
        Task DeleteBookAsync(int id);
    }
}
