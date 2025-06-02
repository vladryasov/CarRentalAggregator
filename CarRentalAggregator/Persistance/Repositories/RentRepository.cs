using CarRentalAggregator.Domain.Entities;
using CarRentalAggregator.Domain.Interfaces;
using CarRentalAggregator.Domain.Enums;
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
                .Include(r => r.Car)
                .Include(r => r.User)
                .Include(r => r.Company)
                .ToListAsync(cancellationToken);
        }

        public async Task<Rent> GetByCarId(Guid carId, CancellationToken cancellationToken = default)
        {
            return (await _dbContext.Rents
                .Include(r => r.Car)
                .Include(r => r.User)
                .Include(r => r.Company)
                .FirstOrDefaultAsync(c => c.CarId == carId, cancellationToken))!;
        }

        public async Task<Rent> GetByCompanyId(Guid companyId, CancellationToken cancellationToken = default)
        {
            return (await _dbContext.Rents
                .Include(r => r.Car)
                .Include(r => r.User)
                .Include(r => r.Company)
                .FirstOrDefaultAsync(c => c.CompanyId == companyId, cancellationToken))!;
        }

        public async Task<List<Rent>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            return await _dbContext.Rents
                .Include(r => r.Car)
                    .ThenInclude(c => c!.Photos)
                .Include(r => r.User)
                .Include(r => r.Company)
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.StartRent)
                .ToListAsync(cancellationToken);
        }

        public async Task<Rent> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return (await _dbContext.Rents
                .Include(r => r.Car)
                .Include(r => r.User)
                .Include(r => r.Company)
                .FirstOrDefaultAsync(c => c.Id == id, cancellationToken))!;
        }

        public async Task CancelRentAsync(Guid rentId, CancellationToken cancellationToken = default)
        {
            var rent = await GetByIdAsync(rentId, cancellationToken);
            if (rent != null)
            {
                rent.Status = RentalStatus.Cancelled;
                Update(rent);
            }
        }

        public async Task CompleteRentAsync(Guid rentId, CancellationToken cancellationToken = default)
        {
            var rent = await GetByIdAsync(rentId, cancellationToken);
            if (rent != null)
            {
                rent.Status = RentalStatus.Completed;
                Update(rent);
            }
        }

        public void Update(Rent entity)
        {
            _dbContext.Rents.Update(entity);
        }
    }
}
