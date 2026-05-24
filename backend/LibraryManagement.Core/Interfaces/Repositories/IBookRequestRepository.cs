using System.Collections.Generic;
using System.Threading.Tasks;
using LibraryManagement.Core.Enums;
using LibraryManagement.Core.Models;

namespace LibraryManagement.Core.Interfaces.Repositories
{
    public interface IBookRequestRepository : IGenericRepository<BookRequest>
    {
        Task<IEnumerable<BookRequest>> GetRequestsByStatusAsync(RequestStatus status);
        Task<IEnumerable<BookRequest>> GetRequestsByUserAsync(int userId);
    }
}
