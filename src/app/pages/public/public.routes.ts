import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ServiceComponent } from './service/service.component';
import { ExperienceComponent } from './experience/experience.component';
import { ProjectComponent } from './project/project.component';
import { ContactComponent } from './contact/contact.component';

export const PUBLIC_ROUTES: Routes = [
  { path: ':slug', component: HomeComponent },
  { path: ':slug/about', component: AboutComponent },
  { path: ':slug/service', component: ServiceComponent },
  { path: ':slug/experience', component: ExperienceComponent },
  { path: ':slug/project', component: ProjectComponent },
  { path: ':slug/contact', component: ContactComponent },
];
