import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminLayoutComponent } from '../../shared/components/admin-layout/admin-layout.component';

export const ADMIN_ROUTES: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: AdminLayoutComponent,
    children: [{ path: '', component: AdminLayoutComponent }],
  },
];
