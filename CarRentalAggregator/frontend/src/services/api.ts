import axios from 'axios';
import { LoginRequest, LoginResponse, UserDto } from '../types/AuthTypes';
import { CarDto } from '../types/CarDto';

export const api = axios.create({
  baseURL: 'https://localhost:7198',
  withCredentials: true,
});

// ⛔ Placeholder interceptor (можно расширить в будущем)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('rememberedUser') ? JSON.parse(localStorage.getItem('rememberedUser')!).token : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔐 Auth
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/api/Auth/login', data);
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

export const logout = async (): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>('/api/Auth/logout');
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

export default api;