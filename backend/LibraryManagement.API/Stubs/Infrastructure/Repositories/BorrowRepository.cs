using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using LibraryManagement.Core.Interfaces.Repositories;
using LibraryManagement.Core.Models;

namespace LibraryManagement.API.Stubs.Infrastructure.Repositories
{
    public class BorrowRepository : GenericRepository<BorrowedBook>, IBorrowRepository
    {
        public BorrowRepository(LibraryDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<BorrowedBook>> GetBorrowsByUserAsync(int userId)
        {
            return await _context.BorrowedBooks
                .Include(b => b.Book)
                .Include(b => b.User)
                .Where(b => b.UserId == userId)
                .ToListAsync();
        }

        public async Task<IEnumerable<BorrowedBook>> GetActiveBorrowsAsync()
        {
            return await _context.BorrowedBooks
                .Include(b => b.Book)
                .Include(b => b.User)
                .Where(b => !b.IsReturned)
                .ToListAsync();
        }

        public async Task<IEnumerable<BorrowedBook>> GetOverdueBorrowsAsync()
        {
            return await _context.BorrowedBooks
                .Include(b => b.Book)
                .Include(b => b.User)
                .Where(b => !b.IsReturned && b.ReturnDate < DateTime.UtcNow)
                .ToListAsync();
        }

        public async Task<BorrowedBook?> GetActiveBorrowByBookIdAsync(int bookId)
        {
            return await _context.BorrowedBooks
                .FirstOrDefaultAsync(b => b.BookId == bookId && !b.IsReturned);
        }
    }
}
