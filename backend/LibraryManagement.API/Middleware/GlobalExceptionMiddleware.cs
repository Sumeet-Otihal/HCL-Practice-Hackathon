using System;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using LibraryManagement.Core.Exceptions;

namespace LibraryManagement.API.Middleware
{
    public class GlobalExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionMiddleware> _logger;
        private readonly IHostEnvironment _env;

        public GlobalExceptionMiddleware(
            RequestDelegate next,
            ILogger<GlobalExceptionMiddleware> logger,
            IHostEnvironment env)
        {
            _next = next;
            _logger = logger;
            _env = env;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unhandled exception occurred during request execution.");
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";
            
            var statusCode = exception switch
            {
                NotFoundException => HttpStatusCode.NotFound,       // 404
                ConflictException => HttpStatusCode.Conflict,       // 409
                CardExpiredException => HttpStatusCode.BadRequest,  // 400
                UnauthorizedException => HttpStatusCode.Forbidden,  // 403 (Note: Prompt mapping says UnauthorizedException -> 403 Forbidden)
                _ => HttpStatusCode.InternalServerError             // 500
            };

            context.Response.StatusCode = (int)statusCode;

            string message;
            if (statusCode == HttpStatusCode.InternalServerError && !_env.IsDevelopment())
            {
                message = "An unexpected error occurred. Please try again later.";
            }
            else
            {
                message = exception.Message;
            }

            var responsePayload = new
            {
                StatusCode = context.Response.StatusCode,
                Message = message,
                Timestamp = DateTime.UtcNow
            };

            var jsonOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            await context.Response.WriteAsync(JsonSerializer.Serialize(responsePayload, jsonOptions));
        }
    }
}
