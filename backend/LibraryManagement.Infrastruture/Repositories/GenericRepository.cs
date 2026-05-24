using LibraryManagement.Core.Interfaces.Repositories;
using LibraryManagement.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.Infrastructure.Repositories;

public class GenericRepository<T> : IGenericRepository<T> where T : class
{
    protected readonly AppDbContext _context;

    public GenericRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<T>> GetAll() =>
        await _context.Set<T>().ToListAsync();

    public async Task<T?> GetById(int id) =>
        await _context.Set<T>().FindAsync(id);

    public async Task Add(T entity) =>
        await _context.Set<T>().AddAsync(entity);

    public void Update(T entity) =>
        _context.Set<T>().Update(entity);

    public void Delete(T entity) =>
        _context.Set<T>().Remove(entity);

    public async Task SaveChanges() =>
        await _context.SaveChangesAsync();
}