using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using LibraryManagement.Core.DTOs.Book;
using LibraryManagement.Core.Exceptions;
using LibraryManagement.Core.Interfaces.Repositories;
using LibraryManagement.Core.Interfaces.Services;
using LibraryManagement.Core.Models;

namespace LibraryManagement.API.Stubs.Services
{
    public class BookService : IBookService
    {
        private readonly IBookRepository _bookRepository;
        private readonly IBorrowRepository _borrowRepository;
        private readonly IMapper _mapper;

        public BookService(IBookRepository bookRepository, IBorrowRepository borrowRepository, IMapper mapper)
        {
            _bookRepository = bookRepository;
            _borrowRepository = borrowRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<BookSummaryDto>> GetAllBooksAsync()
        {
            var books = await _bookRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<BookSummaryDto>>(books);
        }

        public async Task<BookResponseDto> GetBookByIdAsync(int id)
        {
            var book = await _bookRepository.GetByIdAsync(id);
            if (book == null)
                throw new NotFoundException($"Book with ID {id} was not found.");

            return _mapper.Map<BookResponseDto>(book);
        }

        public async Task<IEnumerable<BookSummaryDto>> SearchBooksAsync(string q)
        {
            var books = await _bookRepository.SearchBooksAsync(q);
            return _mapper.Map<IEnumerable<BookSummaryDto>>(books);
        }

        public async Task<BookResponseDto> AddBookAsync(AddBookDto addBookDto)
        {
            var book = _mapper.Map<Book>(addBookDto);
            book.CreatedAt = DateTime.UtcNow;
            book.UpdatedAt = DateTime.UtcNow;

            await _bookRepository.AddAsync(book);
            await _bookRepository.SaveChangesAsync();

            return _mapper.Map<BookResponseDto>(book);
        }

        public async Task<BookResponseDto> UpdateBookAsync(int id, UpdateBookDto updateBookDto)
        {
            var book = await _bookRepository.GetByIdAsync(id);
            if (book == null)
                throw new NotFoundException($"Book with ID {id} was not found.");

            _mapper.Map(updateBookDto, book);
            book.UpdatedAt = DateTime.UtcNow;

            _bookRepository.Update(book);
            await _bookRepository.SaveChangesAsync();

            return _mapper.Map<BookResponseDto>(book);
        }

        public async Task DeleteBookAsync(int id)
        {
            var book = await _bookRepository.GetByIdAsync(id);
            if (book == null)
                throw new NotFoundException($"Book with ID {id} was not found.");

            var activeBorrow = await _borrowRepository.GetActiveBorrowByBookIdAsync(id);
            if (activeBorrow != null)
                throw new ConflictException($"Book with ID {id} cannot be deleted because it is currently borrowed.");

            _bookRepository.Delete(book);
            await _bookRepository.SaveChangesAsync();
        }
    }
}
