using AutoMapper;
using LibraryManagement.Core.DTOs.Book;
using LibraryManagement.Core.Exceptions;
using LibraryManagement.Core.Interfaces.Repositories;
using LibraryManagement.Core.Interfaces.Services;
using LibraryManagement.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LibraryManagement.Services.Services;

public class BookService : IBookService
{
    private readonly IBookRepository _bookRepo;
    private readonly IBorrowRepository _borrowRepo;
    private readonly IMapper _mapper;

    public BookService(
        IBookRepository bookRepo,
        IBorrowRepository borrowRepo,
        IMapper mapper)
    {
        _bookRepo = bookRepo;
        _borrowRepo = borrowRepo;
        _mapper = mapper;
    }

    public async Task<IEnumerable<BookSummaryDto>> GetAllBooksAsync()
    {
        var books = await _bookRepo.GetAllAsync();
        return _mapper.Map<IEnumerable<BookSummaryDto>>(books);
    }

    public async Task<BookResponseDto> GetBookByIdAsync(int id)
    {
        var book = await _bookRepo.GetByIdAsync(id)
            ?? throw new NotFoundException($"Book with ID {id} not found");
        return _mapper.Map<BookResponseDto>(book);
    }

    public async Task<BookResponseDto> AddBookAsync(AddBookDto dto)
    {
        var book = _mapper.Map<Book>(dto);
        await _bookRepo.AddAsync(book);
        await _bookRepo.SaveChangesAsync();
        return _mapper.Map<BookResponseDto>(book);
    }

    public async Task<BookResponseDto> UpdateBookAsync(int id, UpdateBookDto dto)
    {
        var book = await _bookRepo.GetByIdAsync(id)
            ?? throw new NotFoundException($"Book with ID {id} not found");

        if (dto.Price > 0) book.Price = dto.Price;
        if (!string.IsNullOrEmpty(dto.Category)) book.Category = dto.Category;
        book.IsAvailable = dto.IsAvailable;
        if (dto.NoOfCopies >= 0) book.NoOfCopies = dto.NoOfCopies;

        book.UpdatedAt = DateTime.UtcNow;

        _bookRepo.Update(book);
        await _bookRepo.SaveChangesAsync();
        return _mapper.Map<BookResponseDto>(book);
    }

    public async Task DeleteBookAsync(int id)
    {
        var book = await _bookRepo.GetByIdAsync(id)
            ?? throw new NotFoundException($"Book with ID {id} not found");

        var activeBorrow = await _borrowRepo.GetActiveBorrowByBookIdAsync(id);
        if (activeBorrow != null)
            throw new ConflictException("Cannot delete this book — it has an active borrow record");

        _bookRepo.Delete(book);
        await _bookRepo.SaveChangesAsync();
    }

    public async Task<IEnumerable<BookSummaryDto>> SearchBooksAsync(string searchTerm)
    {
        var books = await _bookRepo.SearchBooksAsync(searchTerm);
        return _mapper.Map<IEnumerable<BookSummaryDto>>(books);
    }
}