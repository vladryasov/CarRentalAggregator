namespace CarRentalAggregator.DTO
{
    public class RentDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid CarId { get; set; }
        public Guid CompanyId { get; set; }
        public DateTime StartRent { get; set; }
        public DateTime EndRent { get; set; }
    }
}
