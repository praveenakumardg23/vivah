import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from '../../../../core/services/auth.service';
import { TokenService } from '../../../../core/services/token.service';
import { VivahLogoComponent } from '../../../../shared/components/vivah-logo/vivah-logo.component';

@Component({
  selector: 'app-otp-login',
  standalone: true,
  imports: [CommonModule, FormsModule, VivahLogoComponent],
  templateUrl: './otp-login.component.html',
  styleUrls: ['./otp-login.component.scss']
})
export class OtpLoginComponent {

  step: 'mobile' | 'otp' | 'password' = 'mobile';

  phone = '';
  otp = '';

  email = '';
  password = '';

  timer = 30;
  interval: any;

  errorMessage = '';
  isLoading = false;
  isVerifying = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private dialogRef: MatDialogRef<OtpLoginComponent>,
    private authService: AuthService,
    private tokenService: TokenService
  ) {}

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  isEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  isPhone(value: string): boolean {
    return /^[0-9]{10}$/.test(value);
  }

  loginWithPassword() {
    if (!this.isEmail(this.email) || !this.password) return;
    this.dialogRef.close(true);
  }

  sendOtp() {
    if (!this.isPhone(this.phone)) {
      this.errorMessage = 'Enter valid mobile number';
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;

    this.authService.sendOtp(this.phone).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.step = 'otp';
        this.startTimer();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.msg || 'Failed to send OTP';
      }
    });
  }

  verifyOtp() {
    if (!this.otp || this.otp.length < 4) {
      this.errorMessage = 'Enter valid OTP';
      return;
    }

    this.isVerifying = true;
    this.errorMessage = '';

    this.authService.verifyOtp(this.phone, this.otp).subscribe({
      next: (res: any) => {
        this.isVerifying = false;
        this.tokenService.setTokens(res.token, res.user?.refreshToken);
        this.tokenService.setRole(res.user?.role);
        this.tokenService.setUserDetails(res.user);
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.isVerifying = false;
        this.errorMessage = err?.error?.msg || 'Invalid OTP';
      }
    });
  }

  startTimer() {
    this.timer = 30;
    this.interval = interval(1000)
      .pipe(take(30))
      .subscribe(() => {
        this.timer--;
        this.cdr.markForCheck();
      });
  }

  resendOtp() {
    this.sendOtp();
  }

  goToPasswordLogin() {
    this.step = 'password';
  }

  goToOtpLogin() {
    this.step = 'mobile';
  }
}