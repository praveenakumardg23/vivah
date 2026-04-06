import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HallService } from '../../../../core/services/hall.service';
import { BookingService } from '../../../../core/services/booking.service';
import { Hall } from '../../../../shared/models/hall.model';
import { Booking } from '../../../../shared/models/booking.model';

type Tab = 'bookings' | 'halls' | 'offline';

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './owner-dashboard.component.html',
  styleUrls: ['./owner-dashboard.component.scss']
})
export class OwnerDashboardComponent implements OnInit {
  activeTab: Tab = 'bookings';
  bookings: Booking[] = [];
  halls: Hall[] = [];
  isLoading = true;
  actionId: string | null = null;

  // Offline booking form
  offlineForm = {
    hallId: '',
    date: '',
    guests: 50,
    offlineGuestName: '',
    offlineGuestPhone: '',
    notes: ''
  };
  offlineSubmitting = false;
  offlineMsg = '';

  // Block date
  blockDateForm: { hallId: string; date: string } = { hallId: '', date: '' };
  blockMsg = '';

  today = new Date().toISOString().split('T')[0];

  constructor(
    private hallService: HallService,
    private bookingService: BookingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.hallService.getOwnerHalls().subscribe({
      next: (halls) => {
        this.halls = halls;
        if (halls.length > 0 && !this.offlineForm.hallId) {
          this.offlineForm.hallId = halls[0]._id;
          this.blockDateForm.hallId = halls[0]._id;
        }
        this.cdr.markForCheck();
      }
    });
    this.bookingService.getHallBookings().subscribe({
      next: (bookings) => { this.bookings = bookings; this.isLoading = false; this.cdr.markForCheck(); },
      error: () => { this.isLoading = false; this.cdr.markForCheck(); }
    });
  }

  setTab(tab: Tab) { this.activeTab = tab; }

  pendingBookings(): Booking[] {
    return this.bookings.filter((b) => b.status === 'PENDING');
  }

  confirmedBookings(): Booking[] {
    return this.bookings.filter((b) => b.status === 'CONFIRMED');
  }

  updateStatus(id: string, status: 'CONFIRMED' | 'REJECTED') {
    this.actionId = id;
    this.bookingService.updateBookingStatus(id, status).subscribe({
      next: () => {
        const b = this.bookings.find((x) => x._id === id);
        if (b) b.status = status;
        this.actionId = null;
        this.cdr.markForCheck();
      },
      error: () => { this.actionId = null; this.cdr.markForCheck(); }
    });
  }

  submitOfflineBooking() {
    if (!this.offlineForm.hallId || !this.offlineForm.date ||
        !this.offlineForm.offlineGuestName || !this.offlineForm.offlineGuestPhone) {
      this.offlineMsg = 'Please fill all required fields.';
      return;
    }
    this.offlineSubmitting = true;
    this.offlineMsg = '';
    this.bookingService.createOfflineBooking(this.offlineForm).subscribe({
      next: () => {
        this.offlineMsg = '✅ Offline booking added successfully!';
        this.offlineSubmitting = false;
        this.offlineForm = {
          hallId: this.halls[0]?._id || '',
          date: '', guests: 50,
          offlineGuestName: '', offlineGuestPhone: '', notes: ''
        };
        this.loadData();
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.offlineMsg = err?.error?.msg || '❌ Failed to add booking.';
        this.offlineSubmitting = false;
        this.cdr.markForCheck();
      }
    });
  }

  addBlockDate() {
    if (!this.blockDateForm.hallId || !this.blockDateForm.date) return;
    this.hallService.updateBlockedDates(this.blockDateForm.hallId, this.blockDateForm.date, 'add').subscribe({
      next: () => {
        this.blockMsg = '✅ Date blocked.';
        this.blockDateForm.date = '';
        this.loadData();
        this.cdr.markForCheck();
      },
      error: (err) => { this.blockMsg = err?.error?.msg || '❌ Failed.'; this.cdr.markForCheck(); }
    });
  }

  getBlockedDatesForHall(hallId: string): string[] {
    const hall = this.halls.find((h) => h._id === hallId);
    return hall?.blockedDates || [];
  }

  removeBlockDate(hallId: string, date: string) {
    this.hallService.updateBlockedDates(hallId, date, 'remove').subscribe({
      next: () => { this.loadData(); this.cdr.markForCheck(); }
    });
  }

  stats() {
    return {
      total: this.bookings.length,
      pending: this.bookings.filter((b) => b.status === 'PENDING').length,
      confirmed: this.bookings.filter((b) => b.status === 'CONFIRMED').length,
      halls: this.halls.length
    };
  }
}