using FluentValidation;
using LibraryManagement.Core.DTOs;

namespace LibraryManagement.Services.Validators;

public class UpdateBookValidator : AbstractValidator<UpdateBookDto>
{
    public UpdateBookValidator()
    {
        RuleFor(x => x.Price)
            .GreaterThan(0).WithMessage("Price must be greater than 0")
            .When(x => x.Price.HasValue);

        RuleFor(x => x.NoOfCopies)
            .GreaterThanOrEqualTo(0).WithMessage("Copies cannot be negative")
            .When(x => x.NoOfCopies.HasValue);
    }
}