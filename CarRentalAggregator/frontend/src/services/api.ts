import axios from 'axios';
import { LoginRequest, LoginResponse, UserDto } from '../types/AuthTypes';
import { CarDto } from '../types/CarDto';
import { CompanyDto } from '../types/CompanyDto';
import { RentalDto } from '../types/RentalTypes';

export const api = axios.create({
  baseURL: 'https://localhost:7198',
  withCredentials: true,
});

// Interceptor для добавления токена к запросам
api.interceptors.request.use((config) => {
  const currentUser = localStorage.getItem('currentUser');
  if (currentUser) {
    const token = JSON.parse(currentUser).token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// 🔐 Auth
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/api/Auth/login', data);

  localStorage.setItem(
    'currentUser',
    JSON.stringify({ 
      userId: response.data.userId, 
      token: response.data.token,
      rememberMe: data.rememberMe 
    })
  );

  api.defaults.headers.Authorization = `Bearer ${response.data.token}`;
  return response.data;
};

export const register = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/api/Auth/register', data);
  return response.data;
};

export const autoLogin = async (): Promise<UserDto> => {
  const response = await api.get<UserDto>('/api/Auth/auto-login');
  return response.data;
};

// Функция для проверки, нужно ли выполнять автологин
export const shouldAutoLogin = (): boolean => {
  const currentUser = localStorage.getItem('currentUser');
  return !!currentUser; // возвращаем true только если есть сохраненный пользователь
};

export const logout = async (): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>('/api/Auth/logout');
  return response.data;
};

export const getUserById = async (userId: string): Promise<UserDto> => {
  const response = await api.get<UserDto>(`/api/User/${userId}`);
  return response.data;
};

// 🚗 Cars
export const fetchCars = async (): Promise<CarDto[]> => {
  const response = await api.get<CarDto[]>('/api/Car');
  return response.data;
};

export const searchCarsByBrand = async (brand: string): Promise<CarDto[]> => {
  const response = await api.get<CarDto[]>(`/api/Car/brand/${brand}`);
  return response.data;
};

export const searchCarsByModel = async (model: string): Promise<CarDto[]> => {
  const response = await api.get<CarDto[]>(`/api/Car/model/${model}`);
  return response.data;
};

export const fetchCarsByFilter = async (
  minCapacity: number,
  maxCapacity: number,
  minPower: number,
  maxPower: number,
  minPrice: number,
  maxPrice: number,
  sortByPrice?: 'asc' | 'desc' | null,
  searchQuery?: string
): Promise<CarDto[]> => {
  const params = {
    minCapacity,
    maxCapacity,
    minPower,
    maxPower,
    minPrice,
    maxPrice,
    sortByPrice: sortByPrice || undefined,
    searchQuery: searchQuery || undefined,
  };
  const response = await api.get<CarDto[]>('/api/Car/filter', { params });
  return response.data;
};

export const fetchCarsByEngineCapacityRange = async (min: number, max: number): Promise<CarDto[]> => {
  const response = await api.get<CarDto[]>(`/api/Car/engine-capacity-range?min=${min}&max=${max}`);
  return response.data;
};

export const fetchCarsByEnginePowerRange = async (min: number, max: number): Promise<CarDto[]> => {
  const response = await api.get<CarDto[]>(`/api/Car/engine-power-range?min=${min}&max=${max}`);
  return response.data;
};

export const fetchCarsByPriceRange = async (min: number, max: number): Promise<CarDto[]> => {
  const response = await api.get<CarDto[]>(`/api/Car/price-range?min=${min}&max=${max}`);
  return response.data;
};

export const fetchCarDetails = async (id: string): Promise<CarDto> => {
  const response = await api.get(`/api/Car/${id}`);
  return response.data;
};

export const fetchCarCompanies = async (carId: string): Promise<CompanyDto[]> => {
  const response = await api.get<CompanyDto[]>(`/api/Car/${carId}/companies`);
  return response.data;
};

// Rentals
export const createRental = async (carId: string, startRent: string, endRent: string): Promise<RentalDto> => {
  const response = await api.post<RentalDto>('/api/Rent', {
    carId,
    startRent,
    endRent
  });
  return response.data;
};

export const getUserRentals = async (): Promise<RentalDto[]> => {
  const response = await api.get<RentalDto[]>('/api/Rent/my');
  return response.data;
};

export const cancelRental = async (rentalId: string): Promise<void> => {
  await api.post(`/api/Rent/${rentalId}/cancel`);
};

export default api;