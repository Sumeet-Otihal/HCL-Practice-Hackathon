using System.Text;
using FluentValidation;
using FluentValidation.AspNetCore;
using LibraryManagement.Core.Interfaces.Services;
using LibraryManagement.Services.Mapping;
using LibraryManagement.Services.Services;
using LibraryManagement.Services.Validators;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace LibraryManagement.Services.Extensions;

public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplicationServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // ── Business services ─────────────────────────────────────────
        services.AddScoped<IBookService, BookService>();
        services.AddScoped<IBorrowService, BorrowService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IPaymentService, PaymentService>();
        services.AddScoped<IRequestService, RequestService>();
        services.AddScoped<IJwtTokenService, JwtTokenService>();

        // ── AutoMapper ────────────────────────────────────────────────
        services.AddAutoMapper(typeof(MappingProfile));

        // ── FluentValidation ──────────────────────────────────────────
        services.AddFluentValidationAutoValidation();
        services.AddValidatorsFromAssemblyContaining<AddBookValidator>();

        // ── JWT Authentication ────────────────────────────────────────
        var jwtSection = configuration.GetSection("JwtSettings");
        var secret = jwtSection["Secret"]!;

        services
            .AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtSection["Issuer"],
                    ValidAudience = jwtSection["Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(
                                                  Encoding.UTF8.GetBytes(secret))
                };
            });

        services.AddAuthorization();

        return services;
    }
}