using AutoMapper;
using LibraryManagement.Core.DTOs;
using LibraryManagement.Core.Enums;
using LibraryManagement.Core.Models;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace LibraryManagement.Services.Mapping;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // ── Book ──────────────────────────────────────────────────────
        CreateMap<Book, BookResponseDto>();

        CreateMap<AddBookDto, Book>()
            .ForMember(dest => dest.IsAvailable, opt => opt.MapFrom(_ => true))
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(_ => DateTime.UtcNow))
            .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(_ => DateTime.UtcNow));

        // UpdateBookDto is intentionally NOT used for mapping —
        // UpdateBook() in BookService applies fields manually to avoid
        // overwriting non-nullable fields with null.

        // ── User ──────────────────────────────────────────────────────
        CreateMap<User, UserResponseDto>();

        CreateMap<RegisterDto, User>()
            .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
            .ForMember(dest => dest.IsActive, opt => opt.MapFrom(_ => true))
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(_ => DateTime.UtcNow))
            .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(_ => DateTime.UtcNow));

        // ── BorrowedBook ──────────────────────────────────────────────
        CreateMap<BorrowedBook, BorrowResponseDto>()
            .ForMember(dest => dest.BookTitle,
                opt => opt.MapFrom(src => src.Book.Title))
            .ForMember(dest => dest.UserName,
                opt => opt.MapFrom(src => src.User.Name));

        CreateMap<BorrowBookDto, BorrowedBook>()
            .ForMember(dest => dest.IssuingDate, opt => opt.MapFrom(_ => DateTime.UtcNow))
            .ForMember(dest => dest.IsReturned, opt => opt.MapFrom(_ => false));

        // ── Payment ───────────────────────────────────────────────────
        CreateMap<Payment, PaymentResponseDto>();

        CreateMap<AddPaymentDto, Payment>()
            .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(_ => DateTime.UtcNow));

        // ── BookRequest ───────────────────────────────────────────────
        CreateMap<BookRequest, RequestResponseDto>();

        CreateMap<AddRequestDto, BookRequest>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(_ => RequestStatus.Pending))
            .ForMember(dest => dest.RequestedAt, opt => opt.MapFrom(_ => DateTime.UtcNow));
    }
}