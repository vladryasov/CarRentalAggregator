using AutoMapper;
using CarRentalAggregator.Application.Interfaces;
using CarRentalAggregator.Domain.Entities;
using CarRentalAggregator.Domain.Interfaces;
using CarRentalAggregator.DTO;

namespace CarRentalAggregator.Application.Services
{
    public class RentService : IRentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public RentService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<RentDto> CreateRentAsync(RentDto rentDto, CancellationToken cancellationToken)
        {
            var rent = _mapper.Map<Rent>(rentDto);

            await _unitOfWork.Rents.AddAsync(rent, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return _mapper.Map<RentDto>(rent);
        }

        public async Task<bool> DeleteRentAsync(Guid rentId, CancellationToken cancellationToken)
        {
            var rent = await _unitOfWork.Rents.GetByIdAsync(rentId, cancellationToken);
            if (rent == null)
                return false;

            _unitOfWork.Rents.Delete(rent);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return true;
        }

        public async Task<IEnumerable<RentDto>> GetAllAsync(CancellationToken cancellationToken)
        {
            var companies = await _unitOfWork.Rents.GetAllAsync(cancellationToken);
            return _mapper.Map<IEnumerable<RentDto>>(companies);
        }

        public async Task<RentDto?> GetRentByIdAsync(Guid rentId, CancellationToken cancellationToken)
        {
            var rent = await _unitOfWork.Rents.GetByIdAsync(rentId, cancellationToken);
            return rent == null ? null : _mapper.Map<RentDto>(rent);
        }

        public async Task<bool> UpdateRentAsync(Guid rentId, RentDto rentDto, CancellationToken cancellationToken)
        {
            var rent = await _unitOfWork.Rents.GetByIdAsync(rentId, cancellationToken);
            if (rent == null)
                return false;

            _mapper.Map(rentDto, rent);

            _unitOfWork.Rents.Update(rent);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return true;
        }

        public async Task<IEnumerable<RentDto>> GetRentsByUserIdAsync(Guid userId, CancellationToken cancellationToken)
        {
            var rents = await _unitOfWork.Rents.GetByUserIdAsync(userId, cancellationToken);
            return _mapper.Map<IEnumerable<RentDto>>(rents);
        }
    }
}
