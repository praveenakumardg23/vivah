import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';

import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-8px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'translateY(-8px)' })),
      ]),
    ]),
  ],
})
export class ProfileComponent implements OnInit {
  // ── Form fields ────────────────────────────────────────────
  name = '';
  phone = '';
  email = '';

  // ── Email verification flow ────────────────────────────────
  isEmailVerified = false;
  emailOtp = '';
  showOtpInput = false;

  // ── Loading states ─────────────────────────────────────────
  isLoadingProfile = true;
  isLoading = false;
  isSendingOtp = false;
  isVerifyingOtp = false;

  // ── Feedback ───────────────────────────────────────────────
  message = '';
  isSuccess = false;

  constructor(private userService: UserService, private cdr: ChangeDetectorRef) {}

  // ── Lifecycle ──────────────────────────────────────────────

  ngOnInit(): void {
    this.loadProfile();
  }

  // ── Data fetching ──────────────────────────────────────────

  loadProfile(): void {
    this.isLoadingProfile = true;
    this.clearMessage();

    this.userService.getProfile().subscribe({
      next: (res: any) => {
        this.name = res.name ?? '';
        this.phone = res.phone ?? '';
        this.email = res.email ?? '';
        this.isEmailVerified = res.isEmailVerified ?? false;
        this.isLoadingProfile = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoadingProfile = false;
        this.showMessage('Failed to load profile. Please try again.', false);
        this.cdr.detectChanges();
      },
    });
  }

  // ── Profile update ─────────────────────────────────────────

  updateProfile(): void {
    if (this.isLoading) return;

    this.isLoading = true;
    this.clearMessage();

    this.userService.updateProfile({ name: this.name?.trim(), email: this.email?.trim(), isEmailVerified: this.isEmailVerified }).subscribe({
      next: () => {
        this.isLoading = false;
        this.showMessage('Profile updated successfully!', true);
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.showMessage('Failed to save changes. Please try again.', false);
        this.cdr.detectChanges();
      },
    });
  }

  // ── Email OTP flow ─────────────────────────────────────────

  sendEmailOtp(): void {
    if (!this.email || this.isSendingOtp) return;

    this.isSendingOtp = true;
    this.clearMessage();

    this.userService.sendEmailOtp(this.email.trim()).subscribe({
      next: () => {
        this.isSendingOtp = false;
        this.showOtpInput = true;
        this.emailOtp = '';
        this.cdr.detectChanges();
      },
      error: () => {
        this.isSendingOtp = false;
        this.showMessage('Failed to send OTP. Check your email address.', false);
        this.cdr.detectChanges();
      },
    });
  }

  verifyEmailOtp(): void {
    if (!this.emailOtp || this.isVerifyingOtp) return;

    this.isVerifyingOtp = true;
    this.clearMessage();

    this.userService.verifyEmailOtp({otp: this.emailOtp?.trim(), email: this.email?.trim() }).subscribe({
      next: () => {
        this.isVerifyingOtp = false;
        this.isEmailVerified = true;
        this.showOtpInput = false;
        this.emailOtp = '';
        this.showMessage('Email verified successfully!', true);
        this.cdr.detectChanges();
      },
      error: () => {
        this.isVerifyingOtp = false;
        this.showMessage('Incorrect OTP. Please try again.', false);
        this.cdr.detectChanges();
      },
    });
  }

  // ── Helpers ────────────────────────────────────────────────

  private showMessage(text: string, success: boolean): void {
    this.message = text;
    this.isSuccess = success;

    // Auto-clear success messages after 4 seconds
    if (success) {
      setTimeout(() => this.clearMessage(), 4000);
    }
  }

  private clearMessage(): void {
    this.message = '';
    this.isSuccess = false;
  }
}