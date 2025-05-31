using CarRentalAggregator.Application.Interfaces;
using CarRentalAggregator.Domain.Entities;
using CarRentalAggregator.Domain.Interfaces;
using CarRentalAggregator.DTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class CarPhotoController : ControllerBase
{
    private readonly IPhotoService _photoService;
    private readonly ICarRepository _carRepository;

    public CarPhotoController(IPhotoService photoService, ICarRepository carRepository)
    {
        _photoService = photoService;
        _carRepository = carRepository;
    }

    // Загрузка фото
    [HttpPost("{carId:guid}/upload")]
    public async Task<IActionResult> UploadPhoto(Guid carId, [FromForm] IFormFile file, [FromQuery] bool isPreview = false)
    {
        var car = await _carRepository.GetByIdAsync(carId);
        if (car == null) return NotFound("Car not found");

        var url = await _photoService.UploadAsync(file);

        var photo = new CarPhoto
        {
            CarId = carId,
            Url = url,
            IsPreview = isPreview
        };

        await _carRepository.AddPhotoAsync(photo);

        return Ok(new { photo.Id, photo.Url, photo.IsPreview });
    }

    // Получить все фото для автомобиля
    [HttpGet("{carId:guid}")]
    public async Task<IActionResult> GetPhotos(Guid carId)
    {
        var photos = await _carRepository.GetPhotosByCarIdAsync(carId);
        var result = photos.Select(p => new CarPhotoDto
        {
            Id = p.Id,
            Url = p.Url,
            IsPreview = p.IsPreview
        });

        return Ok(result);
    }
}
