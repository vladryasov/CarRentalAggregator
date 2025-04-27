using CarRentalAggregator.Domain.Entities;
using CarRentalAggregator.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CarRentalAggregator.Persistance.Repositories
{
    public class CompanyRepository : ICompanyRepository
    {
        private readonly AppDbContext _dbContext;

        public CompanyRepository(AppDbContext dbContext) => _dbContext = dbContext;

        public async Task<Company> AddAsync(Company entity, CancellationToken cancellationToken = default)
        {
            await _dbContext.Companies.AddAsync(entity, cancellationToken);
            return entity;
        }

        public void Delete(Company company)
        {
            _dbContext.Companies.Remove(company);
        }

        public async Task<List<Company>> GetAllAsync(CancellationToken cancellationToken = default)
            => await _dbContext.Companies.ToListAsync(cancellationToken);

        public async Task<Company> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
            => (await _dbContext.Companies
                .FirstOrDefaultAsync(c => c.Id == id, cancellationToken))!;

        public void Update(Company entity)
        {
            _dbContext.Companies.Update(entity);
        }
    }
}
