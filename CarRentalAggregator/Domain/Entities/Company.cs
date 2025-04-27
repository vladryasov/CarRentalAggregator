namespace CarRentalAggregator.Domain.Entities
{
    public class Company
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public List<Car>? Cars { get; set; }

        public Company(string name, string phoneNumber, string email, List<Car>? cars)
        {
            Name = name;
            PhoneNumber = phoneNumber;
            Email = email;
            Cars = cars;
        }
        public Company() { }
    }
}
