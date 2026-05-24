using System;

namespace LibraryManagement.Core.DTOs.Payment
{
    public class PaymentResponseDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public DateTime PaymentDate { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
