using LibraryManagement.Core.Interfaces.Services;
using LibraryManagement.Services.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace LibraryManagement.Services.Extentions;

public static class ApplicationServiceExtentions
{
    public static IServiceCollection AddApplicationServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddScoped<IBookService, BookService>();
        services.AddScoped<IBorrowService, BorrowService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IPaymentService, PaymentService>();
        services.AddScoped<IRequestService, RequestService>();
        services.AddScoped<IJwtTokenService, JwtTokenService>();

        return services;
    }
}