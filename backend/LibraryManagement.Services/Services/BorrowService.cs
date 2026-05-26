using AutoMapper;
using LibraryManagement.Core.DTOs.Borrow;
using LibraryManagement.Core.Exceptions;
using LibraryManagement.Core.Interfaces.Repositories;
using LibraryManagement.Core.Interfaces.Services;
using LibraryManagement.Core.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LibraryManagement.Services.Services;

public class BorrowService : IBorrowService
{
    private readonly IBorrowRepository _borrowRepo;
    private readonly IBookRepository _bookRepo;
    private readonly IUserRepository _userRepo;
    private readonly IMapper _mapper;

    public BorrowService(
        IBorrowRepository borrowRepo,
        IBookRepository bookRepo,
        IUserRepository userRepo,
        IMapper mapper)
    {
        _borrowRepo = borrowRepo;
        _bookRepo = bookRepo;
        _userRepo = userRepo;
        _mapper = mapper;
    }

    public async Task<BorrowResponseDto> BorrowBookAsync(BorrowBookDto dto)
    {
        var book = await _bookRepo.GetByIdAsync(dto.BookId)
            ?? throw new NotFoundException("Book not found");

        if (!book.IsAvailable || book.NoOfCopies < 1)
            throw new ConflictException("Book is not available for borrowing");

        var user = await _userRepo.GetByIdAsync(dto.UserId)
            ?? throw new NotFoundException("User not found");

        if (user.LibraryCardExpiry < DateTime.UtcNow)
            throw new ConflictException("Library card has expired");

        var borrow = new BorrowedBook
        {
            BookId = dto.BookId,
            UserId = dto.UserId,
            IssuingDate = DateTime.UtcNow,
            ReturnDate = dto.ReturnDate,
            IsReturned = false,
            PhoneNo = dto.PhoneNo
        };

        book.NoOfCopies--;
        if (book.NoOfCopies == 0) book.IsAvailable = false;

        await _borrowRepo.AddAsync(borrow);
        _bookRepo.Update(book);
        await _borrowRepo.SaveChangesAsync();

        return _mapper.Map<BorrowResponseDto>(borrow);
    }

    public async Task<BorrowResponseDto> ReturnBookAsync(ReturnBookDto dto)
    {
        var borrow = await _borrowRepo.GetByIdAsync(dto.BorrowId)
            ?? throw new NotFoundException("Borrow record not found");

        if (borrow.IsReturned)
            throw new ConflictException("Book already returned");

        var book = await _bookRepo.GetByIdAsync(borrow.BookId)
            ?? throw new NotFoundException("Book not found");

        borrow.IsReturned = true;
        book.NoOfCopies++;
        book.IsAvailable = true;

        _borrowRepo.Update(borrow);
        _bookRepo.Update(book);
        await _borrowRepo.SaveChangesAsync();

        return _mapper.Map<BorrowResponseDto>(borrow);
    }

    public async Task<IEnumerable<BorrowResponseDto>> GetAllBorrowsAsync()
    {
        var borrows = await _borrowRepo.GetAllAsync();
        return _mapper.Map<IEnumerable<BorrowResponseDto>>(borrows);
    }

    public async Task<IEnumerable<BorrowResponseDto>> GetBorrowsByUserAsync(int userId)
    {
        var borrows = await _borrowRepo.GetBorrowsByUserAsync(userId);
        return _mapper.Map<IEnumerable<BorrowResponseDto>>(borrows);
    }

    public async Task<IEnumerable<BorrowResponseDto>> GetOverdueBorrowsAsync()
    {
        var borrows = await _borrowRepo.GetOverdueBorrowsAsync();
        return _mapper.Map<IEnumerable<BorrowResponseDto>>(borrows);
    }
}