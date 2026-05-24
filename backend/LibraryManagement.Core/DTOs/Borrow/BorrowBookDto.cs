using System;

namespace LibraryManagement.Core.DTOs.Borrow
{
    public class BorrowBookDto
    {
        public int BookId { get; set; }
        public int UserId { get; set; }
        public DateTime ReturnDate { get; set; }
        public string PhoneNo { get; set; } = string.Empty;
    }
}
