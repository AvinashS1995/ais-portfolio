import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../../core/services/common.service';
import { SHARED_MODULES } from '../../../core/common/shared-module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [SHARED_MODULES],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css',
})
export class AdminLoginComponent {
  loginForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get password() {
    return this.loginForm.get('password');
  }

  handleSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    // this.router.navigate(['/admin/dashboard']);

    const password = this.password?.value;

    this.apiService.LoginAdmin({ password }).subscribe({
      next: (res) => {
        if (res?.status === 'success') {
          // ✅ Store both access and refresh tokens
          localStorage.setItem('accessToken', res.tokens.accessToken);
          localStorage.setItem('refreshToken', res.tokens.refreshToken);

          // ✅ Store admin info
          // localStorage.setItem('adminInfo', JSON.stringify(res.admin));
          this.commonService.loadUserFromToken();
          this.commonService.showToast(res.message, 'success');
          this.commonService.setLoginState();
          // Navigate to dashboard
          this.router.navigate(['/admin/dashboard']);
        }
        this.isSubmitting = false;
      },
      error: (err) => {
        this.commonService.showToast(err.error.message, 'error');
        this.isSubmitting = false;
      },
    });
  }
}
