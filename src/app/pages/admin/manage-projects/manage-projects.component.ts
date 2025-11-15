import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from '../../../core/services/common.service';
import { SHARED_MODULES } from '../../../core/common/shared-module';
import { ApiService } from '../../../core/services/api.service';

export interface Project {
  _id: string;
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
  confirmDialog = { show: false, message: '', projectId: '' };

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private commonService: CommonService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadProjects();
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

  loadProjects() {
    const payload = { id: this.commonService.userInfo?.id };
    this.apiService.GetPortfolioProjects(payload).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.projects = res.data.projects || [];
        }
      },
      error: (err) => this.commonService.showToast(err.error.message, 'error'),
    });
  }

  saveProject() {
    if (this.projectForm.invalid) return;

    const { title, category, role, image, description, codeLink, previewLink } =
      this.projectForm.getRawValue();
    const payload = {
      adminId: this.commonService.userInfo?.id,
      title,
      category,
      role,
      image,
      description,
      codeLink,
      previewLink,
    };

    this.apiService.SavePortfolioProjects(payload).subscribe({
      next: (res) => {
        this.loadProjects();
        this.commonService.showToast(res.message, 'success');
        this.closeDialog();
      },
      error: (err) => this.commonService.showToast(err.error.message, 'error'),
    });
  }

  updateProject() {
    if (!this.editingProject || this.projectForm.invalid) return;

    const { title, category, role, image, description, codeLink, previewLink } =
      this.projectForm.getRawValue();
    const payload = {
      adminId: this.commonService.userInfo?.id,
      serviceId: this.editingProject._id,
      title,
      category,
      role,
      image,
      description,
      codeLink,
      previewLink,
    };

    this.apiService.UpdatePortfolioServices(payload).subscribe({
      next: (res) => {
        this.loadProjects();
        this.commonService.showToast(res.message, 'success');
        this.closeDialog();
      },
      error: (err) => this.commonService.showToast(err.error.message, 'error'),
    });
  }

  deleteProject(projectId: string) {
    const project = this.projects.find((e) => e._id === projectId);
    if (!project) return;

    console.log(project);

    this.confirmDialog = {
      show: true,
      message: `Are you sure you want to delete ${project.title}?`,
      projectId,
    };
  }

  handleConfirm(result: boolean) {
    debugger;
    if (result && this.confirmDialog.projectId) {
      const payload = {
        adminId: this.commonService.userInfo?.id,
        projectId: this.confirmDialog.projectId,
      };

      this.apiService.DeletePortfolioServices(payload).subscribe({
        next: (res) => {
          this.loadProjects();
          this.commonService.showToast(res.message, 'success');
        },
        error: (err) =>
          this.commonService.showToast(err.error.message, 'error'),
      });
    }
    this.confirmDialog.show = false;
  }
}
