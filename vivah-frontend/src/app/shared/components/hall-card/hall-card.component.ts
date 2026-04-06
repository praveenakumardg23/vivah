import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TokenService } from '../../../core/services/token.service';
import { OtpLoginComponent } from '../../../features/auth/pages/otp-login/otp-login.component';
import { Hall } from '../../models/hall.model';

@Component({
  selector: 'app-hall-card',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './hall-card.component.html',
  styleUrls: ['./hall-card.component.scss']
})
export class HallCardComponent {
  @Input() hall!: Hall;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private tokenService: TokenService
  ) {}

  viewDetails() {
    if (!this.tokenService.hasToken()) {
      this.dialog.open(OtpLoginComponent, {
        width: '400px',
        maxWidth: '90vw',
        autoFocus: false,
        panelClass: 'custom-dialog'
      });
      return;
    }
    this.router.navigate(['/halls', this.hall._id]);
  }
}