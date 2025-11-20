import { Routes } from '@angular/router';
import { adminGuard } from '../../core/guards/admin.guard';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ManageAboutComponent } from './manage-about/manage-about.component';
import { ManageEducationComponent } from './manage-education/manage-education.component';
import { ManageExperienceComponent } from './manage-experience/manage-experience.component';
import { ManageProjectsComponent } from './manage-projects/manage-projects.component';
import { ManageServicesComponent } from './manage-services/manage-services.component';
import { ManageMessagesComponent } from './manage-messages/manage-messages.component';
import { ManageContactInfoComponent } from './manage-contact-info/manage-contact-info.component';
import { AdminUserManagementComponent } from './admin-user-management/admin-user-management.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { ManageSkillsComponent } from './manage-skills/manage-skills.component';
import { ManageHomeComponent } from './manage-home/manage-home.component';

export const ADMIN_ROUTES: Routes = [
  // LOGIN — NO GUARD
  { path: 'login', component: AdminLoginComponent },

  // PROTECTED ADMIN AREA
  {
    path: '',
    canActivateChild: [adminGuard],
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'home', component: ManageHomeComponent },
      { path: 'abouts', component: ManageAboutComponent },
      { path: 'education', component: ManageEducationComponent },
      { path: 'experiences', component: ManageExperienceComponent },
      { path: 'projects', component: ManageProjectsComponent },
      { path: 'skills', component: ManageSkillsComponent },
      { path: 'services', component: ManageServicesComponent },
      { path: 'messages', component: ManageMessagesComponent },
      { path: 'contact-info', component: ManageContactInfoComponent },
      { path: 'user-management', component: AdminUserManagementComponent },

      // Default redirect if someone opens /admin
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
