import { Component } from '@angular/core';
import { SHARED_MODULES } from '../../../core/common/shared-module';

@Component({
  selector: 'app-service',
  standalone: true,
  imports: [SHARED_MODULES],
  templateUrl: './service.component.html',
  styleUrl: './service.component.css',
})
export class ServiceComponent {
  services = [
    {
      title: 'Frontend Development',
      icon: 'fa-code',
      color: '#f58b49',
      description:
        'Building responsive, fast, and elegant web applications using Angular, TypeScript, and modern UI frameworks like Material & Tailwind.',
    },
    {
      title: 'API Integration',
      icon: 'fa-plug',
      color: '#ff9d61',
      description:
        'Connecting and integrating REST APIs with clean, efficient, and secure communication layers for smooth data-driven experiences.',
    },
    {
      title: 'UI/UX Design',
      icon: 'fa-palette',
      color: '#f7a06b',
      description:
        'Designing pixel-perfect interfaces with strong UX focus, accessibility, and modern design principles that enhance user engagement.',
    },
    {
      title: 'Backend Support',
      icon: 'fa-server',
      color: '#f58b49',
      description:
        'Creating and managing backend logic using Node.js, .NET Core, and databases like MongoDB or MySQL for complete app solutions.',
    },
    {
      title: 'Version Control & Dev Tools',
      icon: 'fa-code-branch',
      color: '#ff9d61',
      description:
        'Collaborating with teams using Git & GitHub for version control and agile workflows, ensuring smooth project development.',
    },
    {
      title: 'Performance Optimization',
      icon: 'fa-rocket',
      color: '#f7a06b',
      description:
        'Optimizing web apps for faster load times, improved SEO, and better performance across devices for a seamless user experience.',
    },
  ];
}
