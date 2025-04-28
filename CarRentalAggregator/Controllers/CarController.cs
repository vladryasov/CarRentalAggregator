using CarRentalAggregator.Application.Interfaces;
using CarRentalAggregator.Domain.Enums;
using CarRentalAggregator.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CarRentalAggregator.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarController : ControllerBase
    {
        private readonly ICarService _carService;

        public CarController(ICarService carService)
        {
            _carService = carService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CarDto>>> GetAll(CancellationToken cancellationToken)
        {
            var cars = await _carService.GetAllAsync(cancellationToken);
            return Ok(cars);
        }

        [HttpGet("by-company/{companyId}")]
        public async Task<ActionResult<IEnumerable<CarDto>>> GetByCompanyIdAsync(Guid companyId, CancellationToken cancellationToken)
        {
            var cars = await _carService.GetCarsByCompanyIdAsync(companyId, cancellationToken);
            return Ok(cars);
        }

        [HttpGet("{carId:guid}")]
        [ActionName(nameof(GetByCarIdAsync))]
        public async Task<ActionResult<CarDto>> GetByCarIdAsync(Guid carId, CancellationToken cancellationToken)
        {
            var car = await _carService.GetCarByIdAsync(carId, cancellationToken);
            return Ok(car);
        }

        [HttpGet("brand/{brand}")]
        public async Task<ActionResult<CarDto>> GetByCarBrandAsync(string brand, CancellationToken cancellationToken)
        {
            var car = await _carService.GetCarByBrandAsync(brand, cancellationToken);
            return Ok(car);
        }

        [HttpGet("model/{model}")]
        public async Task<ActionResult<CarDto>> GetByCarModelAsync(string model, CancellationToken cancellationToken)
        {
            var car = await _carService.GetCarByModelAsync(model, cancellationToken);
            return Ok(car);
        }

        [HttpGet("engineCapacity/{engineCapacity}")]
        public async Task<ActionResult<CarDto>> GetByCarEngineCapacityAsync(float engineCapacity, CancellationToken cancellationToken)
        {
            var car = await _carService.GetCarByEngineCapacityAsync(engineCapacity, cancellationToken);
            return Ok(car);
        }

        [HttpGet("engineType/{engineType}")]
        public async Task<ActionResult<CarDto>> GetByCarEngineTypeAsync(EngineTypes engineType, CancellationToken cancellationToken)
        {
            var car = await _carService.GetCarByEngineTypeAsync(engineType, cancellationToken);
            return Ok(car);
        }

        [HttpGet("enginePower/{enginePower}")]
        public async Task<ActionResult<CarDto>> GetByCarEnginePowerAsync(int enginePower, CancellationToken cancellationToken)
        {
            var car = await _carService.GetCarByEnginePowerAsync(enginePower, cancellationToken);
            return Ok(car);
        }

        [HttpGet("price/{price}")]
        public async Task<ActionResult<CarDto>> GetByCarPriceAsync(decimal price, CancellationToken cancellationToken)
        {
            var car = await _carService.GetCarByPriceAsync(price, cancellationToken);
            return Ok(car);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCar([FromBody] CarDto carDto, CancellationToken cancellationToken)
        { 
            var createdCar = await _carService.CreateCarAsync(carDto, cancellationToken);
            return CreatedAtAction(nameof(GetByCarIdAsync), new { carId = createdCar.Id }, createdCar);
        }
    }
}
