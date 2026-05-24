using System;
using LibraryManagement.Core.Enums;

namespace LibraryManagement.Core.DTOs.User
{
    public class RegisterDto
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public Role Role { get; set; }
        public string PhoneNo { get; set; } = string.Empty;
        public DateTime LibraryCardExpiry { get; set; }
    }
}
