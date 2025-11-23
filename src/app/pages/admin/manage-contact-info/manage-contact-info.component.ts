import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SHARED_MODULES } from '../../../core/common/shared-module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { CommonService } from '../../../core/services/common.service';
import { SafeUrlPipe } from '../../../core/pipes/safe-url.pipe';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';

export interface SocialLinks {
  [key: string]: string | undefined; // <-- FIX: allows index access
  linkedin?: string;
  github?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
}

interface Location {
  company?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  mapEmbedUrl?: string;
}

export interface ContactInfo {
  _id: string;
  location: Location;
  email: string;
  phone: string;
  socialMedia: SocialLinks;
  createdAt?: string; // <-- FIX: added missing field
}

@Component({
  selector: 'app-manage-contact-info',
  standalone: true,
  imports: [SHARED_MODULES, SafeUrlPipe, ConfirmationDialogComponent],
  templateUrl: './manage-contact-info.component.html',
  styleUrl: './manage-contact-info.component.css',
})
export class ManageContactInfoComponent {
  contactForm!: FormGroup;
  showDialog = false;
  editingContactInfo: ContactInfo | null = null;

  contactCards: ContactInfo[] = [];

  confirmDialog = { show: false, message: '', contactInfoId: '' };

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private commonService: CommonService
  ) {}

  socialPlatforms = ['linkedin', 'github', 'twitter', 'instagram', 'facebook'];

  socialIcons: any = {
    github: 'fab fa-github',
    twitter: 'fab fa-twitter',
    linkedin: 'fab fa-linkedin',
    instagram: 'fab fa-instagram',
    facebook: 'fab fa-facebook',
  };

  ngOnInit(): void {
    this.initializeForm();
    this.loadContactInfo();
    console.log(this.contactCards);
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

  openDialog(contactInfo?: ContactInfo) {
    if (contactInfo) {
      this.editingContactInfo = contactInfo;
      this.contactForm.patchValue(contactInfo);
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
        if (
          res.status === 'success' &&
          res.data?.contactInfo &&
          Object.keys(res.data.contactInfo).length > 0
        ) {
          this.contactCards = [res.data.contactInfo];
        } else {
          this.contactCards = [];
        }
      },
      error: (err) => this.commonService.showToast(err.error.message, 'error'),
    });
  }

  saveContactInfo() {
    if (this.contactForm.invalid) return;

    const payload = {
      adminId: this.commonService.userInfo?.id,
      ...this.contactForm.getRawValue().location,
      ...this.contactForm.getRawValue(),
    };

    this.apiService.SavePortfolioContactInfo(payload).subscribe({
      next: () => {
        this.loadContactInfo();
        this.commonService.showToast('Contact info saved!', 'success');
        this.closeDialog();
      },
      error: (err) => this.commonService.showToast(err.error.message, 'error'),
    });
  }

  updateContactInfo() {
    if (!this.editingContactInfo || this.contactForm.invalid) return;

    const payload = {
      adminId: this.commonService.userInfo?.id,
      contactInfoId: this.editingContactInfo._id,
      ...this.contactForm.getRawValue().location,
      ...this.contactForm.getRawValue(),
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
    if (!contactInfo || !contactInfo.location) return;

    this.confirmDialog = {
      show: true,
      message: `Are you sure you want to delete ${contactInfo.location.company}?`,
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
