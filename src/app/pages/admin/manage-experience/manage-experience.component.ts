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

  showAIDialog = false;
  loading = false;
  aiProjectDescription: string = '';
  currentProjectDecriptionField: 'experienceDescription' =
    'experienceDescription';
  typingIndex = 0;
  typingInterval: any;

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
      experienceDescription: ['', Validators.required],
    });
  }

  openDialog(experience?: Experience) {
    debugger;
    if (experience) {
      this.editingExperience = experience;
      this.experienceForm.patchValue({
        company: experience.company,
        role: experience.role,
        fromYear: experience.fromYear,
        toYear: experience.toYear,
        currentlyWorking: experience.currentlyWorking,
        project: experience.project,
        experienceDescription: experience.description,
      });
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

    const { company, role, period, project, experienceDescription } =
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

    const { company, role, period, project, experienceDescription } =
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

  generateAI(field: 'experienceDescription') {
    this.currentProjectDecriptionField = field;
    this.aiProjectDescription = '';
    this.typingIndex = 0;
    this.showAIDialog = true;
    this.loading = true;

    const company = this.experienceForm.get('company')?.value || '';
    const role = this.experienceForm.get('role')?.value || 0;
    const project = this.experienceForm.get('project')?.value || 0;
    const userInput = this.experienceForm.get(field)?.value || ''; // typed input

    const payload = {
      field,
      company,
      project,
      role,
      prompt: userInput ? userInput : '', // optional
    };

    this.apiService.GetPortfolioAIGenerate(payload).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.status === 'success') {
          const aiResponse = res.data.aiText;
          const remaining = res.remaining;

          this.commonService.showToast(res.message, 'success');

          // Typing effect
          this.aiProjectDescription = '';
          this.typingIndex = 0;
          this.typingInterval = setInterval(() => {
            if (this.typingIndex < aiResponse.length) {
              this.aiProjectDescription += aiResponse[this.typingIndex];
              this.typingIndex++;
            } else {
              clearInterval(this.typingInterval);
            }
          }, 30);
        } else {
          this.commonService.showToast(res.message, 'error');
          this.closeAIDialog();
        }
      },
      error: (err) => {
        this.loading = false;
        const msg = err.error?.message;
        this.commonService.showToast(msg, 'error');
        this.closeAIDialog();
      },
    });
  }

  // Add AI text to form field
  addAIProjectDescription() {
    this.experienceForm
      .get(this.currentProjectDecriptionField)
      ?.setValue(this.aiProjectDescription);
    this.closeAIDialog();
  }

  // Close AI dialog
  closeAIDialog() {
    this.showAIDialog = false;
    this.loading = false;
    this.aiProjectDescription = '';
    if (this.typingInterval) clearInterval(this.typingInterval);
  }
}
