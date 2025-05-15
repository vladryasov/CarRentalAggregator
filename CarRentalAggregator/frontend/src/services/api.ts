import axios from 'axios';
import { LoginRequest, LoginResponse, UserDto } from '../types/AuthTypes';

const api = axios.create({
  baseURL: 'https://localhost:7198',
  withCredentials: true,
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


export {};