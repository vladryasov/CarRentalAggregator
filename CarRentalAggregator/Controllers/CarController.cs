using CarRentalAggregator.Application.Interfaces;
using CarRentalAggregator.Domain.Enums;
using CarRentalAggregator.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        public async Task<ActionResult<IEnumerable<CarDto>>> GetByCarBrandAsync(string brand, CancellationToken cancellationToken)
        {
            var cars = await _carService.GetCarByBrandAsync(brand, cancellationToken);
            return Ok(cars);
        }

        [HttpGet("model/{model}")]
        public async Task<ActionResult<IEnumerable<CarDto>>> GetByCarModelAsync(string model, CancellationToken cancellationToken)
        {
            var cars = await _carService.GetCarByModelAsync(model, cancellationToken);
            return Ok(cars);
        }

        [HttpGet("engine-capacity-range")]
        public async Task<ActionResult<IEnumerable<CarDto>>> GetByCarEngineCapacityAsync(
            [FromQuery] float minEngineCapacity,
            [FromQuery] float maxEngineCapacity,
            CancellationToken cancellationToken)
        {
            if (minEngineCapacity > maxEngineCapacity)
            {
                return BadRequest("minEngineCapacity must be less than or equal to maxEngineCapacity");
            }

            var cars = await _carService.GetCarByEngineCapacityAsync(minEngineCapacity, maxEngineCapacity, cancellationToken);
            return Ok(cars);
        }

        [HttpGet("engine-type/{engineType}")]
        public async Task<ActionResult<IEnumerable<CarDto>>> GetByCarEngineTypeAsync(EngineTypes engineType, CancellationToken cancellationToken)
        {
            var cars = await _carService.GetCarByEngineTypeAsync(engineType, cancellationToken);
            return Ok(cars);
        }

        [HttpGet("engine-power-range")]
        public async Task<ActionResult<IEnumerable<CarDto>>> GetByCarEnginePowerAsync(
            [FromQuery] int minEnginePower,
            [FromQuery] int maxEnginePower,
            CancellationToken cancellationToken)
        {
            if (minEnginePower > maxEnginePower)
            {
                return BadRequest("minEnginePower must be less than or equal to maxEnginePower");
            }

            var cars = await _carService.GetCarByEnginePowerAsync(minEnginePower, maxEnginePower, cancellationToken);
            return Ok(cars);
        }

        [HttpGet("price-range")]
        public async Task<ActionResult<IEnumerable<CarDto>>> GetByCarPriceAsync(
            [FromQuery] decimal minPrice,
            [FromQuery] decimal maxPrice,
            CancellationToken cancellationToken)
        {
            if (minPrice > maxPrice)
            {
                return BadRequest("minPrice must be less than or equal to maxPrice");
            }

            var cars = await _carService.GetCarByPriceAsync(minPrice, maxPrice, cancellationToken);
            return Ok(cars);
        }

        [HttpGet("filter")]
        public async Task<ActionResult<IEnumerable<CarDto>>> GetFilteredCars(
            [FromQuery] double minCapacity,
            [FromQuery] double maxCapacity,
            [FromQuery] int minPower,
            [FromQuery] int maxPower,
            [FromQuery] int minPrice,
            [FromQuery] int maxPrice,
            [FromQuery] string? sortByPrice,
            [FromQuery] string? searchQuery = null)
        {
            var cars = await _carService.FilterCarsAsync(minCapacity, maxCapacity, minPower, maxPower, minPrice, maxPrice, sortByPrice, searchQuery);
            return Ok(cars);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCar([FromBody] CarDto carDto, CancellationToken cancellationToken)
        {
            var createdCar = await _carService.CreateCarAsync(carDto, cancellationToken);
            return CreatedAtAction(nameof(GetByCarIdAsync), new { carId = createdCar.Id }, createdCar);
        }
    }
}
