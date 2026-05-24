using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using LibraryManagement.Core.Models;
using LibraryManagement.Core.Enums;

namespace LibraryManagement.API.Stubs.Infrastructure
{
    public static class DbSeeder
    {
        public static async Task SeedAsync(LibraryDbContext context)
        {
            await context.Database.EnsureCreatedAsync();

            if (!await context.Users.AnyAsync())
            {
                var admin = new User
                {
                    Name = "Admin Librarian",
                    Email = "librarian@library.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123"),
                    Role = Role.Librarian,
                    IsActive = true,
                    PhoneNo = "1234567890",
                    LibraryCardExpiry = DateTime.UtcNow.AddYears(1),
                    PreferredBooks = "",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                var reader = new User
                {
                    Name = "John Reader",
                    Email = "reader@library.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Reader123"),
                    Role = Role.Reader,
                    IsActive = true,
                    PhoneNo = "0987654321",
                    LibraryCardExpiry = DateTime.UtcNow.AddMonths(6),
                    PreferredBooks = "C# Programming, ASP.NET",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                await context.Users.AddRangeAsync(admin, reader);
                await context.SaveChangesAsync();
            }
        }
    }
}
