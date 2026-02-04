export interface User {
  userId: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
