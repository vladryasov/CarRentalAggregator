using CarRentalAggregator.Domain.Entities;

namespace CarRentalAggregator.Domain.Interfaces
{
    public interface IRentRepository : IRepository<Rent>
    {
        Task<Rent> GetByCarId(Guid carId, CancellationToken cancellationToken = default);
        Task<Rent> GetByCompanyId(Guid companyId, CancellationToken cancellationToken = default);
        Task<List<Rent>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    }
}
