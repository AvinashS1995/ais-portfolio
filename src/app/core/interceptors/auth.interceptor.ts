import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  // 🟠 Get token from localStorage
  const token = localStorage.getItem('adminToken');

  // 🟢 Clone request with Authorization header if token exists
  const clonedRequest = token
    ? req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      })
    : req;

  // 🔴 Handle 401 / 403 Unauthorized responses
  return next(clonedRequest).pipe(
    // Intercept response errors
    tap({
      error: (err) => {
        if (err.status === 401 || err.status === 403) {
          // Clear local storage and redirect
          localStorage.removeItem('adminToken');
          localStorage.removeItem('role');
          router.navigate(['/']);
        }
      },
    })
  );
};
