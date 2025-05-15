using CarRentalAggregator.Domain.Entities;
using System.Security.Claims;

namespace CarRentalAggregator.Application.Interfaces
{
    public interface IJWTService
    {
        string GenerateToken(User user, bool rememberMe);
        ClaimsPrincipal ValidateToken(string token);
    }
}
