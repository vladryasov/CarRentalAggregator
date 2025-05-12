using AutoMapper;
using CarRentalAggregator.Domain.Entities;
using CarRentalAggregator.Domain.Enums;
using CarRentalAggregator.Domain.Interfaces;
using CarRentalAggregator.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
[Authorize(Policy = "AdminOnly")]
public class AdminController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public AdminController(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    [HttpPost("set-admin/{userId}")]
    public async Task<IActionResult> SetAdmin(Guid userId)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user == null)
            return NotFound("User not found");

        user.Role = UserRoles.Admin;
        await _unitOfWork.SaveChangesAsync();

        return Ok(new { message = "User set to Admin" });
    }

    [HttpPost("create-company")]
    public async Task<IActionResult> CreateCompany([FromBody] CompanyDto companyDto, CancellationToken cancellationToken)
    {
        if (companyDto == null || string.IsNullOrWhiteSpace(companyDto.Name))
            return BadRequest("Company name is required");

        var company = _mapper.Map<Company>(companyDto);
        await _unitOfWork.Companies.AddAsync(company, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetCompanyById), new { id = company.Id }, _mapper.Map<CompanyDto>(company));
    }

    [HttpPost("add-car")]
    public async Task<IActionResult> AddCar([FromBody] CarDto carDto, CancellationToken cancellationToken)
    {
        if (carDto == null || carDto.CompanyId == Guid.Empty || string.IsNullOrWhiteSpace(carDto.Model))
            return BadRequest("CompanyId, Model, and LicensePlate are required");

        var company = await _unitOfWork.Companies.GetByIdAsync(carDto.CompanyId, cancellationToken);
        if (company == null)
            return NotFound("Company not found");

        var car = _mapper.Map<Car>(carDto);
        await _unitOfWork.Cars.AddAsync(car, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetCarById), new { id = car.Id }, _mapper.Map<CarDto>(car));
    }

    // Дополнительные методы для получения (опционально)
    [HttpGet("company/{id}")]
    public async Task<IActionResult> GetCompanyById(Guid id, CancellationToken cancellationToken)
    {
        var company = await _unitOfWork.Companies.GetByIdAsync(id, cancellationToken);
        return company == null ? NotFound() : Ok(_mapper.Map<CompanyDto>(company));
    }

    [HttpGet("car/{id}")]
    public async Task<IActionResult> GetCarById(Guid id, CancellationToken cancellationToken)
    {
        var car = await _unitOfWork.Cars.GetByIdAsync(id, cancellationToken);
        return car == null ? NotFound() : Ok(_mapper.Map<CarDto>(car));
    }
}
