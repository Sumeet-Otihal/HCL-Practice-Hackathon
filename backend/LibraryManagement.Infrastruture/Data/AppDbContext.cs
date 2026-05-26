using LibraryManagement.Core.Enums;
using LibraryManagement.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.Infrastruture.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Book> Books { get; set; }
    public DbSet<BorrowedBook> BorrowedBooks { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Payment> Payments { get; set; }
    public DbSet<BookRequest> BookRequests { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // ── Book ──────────────────────────────────────────────────────
        modelBuilder.Entity<Book>(entity =>
        {
            entity.Property(b => b.Title)
                  .IsRequired()
                  .HasMaxLength(200);

            entity.Property(b => b.Price)
                  .HasColumnType("decimal(18,2)");

            entity.Property(b => b.IsAvailable)
                  .HasDefaultValue(true);

            entity.Property(b => b.CreatedAt)
                  .HasDefaultValueSql("GETUTCDATE()");

            entity.Property(b => b.UpdatedAt)
                  .HasDefaultValueSql("GETUTCDATE()");
        });

        // ── User ──────────────────────────────────────────────────────
        modelBuilder.Entity<User>(entity =>
        {
            entity.Property(u => u.Email)
                  .IsRequired()
                  .HasMaxLength(150);

            entity.HasIndex(u => u.Email)
                  .IsUnique();

            entity.Property(u => u.Role)
                  .HasConversion<string>();

            entity.Property(u => u.CreatedAt)
                  .HasDefaultValueSql("GETUTCDATE()");

            entity.Property(u => u.UpdatedAt)
                  .HasDefaultValueSql("GETUTCDATE()");
        });

        // ── BorrowedBook ──────────────────────────────────────────────
        modelBuilder.Entity<BorrowedBook>(entity =>
        {
            entity.HasOne(b => b.Book)
                  .WithMany(b => b.BorrowedBooks)
                  .HasForeignKey(b => b.BookId)
                  .OnDelete(DeleteBehavior.Restrict);   // prevent cascade delete

            entity.HasOne(b => b.User)
                  .WithMany(u => u.BorrowedBooks)
                  .HasForeignKey(b => b.UserId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // ── Payment ───────────────────────────────────────────────────
        modelBuilder.Entity<Payment>(entity =>
        {
            entity.Property(p => p.Amount)
                  .HasColumnType("decimal(18,2)");

            entity.HasOne(p => p.User)
                  .WithMany(u => u.Payments)
                  .HasForeignKey(p => p.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // ── BookRequest ───────────────────────────────────────────────
        modelBuilder.Entity<BookRequest>(entity =>
        {
            entity.Property(r => r.Status)
                  .HasConversion<string>();

            entity.HasOne(r => r.User)
                  .WithMany(u => u.BookRequests)
                  .HasForeignKey(r => r.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}