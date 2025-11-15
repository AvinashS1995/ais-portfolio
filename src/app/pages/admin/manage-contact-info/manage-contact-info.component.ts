import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SHARED_MODULES } from '../../../core/common/shared-module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { CommonService } from '../../../core/services/common.service';
import { SafeUrlPipe } from '../../../core/pipes/safe-url.pipe';

interface SocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
}

interface ContactInfo {
  _id: string;
  company: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  mapEmbedUrl: string;
  email: string;
  phone: string;
  socialMedia: SocialLinks;
}

@Component({
  selector: 'app-manage-contact-info',
  standalone: true,
  imports: [SHARED_MODULES, SafeUrlPipe],
  templateUrl: './manage-contact-info.component.html',
  styleUrl: './manage-contact-info.component.css',
})
export class ManageContactInfoComponent {
  contactForm!: FormGroup;
  showDialog = false;
  editingContactInfo: ContactInfo | null = null;

  socialPlatforms = ['linkedin', 'github', 'twitter', 'instagram', 'facebook'];

  contactCards: any[] = [];
  confirmDialog = { show: false, message: '', contactInfoId: '' };

  socialIcons: any = {
    github: 'fab fa-github',
    twitter: 'fab fa-twitter',
    linkedin: 'fab fa-linkedin',
    instagram: 'fab fa-instagram',
    facebook: 'fab fa-facebook',
  };

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadContactInfo();
  }

  initializeForm() {
    this.contactForm = this.fb.group({
      location: this.fb.group({
        company: ['', Validators.required],
        address: [''],
        city: [''],
        country: [''],
        postalCode: [''],
        mapEmbedUrl: [''],
      }),

      email: ['', [Validators.required, Validators.email]],
      phone: [''],

      socialMedia: this.fb.group({
        linkedin: [''],
        github: [''],
        twitter: [''],
        instagram: [''],
        facebook: [''],
      }),
    });
  }

  openDialog(contactInfo?: any) {
    if (contactInfo) {
      this.editingContactInfo = contactInfo;
      debugger;
      this.contactForm.patchValue({
        location: {
          company: contactInfo.location.company,
          address: contactInfo.location.address,
          city: contactInfo.location.city,
          country: contactInfo.location.country,
          postalCode: contactInfo.location.postalCode,
          mapEmbedUrl: contactInfo.location.mapEmbedUrl,
        },
        email: contactInfo.email,
        phone: contactInfo.phone,
        socialMedia: contactInfo.socialMedia,
      });
    } else {
      this.editingContactInfo = null;
      this.contactForm.reset();
    }

    this.showDialog = true;
  }

  closeDialog() {
    this.showDialog = false;
  }

  loadContactInfo() {
    const payload = { id: this.commonService.userInfo?.id };
    this.apiService.GetPortfolioContactInfo(payload).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          const info = res.data.contactInfo;

          // FIX: Always convert to array
          this.contactCards = info ? [info] : [];
        }
      },
      error: (err) => this.commonService.showToast(err.error.message, 'error'),
    });
  }

  saveContactInfo() {
    if (this.contactForm.invalid) return;

    const { location, email, phone, socialMedia } =
      this.contactForm.getRawValue();
    const payload = {
      adminId: this.commonService.userInfo?.id,
      ...location,
      email,
      phone,
      socialMedia: {
        linkedin: socialMedia.linkedin,
        github: socialMedia.github,
        twitter: socialMedia.twitter,
        instagram: socialMedia.instagram,
        facebook: socialMedia.facebook,
      },
    };

    this.apiService.SavePortfolioContactInfo(payload).subscribe({
      next: () => {
        this.loadContactInfo();
        this.commonService.showToast(
          'Education added successfully!',
          'success'
        );
        this.closeDialog();
      },
      error: (err) => this.commonService.showToast(err.error.message, 'error'),
    });
  }

  updateContactInfo() {
    if (!this.editingContactInfo || this.contactForm.invalid) return;

    const { location, email, phone, socialMedia } =
      this.contactForm.getRawValue();
    const payload = {
      adminId: this.commonService.userInfo?.id,
      contactInfoId: this.editingContactInfo._id,
      ...location,
      email,
      phone,
      socialMedia: {
        linkedin: socialMedia.linkedin,
        github: socialMedia.github,
        twitter: socialMedia.twitter,
        instagram: socialMedia.instagram,
        facebook: socialMedia.facebook,
      },
    };

    this.apiService.UpdatePortfolioContactInfo(payload).subscribe({
      next: (res) => {
        this.loadContactInfo();
        this.commonService.showToast(res.message, 'success');
        this.closeDialog();
      },
      error: (err) => this.commonService.showToast(err.error.message, 'error'),
    });
  }

  deleteContactInfo(contactInfoId: string) {
    const contactInfo = this.contactCards.find((e) => e._id === contactInfoId);
    if (!contactInfo) return;

    console.log(contactInfo);

    this.confirmDialog = {
      show: true,
      message: `Are you sure you want to delete ${contactInfo.company}?`,
      contactInfoId,
    };
  }

  handleConfirm(result: boolean) {
    if (result && this.confirmDialog.contactInfoId) {
      const payload = {
        adminId: this.commonService.userInfo?.id,
        contactInfoId: this.confirmDialog.contactInfoId,
      };

      this.apiService.DeletePortfolioContactInfo(payload).subscribe({
        next: (res) => {
          this.loadContactInfo();
          this.commonService.showToast(res.message, 'success');
        },
        error: (err) =>
          this.commonService.showToast(err.error.message, 'error'),
      });
    }
    this.confirmDialog.show = false;
  }
}
