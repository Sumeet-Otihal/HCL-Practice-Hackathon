using AutoMapper;
using LibraryManagement.Core.DTOs.Payment;
using LibraryManagement.Core.Exceptions;
using LibraryManagement.Core.Interfaces.Repositories;
using LibraryManagement.Core.Interfaces.Services;
using LibraryManagement.Core.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LibraryManagement.Services.Services;

public class PaymentService : IPaymentService
{
    private readonly IPaymentRepository _paymentRepo;
    private readonly IUserRepository _userRepo;
    private readonly IMapper _mapper;

    public PaymentService(
        IPaymentRepository paymentRepo,
        IUserRepository userRepo,
        IMapper mapper)
    {
        _paymentRepo = paymentRepo;
        _userRepo = userRepo;
        _mapper = mapper;
    }

    public async Task<PaymentResponseDto> AddPaymentAsync(AddPaymentDto dto)
    {
        var user = await _userRepo.GetByIdAsync(dto.UserId)
            ?? throw new NotFoundException("User not found");

        var payment = new Payment
        {
            UserId = dto.UserId,
            Amount = dto.Amount,
            PaymentDate = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _paymentRepo.AddAsync(payment);
        await _paymentRepo.SaveChangesAsync();

        return _mapper.Map<PaymentResponseDto>(payment);
    }

    public async Task<IEnumerable<PaymentResponseDto>> GetPaymentsByUserAsync(int userId)
    {
        var payments = await _paymentRepo.GetPaymentsByUserAsync(userId);
        return _mapper.Map<IEnumerable<PaymentResponseDto>>(payments);
    }
}