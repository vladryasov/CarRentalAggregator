using CarRentalAggregator.Domain.Entities;

namespace CarRentalAggregator.Application.Interfaces
{
    public interface IJWTService
    {
        string GenerateToken(User user);
    }
}
