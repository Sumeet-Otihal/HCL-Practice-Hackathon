using LibraryManagement.Core.Interfaces.Repositories;
using LibraryManagement.Infrastruture.Data;
using LibraryManagement.Infrastruture.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace LibraryManagement.Infrastruture.Extentions;

public static class InfrastrutureServiceExtentions
{
    public static IServiceCollection AddInfrastruture(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // Database
        services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(
                configuration.GetConnectionString("DefaultConnection")));

        // Repositories
        services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
        services.AddScoped<IBookRepository, BookRepository>();
        services.AddScoped<IBorrowRepository, BorrowRepository>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IPaymentRepository, PaymentRepository>();
        services.AddScoped<IBookRequestRepository, BookRequestRepository>();

        return services;
    }
}