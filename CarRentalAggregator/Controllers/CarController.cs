using CarRentalAggregator.Application.Interfaces;
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

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<CarDto>> GetByCarIdAsync(Guid carId, CancellationToken cancellationToken)
        {
            var car = await _carService.GetCarByIdAsync(carId, cancellationToken);
            return Ok(car);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCar([FromBody] CarDto carDto, CancellationToken cancellationToken)
        { 
            var createdCar = await _carService.CreateCarAsync(carDto, cancellationToken);
            return CreatedAtAction(nameof(GetByCarIdAsync), new { id = createdCar.Id }, createdCar);
        }
    }
}
