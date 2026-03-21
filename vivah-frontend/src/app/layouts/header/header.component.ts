import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(
    public auth: AuthService,
    private router: Router,
  ) {}

  goToLogin() {
   window.dispatchEvent(new CustomEvent('openLogin'));
   // this.router.navigate(['/login']);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
