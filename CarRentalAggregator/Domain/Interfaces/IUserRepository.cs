using CarRentalAggregator.Domain.Entities;

namespace CarRentalAggregator.Domain.Interfaces
{
    public interface IUserRepository : IRepository<User>
    {
        Task<User> GetByEmailAsync(string email, CancellationToken cancellationToken);
    }
}
