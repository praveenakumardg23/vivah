import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BookingService } from '../../../../core/services/booking.service';
import { TokenService } from '../../../../core/services/token.service';
import { OtpLoginComponent } from '../../../auth/pages/otp-login/otp-login.component';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  template: `
    <div class="booking-form">
      <h3>Book This Hall</h3>

      <label>Select Date</label>
      <input type="date" [min]="today" [(ngModel)]="booking.date" />

      <label>Guests</label>
      <input type="number" [(ngModel)]="booking.guests" [min]="50" [max]="hallCapacity" />

      <label>Notes</label>
      <textarea [(ngModel)]="booking.notes" placeholder="Any special requirements..."></textarea>

      <div class="price-box">
        <span>Total Price</span>
        <strong>₹{{ hallPrice | number }}</strong>
      </div>

      <button (click)="submit()" [disabled]="isSubmitting">
        {{ isSubmitting ? 'Booking...' : 'Book Now' }}
      </button>

      <p *ngIf="message" class="msg" [class.error]="isError">{{ message }}</p>
    </div>
  `,
  styles: [`
    .booking-form {
      background: #fff;
      border-radius: 14px;
      padding: 20px;
      box-shadow: 0 3px 8px rgba(0,0,0,.1);

      h3 { margin: 0 0 16px; font-size: 18px; font-weight: 700; }

      label { display: block; font-size: 13px; font-weight: 500; color: #555; margin: 12px 0 5px; }

      input, textarea {
        width: 100%;
        padding: 10px;
        border-radius: 8px;
        border: 1.5px solid #ddd;
        font-size: 14px;
        box-sizing: border-box;
        &:focus { outline: none; border-color: #b71c1c; }
      }

      textarea { min-height: 70px; resize: vertical; }
    }

    .price-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 16px 0;
      font-size: 15px;
      strong { font-size: 18px; color: #b71c1c; }
    }

    button {
      width: 100%;
      padding: 12px;
      background: #b71c1c;
      color: white;
      border: none;
      border-radius: 10px;
      font-weight: bold;
      font-size: 15px;
      cursor: pointer;
      transition: background .2s;

      &:hover:not(:disabled) { background: #8e0000; }
      &:disabled { opacity: .6; cursor: not-allowed; }
    }

    .msg { margin-top: 12px; font-size: 14px; color: #2e7d32; }
    .error { color: #c62828; }
  `]
})
export class BookingFormComponent {
  @Input() hallId = '';
  @Input() hallPrice = 0;
  @Input() hallCapacity = 500;
  @Output() bookingCreated = new EventEmitter<void>();

  booking = { date: '', guests: 100, notes: '' };
  today = new Date().toISOString().split('T')[0];
  isSubmitting = false;
  message = '';
  isError = false;

  constructor(
    private bookingService: BookingService,
    private tokenService: TokenService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  submit() {
    if (!this.tokenService.hasToken()) {
      this.dialog.open(OtpLoginComponent, {
        width: '400px', maxWidth: '90vw', autoFocus: false, panelClass: 'custom-dialog'
      });
      return;
    }

    if (!this.booking.date) {
      this.message = 'Please select a date.';
      this.isError = true;
      return;
    }

    this.isSubmitting = true;
    this.message = '';

    this.bookingService.createBooking({
      hallId: this.hallId,
      date: this.booking.date,
      guests: this.booking.guests,
      notes: this.booking.notes
    }).subscribe({
      next: () => {
        this.message = '✅ Booking request sent! The owner will confirm shortly.';
        this.isError = false;
        this.isSubmitting = false;
        this.booking = { date: '', guests: 100, notes: '' };
        this.bookingCreated.emit();
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.message = err?.error?.msg || '❌ Booking failed. Please try again.';
        this.isError = true;
        this.isSubmitting = false;
        this.cdr.markForCheck();
      }
    });
  }
}