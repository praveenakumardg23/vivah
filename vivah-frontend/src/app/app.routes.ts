import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/pages/home/home.component').then((m) => m.HomeComponent)
  },
  {
    path: 'halls',
    loadComponent: () =>
      import('./features/halls/pages/hall-list/hall-list.component').then((m) => m.HallListComponent)
  },
  {
    path: 'halls/:id',
    loadComponent: () =>
      import('./features/halls/pages/hall-detail/hall-detail.component').then((m) => m.HallDetailComponent)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/otp-login/otp-login.component').then(
        (m) => m.OtpLoginComponent
      )
  },
  // User
  {
    path: 'my-bookings',
    loadComponent: () =>
      import('./features/booking/pages/booking-history/booking-history.component').then(
        (m) => m.BookingHistoryComponent
      ),
    canActivate: [authGuard]
  },
  // Owner
  {
    path: 'owner-dashboard',
    loadComponent: () =>
      import('./features/owner/pages/owner-dashboard/owner-dashboard.component').then(
        (m) => m.OwnerDashboardComponent
      ),
    canActivate: [authGuard],
    data: { roles: ['OWNER', 'AGENT', 'ADMIN'] }
  },
  // Agent
  {
    path: 'agent-dashboard',
    loadComponent: () =>
      import('./features/agent/pages/agent-dashboard/agent-dashboard.component').then(
        (m) => m.AgentDashboardComponent
      ),
    canActivate: [authGuard],
    data: { roles: ['AGENT', 'ADMIN'] }
  },
  // Admin
  {
    path: 'admin-dashboard',
    loadComponent: () =>
      import('./features/admin/pages/admin-dashboard/admin-dashboard.component').then(
        (m) => m.AdminDashboardComponent
      ),
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] }
  },
  { path: '**', redirectTo: '' }
];