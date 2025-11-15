import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../../../core/services/common.service';
import { SHARED_MODULES } from '../../../core/common/shared-module';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-manage-about',
  standalone: true,
  imports: [SHARED_MODULES],
  templateUrl: './manage-about.component.html',
  styleUrl: './manage-about.component.css',
})
export class ManageAboutComponent {
  aboutForm!: FormGroup;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cs: CommonService,
    private as: ApiService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadPortfolioAbout();
  }

  initializeForm() {
    this.aboutForm = this.fb.group({
      name: [],
      title: [],
      bio: [],
      bio2: [],
      profileImage: [],
      resumeUrl: [],
      stats: this.fb.group({
        experience: [],
        clients: [],
        recruiters: [],
      }),
    });
  }

  loadPortfolioAbout() {
    const payload = {
      id: this.cs.userInfo?.id,
    };

    this.as
      .GetPortfolioAbout(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res?.status === 'success' && res.data) {
            this.setFormValue(res.data.about || []);

            this.cs.showToast(res.message, 'success');
          }
        },
        error: (err) => this.cs.showToast(err.error.message, 'error'),
      });
  }

  setFormValue(portfolioAbout: any) {
    this.aboutForm.patchValue({
      name: portfolioAbout.name,
      title: portfolioAbout.title,
      bio: portfolioAbout.bio,
      bio2: portfolioAbout.bio2,
      profileImage: portfolioAbout.profileImage,
      resumeUrl: portfolioAbout.resumeUrl,
      stats: {
        experience: portfolioAbout.stats?.experience || 0,
        clients: portfolioAbout.stats?.clients || 0,
        recruiters: portfolioAbout.stats?.recruiters || 0,
      },
    });
  }

  onSubmit(): void {
    if (this.aboutForm.valid) {
      const aboutSection = this.aboutForm.getRawValue();

      const { name, title, bio, bio2, profileImage, resumeUrl, stats } =
        aboutSection;

      console.log('About Data:', aboutSection);

      const payload = {
        id: this.cs.userInfo?.id,
        name: name,
        title: title,
        bio: bio,
        bio2: bio2,
        profileImage: profileImage,
        resumeUrl: resumeUrl,
        stats: {
          experience: Number(stats.experience),
          clients: Number(stats.clients),
          recruiters: Number(stats.recruiters),
        },
      };

      this.as
        .SavePortfolioAbout(payload)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            console.log(res);
            this.cs.showToast(res.message, 'success');
            this.router.navigate(['/admin/dashboard']);
          },
          error: (err) => this.cs.showToast(err.error.messages, 'error'),
        });
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/dashboard']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
