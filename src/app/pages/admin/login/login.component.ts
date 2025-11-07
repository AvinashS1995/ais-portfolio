import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SHARED_MODULES } from '../../../core/common/shared-module';

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

  constructor(private router: Router) {}

  onLogin(): void {
    const success = [this.email, this.password];
    if (success) {
      this.router.navigate(['/admin']);
    } else {
      alert('Invalid credentials');
    }
  }

  goBack(): void {
    this.router.navigate(['/']); // Navigate back to portfolio home
  }
}
