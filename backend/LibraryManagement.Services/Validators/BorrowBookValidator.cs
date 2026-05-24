using FluentValidation;
using LibraryManagement.Core.DTOs;

namespace LibraryManagement.Services.Validators;

public class BorrowBookValidator : AbstractValidator<BorrowBookDto>
{
    public BorrowBookValidator()
    {
        RuleFor(x => x.BookId)
            .GreaterThan(0).WithMessage("A valid Book ID is required");

        RuleFor(x => x.UserId)
            .GreaterThan(0).WithMessage("A valid User ID is required");

        RuleFor(x => x.ReturnDate)
            .GreaterThan(DateTime.Today)
            .WithMessage("Return date must be after today");

        RuleFor(x => x.PhoneNo)
            .NotEmpty().WithMessage("Phone number is required");
    }
}