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
          catchError(() => {
            sessionStorage.clear();
            commonService.clearUserInfo();
            commonService.clearSession();
            router.navigate(['/admin/login']);
            return throwError(() => error);
          })
        );
      }

      return throwError(() => error);
    })
  );
};
