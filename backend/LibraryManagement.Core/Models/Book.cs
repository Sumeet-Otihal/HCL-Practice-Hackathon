using System;
using System.Collections.Generic;

namespace LibraryManagement.Core.Models
{
    public class Book
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string AuthorName { get; set; } = string.Empty;
        public DateTime PublishedDate { get; set; }
        public int Volumes { get; set; }
        public decimal Price { get; set; }
        public int NoOfCopies { get; set; }
        public string Genre { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public bool IsAvailable { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        // Navigation properties
        public virtual ICollection<BorrowedBook> BorrowedBooks { get; set; } = new List<BorrowedBook>();
        public virtual ICollection<BookRequest> BookRequests { get; set; } = new List<BookRequest>();
    }
}
