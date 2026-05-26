using FluentValidation;
using LibraryManagement.Core.DTOs.Book;

namespace LibraryManagement.Services.Validators;

public class UpdateBookValidator : AbstractValidator<UpdateBookDto>
{
    public UpdateBookValidator()
    {
        RuleFor(x => x.Price)
            .GreaterThan(0).WithMessage("Price must be greater than 0");

        RuleFor(x => x.NoOfCopies)
            .GreaterThanOrEqualTo(0).WithMessage("Number of copies cannot be negative");

        RuleFor(x => x.Category)
            .NotEmpty().WithMessage("Category is required");
    }
}