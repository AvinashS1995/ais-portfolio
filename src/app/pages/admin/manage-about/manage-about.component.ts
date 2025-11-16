import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../../../core/services/common.service';
import { SHARED_MODULES } from '../../../core/common/shared-module';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';

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

  aboutData: any = null; // loaded API data

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

    const payload = {
      adminId: this.commonService.userInfo?.id,
      ...this.aboutForm.value,
    };

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

  selectedProfileImage: string | null = null;
  resumeFileName: string | null = null;

  onProfileImageUpload(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      this.selectedProfileImage = reader.result as string;
    };
    reader.readAsDataURL(file);

    // Upload to server / AWS / your API
    // this.apiService.uploadFile(file).subscribe((res: any) => {
    //   this.aboutForm.patchValue({
    //     profileImage: res.url
    //   });
    // });
  }

  removeProfileImage() {
    this.selectedProfileImage = null;
    this.aboutForm.patchValue({ profileImage: '' });
  }

  onResumeUpload(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.resumeFileName = file.name;

    // Upload to backend
    // this.apiService.uploadFile(file).subscribe((res: any) => {
    //   this.aboutForm.patchValue({
    //     resumeUrl: res.url
    //   });
    // });
  }

  removeResume() {
    this.resumeFileName = null;
    this.aboutForm.patchValue({ resumeUrl: '' });
  }
}
