import { Component } from '@angular/core';
import { SHARED_MODULES } from '../../../core/common/shared-module';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { CommonService } from '../../../core/services/common.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SHARED_MODULES],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  aboutData: any = {};
  roles: string[] = [];
  displayedText = '';
  currentRoleIndex = 0;
  currentCharIndex = 0;
  isDeleting = false;

  slug!: string;
  private destroy$ = new Subject<void>();

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug')!;
    this.getHomeSection();
  }

  getHomeSection() {
    this.apiService
      .GetPublicPortfolioHome(this.slug)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.aboutData = res.data?.home;

          this.roles = res.data?.home?.roles || [];

          this.resetTypingEffect();

          this.commonService.showToast(res.message, 'success');
        },
        error: (err) => {
          console.error('Home fetch error:', err);
          this.commonService.showToast(err.error.message, 'error');
        },
      });
  }

  // reset & start typing effect again after API load
  resetTypingEffect() {
    this.displayedText = '';
    this.currentRoleIndex = 0;
    this.currentCharIndex = 0;
    this.isDeleting = false;

    if (this.roles.length > 0) {
      this.typeEffect();
    }
  }

  typeEffect() {
    if (this.roles.length === 0) return;

    const currentRole = this.roles[this.currentRoleIndex];
    const typingSpeed = this.isDeleting ? 70 : 120;

    setTimeout(() => {
      if (this.isDeleting) {
        this.displayedText = currentRole.substring(
          0,
          this.currentCharIndex - 1
        );
        this.currentCharIndex--;
      } else {
        this.displayedText = currentRole.substring(
          0,
          this.currentCharIndex + 1
        );
        this.currentCharIndex++;
      }

      if (!this.isDeleting && this.currentCharIndex === currentRole.length) {
        setTimeout(() => (this.isDeleting = true), 1000);
      } else if (this.isDeleting && this.currentCharIndex === 0) {
        this.isDeleting = false;
        this.currentRoleIndex = (this.currentRoleIndex + 1) % this.roles.length;
      }

      this.typeEffect();
    }, typingSpeed);
  }
}
