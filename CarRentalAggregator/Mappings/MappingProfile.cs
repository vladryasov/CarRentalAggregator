using AutoMapper;
using CarRentalAggregator.Domain.Entities;
using CarRentalAggregator.DTO;


namespace CarRentalAggregator.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Car, CarDto>();
            CreateMap<CarDto, Car>();

            CreateMap<Company, CompanyDto>();
            CreateMap<CompanyDto, Company>();

            CreateMap<Rent, RentDto>();
            CreateMap<RentDto, Rent>();

            CreateMap<User, UserDto>();
            CreateMap<UserDto, User>();
        }
    }
}
