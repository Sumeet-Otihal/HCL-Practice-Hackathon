using AutoMapper;
using LibraryManagement.Core.DTOs;
using LibraryManagement.Core.Exceptions;
using LibraryManagement.Core.Interfaces.Repositories;
using LibraryManagement.Core.Interfaces.Services;
using LibraryManagement.Core.Models;

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

    public async Task<BorrowResponseDto> BorrowBook(BorrowBookDto dto)
    {
        // 1. Validate book exists
        var book = await _bookRepo.GetById(dto.BookId)
            ?? throw new NotFoundException($"Book with ID {dto.BookId} not found");

        // 2. Validate availability
        if (!book.IsAvailable || book.NoOfCopies <= 0)
            throw new ConflictException("This book is currently unavailable");

        // 3. Validate user exists
        var user = await _userRepo.GetById(dto.UserId)
            ?? throw new NotFoundException($"User with ID {dto.UserId} not found");

        // 4. Validate library card
        if (user.LibraryCardExpiry <= DateTime.UtcNow)
            throw new CardExpiredException("Reader's library card has expired");

        // 5. Create borrow record
        var borrow = _mapper.Map<BorrowedBook>(dto);

        // 6. Decrement stock; mark unavailable if last copy
        book.NoOfCopies--;
        if (book.NoOfCopies == 0) book.IsAvailable = false;
        book.UpdatedAt = DateTime.UtcNow;

        _bookRepo.Update(book);
        await _borrowRepo.Add(borrow);
        await _borrowRepo.SaveChanges();

        // 7. Reload with navigation properties for the response
        var all = await _borrowRepo.GetBorrowedByUser(dto.UserId);
        var created = all.OrderByDescending(b => b.IssuingDate).First();
        return _mapper.Map<BorrowResponseDto>(created);
    }

    public async Task<BorrowResponseDto> ReturnBook(int borrowId)
    {
        var borrow = await _borrowRepo.GetById(borrowId)
            ?? throw new NotFoundException($"Borrow record with ID {borrowId} not found");

        if (borrow.IsReturned)
            throw new ConflictException("This book has already been returned");

        // Mark returned
        borrow.IsReturned = true;
        borrow.ReturnDate = DateTime.UtcNow;

        // Restore stock
        var book = await _bookRepo.GetById(borrow.BookId);
        if (book != null)
        {
            book.NoOfCopies++;
            book.IsAvailable = true;
            book.UpdatedAt = DateTime.UtcNow;
            _bookRepo.Update(book);
        }

        _borrowRepo.Update(borrow);
        await _borrowRepo.SaveChanges();

        // Reload with navigation properties for the response
        var all = await _borrowRepo.GetBorrowedByUser(borrow.UserId);
        var updated = all.First(b => b.Id == borrowId);
        return _mapper.Map<BorrowResponseDto>(updated);
    }

    public async Task<IEnumerable<BorrowResponseDto>> GetAllBorrows()
    {
        var borrows = await _borrowRepo.GetAllBorrowedBooks();
        return _mapper.Map<IEnumerable<BorrowResponseDto>>(borrows);
    }

    public async Task<IEnumerable<BorrowResponseDto>> GetBorrowsByUser(int userId)
    {
        var borrows = await _borrowRepo.GetBorrowedByUser(userId);
        return _mapper.Map<IEnumerable<BorrowResponseDto>>(borrows);
    }

    public async Task<IEnumerable<BorrowResponseDto>> GetOverdueBorrows()
    {
        var borrows = await _borrowRepo.GetOverdueBorrows();
        return _mapper.Map<IEnumerable<BorrowResponseDto>>(borrows);
    }
}