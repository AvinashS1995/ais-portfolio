import { Component, Input } from '@angular/core';
import { SHARED_MODULES } from '../../../core/common/shared-module';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { CommonService } from '../../../core/services/common.service';
import { ActivatedRoute } from '@angular/router';

interface Project {
  id: number;
  title: string;
  category: string;
  description?: string;
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
  projects: Project[] = [];

  private destroy$ = new Subject<void>();
  slug: string = 'avinash';

  constructor(
    private apiService: ApiService,
    private commonService: CommonService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug')!;
    this.fetchProjects();
  }

  fetchProjects(): void {
    this.apiService
      .GetPublicPortfolioProjects(this.slug)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res?.status === 'success') {
            this.projects = res.data.projects || [];
            console.log(this.projects);
            this.commonService.showToast(res.message, 'success');
          }
        },
        error: (err) => {
          console.error('Failed to fetch projects:', err);
          this.commonService.showToast(err.error.message, 'error');
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
