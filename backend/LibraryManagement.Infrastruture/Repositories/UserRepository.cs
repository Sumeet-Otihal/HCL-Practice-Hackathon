using LibraryManagement.Core.Enums;
using LibraryManagement.Core.Exceptions;
using LibraryManagement.Core.Interfaces.Repositories;
using LibraryManagement.Core.Models;
using LibraryManagement.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.Infrastructure.Repositories;

public class UserRepository : GenericRepository<User>, IUserRepository
{
    public UserRepository(AppDbContext context) : base(context) { }

    public async Task<User?> GetByEmail(string email) =>
        await _context.Users
            .FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());

    public async Task<IEnumerable<User>> GetUsersByRole(UserRole role) =>
        await _context.Users
            .Where(u => u.Role == role)
            .ToListAsync();

    public async Task<bool> CheckCardValidity(int userId)
    {
        var user = await _context.Users.FindAsync(userId)
            ?? throw new NotFoundException("User not found");
        return user.LibraryCardExpiry > DateTime.UtcNow;
    }
}