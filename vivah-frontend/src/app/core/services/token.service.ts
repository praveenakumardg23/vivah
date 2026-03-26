import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private loggedIn$ = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.loggedIn$.asObservable();

  private role$ = new BehaviorSubject<string | null>(this.getRole());
  roleObservable$ = this.role$.asObservable();

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    this.loggedIn$.next(true); // 🔥 notify app
  }

  clearTokens() {
    localStorage.clear();
    this.loggedIn$.next(false);
    this.role$.next(null);
  }

  setRole(role: string) {
    localStorage.setItem('role', role);
    this.role$.next(role);
  }

  setUserDetails(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  hasToken(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  private getRole(): string | null {
    return localStorage.getItem('role');
  }
}