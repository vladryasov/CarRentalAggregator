using CarRentalAggregator.Domain.Enums;

namespace CarRentalAggregator.Domain.Entities
{
    public class User
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public UserRoles Role { get; set; }

        public User(string email, string password, UserRoles role)
        {
            Email = email;
            Password = password;
            Role = role;
        }
    }
}
