using System.Collections.Generic;
using System.Threading.Tasks;
using LibraryManagement.Core.Models;

namespace LibraryManagement.Core.Interfaces.Repositories
{
    public interface IBorrowRepository : IGenericRepository<BorrowedBook>
    {
        Task<IEnumerable<BorrowedBook>> GetBorrowsByUserAsync(int userId);
        Task<IEnumerable<BorrowedBook>> GetActiveBorrowsAsync();
        Task<IEnumerable<BorrowedBook>> GetOverdueBorrowsAsync();
        Task<BorrowedBook?> GetActiveBorrowByBookIdAsync(int bookId);
    }
}
