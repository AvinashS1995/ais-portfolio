import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const accessToken = localStorage.getItem('accessToken');

  const role = localStorage.getItem('role');

  // ✅ Allow only if adminToken exists and role is 'admin'
  if (accessToken && role === 'admin') {
    return true;
  }

  // ❌ Redirect to home or login page if not authorized
  router.navigate(['/admin/login']);
  return false;
};
