import { Component } from '@angular/core';
import { SHARED_MODULES } from '../../../core/common/shared-module';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [SHARED_MODULES],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent {
  aboutData: any;
  skillCategories: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.aboutData = this.getAboutData();
    this.skillCategories = this.getSkillCategories();
  }

  getAboutData() {
    return {
      profileImage: 'assets/profile.jpg',
      bio: 'I am a passionate Angular Developer with a deep focus on modern UI/UX.',
      bio2: 'Building smooth, scalable, and user-centric web applications is what I love doing.',
      resumeUrl: 'assets/resume.pdf',
      stats: {
        experience: '4+',
        clients: '12+',
        recruiters: '20+',
      },
    };
  }

  getSkillCategories() {
    return [
      {
        title: 'Frontend Development',
        accent: '#f58b49',
        icon: 'fa-code',
        skills: [{ name: 'Angular' }, { name: 'HTML' }, { name: 'Tailwind' }],
      },
      {
        title: 'Backend',
        accent: '#f58b49',
        icon: 'fa-database',
        skills: [{ name: 'Node.js' }, { name: 'Express' }, { name: 'MongoDB' }],
      },
      {
        title: 'Tools & Platforms',
        accent: '#f58b49',
        icon: 'fa-tools',
        skills: [{ name: 'Git' }, { name: 'Vercel' }, { name: 'Render' }],
      },
    ];
  }
}
