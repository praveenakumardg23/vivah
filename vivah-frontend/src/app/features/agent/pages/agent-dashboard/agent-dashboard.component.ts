import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HallService } from '../../../../core/services/hall.service';
import { AdminService } from '../../../../core/services/admin.service';
import { Hall, HallFormData } from '../../../../shared/models/hall.model';
import { User } from '../../../../shared/models/user.model';

type Tab = 'halls' | 'add-hall' | 'owners';

@Component({
  selector: 'app-agent-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agent-dashboard.component.html',
  styleUrls: ['./agent-dashboard.component.scss']
})
export class AgentDashboardComponent implements OnInit {
  activeTab: Tab = 'halls';
  halls: Hall[] = [];
  owners: User[] = [];
  isLoading = true;

  // Hall form
  editingHall: Hall | null = null;
  hallForm: HallFormData = this.emptyForm();
  hallAmenitiesInput = '';
  hallSubmitting = false;
  hallMsg = '';

  // Owner registration (inline via hall form)
  ownerPhone = '';
  ownerName = '';
  ownerSubmitting = false;
  ownerMsg = '';

  // Delete
  deletingId: string | null = null;

  constructor(
    private hallService: HallService,
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() { this.loadData(); }

  loadData() {
    this.isLoading = true;
    this.hallService.getAgentHalls().subscribe({
      next: (halls) => { this.halls = halls; this.isLoading = false; this.cdr.markForCheck(); },
      error: () => { this.isLoading = false; this.cdr.markForCheck(); }
    });
    this.adminService.getAllOwners().subscribe({
      next: (owners) => { this.owners = owners; this.cdr.markForCheck(); }
    });
  }

  setTab(tab: Tab) {
    this.activeTab = tab;
    if (tab !== 'add-hall') { this.editingHall = null; this.hallForm = this.emptyForm(); this.hallMsg = ''; }
  }

  editHall(hall: Hall) {
    this.editingHall = hall;
    this.hallForm = {
      name: hall.name,
      description: hall.description || '',
      location: hall.location,
      city: hall.city,
      address: hall.address || '',
      capacity: hall.capacity,
      price: hall.price,
      amenities: [...hall.amenities],
      images: [...hall.images],
      ownerPhone: hall.owner?.phone || ''
    };
    this.hallAmenitiesInput = hall.amenities.join(', ');
    this.activeTab = 'add-hall';
    window.scrollTo(0, 0);
  }

  submitHall() {
    this.hallForm.amenities = this.hallAmenitiesInput
      .split(',').map((s) => s.trim()).filter(Boolean);

    if (!this.hallForm.name || !this.hallForm.city || !this.hallForm.ownerPhone) {
      this.hallMsg = 'Please fill all required fields.';
      return;
    }

    this.hallSubmitting = true;
    this.hallMsg = '';

    const obs = this.editingHall
      ? this.hallService.updateHall(this.editingHall._id, this.hallForm)
      : this.hallService.createHall(this.hallForm);

    obs.subscribe({
      next: () => {
        this.hallMsg = this.editingHall ? '✅ Hall updated!' : '✅ Hall created!';
        this.hallSubmitting = false;
        this.editingHall = null;
        this.hallForm = this.emptyForm();
        this.hallAmenitiesInput = '';
        this.loadData();
        setTimeout(() => { this.activeTab = 'halls'; this.hallMsg = ''; this.cdr.markForCheck(); }, 1500);
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.hallMsg = err?.error?.msg || '❌ Failed. Try again.';
        this.hallSubmitting = false;
        this.cdr.markForCheck();
      }
    });
  }

  deleteHall(id: string) {
    if (!confirm('Delete this hall?')) return;
    this.deletingId = id;
    this.hallService.deleteHall(id).subscribe({
      next: () => {
        this.halls = this.halls.filter((h) => h._id !== id);
        this.deletingId = null;
        this.cdr.markForCheck();
      },
      error: () => { this.deletingId = null; this.cdr.markForCheck(); }
    });
  }

  addImageUrl(url: string) {
    if (url) this.hallForm.images.push(url);
  }

  removeImage(i: number) {
    this.hallForm.images.splice(i, 1);
  }

  registerOwner() {
    if (!this.ownerPhone) { this.ownerMsg = 'Phone required.'; return; }
    this.ownerSubmitting = true;
    this.ownerMsg = '';
    this.adminService.registerOwner(this.ownerPhone, this.ownerName).subscribe({
      next: () => {
        this.ownerMsg = '✅ Owner registered!';
        this.ownerSubmitting = false;
        this.ownerPhone = '';
        this.ownerName = '';
        this.loadData();
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.ownerMsg = err?.error?.msg || '❌ Failed.';
        this.ownerSubmitting = false;
        this.cdr.markForCheck();
      }
    });
  }

  private emptyForm(): HallFormData {
    return {
      name: '', description: '', location: '',
      city: '', address: '', capacity: 100,
      price: 20000, amenities: [], images: [], ownerPhone: ''
    };
  }

  imageUrlInput = '';
}