using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using LibraryManagement.Core.Interfaces.Repositories;
using LibraryManagement.Core.Models;

namespace LibraryManagement.API.Stubs.Infrastructure.Repositories
{
    public class BookRepository : GenericRepository<Book>, IBookRepository
    {
        public BookRepository(LibraryDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Book>> GetAvailableBooksAsync()
        {
            return await _context.Books.Where(b => b.IsAvailable && b.NoOfCopies > 0).ToListAsync();
        }

        public async Task<IEnumerable<Book>> GetBooksByCategoryAsync(string category)
        {
            return await _context.Books.Where(b => b.Category.ToLower() == category.ToLower()).ToListAsync();
        }

        public async Task<IEnumerable<Book>> GetBooksByGenreAsync(string genre)
        {
            return await _context.Books.Where(b => b.Genre.ToLower() == genre.ToLower()).ToListAsync();
        }

        public async Task<IEnumerable<Book>> SearchBooksAsync(string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
                return await GetAllAsync();

            var term = searchTerm.ToLower();
            return await _context.Books
                .Where(b => b.Title.ToLower().Contains(term) || b.AuthorName.ToLower().Contains(term))
                .ToListAsync();
        }
    }
}
