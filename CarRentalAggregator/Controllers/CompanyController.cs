using CarRentalAggregator.Application.Interfaces;
using CarRentalAggregator.Domain.Enums;
using CarRentalAggregator.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CarRentalAggregator.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompanyController : ControllerBase
    {
        private readonly ICompanyService _companyService;

        public CompanyController(ICompanyService companyService)
        {
            _companyService = companyService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CompanyDto>>> GetAll(CancellationToken cancellationToken)
        {
            var companys = await _companyService.GetAllAsync(cancellationToken);
            return Ok(companys);
        }

        [HttpGet("{companyId:guid}")]
        [ActionName(nameof(GetByCompanyIdAsync))]
        public async Task<ActionResult<CompanyDto>> GetByCompanyIdAsync(Guid companyId, CancellationToken cancellationToken)
        {
            var company = await _companyService.GetCompanyByIdAsync(companyId, cancellationToken);
            return Ok(company);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCompany([FromBody] CompanyDto companyDto, CancellationToken cancellationToken)
        {
            var createdCompany = await _companyService.CreateCompanyAsync(companyDto, cancellationToken);
            return CreatedAtAction(nameof(GetByCompanyIdAsync), new { companyId = createdCompany.Id }, createdCompany);
        }
        
    }
}
