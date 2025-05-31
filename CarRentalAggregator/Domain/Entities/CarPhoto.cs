namespace CarRentalAggregator.Domain.Entities
{
    public class CarPhoto
    {
        public Guid Id { get; set; }
        public string Url { get; set; } = string.Empty;
        public bool IsPreview { get; set; }

        public Guid CarId { get; set; }
        public Car? Car { get; set; } = null;

        public CarPhoto(string url, bool isPreview, Guid carId, Car? car)
        {
            Url = url;
            IsPreview = isPreview;
            CarId = carId;
            Car = car;
        }

        public CarPhoto() { }
    }
}
