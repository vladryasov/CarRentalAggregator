using AutoMapper;
using CarRentalAggregator.Application.Interfaces;
using CarRentalAggregator.Domain.Entities;
using CarRentalAggregator.Domain.Enums;
using CarRentalAggregator.Domain.Interfaces;
using CarRentalAggregator.DTO;
using System.Globalization;

namespace CarRentalAggregator.Application.Services
{
    public class CarService : ICarService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public CarService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<CarDto>> GetAllAsync(CancellationToken cancellationToken)
        {
            var cars = await _unitOfWork.Cars.GetAllAsync(cancellationToken);
            return _mapper.Map<IEnumerable<CarDto>>(cars);
        }

        public async Task<CarDto?> GetCarByIdAsync(Guid carId, CancellationToken cancellationToken)
        {
            var car = await _unitOfWork.Cars.GetByIdAsync(carId, cancellationToken);
            return car == null ? null : _mapper.Map<CarDto>(car);
        }

        public async Task<IEnumerable<CarDto?>> GetCarsByCompanyIdAsync(Guid companyId, CancellationToken cancellationToken)
        {
            var cars = await _unitOfWork.Cars.GetByCompanyIdAsync(companyId, cancellationToken);
            return _mapper.Map<IEnumerable<CarDto>>(cars);
        }

        public async Task<IEnumerable<CarDto?>> GetCarByBrandAsync(string brand, CancellationToken cancellationToken)
        {
            var cars = await _unitOfWork.Cars.GetByBrandAsync(brand, cancellationToken);
            return (cars == null ? null : _mapper.Map<IEnumerable<CarDto>>(cars))!;
        }

        public async Task<IEnumerable<CarDto?>> GetCarByModelAsync(string model, CancellationToken cancellationToken)
        {
            var cars = await _unitOfWork.Cars.GetByModelAsync(model, cancellationToken);
            return (cars == null ? null : _mapper.Map<IEnumerable<CarDto>>(cars))!;
        }

        public async Task<IEnumerable<CarDto?>> GetCarByEngineCapacityAsync(float minEngineCapacity, float maxEngineCapacity, CancellationToken cancellationToken)
        {
            var cars = await _unitOfWork.Cars.GetByEngineCapacityAsync(minEngineCapacity, maxEngineCapacity, cancellationToken);
            return (cars == null ? null : _mapper.Map<IEnumerable<CarDto>>(cars))!;
        }

        public async Task<IEnumerable<CarDto?>> GetCarByEnginePowerAsync(int minEnginePower, int maxEnginePower, CancellationToken cancellationToken)
        {
            var cars = await _unitOfWork.Cars.GetByEnginePowerAsync(minEnginePower, maxEnginePower, cancellationToken);
            return (cars == null ? null : _mapper.Map<IEnumerable<CarDto>>(cars))!;
        }

        public async Task<IEnumerable<CarDto?>> GetCarByEngineTypeAsync(EngineTypes engineType, CancellationToken cancellationToken)
        {
            var cars = await _unitOfWork.Cars.GetByEngineTypeAsync(engineType, cancellationToken);
            return (cars == null ? null : _mapper.Map<IEnumerable<CarDto>>(cars))!;
        }

        public async Task<IEnumerable<CarDto?>> GetCarByPriceAsync(decimal minPrice, decimal maxPrice, CancellationToken cancellationToken)
        {
            var cars = await _unitOfWork.Cars.GetByPriceAsync(minPrice, maxPrice, cancellationToken);
            return (cars == null ? null : _mapper.Map<IEnumerable<CarDto>>(cars))!;
        }

        public async Task<CarDto> CreateCarAsync(CarDto carDto, CancellationToken cancellationToken)
        {
            var car = _mapper.Map<Car>(carDto);

            var company = await _unitOfWork.Companies.GetByIdAsync(car.CompanyId, cancellationToken);
            if(company == null)
            {
                throw new Exception("Компания с таким Id не найдена");
            }

            await _unitOfWork.Cars.AddAsync(car, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return _mapper.Map<CarDto>(car);
        }

        public async Task<bool> UpdateCarAsync(Guid userId, CarDto carDto, CancellationToken cancellationToken)
        {
            var car = await _unitOfWork.Cars.GetByIdAsync(userId, cancellationToken);
            if (car == null)
                return false;

            _mapper.Map(carDto, car);

            _unitOfWork.Cars.Update(car);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return true;
        }

        public async Task<bool> DeleteCarAsync(Guid userId, CancellationToken cancellationToken)
        {
            var car = await _unitOfWork.Cars.GetByIdAsync(userId, cancellationToken);
            if (car == null)
                return false;

            _unitOfWork.Cars.Delete(car);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}
