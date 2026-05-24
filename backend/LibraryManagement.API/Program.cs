using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using AutoMapper;
using FluentValidation;
using FluentValidation.AspNetCore;
using LibraryManagement.API.Extensions;
using LibraryManagement.API.Middleware;
using LibraryManagement.API.Stubs;
using LibraryManagement.API.Stubs.Infrastructure;
using LibraryManagement.API.Stubs.Validators;

var builder = WebApplication.CreateBuilder(args);

// First, add controllers
builder.Services.AddControllers();

// Then register DbContext from Infrastructure with the SQL Server connection string
builder.Services.AddDatabaseServices(builder.Configuration);

// Then register all repository implementations (scoped lifetime)
builder.Services.AddRepositories();

// Then register all service implementations (scoped lifetime)
// Then register IJwtTokenService (scoped)
builder.Services.AddApplicationServices();

// Then add AutoMapper and point it to the MappingProfile in Services project
builder.Services.AddAutoMapper(cfg => cfg.AddProfile<MappingProfile>());

// Then add FluentValidation with auto-validation enabled, pointing to the Services project assembly
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssembly(typeof(AddBookDtoValidator).Assembly);

// Then configure JWT Bearer authentication using settings from appsettings
builder.Services.AddJwtAuthentication(builder.Configuration);

// Then add Authorization
builder.Services.AddAuthorization();

// Then add Swagger with a JWT security definition so testers can authorize in the browser
builder.Services.AddSwaggerWithJwt();

// Then add Serilog for logging
builder.Host.UseSerilog((context, services, configuration) => 
    configuration.ReadFrom.Configuration(context.Configuration));

var app = builder.Build();

// Call the database seeder after building the app but before running it
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<LibraryDbContext>();
        await DbSeeder.SeedAsync(context);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<Microsoft.Extensions.Logging.ILogger<Program>>();
        logger.LogError(ex, "An error occurred while seeding the database.");
    }
}

// In the middleware pipeline, use the global exception handler first, then HTTPS redirection, 
// then authentication, then authorization, then Swagger and Swagger UI (in development only), then MapControllers.
app.UseMiddleware<GlobalExceptionMiddleware>();

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();

app.Run();
