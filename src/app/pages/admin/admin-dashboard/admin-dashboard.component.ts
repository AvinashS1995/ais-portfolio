import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SHARED_MODULES } from '../../../core/common/shared-module';

interface StatCard {
  label: string;
  count: number;
  icon: string; // FontAwesome or lucide icon class
  link: string;
  color: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [SHARED_MODULES],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent {
  services: any[] = [];
  experiences: any[] = [];
  education: any[] = [];
  projects: any[] = [];
  contactMessages: any[] = [];

  stats: StatCard[] = [];

  cards = [
    {
      icon: 'fa-user',
      title: 'About Section',
      desc: 'Update your bio, profile image, and stats',
      link: '/admin/about',
    },
    {
      icon: 'fa-wrench',
      title: 'Services',
      desc: 'Add, edit, or remove your services',
      link: '/admin/services',
    },
    {
      icon: 'fa-briefcase',
      title: 'Experience',
      desc: 'Manage your work experience entries',
      link: '/admin/experience',
    },
    {
      icon: 'fa-graduation-cap',
      title: 'Education',
      desc: 'Update your educational background',
      link: '/admin/education',
    },
    {
      icon: 'fa-folder-open',
      title: 'Projects',
      desc: 'Showcase your latest projects',
      link: '/admin/projects',
    },
    {
      icon: 'fa-folder-open',
      title: 'Contact Info',
      desc: 'Update location, email, phone & social links',
      link: '/admin/contact-info',
    },
    {
      icon: 'fa-envelope',
      title: 'Messages',
      desc: 'View and manage contact messages',
      link: '/admin/messages',
    },
    {
      icon: 'fa-user-shield',
      title: 'Admin User Creation',
      desc: 'Create and manage admin users with roles and permissions',
      link: '/admin/user-management',
    },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Sample dynamic data (you’ll replace with actual API data)
    this.services = [{}, {}, {}];
    this.experiences = [{}, {}, {}, {}];
    this.education = [{}, {}];
    this.projects = [{}, {}, {}, {}, {}];
    this.contactMessages = [{}, {}];

    this.stats = [
      {
        label: 'Services',
        count: this.services.length,
        icon: 'fa-wrench',
        link: '/admin/services',
        color: '#f58b49',
      },
      {
        label: 'Experiences',
        count: this.experiences.length,
        icon: 'fa-briefcase',
        link: '/admin/experience',
        color: '#ff9d61',
      },
      {
        label: 'Education',
        count: this.education.length,
        icon: 'fa-graduation-cap',
        link: '/admin/education',
        color: '#f7a06b',
      },
      {
        label: 'Projects',
        count: this.projects.length,
        icon: 'fa-folder-open',
        link: '/admin/projects',
        color: '#f58b49',
      },
      {
        label: 'Messages',
        count: this.contactMessages.length,
        icon: 'fa-envelope',
        link: '/admin/messages',
        color: '#ff9d61',
      },
    ];
  }

  navigate(link: string): void {
    this.router.navigate([link]);
  }
}
