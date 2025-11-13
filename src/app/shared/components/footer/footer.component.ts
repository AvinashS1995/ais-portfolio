import { Component } from '@angular/core';
import { SHARED_MODULES } from '../../../core/common/shared-module';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [SHARED_MODULES],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  navLinks = [
    { label: 'About', url: '#' },
    { label: 'Projects', url: '#' },
    { label: 'Services', url: '#' },
    { label: 'Contact', url: '#' },
  ];

  socialLinks = [
    { icon: 'fa-brands fa-facebook-f', url: 'https://facebook.com' },
    { icon: 'fa-brands fa-twitter', url: 'https://twitter.com' },
    { icon: 'fa-brands fa-linkedin-in', url: 'https://linkedin.com' },
    { icon: 'fa-brands fa-github', url: 'https://github.com' },
  ];
}
