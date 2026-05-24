using LibraryManagement.Core.Models;

namespace LibraryManagement.Core.Interfaces.Services
{
    public interface IJwtTokenService
    {
        string GenerateToken(User user);
    }
}
