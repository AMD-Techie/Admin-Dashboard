import axios, { AxiosError } from 'axios';

const API_BASE_URL = 'https://dummyjson.com';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach Auth Token if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Standardized Error Handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    // If request was canceled by AbortController, pass the cancellation error through untouched
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    if (error.response) {
      // Server responded with non-2xx status
      const message = error.response.data?.message || `API Error: ${error.response.statusText}`;
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Request sent but no response received
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }
    return Promise.reject(error);
  }
);
