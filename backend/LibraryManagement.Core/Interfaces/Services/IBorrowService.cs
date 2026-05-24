using System.Collections.Generic;
using System.Threading.Tasks;
using LibraryManagement.Core.DTOs.Borrow;

namespace LibraryManagement.Core.Interfaces.Services
{
    public interface IBorrowService
    {
        Task<BorrowResponseDto> BorrowBookAsync(BorrowBookDto borrowBookDto);
        Task<BorrowResponseDto> ReturnBookAsync(ReturnBookDto returnBookDto);
        Task<IEnumerable<BorrowResponseDto>> GetAllBorrowsAsync();
        Task<IEnumerable<BorrowResponseDto>> GetBorrowsByUserAsync(int userId);
        Task<IEnumerable<BorrowResponseDto>> GetOverdueBorrowsAsync();
    }
}
