using LibraryManagement.Core.Interfaces.Repositories;
using LibraryManagement.Core.Models;
using LibraryManagement.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.Infrastructure.Repositories;

public class BookRepository : GenericRepository<Book>, IBookRepository
{
    public BookRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<Book>> GetAvailableBooks() =>
        await _context.Books
            .Where(b => b.IsAvailable && b.NoOfCopies > 0)
            .ToListAsync();

    public async Task<IEnumerable<Book>> GetBooksByCategory(string category) =>
        await _context.Books
            .Where(b => b.Category.ToLower() == category.ToLower())
            .ToListAsync();

    public async Task<IEnumerable<Book>> GetBooksByGenre(string genre) =>
        await _context.Books
            .Where(b => b.Genre.ToLower() == genre.ToLower())
            .ToListAsync();

    public async Task<IEnumerable<Book>> SearchBooks(string query)
    {
        var q = query.ToLower();
        return await _context.Books
            .Where(b => b.Title.ToLower().Contains(q)
                     || b.AuthorName.ToLower().Contains(q))
            .ToListAsync();
    }
}