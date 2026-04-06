import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../../core/services/admin.service';
import { User, UserRole } from '../../../../shared/models/user.model';

type Tab = 'users' | 'agents' | 'register-agent';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  activeTab: Tab = 'users';
  users: User[] = [];
  agents: User[] = [];
  isLoading = true;

  // Register agent form
  agentPhone = '';
  agentName = '';
  agentSubmitting = false;
  agentMsg = '';

  // Role change
  updatingRoleId: string | null = null;

  constructor(private adminService: AdminService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.loadData(); }

  loadData() {
    this.isLoading = true;
    this.adminService.getAllUsers().subscribe({
      next: (users) => { this.users = users; this.isLoading = false; this.cdr.markForCheck(); },
      error: () => { this.isLoading = false; this.cdr.markForCheck(); }
    });
    this.adminService.getAllAgents().subscribe({
      next: (agents) => { this.agents = agents; this.cdr.markForCheck(); }
    });
  }

  setTab(tab: Tab) { this.activeTab = tab; }

  registerAgent() {
    if (!this.agentPhone) { this.agentMsg = 'Phone is required.'; return; }
    this.agentSubmitting = true;
    this.agentMsg = '';
    this.adminService.registerAgent(this.agentPhone, this.agentName).subscribe({
      next: () => {
        this.agentMsg = '✅ Agent registered successfully!';
        this.agentSubmitting = false;
        this.agentPhone = '';
        this.agentName = '';
        this.loadData();
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.agentMsg = err?.error?.msg || '❌ Registration failed.';
        this.agentSubmitting = false;
        this.cdr.markForCheck();
      }
    });
  }

  updateRole(user: User, role: UserRole) {
    if (!confirm(`Change ${user.phone}'s role to ${role}?`)) return;
    this.updatingRoleId = user._id;
    this.adminService.updateUserRole(user._id, role).subscribe({
      next: (updated) => {
        user.role = updated.role;
        this.updatingRoleId = null;
        this.loadData();
        this.cdr.markForCheck();
      },
      error: () => { this.updatingRoleId = null; this.cdr.markForCheck(); }
    });
  }

  stats() {
    return {
      total: this.users.length,
      users: this.users.filter((u) => u.role === 'USER').length,
      owners: this.users.filter((u) => u.role === 'OWNER').length,
      agents: this.users.filter((u) => u.role === 'AGENT').length,
      admins: this.users.filter((u) => u.role === 'ADMIN').length
    };
  }

  roleColor(role: UserRole): string {
    const map: Record<UserRole, string> = {
      USER: 'role-user',
      OWNER: 'role-owner',
      AGENT: 'role-agent',
      ADMIN: 'role-admin'
    };
    return map[role];
  }

  roles: UserRole[] = ['USER', 'OWNER', 'AGENT', 'ADMIN'];
}