using AutoMapper;
using LibraryManagement.Core.DTOs.Request;
using LibraryManagement.Core.Enums;
using LibraryManagement.Core.Exceptions;
using LibraryManagement.Core.Interfaces.Repositories;
using LibraryManagement.Core.Interfaces.Services;
using LibraryManagement.Core.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LibraryManagement.Services.Services;

public class RequestService : IRequestService
{
    private readonly IBookRequestRepository _requestRepo;
    private readonly IUserRepository _userRepo;
    private readonly IMapper _mapper;

    public RequestService(
        IBookRequestRepository requestRepo,
        IUserRepository userRepo,
        IMapper mapper)
    {
        _requestRepo = requestRepo;
        _userRepo = userRepo;
        _mapper = mapper;
    }

    public async Task<RequestResponseDto> AddRequestAsync(int userId, AddRequestDto dto)
    {
        var user = await _userRepo.GetByIdAsync(userId)
            ?? throw new NotFoundException("User not found");

        var request = new BookRequest
        {
            UserId = userId,
            Title = dto.Title,
            Author = dto.Author,
            Genre = dto.Genre,
            Status = RequestStatus.Pending,
            RequestedAt = DateTime.UtcNow
        };

        await _requestRepo.AddAsync(request);
        await _requestRepo.SaveChangesAsync();

        return _mapper.Map<RequestResponseDto>(request);
    }

    public async Task<IEnumerable<RequestResponseDto>> GetAllRequestsAsync()
    {
        var requests = await _requestRepo.GetAllAsync();
        return _mapper.Map<IEnumerable<RequestResponseDto>>(requests);
    }

    public async Task<IEnumerable<RequestResponseDto>> GetRequestsByUserAsync(int userId)
    {
        var requests = await _requestRepo.GetRequestsByUserAsync(userId);
        return _mapper.Map<IEnumerable<RequestResponseDto>>(requests);
    }

    public async Task<RequestResponseDto> UpdateRequestStatusAsync(int id, UpdateRequestStatusDto dto)
    {
        var request = await _requestRepo.GetByIdAsync(id)
            ?? throw new NotFoundException("Request not found");

        request.Status = dto.Status;
        _requestRepo.Update(request);
        await _requestRepo.SaveChangesAsync();

        return _mapper.Map<RequestResponseDto>(request);
    }
}