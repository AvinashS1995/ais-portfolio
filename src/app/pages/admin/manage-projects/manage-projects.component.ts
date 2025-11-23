import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from '../../../core/services/common.service';
import { SHARED_MODULES } from '../../../core/common/shared-module';
import { ApiService } from '../../../core/services/api.service';

const allowedImageFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];

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

  @ViewChild('projectInput') projectInput: any;

  showAIDialog = false;
  loading = false;
  aiProjectDescription: string = '';
  currentProjectDecriptionField: 'description' = 'description';
  typingIndex = 0;
  typingInterval: any;

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
      image: image.split('/').pop() || '',
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
      projectId: this.editingProject._id,
      title,
      category,
      role,
      image: image.split('/').pop() || '',
      description,
      codeLink,
      previewLink,
    };

    this.apiService.UpdatePortfolioProjects(payload).subscribe({
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

  selectedProfileImage: string | null = null;

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
        this.selectedProfileImage = uploaded.presignFileUrl;

        this.projectForm.patchValue({
          image: uploaded.fileUrl,
        });
      },
    });
  }

  removeProfileImage() {
    this.selectedProfileImage = null;
    this.projectForm.patchValue({ profileImage: '' });
  }

  generateAI(field: 'description') {
    this.currentProjectDecriptionField = field;
    this.aiProjectDescription = '';
    this.typingIndex = 0;
    this.showAIDialog = true;
    this.loading = true;

    const title = this.projectForm.get('title')?.value || '';
    const category = this.projectForm.get('category')?.value || 0;
    const role = this.projectForm.get('role')?.value || 0;
    const userInput = this.projectForm.get(field)?.value || '';

    const payload = {
      field,
      title,
      category,
      role,
      prompt: userInput ? userInput : '',
    };

    this.apiService.GetPortfolioAIGenerate(payload).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.status === 'success') {
          const aiResponse = res.data.aiText;
          const remaining = res.remaining;

          this.commonService.showToast(res.message, 'success');

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

  addAIProjectDescription() {
    this.projectForm
      .get(this.currentProjectDecriptionField)
      ?.setValue(this.aiProjectDescription);
    this.closeAIDialog();
  }

  closeAIDialog() {
    this.showAIDialog = false;
    this.loading = false;
    this.aiProjectDescription = '';
    if (this.typingInterval) clearInterval(this.typingInterval);
  }
}
