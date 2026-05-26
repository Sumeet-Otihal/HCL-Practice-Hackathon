using LibraryManagement.Core.Interfaces.Repositories;
using LibraryManagement.Core.Models;
using LibraryManagement.Infrastruture.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LibraryManagement.Infrastruture.Repositories;

public class BookRepository : GenericRepository<Book>, IBookRepository
{
    public BookRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<Book>> GetAvailableBooksAsync() =>
        await _context.Books
            .Where(b => b.IsAvailable && b.NoOfCopies > 0)
            .ToListAsync();

    public async Task<IEnumerable<Book>> GetBooksByCategoryAsync(string category) =>
        await _context.Books
            .Where(b => b.Category.ToLower() == category.ToLower())
            .ToListAsync();

    public async Task<IEnumerable<Book>> GetBooksByGenreAsync(string genre) =>
        await _context.Books
            .Where(b => b.Genre.ToLower() == genre.ToLower())
            .ToListAsync();

    public async Task<IEnumerable<Book>> SearchBooksAsync(string query)
    {
        var q = query.ToLower();
        return await _context.Books
            .Where(b => b.Title.ToLower().Contains(q)
                     || b.AuthorName.ToLower().Contains(q)
                     || b.Genre.ToLower().Contains(q)
                     || b.Category.ToLower().Contains(q))
            .ToListAsync();
    }
}