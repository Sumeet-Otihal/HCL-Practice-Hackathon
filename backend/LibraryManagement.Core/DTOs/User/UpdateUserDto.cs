using System;

namespace LibraryManagement.Core.DTOs.User
{
    public class UpdateUserDto
    {
        public string Name { get; set; } = string.Empty;
        public string PhoneNo { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime LibraryCardExpiry { get; set; }
    }
}
