using FluentValidation;
using LibraryManagement.Core.DTOs.Request;

namespace LibraryManagement.Services.Validators;

public class AddRequestValidator : AbstractValidator<AddRequestDto>
{
    public AddRequestValidator()
    {
        RuleFor(x => x.Title).NotEmpty();
        RuleFor(x => x.Author).NotEmpty();
    }
}