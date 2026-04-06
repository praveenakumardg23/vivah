import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TokenService } from '../../core/services/token.service';
import { MatDialog } from '@angular/material/dialog';
import { OtpLoginComponent } from '../../features/auth/pages/otp-login/otp-login.component';
import { ProfileComponent } from '../../features/auth/pages/profile/profile.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  isLoggedIn$: any;
  role$: any;
  isDropdownOpen = false;

  constructor(
    private tokenService: TokenService,
    public router: Router,
    private dialog: MatDialog
  ) {
    this.isLoggedIn$ = this.tokenService.isLoggedIn$;
    this.role$ = this.tokenService.roleObservable$;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile')) {
      this.isDropdownOpen = false;
    }
  }

  toggleDropdown(event?: Event) {
    event?.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout() {
    this.tokenService.clearTokens();
    this.router.navigate(['/']);
    this.isDropdownOpen = false;
  }

  openLogin() {
    this.dialog.open(OtpLoginComponent, {
      width: '400px',
      maxWidth: '90vw',
      autoFocus: false,
      panelClass: 'custom-dialog'
    });
  }

  goToProfile() {
    this.dialog.open(ProfileComponent, {
      width: '400px',
      maxWidth: '90vw',
      autoFocus: false,
      panelClass: 'custom-dialog'
    });
    this.isDropdownOpen = false;
  }

  goToBookings() {
    this.router.navigate(['/my-bookings']);
    this.isDropdownOpen = false;
  }

  goToOwnerDashboard() {
    this.router.navigate(['/owner-dashboard']);
    this.isDropdownOpen = false;
  }

  goToAgentDashboard() {
    this.router.navigate(['/agent-dashboard']);
    this.isDropdownOpen = false;
  }

  goToAdminDashboard() {
    this.router.navigate(['/admin-dashboard']);
    this.isDropdownOpen = false;
  }
}