using System;
using LibraryManagement.Core.Enums;

namespace LibraryManagement.Core.Models
{
    public class BookRequest
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public string Genre { get; set; } = string.Empty;
        public RequestStatus Status { get; set; }
        public DateTime RequestedAt { get; set; }

        // Navigation property
        public virtual User User { get; set; } = null!;
    }
}
