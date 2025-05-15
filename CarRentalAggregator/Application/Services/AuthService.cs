using BCrypt.Net;
using CarRentalAggregator.Application.Interfaces;
using CarRentalAggregator.Domain.Entities;
using CarRentalAggregator.Domain.Enums;
using CarRentalAggregator.Domain.Interfaces;
using CarRentalAggregator.DTO;
using CarRentalAggregator.DTOs;
using System.Text.RegularExpressions;
using System.Security.Claims;
using System.Threading.Tasks;

public class AuthService : IAuthService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IJWTService _jwtService;
    private readonly Regex _emailRegex = new Regex(@"^[a-zA-Z0-9._%+-]+@(gmail\.com|mail\.ru|yandex\.ru)$", RegexOptions.Compiled);
    public AuthService(IUnitOfWork unitOfWork, IJWTService jwtService)
    {
        _unitOfWork = unitOfWork;
        _jwtService = jwtService;
    }

    public async Task<AuthResponse> RegisterAsync(LoginDto request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || !_emailRegex.IsMatch(request.Email))
        {
            throw new Exception("Email must be a valid address from @gmail.com, @mail.ru, or @yandex.ru");
        }

        if (string.IsNullOrWhiteSpace(request.Password) || request.Password.Length < 6 ||
            !request.Password.Any(char.IsLetter) || !request.Password.Any(char.IsDigit))
        {
            throw new Exception("Password must be at least 6 characters long and contain letters and numbers");
        }

        // Проверка уникальности email
        if (await _unitOfWork.Users.GetByEmailAsync(request.Email, cancellationToken) != null)
            throw new Exception("User with this email already exists");

        // Хэширование пароля
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        // Создание пользователя
        var user = new User
        {
            Email = request.Email,
            Password = passwordHash,
            Role = UserRoles.Client // По умолчанию Client
        };

        // Добавление пользователя
        await _unitOfWork.Users.AddAsync(user, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // Генерация токена
        var token = _jwtService.GenerateToken(user, request.RememberMe);

        return new AuthResponse
        {
            Token = token,
            UserDto = new UserDto
            {
                Id = user.Id,
                Role = user.Role
            }
        };
    }

    public async Task<AuthResponse> LoginAsync(LoginDto request, CancellationToken cancellationToken)
    {
        // Поиск пользователя
        var user = await _unitOfWork.Users.GetByEmailAsync(request.Email, cancellationToken);
        if (user == null)
            throw new Exception("Invalid email or password");

        // Проверка пароля
        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
            throw new Exception("Invalid email or password");

        // Генерация токена
        var token = _jwtService.GenerateToken(user, request.RememberMe);

        return new AuthResponse
        {
            Token = token,
            UserDto = new UserDto
            {
                Id = user.Id,
                Role = user.Role
            }
        };
    }

    public async Task<UserDto> AutoLoginAsync(string? jwtToken, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(jwtToken))
            throw new Exception("No token provided");

        var principal = _jwtService.ValidateToken(jwtToken);
        if (principal == null)
            throw new Exception("Invalid token");

        var userIdstr = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdstr == null || !Guid.TryParse(userIdstr, out var userId))
            throw new Exception("Invalid token payload");

        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user == null)
            throw new Exception("User not found");

        return new UserDto
        {
            Id = userId,
            Role = user.Role
        };
    }
}