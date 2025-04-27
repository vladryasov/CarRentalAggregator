using CarRentalAggregator.Domain.Entities;
using CarRentalAggregator.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CarRentalAggregator.Persistance.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _dbContext;

        public UserRepository(AppDbContext dbContext) => _dbContext = dbContext;

        public async Task<User> AddAsync(User entity, CancellationToken cancellationToken = default)
        {
            await _dbContext.Users.AddAsync(entity, cancellationToken);
            return entity;
        }

        public void Delete(User user)
        {
            _dbContext.Users.Remove(user);
        }

        public async Task<List<User>> GetAllAsync(CancellationToken cancellationToken = default)
            => await _dbContext.Users.ToListAsync(cancellationToken);

        public async Task<User> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
            => (await _dbContext.Users
                .FirstOrDefaultAsync(u => u.Id == id, cancellationToken))!;

        public void Update(User entity)
        {
            _dbContext.Update(entity);
        }
    }
}
