using AutoMapper;
using CarRentalAggregator.Domain.Entities;
using CarRentalAggregator.DTO;
using CarRentalAggregator.DTOs;


namespace CarRentalAggregator.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Car, CarDto>();
            CreateMap<CarDto, Car>();

            CreateMap<CarPhoto, CarPhotoDto>();
            CreateMap<CarPhotoDto, CarPhoto>();

            CreateMap<Company, CompanyDto>();
            CreateMap<CompanyDto, Company>();

            CreateMap<Rent, RentDto>();
            CreateMap<RentDto, Rent>();

            CreateMap<User, UserDto>();
            CreateMap<UserDto, User>();
        }
    }
}
