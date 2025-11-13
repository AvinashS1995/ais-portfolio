import { Component, Input } from '@angular/core';
import { SHARED_MODULES } from '../../../core/common/shared-module';

interface Project {
  id: number;
  title: string;
  category: string;
  role: string;
  image: string;
  codeLink?: string;
  previewLink?: string;
}

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [SHARED_MODULES],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css',
})
export class ProjectComponent {
  @Input() projects: Project[] = [
    {
      id: 1,
      title: 'AI Resume Builder',
      category: 'Web App',
      role: 'Angular, Node.js, OpenAI',
      image: 'assets/images/projects/resume-builder.jpg',
      codeLink: 'https://github.com/yourname/ai-resume-builder',
      previewLink: 'https://airesumebuilder.vercel.app',
    },
    {
      id: 2,
      title: 'Employee Management System',
      category: 'Enterprise',
      role: 'Angular + Node.js + MongoDB',
      image: 'assets/images/projects/ems.jpg',
      codeLink: 'https://github.com/yourname/ems',
      previewLink: 'https://emsapp.vercel.app',
    },
    {
      id: 3,
      title: 'Groww Clone',
      category: 'Finance App',
      role: 'Angular + Tailwind + ApexCharts',
      image: 'assets/images/projects/groww.jpg',
      codeLink: 'https://github.com/yourname/groww-clone',
      previewLink: 'https://growwclone.vercel.app',
    },
  ];
}
