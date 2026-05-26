using LibraryManagement.Core.Enums;
using LibraryManagement.Core.Interfaces.Repositories;
using LibraryManagement.Core.Models;
using LibraryManagement.Infrastruture.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LibraryManagement.Infrastruture.Repositories;

public class BookRequestRepository : GenericRepository<BookRequest>, IBookRequestRepository
{
    public BookRequestRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<BookRequest>> GetRequestsByStatusAsync(RequestStatus status) =>
        await _context.BookRequests
            .Where(r => r.Status == status)
            .ToListAsync();

    public async Task<IEnumerable<BookRequest>> GetRequestsByUserAsync(int userId) =>
        await _context.BookRequests
            .Where(r => r.UserId == userId)
            .ToListAsync();
}