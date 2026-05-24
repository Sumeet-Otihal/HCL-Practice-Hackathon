using FluentValidation;
using LibraryManagement.Core.DTOs;
using LibraryManagement.Core.Interfaces.Repositories;

namespace LibraryManagement.Services.Validators;

public class RegisterValidator : AbstractValidator<RegisterDto>
{
    public RegisterValidator(IUserRepository userRepository)
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email format")
            .MustAsync(async (email, _) =>
                await userRepository.GetByEmail(email) == null)
            .WithMessage("This email is already registered");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required")
            .MinimumLength(8).WithMessage("Password must be at least 8 characters")
            .Matches(@"\d").WithMessage("Password must contain at least one number");

        RuleFor(x => x.PhoneNo)
            .NotEmpty().WithMessage("Phone number is required");

        RuleFor(x => x.LibraryCardExpiry)
            .GreaterThan(DateTime.Today)
            .WithMessage("Library card expiry must be a future date");
    }
}