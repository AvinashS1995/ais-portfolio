import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../../../core/services/common.service';
import { SHARED_MODULES } from '../../../core/common/shared-module';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';

const allowedImageFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
const allowedFileTypes = ['application/pdf'];

@Component({
  selector: 'app-manage-about',
  standalone: true,
  imports: [SHARED_MODULES],
  templateUrl: './manage-about.component.html',
  styleUrl: './manage-about.component.css',
})
export class ManageAboutComponent implements OnInit {
  aboutForm!: FormGroup;
  showDialog = false;
  editingAbout: any = null;

  aboutData: any = null;

  selectedProfileImage: string | null = null;
  resumeFileName: string | null = null;

  @ViewChild('profileInput') profileInput: any;
  @ViewChild('resumeInput') resumeInput: any;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.loadAbout();
  }

  initializeForm() {
    this.aboutForm = this.fb.group({
      name: ['', Validators.required],
      title: ['', Validators.required],
      bio: ['', Validators.required],
      bio2: [''],
      profileImage: [''],
      resumeUrl: [''],

      stats: this.fb.group({
        experience: [0],
        clients: [0],
        recruiters: [0],
      }),
    });
  }

  openDialog(about?: any) {
    debugger;
    if (about) {
      this.editingAbout = about;
      this.aboutForm.patchValue({
        ...about,
        stats: {
          experience: about.stats?.experience || 0,
          clients: about.stats?.clients || 0,
          recruiters: about.stats?.recruiters || 0,
        },
      });
    } else {
      this.editingAbout = null;
      this.aboutForm.reset();
    }

    this.showDialog = true;
  }

  closeDialog() {
    this.showDialog = false;
  }

  loadAbout() {
    const payload = { id: this.commonService.userInfo?.id };
    this.apiService.GetPortfolioAbout(payload).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.aboutData = res.data.about || null;
        }
      },
      error: (err) => this.commonService.showToast(err.error.message, 'error'),
    });
  }

  saveAbout() {
    if (this.aboutForm.invalid) return;

    const { name, title, bio, bio2, profileImage, resumeUrl, stats } =
      this.aboutForm.getRawValue();

    const payload = {
      adminId: this.commonService.userInfo?.id,
      profileImage: profileImage.split('/').pop() || '',
      resumeFile: resumeUrl.split('/').pop() || '',
      name,
      title,
      bio,
      bio2,
      stats,
    };

    console.log(payload);

    this.apiService.SavePortfolioAbout(payload).subscribe({
      next: (res) => {
        this.loadAbout();
        this.commonService.showToast(
          res.action === 'Created'
            ? 'About section created!'
            : 'About section updated!',
          'success'
        );
        this.closeDialog();
      },
      error: (err) => this.commonService.showToast(err.error.message, 'error'),
    });
  }

  onProfileImageUpload(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    if (!allowedImageFileTypes.includes(file.type)) {
      this.commonService.showToast(
        'image files are allowed (JPG, JPEG, PNG)',
        'error'
      );
      return;
    }

    this.apiService.UploadFile(formData).subscribe({
      next: (res: any) => {
        const uploaded = res.data;
        console.log(uploaded);
        // Show preview
        this.selectedProfileImage = uploaded.presignFileUrl;

        // Patch form with new object structure
        this.aboutForm.patchValue({
          profileImage: uploaded.fileUrl,
        });
      },
    });
  }

  removeProfileImage() {
    this.selectedProfileImage = null;
    this.aboutForm.patchValue({ profileImage: '' });
  }

  onResumeUpload(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    if (!allowedFileTypes.includes(file.type)) {
      this.commonService.showToast('Pdf files are allowed (PDF)', 'error');
      return;
    }

    // this.resumeFileName = file.name;

    this.apiService.UploadFile(formData).subscribe({
      next: (res: any) => {
        const uploaded = res.data;
        console.log(uploaded);

        // Show preview
        this.resumeFileName = uploaded.fileKey;

        // Patch form with new object structure
        this.aboutForm.patchValue({
          resumeUrl: uploaded.fileUrl,
        });
      },
    });
  }

  removeResume() {
    this.resumeFileName = null;
    this.aboutForm.patchValue({ resumeUrl: '' });
  }
}
