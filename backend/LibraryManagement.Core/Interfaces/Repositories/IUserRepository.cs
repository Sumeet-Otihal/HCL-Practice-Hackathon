using System.Collections.Generic;
using System.Threading.Tasks;
using LibraryManagement.Core.Enums;
using LibraryManagement.Core.Models;

namespace LibraryManagement.Core.Interfaces.Repositories
{
    public interface IUserRepository : IGenericRepository<User>
    {
        Task<User?> GetByEmailAsync(string email);
        Task<IEnumerable<User>> GetUsersByRoleAsync(Role role);
        Task<IEnumerable<User>> GetUsersWithExpiringCardsAsync(int days);
    }
}
