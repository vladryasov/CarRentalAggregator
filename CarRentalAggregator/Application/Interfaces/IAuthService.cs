using CarRentalAggregator.DTO;
using CarRentalAggregator.DTOs;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;

namespace CarRentalAggregator.Application.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponse> RegisterAsync(LoginDto request, CancellationToken cancellationToken);
        Task<AuthResponse> LoginAsync(LoginDto request, CancellationToken cancellationToken);
        Task<UserDto> AutoLoginAsync(string? jwtToken,  CancellationToken cancellationToken);

        Task<UserDto> LogoutAsync(string? jwtToken, CancellationToken cancellationToken);
    }
}
