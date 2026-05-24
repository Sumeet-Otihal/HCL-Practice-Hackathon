using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using LibraryManagement.Core.Enums;
using LibraryManagement.Core.Interfaces.Repositories;
using LibraryManagement.Core.Models;

namespace LibraryManagement.API.Stubs.Infrastructure.Repositories
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        public UserRepository(LibraryDbContext context) : base(context)
        {
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());
        }

        public async Task<IEnumerable<User>> GetUsersByRoleAsync(Role role)
        {
            return await _context.Users.Where(u => u.Role == role).ToListAsync();
        }

        public async Task<IEnumerable<User>> GetUsersWithExpiringCardsAsync(int days)
        {
            var targetDate = DateTime.UtcNow.AddDays(days);
            return await _context.Users
                .Where(u => u.LibraryCardExpiry >= DateTime.UtcNow && u.LibraryCardExpiry <= targetDate)
                .ToListAsync();
        }
    }
}
