import { Component } from '@angular/core';
import { SHARED_MODULES } from '../../../core/common/shared-module';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../core/services/common.service';

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

  private destroy$ = new Subject<void>();
  slug!: string;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    // get slug from URL
    this.slug = this.route.snapshot.paramMap.get('slug')!;

    this.getAboutSection();
    this.getSkillCategories();
  }

  getAboutSection() {
    this.apiService
      .GetPublicPortfolioAbout(this.slug)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.aboutData = res.data?.about;
          this.commonService.showToast(res.message, 'success');
        },
        error: (err) => {
          console.error('About fetch error:', err);
          this.commonService.showToast(err.error.message, 'error');
        },
      });
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
    this.apiService
      .GetPublicPortfolioSkills(this.slug)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.skillCategories = res.data?.skills || [];
          this.commonService.showToast(res.message, 'success');
        },
        error: (err) => {
          console.error('About fetch error:', err);
          this.commonService.showToast(err.error.message, 'error');
        },
      });
  }
}
