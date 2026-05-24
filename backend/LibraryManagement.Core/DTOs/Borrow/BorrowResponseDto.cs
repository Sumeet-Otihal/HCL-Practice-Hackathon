using System;

namespace LibraryManagement.Core.DTOs.Borrow
{
    public class BorrowResponseDto
    {
        public int Id { get; set; }
        public int BookId { get; set; }
        public string BookTitle { get; set; } = string.Empty;
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public DateTime IssuingDate { get; set; }
        public DateTime ReturnDate { get; set; }
        public bool IsReturned { get; set; }
        public string PhoneNo { get; set; } = string.Empty;
    }
}
