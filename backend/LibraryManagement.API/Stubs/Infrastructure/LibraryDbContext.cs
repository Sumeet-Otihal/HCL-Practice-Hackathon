using Microsoft.EntityFrameworkCore;
using LibraryManagement.Core.Models;

namespace LibraryManagement.API.Stubs.Infrastructure
{
    public class LibraryDbContext : DbContext
    {
        public LibraryDbContext(DbContextOptions<LibraryDbContext> options) : base(options)
        {
        }

        public DbSet<Book> Books => Set<Book>();
        public DbSet<BorrowedBook> BorrowedBooks => Set<BorrowedBook>();
        public DbSet<User> Users => Set<User>();
        public DbSet<Payment> Payments => Set<Payment>();
        public DbSet<BookRequest> BookRequests => Set<BookRequest>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            modelBuilder.Entity<Book>().HasKey(b => b.Id);
            modelBuilder.Entity<BorrowedBook>().HasKey(b => b.Id);
            modelBuilder.Entity<User>().HasKey(u => u.Id);
            modelBuilder.Entity<Payment>().HasKey(p => p.Id);
            modelBuilder.Entity<BookRequest>().HasKey(r => r.Id);

            modelBuilder.Entity<BorrowedBook>()
                .HasOne(b => b.Book)
                .WithMany(b => b.BorrowedBooks)
                .HasForeignKey(b => b.BookId);

            modelBuilder.Entity<BorrowedBook>()
                .HasOne(b => b.User)
                .WithMany(u => u.BorrowedBooks)
                .HasForeignKey(b => b.UserId);

            modelBuilder.Entity<Payment>()
                .HasOne(p => p.User)
                .WithMany(u => u.Payments)
                .HasForeignKey(p => p.UserId);

            modelBuilder.Entity<BookRequest>()
                .HasOne(r => r.User)
                .WithMany(u => u.BookRequests)
                .HasForeignKey(r => r.UserId);
        }
    }
}
