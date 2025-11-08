import { Component } from '@angular/core';
import { SHARED_MODULES } from '../../../core/common/shared-module';
import { Router } from '@angular/router';
import { CommonService } from '../../../core/services/common.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [SHARED_MODULES],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  isMenuOpen = false;
  isAdminLoggedIn = false;

  constructor(private router: Router, private commonService: CommonService) {}

  ngOnInit(): void {
    this.checkAdminLogin();
  }

  // 🔍 Check login state
  checkAdminLogin(): void {
    this.isAdminLoggedIn = !!localStorage.getItem('adminToken');
  }

  // 🔒 Logout admin
  logout(): void {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('role');
    this.isAdminLoggedIn = false;
    this.commonService.showToast('Logged out successfully!', 'success');
    this.router.navigate(['/home']); // Redirect to home
    console.log(this.isAdminLoggedIn);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}
