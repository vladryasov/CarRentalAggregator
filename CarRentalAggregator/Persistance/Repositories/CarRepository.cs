using CarRentalAggregator.Domain.Entities;
using CarRentalAggregator.Domain.Enums;
using CarRentalAggregator.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CarRentalAggregator.Persistance.Repositories
{
    public class CarRepository : ICarRepository
    {
        private readonly AppDbContext _dbContext;

        public CarRepository(AppDbContext dbContext) => _dbContext = dbContext;

        public async Task<Car> AddAsync(Car entity, CancellationToken cancellationToken = default)
        {
            await _dbContext.Cars.AddAsync(entity, cancellationToken);
            return entity;
        }

        public void Delete(Car car)
        {
            _dbContext.Cars.Remove(car);
        }

        public async Task<List<Car>> GetAllAsync(CancellationToken cancellationToken = default)
            => await _dbContext.Cars.ToListAsync(cancellationToken);

        public async Task<List<Car>> GetByBrandAsync(string brand, CancellationToken cancellationToken = default)
            => await _dbContext.Cars
                .Where(c => c.Brand == brand)
                .ToListAsync(cancellationToken);

        public async Task<List<Car>> GetByEngineCapacityAsync(float engineCapacity, CancellationToken cancellationToken = default)
            => await _dbContext.Cars
                .Where(c => c.EngineCapacity >= engineCapacity)
                .ToListAsync(cancellationToken);

        public async Task<List<Car>> GetByEnginePowerAsync(int enginePower, CancellationToken cancellationToken = default)
            => await _dbContext.Cars
                .Where(c => c.EnginePower >= enginePower)
                .ToListAsync(cancellationToken);

        public async Task<List<Car>> GetByEngineTypeAsync(EngineTypes engineType, CancellationToken cancellationToken = default)
            => await _dbContext.Cars
                .Where(c => c.EngineType == engineType)
                .ToListAsync(cancellationToken);

        public async Task<Car> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
            => (await _dbContext.Cars
                .FirstOrDefaultAsync(c => c.Id == id, cancellationToken))!;

        public async Task<List<Car>> GetByCompanyIdAsync(Guid companyId, CancellationToken cancellationToken = default)
            => await _dbContext.Cars
                .Where(c => c.CompanyId == companyId)
                .ToListAsync(cancellationToken);

        public async Task<List<Car>> GetByModelAsync(string model, CancellationToken cancellationToken = default)
            => await _dbContext.Cars
                .Where(c => c.Model == model)
                .ToListAsync(cancellationToken);

        public async Task<List<Car>> GetByPriceAsync(decimal price, CancellationToken cancellationToken = default)
            => await _dbContext.Cars
                .Where(c => c.PriceForOneDay <= price)
                .ToListAsync(cancellationToken);

        public void Update(Car entity)
        {
            _dbContext.Cars.Update(entity);
        }
    }
}
