using BCrypt.Net;
using LibraryManagement.Core.Enums;
using LibraryManagement.Core.Models;
using LibraryManagement.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.Infrastructure.Data;

public static class DbInitializer
{
    public static async Task SeedAsync(AppDbContext context)
    {
        // Run pending migrations automatically
        await context.Database.MigrateAsync();

        // Guard: skip if any users already exist
        if (await context.Users.AnyAsync()) return;

        // ── Seed Users ────────────────────────────────────────────────
        var users = new List<User>
        {
            new()
            {
                Name              = "Admin Librarian",
                Email             = "librarian@library.com",
                PasswordHash      = BCrypt.Net.BCrypt.HashPassword("Admin@1234"),
                Role              = UserRole.Librarian,
                IsActive          = true,
                PhoneNo           = "9999999999",
                LibraryCardExpiry = DateTime.UtcNow.AddYears(5),
                CreatedAt         = DateTime.UtcNow,
                UpdatedAt         = DateTime.UtcNow
            },
            new()
            {
                Name              = "John Reader",
                Email             = "reader@library.com",
                PasswordHash      = BCrypt.Net.BCrypt.HashPassword("Reader@1234"),
                Role              = UserRole.Reader,
                IsActive          = true,
                PhoneNo           = "8888888888",
                LibraryCardExpiry = DateTime.UtcNow.AddYears(1),
                CreatedAt         = DateTime.UtcNow,
                UpdatedAt         = DateTime.UtcNow
            }
        };

        // ── Seed Books ────────────────────────────────────────────────
        var books = new List<Book>
        {
            new()
            {
                Title         = "The Great Gatsby",
                AuthorName    = "F. Scott Fitzgerald",
                PublishedDate = new DateTime(1925, 4, 10),
                Volumes       = 1,
                Price         = 299,
                NoOfCopies    = 5,
                Genre         = "Fiction",
                Category      = "Classic",
                IsAvailable   = true,
                CreatedAt     = DateTime.UtcNow,
                UpdatedAt     = DateTime.UtcNow
            },
            new()
            {
                Title         = "A Brief History of Time",
                AuthorName    = "Stephen Hawking",
                PublishedDate = new DateTime(1988, 3, 1),
                Volumes       = 1,
                Price         = 499,
                NoOfCopies    = 3,
                Genre         = "Science",
                Category      = "Non-Fiction",
                IsAvailable   = true,
                CreatedAt     = DateTime.UtcNow,
                UpdatedAt     = DateTime.UtcNow
            },
            new()
            {
                Title         = "Sapiens",
                AuthorName    = "Yuval Noah Harari",
                PublishedDate = new DateTime(2011, 1, 1),
                Volumes       = 1,
                Price         = 599,
                NoOfCopies    = 4,
                Genre         = "History",
                Category      = "Non-Fiction",
                IsAvailable   = true,
                CreatedAt     = DateTime.UtcNow,
                UpdatedAt     = DateTime.UtcNow
            },
            new()
            {
                Title         = "Clean Code",
                AuthorName    = "Robert C. Martin",
                PublishedDate = new DateTime(2008, 8, 1),
                Volumes       = 1,
                Price         = 799,
                NoOfCopies    = 6,
                Genre         = "Technology",
                Category      = "Programming",
                IsAvailable   = true,
                CreatedAt     = DateTime.UtcNow,
                UpdatedAt     = DateTime.UtcNow
            },
            new()
            {
                Title         = "The Girl with the Dragon Tattoo",
                AuthorName    = "Stieg Larsson",
                PublishedDate = new DateTime(2005, 8, 1),
                Volumes       = 1,
                Price         = 399,
                NoOfCopies    = 4,
                Genre         = "Mystery",
                Category      = "Thriller",
                IsAvailable   = true,
                CreatedAt     = DateTime.UtcNow,
                UpdatedAt     = DateTime.UtcNow
            }
        };

        await context.Users.AddRangeAsync(users);
        await context.Books.AddRangeAsync(books);
        await context.SaveChangesAsync();
    }
}