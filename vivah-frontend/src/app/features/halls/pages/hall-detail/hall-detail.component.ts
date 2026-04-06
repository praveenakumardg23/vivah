import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HallService } from '../../../../core/services/hall.service';
import { Hall } from '../../../../shared/models/hall.model';
import { BookingFormComponent } from '../../../booking/pages/booking-form/booking-form.component';

@Component({
  selector: 'app-hall-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, BookingFormComponent],
  templateUrl: './hall-detail.component.html',
  styleUrls: ['./hall-detail.component.scss']
})
export class HallDetailComponent implements OnInit {
  hallId: string | null = null;
  hall: Hall | null = null;
  isLoading = true;
  notFound = false;

  // Image slider
  isFullscreen = false;
  currentIndex = 0;
  startX = 0;
  endX = 0;

  showFullDescription = false;
  bookingSuccess = false;

  today = new Date().toISOString().split('T')[0];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hallService: HallService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.hallId = this.route.snapshot.paramMap.get('id');
    if (this.hallId) {
      this.loadHall(this.hallId);
    }
  }

  loadHall(id: string) {
    this.isLoading = true;
    this.hallService.getHallById(id).subscribe({
      next: (hall) => {
        this.hall = hall;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notFound = true;
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  onBookingCreated() {
    this.bookingSuccess = true;
    setTimeout(() => { this.bookingSuccess = false; }, 5000);
  }

  toggleDescription() {
    this.showFullDescription = !this.showFullDescription;
  }

  next() {
    if (!this.hall) return;
    this.currentIndex = (this.currentIndex + 1) % this.hall.images.length;
  }

  prev() {
    if (!this.hall) return;
    this.currentIndex = (this.currentIndex - 1 + this.hall.images.length) % this.hall.images.length;
  }

  onTouchStart(event: TouchEvent) {
    this.startX = event.touches[0].clientX;
  }

  onTouchEnd(event: TouchEvent) {
    this.endX = event.changedTouches[0].clientX;
    const diff = this.startX - this.endX;
    if (Math.abs(diff) < 50) return;
    if (diff > 0) this.next(); else this.prev();
  }

  openFullscreen(index: number = 0) {
    this.currentIndex = index;
    this.isFullscreen = true;
  }

  closeFullscreen() {
    this.isFullscreen = false;
  }

  goBack() {
    this.router.navigate(['/']);
  }

  isDateBlocked(date: string): boolean {
    if (!this.hall) return false;
    return this.hall.blockedDates.some(
      (d) => new Date(d).toDateString() === new Date(date).toDateString()
    );
  }
}