using AutoMapper;
using LibraryManagement.Core.DTOs.Book;
using LibraryManagement.Core.DTOs.Borrow;
using LibraryManagement.Core.DTOs.Payment;
using LibraryManagement.Core.DTOs.Request;
using LibraryManagement.Core.DTOs.User;
using LibraryManagement.Core.Models;

namespace LibraryManagement.Services.Mapping;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // ── Book ──────────────────────────────────────────────────────
        CreateMap<Book, BookResponseDto>();
        CreateMap<Book, BookSummaryDto>();
        CreateMap<AddBookDto, Book>();
        CreateMap<UpdateBookDto, Book>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

        // ── User ──────────────────────────────────────────────────────
        CreateMap<User, UserResponseDto>();
        CreateMap<RegisterDto, User>();
        CreateMap<UpdateUserDto, User>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

        // ── Borrow ────────────────────────────────────────────────────
        CreateMap<BorrowedBook, BorrowResponseDto>()
            .ForMember(dest => dest.BookTitle, opt => opt.MapFrom(src => src.Book != null ? src.Book.Title : string.Empty))
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User != null ? src.User.Name : string.Empty));
        
        CreateMap<BorrowBookDto, BorrowedBook>();

        // ── Payment ───────────────────────────────────────────────────
        CreateMap<Payment, PaymentResponseDto>()
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.User != null ? src.User.Name : string.Empty));
        
        CreateMap<AddPaymentDto, Payment>();

        // ── Request ───────────────────────────────────────────────────
        CreateMap<BookRequest, RequestResponseDto>();
        
        CreateMap<AddRequestDto, BookRequest>();
    }
}