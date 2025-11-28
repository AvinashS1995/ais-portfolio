import { Component, HostListener } from '@angular/core';
import { SHARED_MODULES } from '../../../core/common/shared-module';
import { Router } from '@angular/router';
import { CommonService } from '../../../core/services/common.service';
import { ApiService } from '../../../core/services/api.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [SHARED_MODULES],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private destroy$ = new Subject<void>();
  isScrolled = false;
  isMenuOpen = false;
  isProfileOpen = false;
  isAdmin = false;
  slug = '';
  adminProfileAvatarUrl = '';
  navLinks: any[] = [];
  adminPortfolioName = '';

  constructor(
    private router: Router,
    private commonService: CommonService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.slug = this.router.url.split('/')[1];
    this.navLinks = [
      { label: 'Home', path: `/${this.slug}` },
      { label: 'About', path: `/${this.slug}/about` },
      { label: 'Services', path: `/${this.slug}/service` },
      { label: 'Experience', path: `/${this.slug}/experience` },
      { label: 'Projects', path: `/${this.slug}/project` },
      { label: 'Contact', path: `/${this.slug}/contact` },
    ];

    this.commonService.isAdmin$.subscribe((status) => {
      this.isAdmin = status;
    });

    this.adminProfileAvatarUrl =
      this.commonService.userInfo?.profileImage || '';
    console.log(this.adminProfileAvatarUrl);

    console.log(this.slug);
    this.adminPortfolioName =
      this.commonService.userInfo?.portfolioWebsiteName || 'AIS';
    this.getPortfolioWebsiteOnNav(this.slug);
  }

  getPortfolioWebsiteOnNav(slug: string) {
    this.apiService
      .GetPublicPortfolioWebsite(slug)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          debugger;
          if (res?.status === 'success') {
            this.adminPortfolioName = res.data?.portfolioWebsite || 'AIS';
            console.log('Website Name:', this.adminPortfolioName);
          }
        },
        error: (err) => {
          console.error('Failed to fetch projects:', err);
          this.adminPortfolioName = 'AIS';
        },
      });
  }

  toggleProfileMenu(): void {
    this.isProfileOpen = !this.isProfileOpen;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled = window.scrollY > 20;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const element = event.target as HTMLElement;
    if (!element.closest('.relative')) {
      this.isProfileOpen = false;
    }
  }

  logout(): void {
    this.apiService.LogOutAdmin().subscribe({
      next: (res) => {
        this.commonService.showToast(res.message, 'success');
        this.commonService.clearSession();
        this.router.navigate(['/admin/login']);
        this.isProfileOpen = false;
      },
      error: (err) => {
        this.commonService.showToast(err.error?.message, 'error');
      },
    });
  }

  goToAdminProfile(): void {
    this.router.navigate(['/admin/admin-profile']);
    this.isProfileOpen = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
