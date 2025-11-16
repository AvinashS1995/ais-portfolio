import { Component } from '@angular/core';
import { SHARED_MODULES } from '../../../core/common/shared-module';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../core/services/common.service';
import { SafeUrlPipe } from '../../../core/pipes/safe-url.pipe';

interface ContactInfo {
  location: {
    company: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
    mapEmbedUrl: string;
  };
  email: string;
  phone: string;
  socialMedia: {
    linkedin: string;
    github: string;
    twitter: string;
    instagram: string;
    facebook: string;
  };
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [SHARED_MODULES, SafeUrlPipe],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  contactInfo: ContactInfo = {
    location: {
      company: 'My Portfolio Studio',
      address: 'MG Road',
      city: 'Mumbai',
      country: 'India',
      postalCode: '400001',
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!...', // replace with your map embed link
    },
    email: 'hello@example.com',
    phone: '+91 98765 43210',
    socialMedia: {
      linkedin: 'https://linkedin.com/in/yourprofile',
      github: 'https://github.com/yourprofile',
      twitter: '',
      instagram: '',
      facebook: '',
    },
  };

  formData = {
    name: '',
    email: '',
    subject: '',
    message: '',
  };

  private destroy$ = new Subject<void>();
  slug: string = 'avinash'; // Can be dynamic from route

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug')!;

    this.fetchContactInfo();
  }

  fetchContactInfo(): void {
    this.apiService
      .GetPublicPortfolioContactInfo(this.slug)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res?.status === 'success') {
            this.contactInfo = res.data.contactInfo || [];
            console.log(this.contactInfo);

            this.commonService.showToast(res.message, 'success');
          }
        },
        error: (err) => {
          console.error('Failed to fetch contact info:', err);
          this.commonService.showToast(err.error.message, 'error');
        },
      });
  }

  handleSubmit(): void {
    // Replace this with real POST API to save contact form messages
    console.log('Message sent:', this.formData);
    alert('✅ Message sent successfully!');
    this.formData = { name: '', email: '', subject: '', message: '' };
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
