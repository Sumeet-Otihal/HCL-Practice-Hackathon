using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using LibraryManagement.Core.DTOs.Request;
using LibraryManagement.Core.Enums;
using LibraryManagement.Core.Exceptions;
using LibraryManagement.Core.Interfaces.Repositories;
using LibraryManagement.Core.Interfaces.Services;
using LibraryManagement.Core.Models;

namespace LibraryManagement.API.Stubs.Services
{
    public class RequestService : IRequestService
    {
        private readonly IBookRequestRepository _requestRepository;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public RequestService(
            IBookRequestRepository requestRepository,
            IUserRepository userRepository,
            IMapper mapper)
        {
            _requestRepository = requestRepository;
            _userRepository = userRepository;
            _mapper = mapper;
        }

        public async Task<RequestResponseDto> AddRequestAsync(int userId, AddRequestDto addRequestDto)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                throw new NotFoundException($"User with ID {userId} was not found.");

            var request = _mapper.Map<BookRequest>(addRequestDto);
            request.UserId = userId;
            request.Status = RequestStatus.Pending;
            request.RequestedAt = DateTime.UtcNow;

            await _requestRepository.AddAsync(request);
            await _requestRepository.SaveChangesAsync();

            request.User = user;

            return _mapper.Map<RequestResponseDto>(request);
        }

        public async Task<IEnumerable<RequestResponseDto>> GetAllRequestsAsync()
        {
            var requests = await _requestRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<RequestResponseDto>>(requests);
        }

        public async Task<IEnumerable<RequestResponseDto>> GetRequestsByUserAsync(int userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                throw new NotFoundException($"User with ID {userId} was not found.");

            var requests = await _requestRepository.GetRequestsByUserAsync(userId);
            return _mapper.Map<IEnumerable<RequestResponseDto>>(requests);
        }

        public async Task<RequestResponseDto> UpdateRequestStatusAsync(int id, UpdateRequestStatusDto dto)
        {
            var request = await _requestRepository.GetByIdAsync(id);
            if (request == null)
                throw new NotFoundException($"Book request with ID {id} was not found.");

            request.Status = dto.Status;

            _requestRepository.Update(request);
            await _requestRepository.SaveChangesAsync();

            return _mapper.Map<RequestResponseDto>(request);
        }
    }
}
