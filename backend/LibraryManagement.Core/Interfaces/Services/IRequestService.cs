using System.Collections.Generic;
using System.Threading.Tasks;
using LibraryManagement.Core.DTOs.Request;

namespace LibraryManagement.Core.Interfaces.Services
{
    public interface IRequestService
    {
        Task<RequestResponseDto> AddRequestAsync(int userId, AddRequestDto addRequestDto);
        Task<IEnumerable<RequestResponseDto>> GetAllRequestsAsync();
        Task<IEnumerable<RequestResponseDto>> GetRequestsByUserAsync(int userId);
        Task<RequestResponseDto> UpdateRequestStatusAsync(int id, UpdateRequestStatusDto dto);
    }
}
