using CarRentalAggregator.Domain.Entities;
using CarRentalAggregator.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.Design;

namespace CarRentalAggregator.Persistance.Repositories
{
    public class RentRepository : IRentRepository
    {
        private readonly AppDbContext _dbContext;

        public RentRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Rent> AddAsync(Rent entity, CancellationToken cancellationToken = default)
        {
            await _dbContext.Rents.AddAsync(entity);
            return entity;
        }

        public void Delete(Rent rent)
        {
            _dbContext.Rents.Remove(rent);
        }

        public async Task<List<Rent>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            return await _dbContext.Rents
                .ToListAsync(cancellationToken);
        }

        public async Task<Rent> GetByCarId(Guid carId, CancellationToken cancellationToken = default)
        {
            return (await _dbContext.Rents
                .FirstOrDefaultAsync(c => c.CarId == carId, cancellationToken))!;
        }

        public async Task<Rent> GetByCompanyId(Guid companyId, CancellationToken cancellationToken = default)
        {
            return (await _dbContext.Rents
                .FirstOrDefaultAsync(c => c.CompanyId == companyId, cancellationToken))!;
        }

        public async Task<Rent> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return (await _dbContext.Rents
                .FirstOrDefaultAsync(c => c.Id == id, cancellationToken))!;
        }

        public void Update(Rent entity)
        {
            _dbContext.Rents.Update(entity);   
        }
    }
}
