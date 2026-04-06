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
    PROFILE: `${API_BASE}/user/profile`,
    SEND_EMAIL_OTP: `${API_BASE}/user/email/send-otp`,
    VERIFY_EMAIL_OTP: `${API_BASE}/user/email/verify-otp`
  },

  HALLS: {
    LIST: `${API_BASE}/halls`,
    DETAIL: (id: string) => `${API_BASE}/halls/${id}`,
    AGENT_HALLS: `${API_BASE}/halls/my/agent`,
    OWNER_HALLS: `${API_BASE}/halls/my/owner`,
    CREATE: `${API_BASE}/halls`,
    UPDATE: (id: string) => `${API_BASE}/halls/${id}`,
    DELETE: (id: string) => `${API_BASE}/halls/${id}`,
    BLOCKED_DATES: (id: string) => `${API_BASE}/halls/${id}/blocked-dates`
  },

  BOOKINGS: {
    CREATE: `${API_BASE}/bookings`,
    MY_BOOKINGS: `${API_BASE}/bookings/my`,
    HALL_BOOKINGS: `${API_BASE}/bookings/hall-bookings`,
    STATUS: (id: string) => `${API_BASE}/bookings/${id}/status`,
    CANCEL: (id: string) => `${API_BASE}/bookings/${id}/cancel`,
    OFFLINE: `${API_BASE}/bookings/offline`
  },

  ADMIN: {
    USERS: `${API_BASE}/admin/users`,
    REGISTER_AGENT: `${API_BASE}/admin/register-agent`,
    REGISTER_OWNER: `${API_BASE}/admin/register-owner`,
    UPDATE_ROLE: (id: string) => `${API_BASE}/admin/users/${id}/role`,
    AGENTS: `${API_BASE}/admin/agents`,
    OWNERS: `${API_BASE}/admin/owners`
  }
};