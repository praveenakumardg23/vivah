import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../../../core/services/booking.service';
import { Booking } from '../../../../shared/models/booking.model';

@Component({
  selector: 'app-booking-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>My Bookings</h1>
        <p>Track all your wedding hall reservations</p>
      </div>

      <div class="bookings-list" *ngIf="!isLoading; else loader">
        <div *ngIf="bookings.length === 0" class="empty-state">
          <span class="empty-icon">📋</span>
          <h3>No bookings yet</h3>
          <p>Start by exploring available halls</p>
        </div>

        <div class="booking-card" *ngFor="let b of bookings">
          <div class="booking-image">
            <img [src]="b.hall.images[0] || 'https://via.placeholder.com/120x80'" [alt]="b.hall.name" />
          </div>
          <div class="booking-info">
            <h3>{{ b.hall.name }}</h3>
            <p class="meta">📍 {{ b.hall.location }}</p>
            <p class="meta">📅 {{ b.date | date:'mediumDate' }}</p>
            <p class="meta">👥 {{ b.guests }} guests</p>
            <p class="meta price">💰 ₹{{ b.totalPrice | number }}</p>
          </div>
          <div class="booking-status">
            <span class="status-badge" [class]="'status-' + b.status.toLowerCase()">
              {{ b.status }}
            </span>
            <button
              *ngIf="b.status === 'PENDING'"
              class="cancel-btn"
              (click)="cancelBooking(b._id)"
              [disabled]="cancellingId === b._id">
              {{ cancellingId === b._id ? 'Cancelling...' : 'Cancel' }}
            </button>
          </div>
        </div>
      </div>

      <ng-template #loader>
        <div class="loader-wrap"><div class="loader"></div></div>
      </ng-template>
    </div>
  `,
  styles: [`
    .page-container { max-width: 800px; margin: 0 auto; padding: 24px 16px; }
    .page-header { margin-bottom: 28px; }
    .page-header h1 { font-size: 26px; font-weight: 700; color: #1a1a1a; margin: 0 0 4px; }
    .page-header p { color: #666; margin: 0; }

    .empty-state {
      text-align: center; padding: 60px 20px; background: #fff;
      border-radius: 16px; box-shadow: 0 2px 8px rgba(0,0,0,.08);
    }
    .empty-icon { font-size: 48px; display: block; margin-bottom: 12px; }
    .empty-state h3 { color: #333; margin: 0 0 8px; }
    .empty-state p { color: #888; margin: 0; }

    .booking-card {
      display: flex; gap: 16px; background: #fff; border-radius: 16px;
      padding: 16px; margin-bottom: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,.08);
      align-items: flex-start;
    }
    .booking-image img { width: 120px; height: 80px; object-fit: cover; border-radius: 10px; }
    .booking-info { flex: 1; }
    .booking-info h3 { margin: 0 0 8px; font-size: 16px; color: #1a1a1a; }
    .meta { margin: 3px 0; font-size: 13px; color: #555; }
    .price { font-weight: 600; color: #b71c1c; }
    .booking-status { display: flex; flex-direction: column; align-items: flex-end; gap: 10px; min-width: 100px; }

    .status-badge {
      padding: 5px 12px; border-radius: 20px; font-size: 12px;
      font-weight: 600; text-transform: uppercase; letter-spacing: .5px;
    }
    .status-pending { background: #fff8e1; color: #f57f17; }
    .status-confirmed { background: #e8f5e9; color: #2e7d32; }
    .status-rejected { background: #fce4ec; color: #c62828; }
    .status-cancelled { background: #f5f5f5; color: #757575; }

    .cancel-btn {
      padding: 6px 14px; background: #fff; border: 1.5px solid #e53935;
      color: #e53935; border-radius: 8px; cursor: pointer; font-size: 12px;
      font-weight: 600; transition: all .2s;
    }
    .cancel-btn:hover:not(:disabled) { background: #e53935; color: #fff; }
    .cancel-btn:disabled { opacity: .5; cursor: not-allowed; }

    .loader-wrap { display: flex; justify-content: center; padding: 60px; }
    .loader {
      width: 36px; height: 36px; border: 3px solid #f3f3f3;
      border-top-color: #b71c1c; border-radius: 50%;
      animation: spin .8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class BookingHistoryComponent implements OnInit {
  bookings: Booking[] = [];
  isLoading = true;
  cancellingId: string | null = null;

  constructor(private bookingService: BookingService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.isLoading = true;
    this.bookingService.getMyBookings().subscribe({
      next: (data) => { this.bookings = data; this.isLoading = false; this.cdr.markForCheck(); },
      error: () => { this.isLoading = false; this.cdr.markForCheck(); }
    });
  }

  cancelBooking(id: string) {
    this.cancellingId = id;
    this.bookingService.cancelBooking(id).subscribe({
      next: () => {
        const b = this.bookings.find((x) => x._id === id);
        if (b) b.status = 'CANCELLED';
        this.cancellingId = null;
        this.cdr.markForCheck();
      },
      error: () => { this.cancellingId = null; this.cdr.markForCheck(); }
    });
  }
}