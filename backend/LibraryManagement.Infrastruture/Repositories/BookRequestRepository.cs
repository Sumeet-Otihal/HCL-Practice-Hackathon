using LibraryManagement.Core.Enums;
using LibraryManagement.Core.Interfaces.Repositories;
using LibraryManagement.Core.Models;
using LibraryManagement.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.Infrastructure.Repositories;

public class BookRequestRepository : GenericRepository<BookRequest>, IBookRequestRepository
{
    public BookRequestRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<BookRequest>> GetRequestsByStatus(RequestStatus status) =>
        await _context.BookRequests
            .Include(r => r.User)
            .Where(r => r.Status == status)
            .ToListAsync();

    public async Task<IEnumerable<BookRequest>> GetRequestsByUser(int userId) =>
        await _context.BookRequests
            .Where(r => r.UserId == userId)
            .ToListAsync();
}