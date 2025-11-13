import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from '../../../core/services/common.service';
import { SHARED_MODULES } from '../../../core/common/shared-module';

export interface Project {
  id: string;
  title: string;
  category: string;
  role: string;
  image: string;
  description?: string;
  codeLink?: string;
  previewLink?: string;
}

@Component({
  selector: 'app-manage-projects',
  standalone: true,
  imports: [SHARED_MODULES],
  templateUrl: './manage-projects.component.html',
  styleUrl: './manage-projects.component.css',
})
export class ManageProjectsComponent {
  projects: Project[] = [];
  projectForm!: FormGroup;
  editingProject: Project | null = null;
  isDialogOpen = false;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private cs: CommonService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.projectForm = this.fb.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      role: ['', Validators.required],
      image: ['', Validators.required],
      description: [''],
      codeLink: [''],
      previewLink: [''],
    });
  }

  openDialog(project?: Project) {
    this.isDialogOpen = true;
    if (project) {
      this.editingProject = project;
      this.projectForm.patchValue(project);
    } else {
      this.editingProject = null;
      this.projectForm.reset();
    }
  }

  closeDialog() {
    this.isDialogOpen = false;
  }

  saveProject() {
    if (this.projectForm.invalid) return;
    const formData = this.projectForm.value;

    if (this.editingProject) {
      const index = this.projects.findIndex(
        (p) => p.id === this.editingProject?.id
      );
      this.projects[index] = { ...this.editingProject, ...formData };
      this.cs.showToast('Project updated successfully!', 'success');
    } else {
      const newProject: Project = {
        id: Math.random().toString(36).substring(2, 9),
        ...formData,
      };
      this.projects.push(newProject);
      this.cs.showToast('Project added successfully!', 'success');
    }

    this.isDialogOpen = false;
  }

  deleteProject(id: string) {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projects = this.projects.filter((p) => p.id !== id);
      this.cs.showToast('Project deleted successfully!', 'success');
    }
  }
}
