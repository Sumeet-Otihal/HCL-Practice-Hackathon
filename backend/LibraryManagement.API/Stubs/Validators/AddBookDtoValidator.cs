using FluentValidation;
using LibraryManagement.Core.DTOs.Book;

namespace LibraryManagement.API.Stubs.Validators
{
    public class AddBookDtoValidator : AbstractValidator<AddBookDto>
    {
        public AddBookDtoValidator()
        {
            RuleFor(x => x.Title).NotEmpty().WithMessage("Title is required.");
            RuleFor(x => x.AuthorName).NotEmpty().WithMessage("Author name is required.");
            RuleFor(x => x.Price).GreaterThan(0).WithMessage("Price must be greater than zero.");
            RuleFor(x => x.NoOfCopies).GreaterThanOrEqualTo(0).WithMessage("No of copies cannot be negative.");
        }
    }
}
