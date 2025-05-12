using CarRentalAggregator.Domain.Enums;

namespace CarRentalAggregator.DTO
{
    public class UserDto
    {
        public Guid Id { get; set; }
        public UserRoles Role { get; set; }
    }
}
