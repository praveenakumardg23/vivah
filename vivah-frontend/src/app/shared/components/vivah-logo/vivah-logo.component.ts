import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vivah-logo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vivah-logo.component.html',
  styleUrls: ['./vivah-logo.component.scss']
})
export class VivahLogoComponent {
  /** 'full' shows icon + text, 'text' shows text only, 'icon' shows icon only */
  @Input() variant: 'full' | 'text' | 'icon' = 'full';

  /** Size — 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl' */
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl' = 'md';

  /** Invert colors for dark backgrounds */
  @Input() inverted = false;
}