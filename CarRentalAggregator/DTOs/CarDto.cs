using CarRentalAggregator.Domain.Entities;
using CarRentalAggregator.Domain.Enums;

namespace CarRentalAggregator.DTO
{
    public class CarDto
    {
        public Guid Id { get; set; }
        public string Brand { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public float EngineCapacity { get; set; }
        public int EnginePower { get; set; }
        public EngineTypes EngineType { get; set; }
        public decimal PriceForOneDay { get; set; }

        public Guid CompanyId { get; set; }
        public CompanyDto? CompanyDto { get; set; }
    }
}
