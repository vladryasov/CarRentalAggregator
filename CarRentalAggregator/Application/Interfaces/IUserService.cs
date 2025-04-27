using CarRentalAggregator.DTO;

namespace CarRentalAggregator.Application.Interfaces
{
    public interface IUserService
    {
        public Task<IEnumerable<UserDto>> GetAllAsync(CancellationToken cancellationToken);
        public Task<UserDto?> GetUserByIdAsync(Guid userId, CancellationToken cancellationToken);
        public Task<UserDto> CreateUserAsync(UserDto userDto, CancellationToken cancellationToken);
    }
}
