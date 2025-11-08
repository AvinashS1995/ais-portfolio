import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SHARED_MODULES } from '../../../core/common/shared-module';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../../../core/services/common.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SHARED_MODULES],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email = '';
  password = '';
  isLoading = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private commonService: CommonService
  ) {}

  // 🔐 Login Function
  onLogin() {
    if (!this.email || !this.password) {
      this.commonService.showToast(
        'Please enter both email and password.',
        'error'
      );
      return;
    }

    this.isLoading = true;

    // ⏳ Simulate API delay
    setTimeout(() => {
      this.isLoading = false;

      // ✅ Dummy credentials
      const dummyEmail = 'abhiyavm@gmail.com';
      const dummyPassword = '12345';

      if (this.email === dummyEmail && this.password === dummyPassword) {
        // Simulate JWT token
        const dummyToken = 'dummy-jwt-token';
        localStorage.setItem('adminToken', dummyToken);
        localStorage.setItem('role', 'admin');

        this.commonService.showToast('Login successful...!', 'success');
        setTimeout(() => this.router.navigate(['/admin']), 1000);
      } else {
        this.commonService.showToast('Invalid email or password.', 'error');
      }
    }, 1000);
  }

  goBack(): void {
    this.router.navigate(['/home']); // Navigate back to portfolio home
  }
}
