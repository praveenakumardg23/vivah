import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { User } from '../../shared/models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private api: ApiService) {}

  getProfile() {
    return this.api.get<User>(API_ENDPOINTS.USER.PROFILE);
  }

  updateProfile(data: { name: string }) {
    return this.api.put<User>(API_ENDPOINTS.USER.PROFILE, data);
  }

  sendEmailOtp(email: string) {
    return this.api.post<{ msg: string }>(API_ENDPOINTS.USER.SEND_EMAIL_OTP, { email });
  }

  verifyEmailOtp(otp: string) {
    return this.api.post<{ msg: string }>(API_ENDPOINTS.USER.VERIFY_EMAIL_OTP, { otp });
  }
}