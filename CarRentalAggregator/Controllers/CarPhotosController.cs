using CarRentalAggregator.Application.Interfaces;
using CarRentalAggregator.DTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class CarPhotoController : ControllerBase
{
    private readonly ICarPhotoService _carPhotoService;

    public CarPhotoController(ICarPhotoService carPhotoService)
    {
        _carPhotoService = carPhotoService;
    }

    // Загрузка фото
    [HttpPost("{carId:guid}/upload")]
    public async Task<IActionResult> UploadPhoto(Guid carId, [FromForm] IFormFile file, [FromQuery] bool isPreview = false)
    {
        try
        {
            var photo = await _carPhotoService.UploadPhotoAsync(carId, file, isPreview);
            return Ok(photo);
        }
        catch (ArgumentException ex)
        {
            return NotFound(ex.Message);
        }
    }

    // Получить все фото для автомобиля
    [HttpGet("{carId:guid}")]
    public async Task<IActionResult> GetPhotos(Guid carId)
    {
        var photos = await _carPhotoService.GetPhotosAsync(carId);
        return Ok(photos);
    }
}
