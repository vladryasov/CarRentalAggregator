using CarRentalAggregator.Domain.Entities;
using CarRentalAggregator.Domain.Enums;
using CarRentalAggregator.DTO;

namespace CarRentalAggregator.Application.Interfaces
{
    public interface ICarService
    {
        public Task<IEnumerable<CarDto>> GetAllAsync(CancellationToken cancellationToken);
        public Task<CarDto?> GetCarByIdAsync(Guid carId, CancellationToken cancellationToken);
        public Task<IEnumerable<CarDto?>> GetCarsByCompanyIdAsync(Guid companyId, CancellationToken cancellationToken);
        public Task<IEnumerable<CarDto?>> GetCarByBrandAsync(string brand, CancellationToken cancellationToken);
        public Task<IEnumerable<CarDto?>> GetCarByModelAsync(string model, CancellationToken cancellationToken);
        public Task<IEnumerable<CarDto?>> GetCarByEngineCapacityAsync(float minEngineCapacity, float maxEngineCapacity, CancellationToken cancellationToken);
        public Task<IEnumerable<CarDto?>> GetCarByEnginePowerAsync(int minEnginePower, int maxEnginePower, CancellationToken cancellationToken);
        public Task<IEnumerable<CarDto?>> GetCarByEngineTypeAsync(EngineTypes engineType, CancellationToken cancellationToken);
        public Task<IEnumerable<CarDto?>> GetCarByPriceAsync(decimal minPrice, decimal maxPrice, CancellationToken cancellationToken);
        public Task<CarDto> CreateCarAsync(CarDto carDto, CancellationToken cancellationToken);
        public Task<bool> UpdateCarAsync(Guid id, CarDto carDto, CancellationToken cancellationToken);
        public Task<bool> DeleteCarAsync(Guid id, CancellationToken cancellationToken);

    }
}
