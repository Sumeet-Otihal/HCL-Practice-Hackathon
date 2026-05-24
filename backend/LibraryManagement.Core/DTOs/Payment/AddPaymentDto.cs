using System;

namespace LibraryManagement.Core.DTOs.Payment
{
    public class AddPaymentDto
    {
        public int UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public DateTime PaymentDate { get; set; }
    }
}
