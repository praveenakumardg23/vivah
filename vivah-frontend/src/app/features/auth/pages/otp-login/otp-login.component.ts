import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-otp-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './otp-login.component.html',
  styleUrls: ['./otp-login.component.scss']
})
export class OtpLoginComponent {

  step: 'mobile' | 'otp' = 'mobile';

  phone = '';
  otp = '';

  timer = 30;
  interval: any;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  sendOtp() {
    if (!this.phone) return;

    console.log('Send OTP to', this.phone);

    this.step = 'otp';
    this.startTimer();
  }

  verifyOtp() {
    console.log('Verify OTP', this.otp);

    if (this.otp === '1234') {
      alert('Login successful');
    } else {
      alert('Invalid OTP');
    }
  }

  startTimer() {
    this.timer = 30;

    this.interval = interval(1000)
    .pipe(take(30))
    .subscribe(() => {
      this.timer--;
      this.cdr.markForCheck();
      if (this.timer === 0) {
        console.log('Timer done');
      }
    });
  }

  resendOtp() {
    this.sendOtp();
  }
}