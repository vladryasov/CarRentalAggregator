using CarRentalAggregator.Application.Interfaces;
using CarRentalAggregator.Application.Services;
using CarRentalAggregator.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CarRentalAggregator.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetAll(CancellationToken cancellationToken)
        {
            var users = await _userService.GetAllAsync(cancellationToken);
            return Ok(users);
        }

        [HttpGet("{userId:guid}")]
        [ActionName(nameof(GetByUserIdAsync))]
        public async Task<ActionResult<UserDto>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken)
        {
            var user = await _userService.GetUserByIdAsync(userId, cancellationToken);
            return Ok(user);
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] UserDto userDto, CancellationToken cancellationToken)
        {
            var createdUser = await _userService.CreateUserAsync(userDto, cancellationToken);
            return CreatedAtAction(nameof(GetByUserIdAsync), new {userId = createdUser.Id}, createdUser);
        }
    }
}
