using CarRentalAggregator.DTO;

namespace CarRentalAggregator.DTOs
{
    public class AuthResponse
    {
        public string Token { get; set; }
        public UserDto UserDto { get; set; }
    }
}
