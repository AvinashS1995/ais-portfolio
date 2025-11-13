import { Component, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SHARED_MODULES } from '../../../core/common/shared-module';

@Component({
  selector: 'app-education-dialog',
  standalone: true,
  imports: [SHARED_MODULES],
  templateUrl: './education-dialog.component.html',
  styleUrl: './education-dialog.component.css',
})
export class EducationDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      form: FormGroup;
      editingEducation: any;
      saveEducation: () => void;
      closeDialog: () => void;
    }
  ) {}
}
