import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { OtpLoginComponent } from '../../features/auth/pages/otp-login/otp-login.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(
    public auth: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  goToLogin() {
  //  window.dispatchEvent(new CustomEvent('openLogin'));
  this.dialog.open(OtpLoginComponent, {
        width: '400px',
        maxWidth: '90vw',
        autoFocus: false,
        panelClass: 'custom-dialog',
      });
   // this.router.navigate(['/login']);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
