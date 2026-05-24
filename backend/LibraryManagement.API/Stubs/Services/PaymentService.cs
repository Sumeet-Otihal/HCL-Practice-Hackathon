using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using LibraryManagement.Core.DTOs.Payment;
using LibraryManagement.Core.Exceptions;
using LibraryManagement.Core.Interfaces.Repositories;
using LibraryManagement.Core.Interfaces.Services;
using LibraryManagement.Core.Models;

namespace LibraryManagement.API.Stubs.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IPaymentRepository _paymentRepository;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public PaymentService(
            IPaymentRepository paymentRepository,
            IUserRepository userRepository,
            IMapper mapper)
        {
            _paymentRepository = paymentRepository;
            _userRepository = userRepository;
            _mapper = mapper;
        }

        public async Task<PaymentResponseDto> AddPaymentAsync(AddPaymentDto addPaymentDto)
        {
            var user = await _userRepository.GetByIdAsync(addPaymentDto.UserId);
            if (user == null)
                throw new NotFoundException($"User with ID {addPaymentDto.UserId} was not found.");

            var payment = _mapper.Map<Payment>(addPaymentDto);
            payment.UpdatedAt = DateTime.UtcNow;

            await _paymentRepository.AddAsync(payment);
            await _paymentRepository.SaveChangesAsync();

            payment.User = user;

            return _mapper.Map<PaymentResponseDto>(payment);
        }

        public async Task<IEnumerable<PaymentResponseDto>> GetPaymentsByUserAsync(int userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                throw new NotFoundException($"User with ID {userId} was not found.");

            var payments = await _paymentRepository.GetPaymentsByUserAsync(userId);
            return _mapper.Map<IEnumerable<PaymentResponseDto>>(payments);
        }
    }
}
