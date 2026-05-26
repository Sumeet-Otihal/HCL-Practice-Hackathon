using AutoMapper;
using BCrypt.Net;
using LibraryManagement.Core.DTOs.User;
using LibraryManagement.Core.Enums;
using LibraryManagement.Core.Exceptions;
using LibraryManagement.Core.Interfaces.Repositories;
using LibraryManagement.Core.Interfaces.Services;
using LibraryManagement.Core.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LibraryManagement.Services.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepo;
    private readonly IJwtTokenService _jwtService;
    private readonly IMapper _mapper;

    public UserService(
        IUserRepository userRepo,
        IJwtTokenService jwtService,
        IMapper mapper)
    {
        _userRepo = userRepo;
        _jwtService = jwtService;
        _mapper = mapper;
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        var user = await _userRepo.GetByEmailAsync(dto.Email)
            ?? throw new UnauthorizedException("Invalid email or password");

        if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            throw new UnauthorizedException("Invalid email or password");

        var token = _jwtService.GenerateToken(user);

        return new AuthResponseDto
        {
            Token = token,
            UserId = user.Id,
            Name = user.Name,
            Role = user.Role.ToString(),
            ExpiresAt = DateTime.UtcNow.AddDays(7) // Example matching JWT expiry
        };
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        var existing = await _userRepo.GetByEmailAsync(dto.Email);
        if (existing != null)
            throw new ConflictException("Email already registered");

        var user = _mapper.Map<User>(dto);
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
        user.Role = Role.Reader; // Default role
        user.IsActive = true;
        user.CreatedAt = DateTime.UtcNow;
        user.UpdatedAt = DateTime.UtcNow;

        await _userRepo.AddAsync(user);
        await _userRepo.SaveChangesAsync();

        var token = _jwtService.GenerateToken(user);

        return new AuthResponseDto
        {
            Token = token,
            UserId = user.Id,
            Name = user.Name,
            Role = user.Role.ToString(),
            ExpiresAt = DateTime.UtcNow.AddDays(7)
        };
    }

    public async Task<UserResponseDto> GetUserByIdAsync(int id)
    {
        var user = await _userRepo.GetByIdAsync(id)
            ?? throw new NotFoundException("User not found");
        return _mapper.Map<UserResponseDto>(user);
    }

    public async Task<IEnumerable<UserResponseDto>> GetAllUsersAsync()
    {
        var users = await _userRepo.GetAllAsync();
        return _mapper.Map<IEnumerable<UserResponseDto>>(users);
    }

    public async Task<CardValidityResponseDto> CheckCardValidityAsync(int userId)
    {
        var user = await _userRepo.GetByIdAsync(userId)
            ?? throw new NotFoundException("User not found");

        var today = DateTime.UtcNow;
        var remaining = (user.LibraryCardExpiry - today).Days;

        return new CardValidityResponseDto
        {
            UserId = userId,
            Name = user.Name,
            LibraryCardExpiry = user.LibraryCardExpiry,
            IsValid = user.LibraryCardExpiry > today,
            DaysRemaining = remaining
        };
    }

    public async Task<IEnumerable<UserResponseDto>> GetExpiringCardsAsync(int days)
    {
        var users = await _userRepo.GetUsersWithExpiringCardsAsync(days);
        return _mapper.Map<IEnumerable<UserResponseDto>>(users);
    }

    public async Task<UserResponseDto> UpdateUserAsync(int id, UpdateUserDto dto)
    {
        var user = await _userRepo.GetByIdAsync(id)
            ?? throw new NotFoundException("User not found");

        if (!string.IsNullOrEmpty(dto.Name)) user.Name = dto.Name;
        if (!string.IsNullOrEmpty(dto.PhoneNo)) user.PhoneNo = dto.PhoneNo;
        if (dto.LibraryCardExpiry != default) user.LibraryCardExpiry = dto.LibraryCardExpiry;

        user.UpdatedAt = DateTime.UtcNow;

        _userRepo.Update(user);
        await _userRepo.SaveChangesAsync();

        return _mapper.Map<UserResponseDto>(user);
    }
}