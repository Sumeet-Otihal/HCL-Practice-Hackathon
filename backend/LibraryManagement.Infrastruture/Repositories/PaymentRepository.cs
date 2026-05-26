using LibraryManagement.Core.Interfaces.Repositories;
using LibraryManagement.Core.Models;
using LibraryManagement.Infrastruture.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LibraryManagement.Infrastruture.Repositories;

public class PaymentRepository : GenericRepository<Payment>, IPaymentRepository
{
    public PaymentRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<Payment>> GetPaymentsByUserAsync(int userId) =>
        await _context.Payments
            .Where(p => p.UserId == userId)
            .ToListAsync();
}