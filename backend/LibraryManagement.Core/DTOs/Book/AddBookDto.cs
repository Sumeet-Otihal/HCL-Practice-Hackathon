using System;

namespace LibraryManagement.Core.DTOs.Book
{
    public class AddBookDto
    {
        public string Title { get; set; } = string.Empty;
        public string AuthorName { get; set; } = string.Empty;
        public DateTime PublishedDate { get; set; }
        public int Volumes { get; set; }
        public decimal Price { get; set; }
        public int NoOfCopies { get; set; }
        public string Genre { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public bool IsAvailable { get; set; }
    }
}
