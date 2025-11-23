import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, tap, throwError } from 'rxjs';
import { ApiService } from '../services/api.service';
import { CommonService } from '../services/common.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const apiService = inject(ApiService);
  const commonService = inject(CommonService);

  const accessToken = sessionStorage.getItem('accessToken');
  const refreshToken = sessionStorage.getItem('refreshToken');

  const clonedReq = accessToken
    ? req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } })
    : req;

  return next(clonedReq).pipe(
    catchError((error) => {
      // If access token expired → try refresh token
      if ((error.status === 401 || error.status === 403) && refreshToken) {
        return apiService.refreshAccessToken(refreshToken).pipe(
          switchMap((res: any) => {
            const newToken = res.accessToken;
            sessionStorage.setItem('accessToken', newToken);

            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` },
            });

            return next(retryReq);
          }),

          // REFRESH TOKEN FAILED HERE
          catchError((refreshErr) => {
            const message =
              refreshErr?.error?.message ||
              'Invalid or expired refresh token. Please login again.';

            commonService.showToast(message, 'error');

            // Clear everything and logout
            sessionStorage.clear();
            commonService.clearUserInfo();
            commonService.clearSession();

            router.navigate(['/admin/login']);

            return throwError(() => refreshErr);
          })
        );
      }

      commonService.showToast(
        error?.error?.message || 'Something went wrong!',
        'error'
      );

      return throwError(() => error);
    })
  );
};
