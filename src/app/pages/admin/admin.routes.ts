import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminLayoutComponent } from '../../shared/components/admin-layout/admin-layout.component';
import { CreateAdminComponent } from './create-admin/create-admin.component';
import { adminGuard } from '../../core/guards/admin.guard';

export const ADMIN_ROUTES: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'new-admin-creation', component: CreateAdminComponent },

  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [{ path: '', component: AdminLayoutComponent }],
  },
];
