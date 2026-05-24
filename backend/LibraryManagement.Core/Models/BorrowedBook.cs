using System;

namespace LibraryManagement.Core.Models
{
    public class BorrowedBook
    {
        public int Id { get; set; }
        public int BookId { get; set; }
        public int UserId { get; set; }
        public DateTime IssuingDate { get; set; }
        public DateTime ReturnDate { get; set; }
        public bool IsReturned { get; set; }
        public string PhoneNo { get; set; } = string.Empty;

        // Navigation properties
        public virtual Book Book { get; set; } = null!;
        public virtual User User { get; set; } = null!;
    }
}
