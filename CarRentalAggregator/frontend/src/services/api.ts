import axios from 'axios';
import { LoginRequest, LoginResponse, UserDto } from '../types/AuthTypes';
import { CarDto } from '../types/CarDto';

export const api = axios.create({
  baseURL: 'https://localhost:7198',
  withCredentials: true,
});

// Удалить interceptor или изменить:
api.interceptors.request.use((config) => {
  return config;
});


export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/api/Auth/login', data, {
    withCredentials: true, // важно для отправки/получения куки
  });
  return response.data;
};

export const register = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/api/Auth/register', data);
  return response.data;
};

export const autoLogin = async (): Promise<UserDto> => {
  const response = await api.get<UserDto>('/api/Auth/auto-login', {
    withCredentials: true
  });
  return response.data;
};

export const logout = async (): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>('/api/Auth/logout');
  return response.data;
};

export const fetchCars = async (): Promise<CarDto[]> => {
  const response = await api.get<CarDto[]>('/api/Car');
  return response.data;
};



export {};