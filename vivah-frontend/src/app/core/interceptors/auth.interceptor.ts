import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';

import { inject } from '@angular/core';
import {
  Observable,
  throwError,
  BehaviorSubject
} from 'rxjs';

import {
  catchError,
  switchMap,
  filter,
  take
} from 'rxjs/operators';

import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (
  req,
  next
): Observable<HttpEvent<unknown>> => {

  const tokenService = inject(TokenService);
  const authService = inject(AuthService);

  // ❌ Skip auth APIs
  if (req.url.includes('/auth')) {
    return next(req);
  }

  let authReq = req;
  const accessToken = tokenService.getAccessToken();

  if (accessToken) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {

      if (error.status === 401) {
        return handle401Error(authReq, next, tokenService, authService);
      }

      return throwError(() => error);
    })
  );
};

function handle401Error(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
  tokenService: any,
  authService: any
): Observable<HttpEvent<unknown>> {

  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    const refreshToken = tokenService.getRefreshToken();

    if (!refreshToken) {
      logout(tokenService);
      return throwError(() => new Error('No refresh token'));
    }

    return authService.refreshToken(refreshToken).pipe(
      switchMap((response: any) => {
        isRefreshing = false;

        tokenService.setTokens(
          response.accessToken,
          response.refreshToken
        );

        refreshTokenSubject.next(response.accessToken);

        return next(
          request.clone({
            setHeaders: {
              Authorization: `Bearer ${response.accessToken}`
            }
          })
        );
      }),
      catchError((err) => {
        isRefreshing = false;
        logout(tokenService);
        return throwError(() => err);
      })
    );
  }

  return refreshTokenSubject.pipe(
    filter((token): token is string => token !== null),
    take(1),
    switchMap((token) => {
      return next(
        request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        })
      );
    })
  );
}

function logout(tokenService: any) {
  tokenService.clearTokens();
  window.location.href = '/login';
}