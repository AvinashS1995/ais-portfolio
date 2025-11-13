import { Component } from '@angular/core';
import { SHARED_MODULES } from '../../../core/common/shared-module';

interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-service',
  standalone: true,
  imports: [SHARED_MODULES],
  templateUrl: './service.component.html',
  styleUrl: './service.component.css',
})
export class ServiceComponent {
  services: Service[] = [];

  ngOnInit() {
    this.services = [
      {
        id: 1,
        title: 'Frontend Development',
        description:
          'Building fast, modern, and responsive web interfaces using Angular, React, and TypeScript.',
        icon: 'fa-code',
        color: '#f58b49',
      },
      {
        id: 2,
        title: 'UI/UX Design',
        description:
          'Designing clean, user-friendly interfaces focused on usability, accessibility, and visual appeal.',
        icon: 'fa-paint-brush',
        color: '#f58b49',
      },
      {
        id: 3,
        title: 'API Integration',
        description:
          'Connecting apps with secure backend APIs and optimizing data flow using RESTful services.',
        icon: 'fa-plug',
        color: '#f58b49',
      },
      {
        id: 4,
        title: 'Performance Optimization',
        description:
          'Improving load time, Core Web Vitals, and rendering efficiency for seamless user experiences.',
        icon: 'fa-rocket',
        color: '#f58b49',
      },
      {
        id: 5,
        title: 'Maintenance & Support',
        description:
          'Ensuring applications run smoothly with updates, monitoring, and quick issue resolution.',
        icon: 'fa-tools',
        color: '#f58b49',
      },
      {
        id: 6,
        title: 'Deployment & DevOps',
        description:
          'CI/CD setup and deploying scalable apps on AWS, Vercel, and Render for production-ready systems.',
        icon: 'fa-server',
        color: '#f58b49',
      },
    ];
  }
}
