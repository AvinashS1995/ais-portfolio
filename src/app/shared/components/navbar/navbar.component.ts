import { Component, HostListener } from '@angular/core';
import { SHARED_MODULES } from '../../../core/common/shared-module';
import { Router } from '@angular/router';
import { CommonService } from '../../../core/services/common.service';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [SHARED_MODULES],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  isScrolled = false;
  isMenuOpen = false;
  isProfileOpen = false;
  isAdmin = false;
  slug = '';
  navLinks: any[] = [];

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
}
