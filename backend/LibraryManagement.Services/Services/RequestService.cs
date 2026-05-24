using AutoMapper;
using LibraryManagement.Core.DTOs;
using LibraryManagement.Core.Enums;
using LibraryManagement.Core.Exceptions;
using LibraryManagement.Core.Interfaces.Repositories;
using LibraryManagement.Core.Interfaces.Services;
using LibraryManagement.Core.Models;

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

    public async Task<RequestResponseDto> AddRequest(AddRequestDto dto, int userId)
    {
        _ = await _userRepo.GetById(userId)
            ?? throw new NotFoundException($"User with ID {userId} not found");

        var request = _mapper.Map<BookRequest>(dto);
        request.UserId = userId;   // always from JWT, never from request body

        await _requestRepo.Add(request);
        await _requestRepo.SaveChanges();
        return _mapper.Map<RequestResponseDto>(request);
    }

    public async Task<IEnumerable<RequestResponseDto>> GetAllRequests()
    {
        var requests = await _requestRepo.GetAll();
        return _mapper.Map<IEnumerable<RequestResponseDto>>(requests);
    }

    public async Task<RequestResponseDto> UpdateRequestStatus(
        int requestId, RequestStatus status)
    {
        // Librarians can only set Fulfilled or Rejected — never revert to Pending
        if (status == RequestStatus.Pending)
            throw new ConflictException("Status cannot be set back to Pending");

        var request = await _requestRepo.GetById(requestId)
            ?? throw new NotFoundException($"Request with ID {requestId} not found");

        request.Status = status;
        _requestRepo.Update(request);
        await _requestRepo.SaveChanges();
        return _mapper.Map<RequestResponseDto>(request);
    }

    public async Task<IEnumerable<RequestResponseDto>> GetRequestsByUser(int userId)
    {
        var requests = await _requestRepo.GetRequestsByUser(userId);
        return _mapper.Map<IEnumerable<RequestResponseDto>>(requests);
    }
}