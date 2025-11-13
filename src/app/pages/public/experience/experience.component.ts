import { Component } from '@angular/core';
import { SHARED_MODULES } from '../../../core/common/shared-module';

interface Experience {
  id: number;
  company: string;
  period: string;
  role: string;
  project: string;
  description: string;
}

interface Education {
  id: number;
  university: string;
  degree: string;
  period: string;
}

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [SHARED_MODULES],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.css',
})
export class ExperienceComponent {
  experiences: Experience[] = [];
  education: Education[] = [];

  ngOnInit() {
    // 🧱 You can replace this with dynamic API data later
    this.experiences = [
      {
        id: 1,
        company: 'Torrent Pharma',
        period: 'Mar 2024 - Present',
        role: 'Frontend Developer (Angular)',
        project: 'SFA - Sales Force Automation',
        description:
          'Developed interactive dashboards, popup systems, and meeting scheduling modules using Angular 18 & Node.js.',
      },
      {
        id: 2,
        company: 'TechCorp Solutions',
        period: '2022 - 2024',
        role: 'Software Engineer',
        project: 'Employee Management System',
        description:
          'Built modular Angular architecture with Node.js APIs and MongoDB integration for enterprise HR automation.',
      },
    ];

    this.education = [
      {
        id: 1,
        university: 'Bachelor of Fine Arts (BFA)',
        degree: 'BFA - Visual Communication',
        period: '2017 - 2021',
      },
      {
        id: 2,
        university: 'High School - Science Stream',
        degree: '12th Standard',
        period: '2015 - 2017',
      },
    ];
  }
}
