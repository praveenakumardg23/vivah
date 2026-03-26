import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../../core/services/auth.service';
import { OtpLoginComponent } from '../../../features/auth/pages/otp-login/otp-login.component';
import { TokenService } from '../../../core/services/token.service';

@Component({
  selector: 'app-hall-card',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './hall-card.component.html',
  styleUrls: ['./hall-card.component.scss'],
})
export class HallCardComponent {
  @Input() hall: any;
  isLoggedIn: boolean = false;

  constructor(
    private router: Router,
    private auth: AuthService,
    private dialog: MatDialog,
    private tokenService: TokenService
  ) {
    this.isLoggedIn = this.tokenService.hasToken();
    this.tokenService.isLoggedIn$.subscribe(isLoggedIn => {
      console.log('Login status changed:', isLoggedIn);
      this.isLoggedIn = isLoggedIn;
    });
  }

  viewDetails() {
    if (!this.isLoggedIn) {
      // 🔥 trigger login popup instead of navigation
      // window.dispatchEvent(new CustomEvent('openLogin'));
      this.dialog.open(OtpLoginComponent, {
        width: '400px',
        maxWidth: '90vw',
        autoFocus: false,
        panelClass: 'custom-dialog',
      });
      return;
    }

    this.router.navigate(['/halls', this.hall?.id]);
  }
}
