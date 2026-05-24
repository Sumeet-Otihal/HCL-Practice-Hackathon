using System;

namespace LibraryManagement.Core.Models
{
    public class Payment
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public DateTime PaymentDate { get; set; }
        public DateTime UpdatedAt { get; set; }

        // Navigation property
        public virtual User User { get; set; } = null!;
    }
}
