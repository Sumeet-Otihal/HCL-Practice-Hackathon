using System;
using System.Collections.Generic;
using LibraryManagement.Core.Enums;

namespace LibraryManagement.Core.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public Role Role { get; set; }
        public bool IsActive { get; set; }
        public string PhoneNo { get; set; } = string.Empty;
        public DateTime LibraryCardExpiry { get; set; }
        public string PreferredBooks { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        // Navigation properties
        public virtual ICollection<BorrowedBook> BorrowedBooks { get; set; } = new List<BorrowedBook>();
        public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
        public virtual ICollection<BookRequest> BookRequests { get; set; } = new List<BookRequest>();
    }
}
