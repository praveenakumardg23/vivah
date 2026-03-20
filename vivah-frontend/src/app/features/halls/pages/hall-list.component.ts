import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hall-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="hall-list">
      <h2>Available Halls</h2>

      <div class="card" *ngFor="let hall of halls">
        <h3>{{ hall.name }}</h3>
        <p>{{ hall.location }}</p>
      </div>
    </div>
  `,
  styles: [`
    .hall-list {
      padding: 16px;
    }

    .card {
      border: 1px solid #ddd;
      padding: 10px;
      margin-bottom: 10px;
      border-radius: 8px;
    }
  `]
})
export class HallListComponent {

  halls = [
    { name: 'Royal Hall', location: 'Bangalore' },
    { name: 'Grand Palace', location: 'Mysore' }
  ];
}