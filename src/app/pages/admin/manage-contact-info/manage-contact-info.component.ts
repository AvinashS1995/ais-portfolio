import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SHARED_MODULES } from '../../../core/common/shared-module';

type SocialPlatform =
  | 'linkedin'
  | 'github'
  | 'twitter'
  | 'instagram'
  | 'facebook';

@Component({
  selector: 'app-manage-contact-info',
  standalone: true,
  imports: [SHARED_MODULES],
  templateUrl: './manage-contact-info.component.html',
  styleUrl: './manage-contact-info.component.css',
})
export class ManageContactInfoComponent {
  socialPlatforms: SocialPlatform[] = [
    'linkedin',
    'github',
    'twitter',
    'instagram',
    'facebook',
  ];

  formData = {
    location: {
      company: 'TechNova Pvt Ltd',
      address: '123 Innovation Street',
      city: 'Bangalore',
      country: 'India',
      postalCode: '560001',
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=...',
    },
    email: 'info@technova.com',
    phone: '+91 9876543210',
    socialMedia: {
      linkedin: '',
      github: '',
      twitter: '',
      instagram: '',
      facebook: '',
    } as Record<SocialPlatform, string>,
  };

  constructor(public router: Router) {}

  onSubmit() {
    alert('Contact information updated successfully!');
    this.router.navigate(['/admin/dashboard']);
  }
}
