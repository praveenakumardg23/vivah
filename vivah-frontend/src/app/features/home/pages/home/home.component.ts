import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HallCardComponent } from '../../../../shared/components/hall-card/hall-card.component';
import { HallService } from '../../../../core/services/hall.service';
import { Hall } from '../../../../shared/models/hall.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, HallCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  locations = ['All', 'Bangalore', 'Mysore', 'Chennai', 'Hyderabad'];
  selectedLocation = 'All';
  selectedDate = '';

  featuredHalls: Hall[] = [];
  isLoading = true;

  today = new Date().toISOString().split('T')[0];

  // Fallback mock halls in case API is not ready
  private mockHalls: any[] = [
    {
      _id: '1',
      name: 'Sri Lakshmi Convention Hall',
      location: 'Jayanagar',
      city: 'Bangalore',
      price: 50000,
      capacity: 500,
      images: ['https://res.cloudinary.com/dah7ebcsg/image/upload/f_auto,q_auto/culture_h9i1d8'],
      amenities: ['AC', 'Parking', 'Catering'],
      blockedDates: [],
      isActive: true
    },
    {
      _id: '2',
      name: 'Royal Palace Mantapa',
      location: 'Vijayanagar',
      city: 'Mysore',
      price: 75000,
      capacity: 800,
      images: ['https://res.cloudinary.com/dah7ebcsg/image/upload/v1773984624/r07SrimT99qHxXublRSWt8jHk6A9izJkfc-UQG3SYo_JkdsqcREMQ7hpr5j3tzdwpRyQOygk_6uNvJ0e76CBw2_IxGoGkoxdvOROoqJDwgE_dkv50k.jpg'],
      amenities: ['AC', 'Parking', 'Decoration'],
      blockedDates: [],
      isActive: true
    }
  ];

  constructor(private hallService: HallService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.search();
  }

  search() {
    this.isLoading = true;
    const params: any = {};
    if (this.selectedLocation !== 'All') params['city'] = this.selectedLocation;
    if (this.selectedDate) params['date'] = this.selectedDate;

    this.hallService.getAllHalls(params).subscribe({
      next: (halls) => {
        this.featuredHalls = halls;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        // Fallback to mock data
        this.featuredHalls = this.mockHalls;
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }
}