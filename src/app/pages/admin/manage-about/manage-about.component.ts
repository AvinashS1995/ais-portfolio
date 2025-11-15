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
      next: () => {
        this.loadAbout();
        this.commonService.showToast('About section added!', 'success');
        this.closeDialog();
      },
      error: (err) => this.commonService.showToast(err.error.message, 'error'),
    });
  }

  updateAbout() {
    if (!this.editingAbout || this.aboutForm.invalid) return;

    // const payload = {
    //   adminId: this.commonService.userInfo?.id,
    //   aboutId: this.editingAbout._id,
    //   ...this.aboutForm.value,
    // };

    // this.apiService.UpdatePortfolioAbout(payload).subscribe({
    //   next: (res) => {
    //     this.loadAbout();
    //     this.commonService.showToast(res.message, 'success');
    //     this.closeDialog();
    //   },
    //   error: (err) => this.commonService.showToast(err.error.message, 'error'),
    // });
  }
}
