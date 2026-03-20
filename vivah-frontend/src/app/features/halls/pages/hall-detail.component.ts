import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hall-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hall-detail.component.html',
  styleUrls: ['./hall-detail.component.scss']
})
export class HallDetailComponent {

  isFullscreen = false;
  startX = 0;
  endX = 0;
  currentIndex = 0;

  hallId: string | null = null;

  hall: any;

  showFullDescription = false;

  booking = {
    date: '',
    guests: 100,
    notes: ''
  };

  today = new Date().toISOString().split('T')[0];

  constructor(private route: ActivatedRoute) {
    this.hallId = this.route.snapshot.paramMap.get('id');

    // Mock data (replace with API later)
    this.hall = {
      name: 'Sri Lakshmi Convention Hall',
      location: 'Bangalore',
      price: 50000,
      capacity: 500,
      images: [
        'https://res.cloudinary.com/dah7ebcsg/image/upload/f_auto,q_auto/culture_h9i1d8',
        'https://res.cloudinary.com/dah7ebcsg/image/upload/v1773984624/r07SrimT99qHxXublRSWt8jHk6A9izJkfc-UQG3SYo_JkdsqcREMQ7hpr5j3tzdwpRyQOygk_6uNvJ0e76CBw2_IxGoGkoxdvOROoqJDwgE_dkv50k.jpg',
        'https://res.cloudinary.com/dah7ebcsg/image/upload/v1774008524/amish-thakkar-BEdxXAiRfRM-unsplash_ulqxvz.jpg'
      ],
      amenities: ['Parking', 'AC', 'Catering', 'Decoration'],
      description: `Sri Lakshmi Convention Hall is a spacious and elegant venue 
        perfect for weddings, receptions, and large gatherings. With modern 
        facilities, ample parking space, and premium interiors, it ensures a 
        memorable experience for your special day. The hall offers catering, 
        decoration services, and customizable seating arrangements.`
    };
  }

  toggleDescription() {
    this.showFullDescription = !this.showFullDescription;
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.hall.images.length;
  }

  prev() {
    this.currentIndex =
      (this.currentIndex - 1 + this.hall.images.length) % this.hall.images.length;
  }

  onTouchStart(event: TouchEvent) {
    this.startX = event.touches[0].clientX;
  }

  onTouchEnd(event: TouchEvent) {
    this.endX = event.changedTouches[0].clientX;
    this.handleSwipe();
  }

  handleSwipe() {
    const diff = this.startX - this.endX;

    if (Math.abs(diff) < 50) return; // ignore small swipes

    if (diff > 0) {
      // swipe left → next
      this.next();
    } else {
      // swipe right → previous
      this.prev();
    }
  }

  openFullscreen(index: number = 0) {
    this.currentIndex = index;
    this.isFullscreen = true;
  }

  closeFullscreen() {
    this.isFullscreen = false;
  }

  bookNow() {
    console.log('Booking Details:', this.booking);
    alert('Booking submitted!');
  }
}