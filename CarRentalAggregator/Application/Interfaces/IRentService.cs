using CarRentalAggregator.DTO;

namespace CarRentalAggregator.Application.Interfaces
{
    public interface IRentService
    {
        public Task<IEnumerable<RentDto>> GetAllAsync(CancellationToken cancellationToken);
        public Task<RentDto?> GetRentByIdAsync(Guid rentId, CancellationToken cancellationToken);
        public Task<RentDto> CreateRentAsync(RentDto rentDto, CancellationToken cancellationToken);
        public Task<bool> DeleteRentAsync(Guid rentId, CancellationToken cancellationToken);
        public Task<bool> UpdateRentAsync(Guid rentId, RentDto rentDto, CancellationToken cancellationToken);
        public Task<IEnumerable<RentDto>> GetRentsByUserIdAsync(Guid userId, CancellationToken cancellationToken);
    }
}
