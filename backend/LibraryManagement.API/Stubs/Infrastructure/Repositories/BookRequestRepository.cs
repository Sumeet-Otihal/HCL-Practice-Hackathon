using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using LibraryManagement.Core.Enums;
using LibraryManagement.Core.Interfaces.Repositories;
using LibraryManagement.Core.Models;

namespace LibraryManagement.API.Stubs.Infrastructure.Repositories
{
    public class BookRequestRepository : GenericRepository<BookRequest>, IBookRequestRepository
    {
        public BookRequestRepository(LibraryDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<BookRequest>> GetRequestsByStatusAsync(RequestStatus status)
        {
            return await _context.BookRequests
                .Where(r => r.Status == status)
                .ToListAsync();
        }

        public async Task<IEnumerable<BookRequest>> GetRequestsByUserAsync(int userId)
        {
            return await _context.BookRequests
                .Where(r => r.UserId == userId)
                .ToListAsync();
        }
    }
}
