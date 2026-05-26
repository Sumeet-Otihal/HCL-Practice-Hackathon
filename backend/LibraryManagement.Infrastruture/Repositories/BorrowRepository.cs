using LibraryManagement.Core.Interfaces.Repositories;
using LibraryManagement.Core.Models;
using LibraryManagement.Infrastruture.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LibraryManagement.Infrastruture.Repositories;

public class BorrowRepository : GenericRepository<BorrowedBook>, IBorrowRepository
{
    public BorrowRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<BorrowedBook>> GetBorrowsByUserAsync(int userId) =>
        await _context.BorrowedBooks
            .Where(b => b.UserId == userId)
            .ToListAsync();

    public async Task<IEnumerable<BorrowedBook>> GetActiveBorrowsAsync() =>
        await _context.BorrowedBooks
            .Where(b => !b.IsReturned)
            .ToListAsync();

    public async Task<IEnumerable<BorrowedBook>> GetOverdueBorrowsAsync() =>
        await _context.BorrowedBooks
            .Where(b => !b.IsReturned && b.ReturnDate < DateTime.UtcNow)
            .ToListAsync();

    public async Task<BorrowedBook?> GetActiveBorrowByBookIdAsync(int bookId) =>
        await _context.BorrowedBooks
            .FirstOrDefaultAsync(b => b.BookId == bookId && !b.IsReturned);
}