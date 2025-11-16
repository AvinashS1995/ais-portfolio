import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CommonService } from '../services/common.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const commonService = inject(CommonService);

  const token = sessionStorage.getItem('accessToken');
  if (!token) return router.parseUrl('/admin/login');

  try {
    const decoded = commonService.userInfo;

    if (!decoded?.role || !['Admin', 'Super Admin'].includes(decoded?.role)) {
      return router.parseUrl('/admin/not-authorized');
    }

    return true;
  } catch {
    return router.parseUrl('/admin/login');
  }
};
