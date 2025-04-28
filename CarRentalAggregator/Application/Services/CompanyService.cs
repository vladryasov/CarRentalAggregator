using AutoMapper;
using CarRentalAggregator.Application.Interfaces;
using CarRentalAggregator.Domain.Entities;
using CarRentalAggregator.Domain.Interfaces;
using CarRentalAggregator.DTO;

namespace CarRentalAggregator.Application.Services
{
    public class CompanyService : ICompanyService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public CompanyService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<CompanyDto> CreateCompanyAsync(CompanyDto companyDto, CancellationToken cancellationToken)
        {
            var company = _mapper.Map<Company>(companyDto);

            await _unitOfWork.Companies.AddAsync(company, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return _mapper.Map<CompanyDto>(company);
        }

        public async Task<bool> DeleteCompanyAsync(Guid companyId, CancellationToken cancellationToken)
        {
            var company = await _unitOfWork.Companies.GetByIdAsync(companyId, cancellationToken);
            if (company == null)
                return false;

            _unitOfWork.Companies.Delete(company);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return true;
        }

        public async Task<IEnumerable<CompanyDto>> GetAllAsync(CancellationToken cancellationToken)
        {
            var companies = await _unitOfWork.Companies.GetAllAsync(cancellationToken);
            return _mapper.Map<IEnumerable<CompanyDto>>(companies);
        }

        public async Task<CompanyDto?> GetCompanyByIdAsync(Guid companyId, CancellationToken cancellationToken)
        {
            var company = await _unitOfWork.Companies.GetByIdAsync(companyId, cancellationToken);
            return company == null ? null : _mapper.Map<CompanyDto>(company);
        }

        public async Task<bool> UpdateCompanyAsync(Guid companyId, CompanyDto companyDto, CancellationToken cancellationToken)
        {
            var company = await _unitOfWork.Companies.GetByIdAsync(companyId, cancellationToken);
            if (company == null)
                return false;

            _mapper.Map(companyDto, company);

            _unitOfWork.Companies.Update(company);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}
