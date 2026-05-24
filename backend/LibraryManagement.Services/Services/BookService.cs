using AutoMapper;
using LibraryManagement.Core.DTOs;
using LibraryManagement.Core.Exceptions;
using LibraryManagement.Core.Interfaces.Repositories;
using LibraryManagement.Core.Interfaces.Services;
using LibraryManagement.Core.Models;

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

    public async Task<IEnumerable<BookResponseDto>> GetAllBooks()
    {
        var books = await _bookRepo.GetAll();
        return _mapper.Map<IEnumerable<BookResponseDto>>(books);
    }

    public async Task<BookResponseDto> GetBookById(int id)
    {
        var book = await _bookRepo.GetById(id)
            ?? throw new NotFoundException($"Book with ID {id} not found");
        return _mapper.Map<BookResponseDto>(book);
    }

    public async Task<BookResponseDto> AddBook(AddBookDto dto)
    {
        var book = _mapper.Map<Book>(dto);
        await _bookRepo.Add(book);
        await _bookRepo.SaveChanges();
        return _mapper.Map<BookResponseDto>(book);
    }

    public async Task<BookResponseDto> UpdateBook(int id, UpdateBookDto dto)
    {
        var book = await _bookRepo.GetById(id)
            ?? throw new NotFoundException($"Book with ID {id} not found");

        // Only these four fields are updatable — enforced here, not via AutoMapper
        if (dto.Price.HasValue) book.Price = dto.Price.Value;
        if (dto.Category != null) book.Category = dto.Category;
        if (dto.IsAvailable.HasValue) book.IsAvailable = dto.IsAvailable.Value;
        if (dto.NoOfCopies.HasValue) book.NoOfCopies = dto.NoOfCopies.Value;

        book.UpdatedAt = DateTime.UtcNow;

        _bookRepo.Update(book);
        await _bookRepo.SaveChanges();
        return _mapper.Map<BookResponseDto>(book);
    }

    public async Task DeleteBook(int id)
    {
        var book = await _bookRepo.GetById(id)
            ?? throw new NotFoundException($"Book with ID {id} not found");

        var activeBorrows = await _borrowRepo.GetActiveBorrows();
        if (activeBorrows.Any(b => b.BookId == id))
            throw new ConflictException(
                "Cannot delete this book — it has active borrow records");

        _bookRepo.Delete(book);
        await _bookRepo.SaveChanges();
    }

    public async Task<IEnumerable<BookResponseDto>> SearchBooks(
        string? title, string? author, string? genre, string? category)
    {
        IEnumerable<Book> books;

        if (!string.IsNullOrWhiteSpace(title) || !string.IsNullOrWhiteSpace(author))
        {
            var query = title ?? author!;
            books = await _bookRepo.SearchBooks(query);
        }
        else
        {
            books = await _bookRepo.GetAll();
        }

        if (!string.IsNullOrWhiteSpace(genre))
            books = books.Where(b =>
                b.Genre.Equals(genre, StringComparison.OrdinalIgnoreCase));

        if (!string.IsNullOrWhiteSpace(category))
            books = books.Where(b =>
                b.Category.Equals(category, StringComparison.OrdinalIgnoreCase));

        return _mapper.Map<IEnumerable<BookResponseDto>>(books);
    }
}