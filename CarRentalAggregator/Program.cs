using CarRentalAggregator.Application.Interfaces;
using CarRentalAggregator.Application.Services;
using CarRentalAggregator.Application.Serialization;
using CarRentalAggregator.Application.Settings;
using CarRentalAggregator.Domain.Interfaces;
using CarRentalAggregator.Persistance;
using CarRentalAggregator.Persistance.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

namespace CarRentalAggregator
{
    public class Program
    {
        public static void Main(string[] args)
        {
            DotNetEnv.Env.Load();

            var builder = WebApplication.CreateBuilder(args);

            builder.Configuration.AddEnvironmentVariables();
            builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("Cloudinary"));


            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowLocalhost3000", builder =>
                {
                    builder.WithOrigins("https://localhost:3000") // Разрешаем запросы с фронтенда
                           .AllowAnyMethod() // Разрешаем любые методы (GET, POST и т.д.)
                           .AllowAnyHeader() // Разрешаем любые заголовки
                           .AllowCredentials(); // Разрешаем отправку куки (нужно для withCredentials)
                });
            });

            // Add services to the container.

            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
            builder.Services.AddAutoMapper(typeof(Program));
            builder.Services.AddScoped<ICarService, CarService>();
            builder.Services.AddScoped<IUserService, UserService>();
            builder.Services.AddScoped<IRentService, RentService>();
            builder.Services.AddScoped<ICompanyService, CompanyService>();
            builder.Services.AddScoped<IAuthService, AuthService>();
            builder.Services.AddScoped<IJWTService, JWTService>();
            builder.Services.AddScoped<IPhotoService, PhotoService>();
            builder.Services.AddScoped<ICarPhotoService, CarPhotoService>();

            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<ICarRepository, CarRepository>();
            builder.Services.AddScoped<ICompanyRepository, CompanyRepository>();
            builder.Services.AddScoped<IRentRepository, RentRepository>();

            builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var token = context.Request.Cookies["JwtToken"];
                        if (!string.IsNullOrEmpty(token))
                        {
                            context.Token = token;
                        }

                        // Логируем заголовки
                        Console.WriteLine("Request Headers:");
                        foreach (var header in context.Request.Headers)
                        {
                            Console.WriteLine($"{header.Key}: {header.Value}");
                        }

                        // Логируем query string
                        Console.WriteLine("Query String:");
                        foreach (var query in context.Request.Query)
                        {
                            Console.WriteLine($"{query.Key}: {query.Value}");
                        }

                        return Task.CompletedTask;
                    }
                };

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = builder.Configuration["Jwt:Issuer"],
                    ValidAudience = builder.Configuration["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
                };
            });


            // Add authorization policies
            builder.Services.AddAuthorization(options =>
            {
                options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
                options.AddPolicy("ClientOnly", policy => policy.RequireRole("1"));
            });

            builder.Services.AddControllers().AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.Converters.Add(new EngineTypeSerializer());
                });

            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "CarRentalAggregator API", Version = "v1" });

                // Настройка авторизации для Bearer-токена
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = "JWT Authorization header using the Bearer scheme. Example: 'Bearer {token}'",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                    },
                    new string[] {}
                }
            });
            });

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            app.UseCors("AllowLocalhost3000");

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
