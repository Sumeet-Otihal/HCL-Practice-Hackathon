using LibraryManagement.Core.Enums;
using LibraryManagement.Core.Interfaces.Repositories;
using LibraryManagement.Core.Models;
using LibraryManagement.Infrastruture.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LibraryManagement.Infrastruture.Repositories;

public class UserRepository : GenericRepository<User>, IUserRepository
{
    public UserRepository(AppDbContext context) : base(context) { }

    public async Task<User?> GetByEmailAsync(string email) =>
        await _context.Users
            .FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());

    public async Task<IEnumerable<User>> GetUsersByRoleAsync(Role role) =>
        await _context.Users
            .Where(u => u.Role == role)
            .ToListAsync();

    public async Task<IEnumerable<User>> GetUsersWithExpiringCardsAsync(int days)
    {
        var targetDate = DateTime.UtcNow.AddDays(days);
        return await _context.Users
            .Where(u => u.Role == Role.Reader && u.LibraryCardExpiry <= targetDate && u.LibraryCardExpiry > DateTime.UtcNow)
            .ToListAsync();
    }
}