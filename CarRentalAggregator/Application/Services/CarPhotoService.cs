using AutoMapper;
using CarRentalAggregator.Application.Interfaces;
using CarRentalAggregator.Domain.Entities;
using CarRentalAggregator.Domain.Interfaces;
using CarRentalAggregator.DTOs;
using Microsoft.AspNetCore.Http;

namespace CarRentalAggregator.Application.Services
{
    public class CarPhotoService : ICarPhotoService
    {
        private readonly IPhotoService _photoService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public CarPhotoService(
            IPhotoService photoService,
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _photoService = photoService;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<CarPhotoDto> UploadPhotoAsync(Guid carId, IFormFile file, bool isPreview = false, CancellationToken cancellationToken = default)
        {
            var car = await _unitOfWork.Cars.GetByIdAsync(carId, cancellationToken);
            if (car == null)
                throw new ArgumentException("Car not found", nameof(carId));

            var url = await _photoService.UploadAsync(file);

            var photo = new CarPhoto
            {
                CarId = carId,
                Url = url,
                IsPreview = isPreview
            };

            await _unitOfWork.Cars.AddPhotoAsync(photo, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return _mapper.Map<CarPhotoDto>(photo);
        }

        public async Task<IEnumerable<CarPhotoDto>> GetPhotosAsync(Guid carId, CancellationToken cancellationToken = default)
        {
            var photos = await _unitOfWork.Cars.GetPhotosByCarIdAsync(carId, cancellationToken);
            return _mapper.Map<IEnumerable<CarPhotoDto>>(photos);
        }
    }
}