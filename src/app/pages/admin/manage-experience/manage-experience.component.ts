import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SHARED_MODULES } from '../../../core/common/shared-module';
import { ApiService } from '../../../core/services/api.service';
import { CommonService } from '../../../core/services/common.service';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';

interface Experience {
  _id: string;
  company: string;
  role: string;
  fromYear: string;
  toYear?: string;
  currentlyWorking: boolean;
  project: string;
  description: string;
}

@Component({
  selector: 'app-manage-experience',
  standalone: true,
  imports: [SHARED_MODULES, ConfirmationDialogComponent],
  templateUrl: './manage-experience.component.html',
  styleUrl: './manage-experience.component.css',
})
export class ManageExperienceComponent {
  experiences: Experience[] = [];

  experienceForm!: FormGroup;
  showDialog = false;
  editingExperience: Experience | null = null;
  confirmDialog = { show: false, message: '', expId: '' };

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadExperiences();
    // Currently Studying checkbox logic
    this.experienceForm
      .get('currentlyWorking')
      ?.valueChanges.subscribe((val) => {
        const toYearControl = this.experienceForm.get('toYear');
        if (val) {
          toYearControl?.disable({ emitEvent: false }); // disable To Year
          toYearControl?.setValue(''); // clear To Year
        } else {
          toYearControl?.enable({ emitEvent: false });
        }
      });
  }

  initializeForm() {
    this.experienceForm = this.fb.group({
      company: ['', Validators.required],
      role: ['', Validators.required],
      fromYear: ['', Validators.required],
      toYear: [''],
      currentlyWorking: [false],
      project: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  openDialog(experience?: Experience) {
    if (experience) {
      this.editingExperience = experience;
      this.experienceForm.patchValue(experience);
    } else {
      this.editingExperience = null;
      this.experienceForm.reset({ currentlyWorking: false });
    }
    this.showDialog = true;
  }

  closeDialog() {
    this.showDialog = false;
  }

  loadExperiences() {
    const payload = { id: this.commonService.userInfo?.id };
    this.apiService.GetPortfolioExperiences(payload).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.experiences = res.data.experience || [];
        }
      },
      error: (err) => this.commonService.showToast(err.error.message, 'error'),
    });
  }

  saveExperience() {
    if (this.experienceForm.invalid) return;

    const { company, role, period, project, description } =
      this.experienceForm.getRawValue();
    const payload = {
      adminId: this.commonService.userInfo?.id,
      ...this.experienceForm.getRawValue(),
    };

    this.apiService.SavePortfolioExperiences(payload).subscribe({
      next: () => {
        this.loadExperiences();
        this.commonService.showToast(
          'Education added successfully!',
          'success'
        );
        this.closeDialog();
      },
      error: (err) => this.commonService.showToast(err.error.message, 'error'),
    });
  }

  updateExperience() {
    if (!this.editingExperience || this.experienceForm.invalid) return;

    const { company, role, period, project, description } =
      this.experienceForm.getRawValue();
    const payload = {
      adminId: this.commonService.userInfo?.id,
      expId: this.editingExperience._id,
      ...this.experienceForm.getRawValue(),
    };

    this.apiService.UpdatePortfolioExperiences(payload).subscribe({
      next: (res) => {
        this.loadExperiences();
        this.commonService.showToast(res.message, 'success');
        this.closeDialog();
      },
      error: (err) => this.commonService.showToast(err.error.message, 'error'),
    });
  }

  deleteExperience(expId: string) {
    const exp = this.experiences.find((e) => e._id === expId);
    if (!exp) return;

    console.log(exp);

    this.confirmDialog = {
      show: true,
      message: `Are you sure you want to delete ${exp.company}?`,
      expId,
    };
  }

  handleConfirm(result: boolean) {
    if (result && this.confirmDialog.expId) {
      const payload = {
        adminId: this.commonService.userInfo?.id,
        expId: this.confirmDialog.expId,
      };

      this.apiService.DeletePortfolioExperiences(payload).subscribe({
        next: (res) => {
          this.loadExperiences();
          this.commonService.showToast(res.message, 'success');
        },
        error: (err) =>
          this.commonService.showToast(err.error.message, 'error'),
      });
    }
    this.confirmDialog.show = false;
  }
}
