using CarRentalAggregator.Application.Interfaces;
using CarRentalAggregator.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CarRentalAggregator.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RentController : ControllerBase
    {
        private readonly IRentService _rentService;

        public RentController(IRentService rentService)
        {
            _rentService = rentService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateRent([FromBody] RentDto rentDto, CancellationToken cancellationToken)
        {
            try
            {
                var rent = await _rentService.CreateRentAsync(rentDto, cancellationToken);
                return CreatedAtAction(nameof(GetRentById), new { id = rent.Id }, rent);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetRentById(Guid id, CancellationToken cancellationToken)
        {
            var rent = await _rentService.GetRentByIdAsync(id, cancellationToken);
            return rent == null ? NotFound() : Ok(rent);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllRents(CancellationToken cancellationToken)
        {
            var rents = await _rentService.GetAllAsync(cancellationToken);
            return Ok(rents);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRent(Guid id, [FromBody] RentDto rentDto, CancellationToken cancellationToken)
        {
            try
            {
                await _rentService.UpdateRentAsync(id, rentDto, cancellationToken);
                return NoContent();
            }
            catch (ArgumentNullException)
            {
                return BadRequest(new { message = "Rent data is required" });
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = "Rent not found" });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRent(Guid id, CancellationToken cancellationToken)
        {
            try
            {
                await _rentService.DeleteRentAsync(id, cancellationToken);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = "Rent not found" });
            }
        }

        [HttpGet("my")]
        public async Task<IActionResult> GetMyRents(CancellationToken cancellationToken)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized();
            }

            var rents = await _rentService.GetRentsByUserIdAsync(userId, cancellationToken);
            return Ok(rents);
        }
    }
}
