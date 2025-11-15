import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SHARED_MODULES } from '../../../core/common/shared-module';
import { CommonService } from '../../../core/services/common.service';
import { ApiService } from '../../../core/services/api.service';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';

export interface Education {
  _id: string;
  degree: string;
  university: string;
  period: string;
}

@Component({
  selector: 'app-manage-education',
  standalone: true,
  imports: [SHARED_MODULES, ConfirmationDialogComponent],
  templateUrl: './manage-education.component.html',
  styleUrl: './manage-education.component.css',
})
export class ManageEducationComponent {
  education: Education[] = [];
  eduForm!: FormGroup;
  editingEdu: Education | null = null;
  isDialogOpen = false;
  confirmDialog = { show: false, message: '', eduId: '' };

  constructor(
    private fb: FormBuilder,
    private cs: CommonService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadEducation();
  }

  initForm() {
    this.eduForm = this.fb.group({
      degree: ['', Validators.required],
      university: ['', Validators.required],
      period: ['', Validators.required],
    });
  }

  openDialog(edu?: Education) {
    this.isDialogOpen = true;
    if (edu) {
      this.editingEdu = edu;
      this.eduForm.patchValue(edu);
    } else {
      this.editingEdu = null;
      this.eduForm.reset();
    }
  }

  closeDialog() {
    this.isDialogOpen = false;
  }

  loadEducation() {
    const payload = { id: this.cs.userInfo?.id };
    this.apiService.GetPortfolioEducations(payload).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.education = res.data.educations || [];
        }
      },
      error: (err) => this.cs.showToast(err.error.message, 'error'),
    });
  }

  saveEducation() {
    if (this.eduForm.invalid) return;

    const { degree, university, period } = this.eduForm.getRawValue();
    const payload = {
      adminId: this.cs.userInfo?.id,
      degree,
      university,
      period,
    };

    this.apiService.SavePortfolioEducations(payload).subscribe({
      next: () => {
        this.loadEducation();
        this.cs.showToast('Education added successfully!', 'success');
        this.closeDialog();
      },
      error: (err) => this.cs.showToast(err.error.message, 'error'),
    });
  }

  updateEducation() {
    if (!this.editingEdu || this.eduForm.invalid) return;

    const { degree, university, period } = this.eduForm.getRawValue();
    const payload = {
      adminId: this.cs.userInfo?.id,
      eduId: this.editingEdu._id,
      degree,
      university,
      period,
    };

    this.apiService.UpdatePortfolioEducations(payload).subscribe({
      next: () => {
        this.loadEducation();
        this.cs.showToast('Education updated successfully!', 'success');
        this.closeDialog();
      },
      error: (err) => this.cs.showToast(err.error.message, 'error'),
    });
  }

  deleteEducation(eduId: string) {
    const edu = this.education.find((e) => e._id === eduId);
    if (!edu) return;

    this.confirmDialog = {
      show: true,
      message: `Are you sure you want to delete ${edu.degree}?`,
      eduId,
    };
  }

  handleConfirm(result: boolean) {
    if (result && this.confirmDialog.eduId) {
      const payload = {
        adminId: this.cs.userInfo?.id,
        eduId: this.confirmDialog.eduId,
      };

      this.apiService.DeletePortfolioEducations(payload).subscribe({
        next: (res) => {
          this.loadEducation();
          this.cs.showToast(res.message || 'Education deleted!', 'success');
        },
        error: (err) => this.cs.showToast(err.error.message, 'error'),
      });
    }
    this.confirmDialog.show = false;
  }
}
