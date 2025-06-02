using CarRentalAggregator.DTOs;
using Microsoft.AspNetCore.Http;

namespace CarRentalAggregator.Application.Interfaces
{
    public interface ICarPhotoService
    {
        Task<CarPhotoDto> UploadPhotoAsync(Guid carId, IFormFile file, bool isPreview = false, CancellationToken cancellationToken = default);
        Task<IEnumerable<CarPhotoDto>> GetPhotosAsync(Guid carId, CancellationToken cancellationToken = default);
    }
}