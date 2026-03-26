import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../core/services/user.service';
import { TokenService } from '../../../../core/services/token.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  name = '';
  phone = '';
  isLoading = false;
  message = '';
  email = '';
  isEmailVerified = false;
  emailOtp = '';
  showOtpInput = false;

  constructor(
    private userService: UserService,
    private tokenService: TokenService,
  ) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.userService.getProfile().subscribe({
      next: (res: any) => {
        this.name = res.name;
        this.phone = res.phone;
        this.email = res.email;
        this.isEmailVerified = res.isEmailVerified;
      },
    });
  }

  updateProfile() {
    this.isLoading = true;

    this.userService.updateProfile({ name: this.name }).subscribe({
      next: (res: any) => {
        this.isLoading = false;

        this.message = 'Profile updated successfully ✅';

        // 🔥 Update navbar name instantly
        // this.tokenService.setUser(res.name);
      },
      error: () => {
        this.isLoading = false;
        this.message = 'Update failed ❌';
      },
    });
  }

  sendEmailOtp() {
    this.userService.sendEmailOtp(this.email).subscribe({
      next: () => {
        this.showOtpInput = true;
      },
    });
  }

  verifyEmailOtp() {
  this.userService.verifyEmailOtp(this.emailOtp).subscribe({
    next: () => {
      this.isEmailVerified = true;
      this.showOtpInput = false;
    },
    error: () => {
      alert('Invalid OTP');
    }
  });
}
}
