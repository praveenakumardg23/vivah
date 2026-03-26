import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private api: ApiService) {}

  getProfile() {
    return this.api.get<any>(API_ENDPOINTS.USER.PROFILE);
  }

  updateProfile(data: any) {
    return this.api.put<any>(API_ENDPOINTS.USER.PROFILE, data);
  }

  sendEmailOtp(email: string) {
    return this.api.post(API_ENDPOINTS.USER.SEND_EMAIL_OTP, { email });
  }

  verifyEmailOtp(otp: string) {
    return this.api.post(API_ENDPOINTS.USER.VERIFY_EMAIL_OTP, { otp });
  }
}
