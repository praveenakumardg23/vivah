import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/pages/home.component')
        .then(m => m.HomeComponent)
  },
  {
    path: 'halls',
    loadComponent: () =>
      import('./features/halls/pages/hall-list.component')
        .then(m => m.HallListComponent)
  }
];