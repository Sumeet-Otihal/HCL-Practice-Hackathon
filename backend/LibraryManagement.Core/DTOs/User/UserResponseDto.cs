using System;
using LibraryManagement.Core.Enums;

namespace LibraryManagement.Core.DTOs.User
{
    public class UserResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public Role Role { get; set; }
        public bool IsActive { get; set; }
        public string PhoneNo { get; set; } = string.Empty;
        public DateTime LibraryCardExpiry { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
