import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hall-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hall-card.component.html',
  styleUrls: ['./hall-card.component.scss']
})
export class HallCardComponent {

  @Input() hall: any;

  constructor(private router: Router) {}

  viewDetails() {
    this.router.navigate(['/halls', this.hall?.id]);
  }

}