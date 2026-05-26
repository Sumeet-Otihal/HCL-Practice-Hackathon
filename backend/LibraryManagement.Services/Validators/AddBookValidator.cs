using FluentValidation;
using LibraryManagement.Core.DTOs.Book;

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

        RuleFor(x => x.PublishedDate)
            .NotEmpty().WithMessage("Published date is required")
            .LessThanOrEqualTo(DateTime.UtcNow).WithMessage("Published date cannot be in the future");

        RuleFor(x => x.Volumes)
            .GreaterThan(0).WithMessage("Volumes must be at least 1");

        RuleFor(x => x.Price)
            .GreaterThan(0).WithMessage("Price must be greater than 0");

        RuleFor(x => x.NoOfCopies)
            .GreaterThan(0).WithMessage("Number of copies must be at least 1");
    }
}