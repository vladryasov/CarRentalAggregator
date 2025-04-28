using CarRentalAggregator.DTO;

namespace CarRentalAggregator.Application.Interfaces
{
    public interface ICompanyService
    {
        public Task<IEnumerable<CompanyDto>> GetAllAsync(CancellationToken cancellationToken);
        public Task<CompanyDto?> GetCompanyByIdAsync(Guid companyId, CancellationToken cancellationToken);
        public Task<CompanyDto> CreateCompanyAsync(CompanyDto companyDto, CancellationToken cancellationToken);
        public Task<bool> DeleteCompanyAsync(Guid companyId, CancellationToken cancellationToken);
        public Task<bool> UpdateCompanyAsync(Guid companyId, CompanyDto companyDto, CancellationToken cancellationToken);
    }
}
