import { axiosInstance } from './axiosInstance';
import { AuthUser, LoginCredentials } from '../types/product';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    const response = await axiosInstance.post<AuthUser>('/auth/login', {
      username: credentials.username,
      password: credentials.password,
      expiresInMins: 60, // Token valid for 60 mins
    });
    return response.data;
  },

  async getCurrentUser(): Promise<AuthUser> {
    const response = await axiosInstance.get<AuthUser>('/auth/me');
    return response.data;
  },
};
