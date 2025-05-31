using CarRentalAggregator.Domain.Enums;

namespace CarRentalAggregator.Domain.Entities
{
    public class Car
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Brand { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public float EngineCapacity { get; set; }
        public int EnginePower { get; set; }
        public EngineTypes EngineType { get; set; }

        public decimal PriceForOneDay { get; set; }

        public Guid CompanyId { get; set; }
        public Company? Company { get; set; } = null;
        public List<CarPhoto>? Photos { get; set; }

        public Car(string brand, string model, string description,
                   float engineCapacity, int enginePower,
                   EngineTypes engineType, decimal priceForOneDay,
                   Company company, List<CarPhoto> photos)
        {
            Brand = brand;
            Model = model;
            Description = description;
            EngineCapacity = engineCapacity;
            EnginePower = enginePower;
            EngineType = engineType;
            PriceForOneDay = priceForOneDay;
            Company = company;
            Photos = photos;
        }

        public Car() { }
    }
}
