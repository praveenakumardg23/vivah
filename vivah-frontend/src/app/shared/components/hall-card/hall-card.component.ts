import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hall-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hall-card.component.html',
  styleUrls: ['./hall-card.component.scss']
})
export class HallCardComponent {

  @Input() hall: any;

}