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
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get email() {
    return this.loginForm.get('email');
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

    const payload = {
      email: this.email?.value,
      password: this.password?.value,
    };

    this.apiService.LoginAdmin(payload).subscribe({
      next: (res) => {
        if (res?.status === 'success') {
          sessionStorage.setItem('accessToken', res.tokens.accessToken);
          sessionStorage.setItem('refreshToken', res.tokens.refreshToken);
          console.log(res.message);
          this.commonService.showToast(res.message, 'success');
          this.commonService.loadUserFromToken();
          this.commonService.setLoginState();
          this.router.navigate(['/admin/dashboard']);
        }
        this.isSubmitting = false;
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Login failed';
        this.commonService.showToast(this.errorMessage, 'error');
        this.isSubmitting = false;
      },
    });
  }
}
