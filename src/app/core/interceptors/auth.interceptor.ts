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

  // ✅ Attach access token if available
  const clonedRequest = accessToken
    ? req.clone({
        setHeaders: { Authorization: `Bearer ${accessToken}` },
      })
    : req;

  return next(clonedRequest).pipe(
    catchError((error) => {
      // 🔒 Handle token expiration (401 / 403)
      if ((error.status === 401 || error.status === 403) && refreshToken) {
        return apiService.refreshAccessToken(refreshToken).pipe(
          switchMap((res: any) => {
            const newAccessToken = res.accessToken;
            sessionStorage.setItem('accessToken', newAccessToken);

            // 🔁 Retry original request
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newAccessToken}` },
            });
            return next(retryReq);
          }),
          catchError((refreshErr) => {
            // ❌ Refresh failed

            console.log(refreshErr);
            commonService.showToast(
              'Session expired, please login again',
              'error'
            );
            sessionStorage.clear();
            router.navigate(['/home']);
            return throwError(() => refreshErr);
          })
        );
      }

      // ⚠️ Other backend errors
      if (error?.error?.message) {
        commonService.showToast(error.error.message, 'error');
      } else {
        commonService.showToast('Something went wrong!', 'error');
      }

      return throwError(() => error);
    })
  );
};
