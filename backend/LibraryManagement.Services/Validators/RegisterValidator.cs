using FluentValidation;
using LibraryManagement.Core.DTOs.User;

namespace LibraryManagement.Services.Validators;

public class RegisterValidator : AbstractValidator<RegisterDto>
{
    public RegisterValidator()
    {
        RuleFor(x => x.Name).NotEmpty();
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Password)
            .NotEmpty()
            .MinimumLength(8)
            .Matches("[0-9]").WithMessage("Password must contain at least one number");
        RuleFor(x => x.PhoneNo).NotEmpty();
    }
}