using System.Collections.Generic;
using System.Threading.Tasks;
using LibraryManagement.Core.DTOs.User;

namespace LibraryManagement.Core.Interfaces.Services
{
    public interface IUserService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto);
        Task<AuthResponseDto> LoginAsync(LoginDto loginDto);
        Task<IEnumerable<UserResponseDto>> GetAllUsersAsync();
        Task<UserResponseDto> GetUserByIdAsync(int id);
        Task<UserResponseDto> UpdateUserAsync(int id, UpdateUserDto updateUserDto);
        Task<CardValidityResponseDto> CheckCardValidityAsync(int userId);
        Task<IEnumerable<UserResponseDto>> GetExpiringCardsAsync(int days);
    }
}
