using CarRentalAggregator.Domain.Entities;
using CarRentalAggregator.Domain.Enums;

namespace CarRentalAggregator.Domain.Interfaces
{
    public interface ICarRepository : IRepository<Car>
    {
        Task<List<Car>> GetByCompanyIdAsync(Guid companyId, CancellationToken cancellationToken = default);
        Task<List<Car>> GetByBrandAsync(string brand, CancellationToken cancellationToken = default);
        Task<List<Car>> GetByEngineCapacityAsync(float minEngineCapacity, float maxEngineCapacity, CancellationToken cancellationToken = default);
        Task<List<Car>> GetByEnginePowerAsync(int minEnginePower, int maxEnginePower, CancellationToken cancellationToken = default);
        Task<List<Car>> GetByEngineTypeAsync(EngineTypes engineType, CancellationToken cancellationToken = default);
        Task<List<Car>> GetByModelAsync(string model, CancellationToken cancellationToken = default);
        Task<List<Car>> GetByPriceAsync(decimal minPrice, decimal maxPrice, CancellationToken cancellationToken = default);

    }
}
