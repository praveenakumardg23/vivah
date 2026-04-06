import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);

  // Skip adding auth header for auth routes
  if (req.url.includes('/auth/send-otp') ||
      req.url.includes('/auth/verify-otp') ||
      req.url.includes('/auth/login') ||
      req.url.includes('/auth/refresh')) {
    return next(req);
  }

  const accessToken = tokenService.getAccessToken();
  const authReq = accessToken
    ? req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        return handle401Error(authReq, next, tokenService, authService);
      }
      return throwError(() => error);
    })
  );
};

function handle401Error(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
  tokenService: TokenService,
  authService: AuthService
): Observable<HttpEvent<unknown>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    const refreshToken = tokenService.getRefreshToken();
    if (!refreshToken) {
      isRefreshing = false;
      tokenService.clearTokens();
      return throwError(() => new Error('No refresh token'));
    }

    return authService.refreshToken(refreshToken).pipe(
      switchMap((response) => {
        isRefreshing = false;
        tokenService.setTokens(response.accessToken, response.refreshToken);
        refreshTokenSubject.next(response.accessToken);
        return next(
          request.clone({
            setHeaders: { Authorization: `Bearer ${response.accessToken}` }
          })
        );
      }),
      catchError((err) => {
        isRefreshing = false;
        tokenService.clearTokens();
        window.location.href = '/';
        return throwError(() => err);
      })
    );
  }

  // Queue subsequent requests while refreshing
  return refreshTokenSubject.pipe(
    filter((token): token is string => token !== null),
    take(1),
    switchMap((token) => 
      next(request.clone({ setHeaders: { Authorization: `Bearer ${token}` } }))
    )
  );
}