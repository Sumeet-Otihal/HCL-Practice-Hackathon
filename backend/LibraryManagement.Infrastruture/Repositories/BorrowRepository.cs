using LibraryManagement.Core.Interfaces.Repositories;
using LibraryManagement.Core.Models;
using LibraryManagement.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.Infrastructure.Repositories;

public class BorrowRepository : GenericRepository<BorrowedBook>, IBorrowRepository
{
    public BorrowRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<BorrowedBook>> GetAllBorrowedBooks() =>
        await _context.BorrowedBooks
            .Include(b => b.Book)
            .Include(b => b.User)
            .ToListAsync();

    public async Task<IEnumerable<BorrowedBook>> GetBorrowedByUser(int userId) =>
        await _context.BorrowedBooks
            .Include(b => b.Book)
            .Include(b => b.User)
            .Where(b => b.UserId == userId)
            .ToListAsync();

    public async Task<IEnumerable<BorrowedBook>> GetActiveBorrows() =>
        await _context.BorrowedBooks
            .Include(b => b.Book)
            .Include(b => b.User)
            .Where(b => !b.IsReturned)
            .ToListAsync();

    public async Task<IEnumerable<BorrowedBook>> GetOverdueBorrows() =>
        await _context.BorrowedBooks
            .Include(b => b.Book)
            .Include(b => b.User)
            .Where(b => !b.IsReturned && b.ReturnDate < DateTime.UtcNow)
            .ToListAsync();
}