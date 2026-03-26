import { environment } from '../../../environments/environment';

export const API_BASE = environment.apiBaseUrl;

export const API_ENDPOINTS = {
  AUTH: {
    SEND_OTP: `${API_BASE}/auth/send-otp`,
    VERIFY_OTP: `${API_BASE}/auth/verify-otp`,
    LOGIN: `${API_BASE}/auth/login`,
    REFRESH: `${API_BASE}/auth/refresh`,
    LOGOUT: `${API_BASE}/auth/logout`
  },

  USER: {
    PROFILE: `${API_BASE}/user/profile`
  },

  MANTAPA: {
    CREATE: `${API_BASE}/mantapa`,
    LIST: `${API_BASE}/mantapa`
  },

  BOOKING: {
    CREATE: `${API_BASE}/booking`,
    LIST: `${API_BASE}/booking`
  }
};