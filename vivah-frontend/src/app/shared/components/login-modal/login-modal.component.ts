import { Component, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OtpLoginComponent } from '../../../features/auth/pages/otp-login/otp-login.component';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, OtpLoginComponent],
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent {

  show = false;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    document.body.appendChild(this.el.nativeElement); // 🔥 FIX
  }

  @HostListener('window:openLogin')
  open() {
    this.show = true;
    document.body.style.overflow = 'hidden'; // 🔥
  }

  close() {
    this.show = false;
    document.body.style.overflow = 'auto'; // 🔥
  }
}