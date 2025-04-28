using CarRentalAggregator.DTO;

namespace CarRentalAggregator.Application.Interfaces
{
    public interface IUserService
    {
        public Task<IEnumerable<UserDto>> GetAllAsync(CancellationToken cancellationToken);
        public Task<UserDto?> GetUserByIdAsync(Guid userId, CancellationToken cancellationToken);
        public Task<UserDto> CreateUserAsync(UserDto userDto, CancellationToken cancellationToken);
        public Task<bool> DeleteUserAsync(Guid userId, CancellationToken cancellationToken);
        public Task<bool> UpdateUserAsync(Guid userId, UserDto userDto, CancellationToken cancellationToken);
    }
}
