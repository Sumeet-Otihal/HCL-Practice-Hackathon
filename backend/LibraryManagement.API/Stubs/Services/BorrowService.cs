using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using LibraryManagement.Core.DTOs.Borrow;
using LibraryManagement.Core.Exceptions;
using LibraryManagement.Core.Interfaces.Repositories;
using LibraryManagement.Core.Interfaces.Services;
using LibraryManagement.Core.Models;

namespace LibraryManagement.API.Stubs.Services
{
    public class BorrowService : IBorrowService
    {
        private readonly IBorrowRepository _borrowRepository;
        private readonly IBookRepository _bookRepository;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public BorrowService(
            IBorrowRepository borrowRepository,
            IBookRepository bookRepository,
            IUserRepository userRepository,
            IMapper mapper)
        {
            _borrowRepository = borrowRepository;
            _bookRepository = bookRepository;
            _userRepository = userRepository;
            _mapper = mapper;
        }

        public async Task<BorrowResponseDto> BorrowBookAsync(BorrowBookDto borrowBookDto)
        {
            var book = await _bookRepository.GetByIdAsync(borrowBookDto.BookId);
            if (book == null)
                throw new NotFoundException($"Book with ID {borrowBookDto.BookId} was not found.");

            var user = await _userRepository.GetByIdAsync(borrowBookDto.UserId);
            if (user == null)
                throw new NotFoundException($"User with ID {borrowBookDto.UserId} was not found.");

            if (user.LibraryCardExpiry < DateTime.UtcNow)
                throw new CardExpiredException("Cannot borrow book because the user's library card has expired.");

            if (!book.IsAvailable || book.NoOfCopies <= 0)
                throw new ConflictException("Book is currently unavailable for borrowing.");

            book.NoOfCopies -= 1;
            if (book.NoOfCopies == 0)
            {
                book.IsAvailable = false;
            }

            var borrow = new BorrowedBook
            {
                BookId = borrowBookDto.BookId,
                UserId = borrowBookDto.UserId,
                IssuingDate = DateTime.UtcNow,
                ReturnDate = borrowBookDto.ReturnDate,
                IsReturned = false,
                PhoneNo = borrowBookDto.PhoneNo
            };

            await _borrowRepository.AddAsync(borrow);
            _bookRepository.Update(book);

            await _borrowRepository.SaveChangesAsync();

            borrow.Book = book;
            borrow.User = user;

            return _mapper.Map<BorrowResponseDto>(borrow);
        }

        public async Task<BorrowResponseDto> ReturnBookAsync(ReturnBookDto returnBookDto)
        {
            var borrow = await _borrowRepository.GetByIdAsync(returnBookDto.BorrowId);
            if (borrow == null)
                throw new NotFoundException($"Borrow record with ID {returnBookDto.BorrowId} was not found.");

            if (borrow.IsReturned)
                throw new ConflictException("Book has already been returned.");

            borrow.IsReturned = true;

            var book = await _bookRepository.GetByIdAsync(borrow.BookId);
            if (book != null)
            {
                book.NoOfCopies += 1;
                book.IsAvailable = true;
                _bookRepository.Update(book);
            }

            _borrowRepository.Update(borrow);
            await _borrowRepository.SaveChangesAsync();

            return _mapper.Map<BorrowResponseDto>(borrow);
        }

        public async Task<IEnumerable<BorrowResponseDto>> GetAllBorrowsAsync()
        {
            var allBorrows = await _borrowRepository.GetAllAsync();
            foreach (var b in allBorrows)
            {
                if (b.Book == null) b.Book = await _bookRepository.GetByIdAsync(b.BookId) ?? new Book();
                if (b.User == null) b.User = await _userRepository.GetByIdAsync(b.UserId) ?? new User();
            }
            return _mapper.Map<IEnumerable<BorrowResponseDto>>(allBorrows);
        }

        public async Task<IEnumerable<BorrowResponseDto>> GetBorrowsByUserAsync(int userId)
        {
            var borrows = await _borrowRepository.GetBorrowsByUserAsync(userId);
            return _mapper.Map<IEnumerable<BorrowResponseDto>>(borrows);
        }

        public async Task<IEnumerable<BorrowResponseDto>> GetOverdueBorrowsAsync()
        {
            var borrows = await _borrowRepository.GetOverdueBorrowsAsync();
            return _mapper.Map<IEnumerable<BorrowResponseDto>>(borrows);
        }
    }
}
