using CarRentalAggregator.Domain.Interfaces;

namespace CarRentalAggregator.Persistance
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;

        public IUserRepository Users { get; }
        public ICarRepository Cars { get; }
        public ICompanyRepository Companies { get; }
        public IRentRepository Rents { get; }

        public UnitOfWork(
            AppDbContext context,
            IUserRepository userRepository,
            ICarRepository carRepository,
            ICompanyRepository companyRepository,
            IRentRepository rentRepository)
        {
            _context = context;
            Users = userRepository;
            Cars = carRepository;
            Companies = companyRepository;
            Rents = rentRepository;
        }

        public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            return await _context.SaveChangesAsync(cancellationToken);
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }

}
