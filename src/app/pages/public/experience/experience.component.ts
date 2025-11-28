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
