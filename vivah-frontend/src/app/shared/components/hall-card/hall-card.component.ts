import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-hall-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hall-card.component.html',
  styleUrls: ['./hall-card.component.scss'],
})
export class HallCardComponent {
  @Input() hall: any;

  constructor(
    private router: Router,
    private auth: AuthService,
  ) {}

  viewDetails() {
    if (!this.auth.isLoggedIn()) {
      // 🔥 trigger login popup instead of navigation
      window.dispatchEvent(new CustomEvent('openLogin'));
      return;
    }

    this.router.navigate(['/halls', this.hall?.id]);
  }
}
