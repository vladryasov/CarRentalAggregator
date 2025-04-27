namespace CarRentalAggregator.Domain.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IUserRepository Users { get; }
        ICarRepository Cars { get; }
        ICompanyRepository Companies { get; }
        IRentRepository Rents { get; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }

}
