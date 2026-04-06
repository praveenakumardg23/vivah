import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HallService } from '../../../../core/services/hall.service';
import { Hall } from '../../../../shared/models/hall.model';
import { TokenService } from '../../../../core/services/token.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { OtpLoginComponent } from '../../../auth/pages/otp-login/otp-login.component';

@Component({
  selector: 'app-hall-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './hall-list.component.html',
  styleUrls: ['./hall-list.component.scss']
})
export class HallListComponent implements OnInit {
  halls: Hall[] = [];
  filteredHalls: Hall[] = [];
  isLoading = true;

  searchCity = '';
  searchDate = '';
  sortBy: 'price-asc' | 'price-desc' | 'capacity' = 'price-asc';

  today = new Date().toISOString().split('T')[0];

  constructor(
    private hallService: HallService,
    private router: Router,
    private tokenService: TokenService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadHalls();
  }

  loadHalls() {
    this.isLoading = true;
    const params: any = {};
    if (this.searchCity) params['city'] = this.searchCity;
    if (this.searchDate) params['date'] = this.searchDate;

    this.hallService.getAllHalls(params).subscribe({
      next: (halls) => {
        this.halls = halls;
        this.applySort();
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => { 
        this.isLoading = false; 
        this.cdr.markForCheck();
      }
    });
  }

  applySort() {
    let sorted = [...this.halls];
    if (this.sortBy === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    else if (this.sortBy === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    else if (this.sortBy === 'capacity') sorted.sort((a, b) => b.capacity - a.capacity);
    this.filteredHalls = sorted;
  }

  search() { this.loadHalls(); }

  clearFilters() {
    this.searchCity = '';
    this.searchDate = '';
    this.loadHalls();
  }

  viewHall(hall: Hall) {
    if (!this.tokenService.hasToken()) {
      this.dialog.open(OtpLoginComponent, {
        width: '400px', maxWidth: '90vw', autoFocus: false, panelClass: 'custom-dialog'
      });
      return;
    }
    this.router.navigate(['/halls', hall._id]);
  }
}