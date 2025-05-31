namespace CarRentalAggregator.DTOs
{
    public class CarPhotoDto
    {
        public Guid Id { get; set; }
        public string Url { get; set; } = string.Empty;
        public bool IsPreview { get; set; }
    }
}
