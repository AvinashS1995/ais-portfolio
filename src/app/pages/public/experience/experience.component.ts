import { Component } from '@angular/core';
import { SHARED_MODULES } from '../../../core/common/shared-module';
import { ApiService } from '../../../core/services/api.service';
import { Subject, takeUntil } from 'rxjs';
import { CommonService } from '../../../core/services/common.service';
import { ActivatedRoute } from '@angular/router';

interface Experience {
  id: number;
  company: string;
  fromYear: string;
  toYear?: string;
  currentlyWorking: boolean;
  role: string;
  project: string;
  description: string;
}

interface Education {
  id: number;
  university: string;
  degree: string;
  fromYear: string;
  toYear?: string;
  currentlyStudying: boolean;
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
    // this.experiences = [
    //   {
    //     id: 1,
    //     company: 'Torrent Pharma',
    //     period: 'Mar 2024 - Present',
    //     role: 'Frontend Developer (Angular)',
    //     project: 'SFA - Sales Force Automation',
    //     description:
    //       'Developed interactive dashboards, popup systems, and meeting scheduling modules using Angular 18 & Node.js.',
    //   },
    //   {
    //     id: 2,
    //     company: 'TechCorp Solutions',
    //     period: '2022 - 2024',
    //     role: 'Software Engineer',
    //     project: 'Employee Management System',
    //     description:
    //       'Built modular Angular architecture with Node.js APIs and MongoDB integration for enterprise HR automation.',
    //   },
    // ];

    // this.education = [
    //   {
    //     id: 1,
    //     university: 'Bachelor of Fine Arts (BFA)',
    //     degree: 'BFA - Visual Communication',
    //     period: '2017 - 2021',
    //   },
    //   {
    //     id: 2,
    //     university: 'High School - Science Stream',
    //     degree: '12th Standard',
    //     period: '2015 - 2017',
    //   },
    // ];
    this.slug = this.route.snapshot.paramMap.get('slug')!;

    this.fetchExperiences();
    this.fetchEducation();
  }

  private destroy$ = new Subject<void>();
  slug: string = 'avinash'; // Can be dynamic from route

  constructor(
    private apiService: ApiService,
    private commonService: CommonService,
    private route: ActivatedRoute
  ) {}

  fetchExperiences(): void {
    this.apiService
      .GetPublicPortfolioExperiences(this.slug)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res?.status === 'success') {
            this.experiences = res.data.experiences || [];
            this.commonService.showToast(res.message, 'success');
          }
        },
        error: (err) => {
          console.error('Failed to fetch experiences:', err);
          this.commonService.showToast(err.error.message, 'error');
        },
      });
  }

  fetchEducation(): void {
    this.apiService
      .GetPublicPortfolioEducations(this.slug)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res?.status === 'success') {
            this.education = res.data.educations || [];
            this.commonService.showToast(res.message, 'success');
          }
        },
        error: (err) => {
          console.error('Failed to fetch education:', err);
          this.commonService.showToast(err.error.message, 'error');
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
