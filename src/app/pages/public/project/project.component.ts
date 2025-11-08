import { Component } from '@angular/core';
import { SHARED_MODULES } from '../../../core/common/shared-module';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [SHARED_MODULES],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css',
})
export class ProjectComponent {
  projects = [
    {
      title: 'Sales Force Automation (SFA) System',
      category: 'Web App (CRM) or specifically, the Sales domain.',
      role: 'Frontend Developer • Angular + Angular Materail + Devextreme',
      image: 'assets/images/projects/sfa-mockup.jpg',
      codeLink: 'https://github.com/yourusername/sfa',
      previewLink: 'https://your-sfa-demo-link.com',
    },
    {
      title: 'Hotel Management & Monitoring',
      category: 'Web App Enterprise System',
      role: 'Frontend Developer • Angular + Bootstrap',
      image: 'assets/images/projects/hotel-mockup.jpg',
      codeLink: 'https://github.com/yourusername/hotel-management',
      previewLink: 'https://your-hotel-demo-link.com',
    },
    {
      title: 'Employee Management System App',
      category: 'Web App (CRM)',
      role: 'Full Stack Developer • Angular + Angular Material + Nodejs + Express.js + MongoDB',
      image: 'assets/images/projects/attendance-mockup.jpg',
      codeLink: 'https://github.com/yourusername/attendance-tracker',
      previewLink: 'https://your-attendance-demo-link.com',
    },
    {
      title: 'IRCTC Ticket Booking System',
      category: 'Web App',
      role: 'Angular + Angular Material + Tailwind CSS + Node.js + Express.js + MongoDB',
      image: 'assets/images/projects/irctc-mockup.jpg',
      description:
        'A smart IRCTC booking interface using RapidAPI IRCTC and local MongoDB to fetch, store, and search trains with a modern user-friendly UI.',
      codeLink: 'https://github.com/yourusername/irctc-booking',
      previewLink: 'https://your-irctc-demo-link.com',
    },
    {
      title: 'Weather Forecast Dashboard',
      category: 'Dashboard App',
      role: 'Angular + Tailwind CSS + Node.js + Express.js + MongoDB',
      image: 'assets/images/projects/weather-mockup.jpg',
      description:
        'A live weather analytics dashboard using Open-Meteo API with city search, history storage, and data charts using local MongoDB.',
      codeLink: 'https://github.com/yourusername/weather-dashboard',
      previewLink: 'https://your-weather-demo-link.com',
    },
  ];
}
