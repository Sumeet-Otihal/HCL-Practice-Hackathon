using FluentValidation;
using LibraryManagement.Core.DTOs;

namespace LibraryManagement.Services.Validators;

public class AddRequestValidator : AbstractValidator<AddRequestDto>
{
    public AddRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Book title is required");

        RuleFor(x => x.Author)
            .NotEmpty().WithMessage("Author name is required");
    }
}