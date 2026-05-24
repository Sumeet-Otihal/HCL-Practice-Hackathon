namespace LibraryManagement.Core.DTOs.Book
{
    public class UpdateBookDto
    {
        public decimal Price { get; set; }
        public string Category { get; set; } = string.Empty;
        public bool IsAvailable { get; set; }
        public int NoOfCopies { get; set; }
    }
}
