using FluentValidation;
using LibraryManagement.Core.DTOs;

namespace LibraryManagement.Services.Validators;

public class AddBookValidator : AbstractValidator<AddBookDto>
{
    public AddBookValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required")
            .MaximumLength(200).WithMessage("Title cannot exceed 200 characters");

        RuleFor(x => x.AuthorName)
            .NotEmpty().WithMessage("Author name is required");

        RuleFor(x => x.Price)
            .GreaterThan(0).WithMessage("Price must be greater than 0");

        RuleFor(x => x.PublishedDate)
            .LessThanOrEqualTo(DateTime.Today)
            .WithMessage("Published date cannot be in the future");

        RuleFor(x => x.NoOfCopies)
            .GreaterThanOrEqualTo(1).WithMessage("At least 1 copy is required");
    }
}