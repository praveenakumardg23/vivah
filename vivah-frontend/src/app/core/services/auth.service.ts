import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private api: ApiService) {}

  sendOtp(phone: string) {
    return this.api.post(API_ENDPOINTS.AUTH.SEND_OTP, { phone });
  }

  verifyOtp(phone: string, otp: string) {
    return this.api.post(API_ENDPOINTS.AUTH.VERIFY_OTP, { phone, otp });
  }

  login(email: string, password: string) {
    return this.api.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
  }

  refreshToken(refreshToken: string) {
    return this.api.post<{ accessToken: string; refreshToken: string }>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refreshToken }
    );
  }

  logout() {
    return this.api.post(API_ENDPOINTS.AUTH.LOGOUT, {});
  }
}