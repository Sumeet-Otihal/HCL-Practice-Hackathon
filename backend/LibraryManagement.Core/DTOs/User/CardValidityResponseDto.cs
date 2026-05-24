using System;

namespace LibraryManagement.Core.DTOs.User
{
    public class CardValidityResponseDto
    {
        public int UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateTime LibraryCardExpiry { get; set; }
        public bool IsValid { get; set; }
        public int DaysRemaining { get; set; }
    }
}
