import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layouts/header/header.component';
import { LoginModalComponent } from './shared/components/login-modal/login-modal.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, LoginModalComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('vivah-frontend');
}
