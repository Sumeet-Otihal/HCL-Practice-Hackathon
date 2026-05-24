using AutoMapper;
using LibraryManagement.Core.DTOs;
using LibraryManagement.Core.Exceptions;
using LibraryManagement.Core.Interfaces.Repositories;
using LibraryManagement.Core.Interfaces.Services;
using LibraryManagement.Core.Models;

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

    public async Task<PaymentResponseDto> AddPayment(AddPaymentDto dto)
    {
        _ = await _userRepo.GetById(dto.UserId)
            ?? throw new NotFoundException($"User with ID {dto.UserId} not found");

        var payment = _mapper.Map<Payment>(dto);
        await _paymentRepo.Add(payment);
        await _paymentRepo.SaveChanges();
        return _mapper.Map<PaymentResponseDto>(payment);
    }

    public async Task<IEnumerable<PaymentResponseDto>> GetPaymentsByUser(int userId)
    {
        _ = await _userRepo.GetById(userId)
            ?? throw new NotFoundException($"User with ID {userId} not found");

        var payments = await _paymentRepo.GetPaymentsByUser(userId);
        return _mapper.Map<IEnumerable<PaymentResponseDto>>(payments);
    }
}