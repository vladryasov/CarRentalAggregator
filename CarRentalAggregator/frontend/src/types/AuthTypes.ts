import { server } from "typescript";

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  message: string;
  userId: string;
  token?: string;
}

export interface UserDto{
    id: string
    role: number
    token?: string
}

export {};