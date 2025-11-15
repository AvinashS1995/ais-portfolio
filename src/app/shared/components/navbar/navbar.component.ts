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
  isAdmin = false;

  navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Services', path: '/service' },
    { label: 'Experience', path: '/experience' },
    { label: 'Projects', path: '/project' },
    { label: 'Contact', path: '/contact' },
  ];

  constructor(
    private router: Router,
    private commonService: CommonService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.commonService.isAdmin$.subscribe((status) => {
      this.isAdmin = status;
    });
  }

  // ✅ Logout API call
  logout(): void {
    this.apiService.LogOutAdmin().subscribe({
      next: (res) => {
        this.commonService.showToast(res.message, 'success');
        this.commonService.clearSession();
        this.router.navigate(['/home']);
      },
      error: (err) => {
        const msg = err.error?.message;
        this.commonService.showToast(msg, 'error');
      },
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  // ✅ Highlight active link
  isActive(path: string): boolean {
    return this.router.url === path;
  }

  // ✅ Add shadow effect on scroll
  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled = window.scrollY > 20;
  }
}
