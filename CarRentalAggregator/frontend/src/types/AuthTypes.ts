export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  message: string;
  userId: string;
}

export interface UserDto{
    id: string
    role: Int16Array
}

export {};