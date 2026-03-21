import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../../core/services/auth.service';
import { OtpLoginComponent } from '../../../features/auth/pages/otp-login/otp-login.component';

@Component({
  selector: 'app-hall-card',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './hall-card.component.html',
  styleUrls: ['./hall-card.component.scss'],
})
export class HallCardComponent {
  @Input() hall: any;

  constructor(
    private router: Router,
    private auth: AuthService,
    private dialog: MatDialog
  ) {}

  viewDetails() {
    if (!this.auth.isLoggedIn()) {
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
