import { Component, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from '../../../../core/services/auth.service';
import { TokenService } from '../../../../core/services/token.service';

@Component({
  selector: 'app-otp-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './otp-login.component.html',
  styleUrls: ['./otp-login.component.scss']
})
export class OtpLoginComponent implements OnDestroy {
  step: 'mobile' | 'otp' | 'password' = 'mobile';

  phone = '';
  otp = '';
  email = '';
  password = '';

  timer = 30;
  private timerSub?: Subscription;

  errorMessage = '';
  isLoading = false;
  isVerifying = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private dialogRef: MatDialogRef<OtpLoginComponent>,
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  ngOnDestroy() {
    this.timerSub?.unsubscribe();
  }

  isEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  isPhone(value: string): boolean {
    return /^[0-9]{10}$/.test(value);
  }

  sendOtp() {
    if (!this.isPhone(this.phone)) {
      this.errorMessage = 'Enter a valid 10-digit mobile number';
      return;
    }
    this.errorMessage = '';
    this.isLoading = true;

    this.authService.sendOtp(this.phone).subscribe({
      next: () => {
        this.isLoading = false;
        this.step = 'otp';
        this.startTimer();
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.msg || 'Failed to send OTP';
        this.cdr.markForCheck();
      }
    });
  }

  verifyOtp() {
    if (!this.otp || this.otp.length < 4) {
      this.errorMessage = 'Enter a valid OTP';
      return;
    }
    this.isVerifying = true;
    this.errorMessage = '';

    this.authService.verifyOtp(this.phone, this.otp).subscribe({
      next: (res: any) => {
        this.isVerifying = false;

        const role = res.user?.role || 'USER';
        this.tokenService.setTokens(res.token, res.user?.refreshToken || '');
        this.tokenService.setRole(role);
        this.tokenService.setUserDetails(res.user);

        this.dialogRef.close(true);
        this.redirectByRole(role);
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isVerifying = false;
        this.errorMessage = err?.error?.msg || 'Invalid OTP';
        this.cdr.markForCheck();
      }
    });
  }

  loginWithPassword() {
    if (!this.isEmail(this.email) || !this.password) {
      this.errorMessage = 'Enter valid email and password';
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        const role = res.role;
        this.tokenService.setTokens(res.accessToken, res.refreshToken);
        this.tokenService.setRole(role);

        this.dialogRef.close(true);
        this.redirectByRole(role);
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.msg || 'Login failed';
        this.cdr.markForCheck();
      }
    });
  }

  private redirectByRole(role: string) {
    switch (role) {
      case 'ADMIN': this.router.navigate(['/admin-dashboard']); break;
      case 'AGENT': this.router.navigate(['/agent-dashboard']); break;
      case 'OWNER': this.router.navigate(['/owner-dashboard']); break;
      default: break; // USER stays on current page
    }
  }

  startTimer() {
    this.timer = 30;
    this.timerSub?.unsubscribe();
    this.timerSub = interval(1000).pipe(take(30)).subscribe(() => {
      this.timer--;
      this.cdr.markForCheck();
    });
  }

  resendOtp() {
    this.otp = '';
    this.sendOtp();
  }

  goToPasswordLogin() { this.step = 'password'; this.errorMessage = ''; }
  goToOtpLogin() { this.step = 'mobile'; this.errorMessage = ''; }
}