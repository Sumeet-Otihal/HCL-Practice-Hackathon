using System.Collections.Generic;
using System.Threading.Tasks;
using LibraryManagement.Core.DTOs.Payment;

namespace LibraryManagement.Core.Interfaces.Services
{
    public interface IPaymentService
    {
        Task<PaymentResponseDto> AddPaymentAsync(AddPaymentDto addPaymentDto);
        Task<IEnumerable<PaymentResponseDto>> GetPaymentsByUserAsync(int userId);
    }
}
