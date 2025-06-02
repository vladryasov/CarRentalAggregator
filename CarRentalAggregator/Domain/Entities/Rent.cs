using CarRentalAggregator.Domain.Enums;

namespace CarRentalAggregator.Domain.Entities
{
    public class Rent
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid UserId { get; set; }
        public Guid CarId { get; set; }
        public Guid CompanyId { get; set; }
        public DateTime StartRent { get; set; }
        public DateTime EndRent { get; set; }
        public decimal TotalPrice { get; set; }
        public RentalStatus Status { get; set; } = RentalStatus.Active;

        public Car? Car { get; set; }
        public User? User { get; set; }
        public Company? Company { get; set; }

        public Rent(Guid userId, Guid carId, Guid companyId, DateTime startRent, DateTime endRent, decimal totalPrice)
        {
            UserId = userId;
            CarId = carId;
            CompanyId = companyId;
            StartRent = startRent;
            EndRent = endRent;
            TotalPrice = totalPrice;
        }

        public Rent() { }
    }
}
