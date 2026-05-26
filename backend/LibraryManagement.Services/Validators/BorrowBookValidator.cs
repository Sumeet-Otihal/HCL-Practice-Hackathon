using FluentValidation;
using LibraryManagement.Core.DTOs.Borrow;

namespace LibraryManagement.Services.Validators;

public class BorrowBookValidator : AbstractValidator<BorrowBookDto>
{
    public BorrowBookValidator()
    {
        RuleFor(x => x.BookId).NotEmpty();
        RuleFor(x => x.UserId).NotEmpty();
        RuleFor(x => x.ReturnDate)
            .NotEmpty()
            .GreaterThan(DateTime.UtcNow).WithMessage("Return date must be in the future");
        RuleFor(x => x.PhoneNo).NotEmpty();
    }
}