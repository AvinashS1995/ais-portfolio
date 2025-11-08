import { Component } from '@angular/core';
import { SHARED_MODULES } from '../../../core/common/shared-module';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [SHARED_MODULES],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.css',
})
export class ExperienceComponent {
  experiences = [
    {
      company: 'Torrent Pharma Ltd (Corporate Office)',
      role: 'Executive – Front End Developer',
      period: '2024 – Present',
      project: 'Sales Force Automation (SFA) Project',
      description:
        'Contributed to the front-end development of a large-scale SFA platform to streamline sales operations, enhance real-time reporting, and improve the productivity of field teams through modern, user-focused UI built with Angular.',
    },
    {
      company: 'Ambroasian Research & Development Pvt Ltd',
      role: 'Angular – Front End Developer',
      period: '2021 – 2024',
      project: 'Hotel Management & Monitoring System Project',
      description:
        'Developed an intuitive hotel management interface with advanced dashboards and data visualization, enabling real-time booking insights, room status tracking, and performance analytics for enhanced operational efficiency.',
    },
  ];

  education = [
    {
      degree: 'Master’s Degree – Bio-Informatics',
      university: 'SRTM University',
      period: '2016 – 2018',
    },
    {
      degree: 'Bachelor’s Degree – Bio-Informatics',
      university: 'SRTM University',
      period: '2013 – 2016',
    },
  ];
}
