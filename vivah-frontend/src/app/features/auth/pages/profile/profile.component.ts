import { ChangeDetectorRef, Component, OnInit, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { UserService } from '../../../../core/services/user.service';
import { TokenService } from '../../../../core/services/token.service';
import { User } from '../../../../shared/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;

  name = '';
  phone = '';
  email = '';
  isEmailVerified = false;

  emailOtp = '';
  showOtpInput = false;

  isLoading = false;
  isSendingOtp = false;
  isVerifyingOtp = false;

  message = '';
  messageType: 'success' | 'error' = 'success';

  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private cdr: ChangeDetectorRef,
    // @Optional so it works when navigated to as a route (no dialog context)
    @Optional() private dialogRef: MatDialogRef<ProfileComponent> | null
  ) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.userService.getProfile().subscribe({
      next: (res) => {
        this.user = res;
        this.name = res.name || '';
        this.phone = res.phone;
        this.email = res.email || '';
        this.isEmailVerified = res.isEmailVerified;
        this.cdr.markForCheck();
      },
      error: () => {
        this.showMessage('Failed to load profile', 'error');
        this.cdr.markForCheck();
      }
    });
  }

  updateProfile() {
    this.isLoading = true;
    this.message = '';
    this.userService.updateProfile({ name: this.name }).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.name = res.name || '';
        const stored = this.tokenService.getUserDetails();
        if (stored) { stored.name = res.name; this.tokenService.setUserDetails(stored); }
        this.showMessage('Profile updated successfully ✅', 'success');
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        this.showMessage('Failed to update profile ❌', 'error');
        this.cdr.markForCheck();
      }
    });
  }

  sendEmailOtp() {
    if (!this.email || !this.email.includes('@')) {
      this.showMessage('Enter a valid email address', 'error');
      return;
    }
    this.isSendingOtp = true;
    this.message = '';
    this.userService.sendEmailOtp(this.email).subscribe({
      next: () => {
        this.isSendingOtp = false;
        this.showOtpInput = true;
        this.showMessage('OTP sent to your email ✅', 'success');
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isSendingOtp = false;
        this.showMessage(err?.error?.msg || 'Failed to send OTP ❌', 'error');
        this.cdr.markForCheck();
      }
    });
  }

  verifyEmailOtp() {
    if (!this.emailOtp || this.emailOtp.length < 4) {
      this.showMessage('Enter the OTP sent to your email', 'error');
      return;
    }
    this.isVerifyingOtp = true;
    this.userService.verifyEmailOtp(this.emailOtp).subscribe({
      next: () => {
        this.isVerifyingOtp = false;
        this.isEmailVerified = true;
        this.showOtpInput = false;
        this.emailOtp = '';
        this.showMessage('Email verified successfully ✅', 'success');
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isVerifyingOtp = false;
        this.showMessage(err?.error?.msg || 'Invalid or expired OTP ❌', 'error');
        this.cdr.markForCheck();
      }
    });
  }

  closeDialog() {
    this.dialogRef?.close();
  }

  get isInDialog(): boolean {
    return !!this.dialogRef;
  }

  get roleLabel(): string {
    const map: Record<string, string> = {
      USER: '👤 User',
      OWNER: '🏛️ Hall Owner',
      AGENT: '🤝 Agent',
      ADMIN: '🛡️ Admin'
    };
    return map[this.user?.role || 'USER'] || '👤 User';
  }

  private showMessage(msg: string, type: 'success' | 'error') {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => { this.message = ''; }, 4000);
  }
}