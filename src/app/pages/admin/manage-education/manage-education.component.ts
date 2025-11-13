import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EducationDialogComponent } from '../../../shared/components/education-dialog/education-dialog.component';
import { SHARED_MODULES } from '../../../core/common/shared-module';
import { CommonService } from '../../../core/services/common.service';

export interface Education {
  id: string;
  degree: string;
  university: string;
  period: string;
}

@Component({
  selector: 'app-manage-education',
  standalone: true,
  imports: [SHARED_MODULES],
  templateUrl: './manage-education.component.html',
  styleUrl: './manage-education.component.css',
})
export class ManageEducationComponent {
  education: Education[] = [];
  eduForm!: FormGroup;
  editingEdu: Education | null = null;
  isDialogOpen = false;

  constructor(private fb: FormBuilder, private cs: CommonService) {}

  ngOnInit(): void {
    this.initForm();
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

  saveEducation() {
    if (this.eduForm.invalid) return;
    const formData = this.eduForm.value;

    if (this.editingEdu) {
      const index = this.education.findIndex(
        (e) => e.id === this.editingEdu?.id
      );
      this.education[index] = { ...this.editingEdu, ...formData };
      this.cs.showToast('Education updated successfully!', 'success');
    } else {
      const newEdu: Education = {
        id: Math.random().toString(36).substring(2, 9),
        ...formData,
      };
      this.education.push(newEdu);
      this.cs.showToast('Education added successfully!', 'success');
    }
    this.isDialogOpen = false;
  }

  deleteEducation(id: string) {
    if (confirm('Are you sure you want to delete this education entry?')) {
      this.education = this.education.filter((e) => e.id !== id);
      this.cs.showToast('Education deleted successfully!', 'success');
    }
  }
}
