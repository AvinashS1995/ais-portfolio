import { Component, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { SHARED_MODULES } from '../../../core/common/shared-module';
import { CommonService } from '../../../core/services/common.service';

const allowedImageFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];

@Component({
  selector: 'app-manage-home',
  standalone: true,
  imports: [SHARED_MODULES],
  templateUrl: './manage-home.component.html',
  styleUrl: './manage-home.component.css',
})
export class ManageHomeComponent {
  homeForm!: FormGroup;
  showDialog = false;

  homeData: any = null;
  imagePreview: string | null = null;

  @ViewChild('profileInput') profileInput: any;

  showAIDialog = false;
  loading = false;
  aiSelfDescription: string = '';
  currentSelfDecriptionField: 'homeDescription' = 'homeDescription';
  typingIndex = 0;
  typingInterval: any;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.homeForm = this.fb.group({
      name: ['', Validators.required],
      homeDescription: ['', Validators.required],
      roles: this.fb.array([]),
      profileImage: [''],
    });

    this.getHomeData();
  }

  get roles(): FormArray {
    return this.homeForm.get('roles') as FormArray;
  }

  getRoleControl(role: AbstractControl): FormControl {
    return role as FormControl;
  }

  addRole(value: string = '') {
    this.roles.push(new FormControl(value, Validators.required));
  }

  removeRole(index: number) {
    this.roles.removeAt(index);
  }

  getHomeData() {
    const payload = { id: this.commonService.userInfo?.id };

    this.apiService.GetPortfolioHome(payload).subscribe({
      next: (res: any) => {
        if (res.status === 'success' && res.data?.home) {
          this.homeData = res.data.home;

          this.imagePreview = this.homeData.profileImage ?? null;
        }
      },
      error: (err) => {
        this.commonService.showToast(err.error.message, 'error');
      },
    });
  }

  openDialog(data?: any) {
    this.showDialog = false;

    this.homeForm.reset();
    this.roles.clear();
    this.imagePreview = null;

    if (data) {
      this.homeForm.patchValue({
        name: data.name,
        homeDescription: data.description,
        profileImage: data.profileImage,
      });

      (data.roles || []).forEach((role: string) => this.addRole(role));
      this.imagePreview = data.profileImage;
    } else {
      this.addRole();
    }

    setTimeout(() => (this.showDialog = true));
  }

  closeDialog() {
    this.showDialog = false;
    this.homeForm.reset();
    this.roles.clear();
    this.imagePreview = null;
  }

  onFileSelected(e: any) {
    const file = e.target.files[0];
    if (!file) return;

    if (!allowedImageFileTypes.includes(file.type)) {
      this.commonService.showToast('Only JPG, JPEG, PNG allowed', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    this.apiService.UploadFile(formData).subscribe({
      next: (res: any) => {
        const uploaded = res.data;

        this.imagePreview = uploaded.presignFileUrl;

        this.homeForm.patchValue({
          profileImage: uploaded.fileUrl,
        });
      },
      error: () => {
        this.commonService.showToast('Failed to upload image', 'error');
      },
    });
  }

  removeImage() {
    this.imagePreview = null;
    this.homeForm.patchValue({ profileImage: '' });
  }

  saveHome() {
    if (this.homeForm.invalid) {
      this.commonService.showToast('Fill all fields', 'error');
      return;
    }

    const { name, homeDescription, roles, profileImage } =
      this.homeForm.getRawValue();

    const payload = {
      adminId: this.commonService.userInfo?.id,
      name: name || '',
      homeDescription: homeDescription || '',
      roles: roles || '',
      profileImage: profileImage.split('/').pop() || '',
    };

    console.log(payload);

    this.apiService.SavePortfolioHome(payload).subscribe({
      next: (res: any) => {
        if (res.status === 'success') {
          this.commonService.showToast('Home updated', 'success');
          this.getHomeData();
          this.closeDialog();
        }
      },
      error: () => {
        this.commonService.showToast('Failed to save', 'error');
      },
    });
  }

  generateAI(field: 'homeDescription') {
    this.currentSelfDecriptionField = field;
    this.aiSelfDescription = '';
    this.typingIndex = 0;
    this.showAIDialog = true;
    this.loading = true;

    const name = this.homeForm.get('name')?.value || '';
    const roles = this.homeForm.get('roles')?.value || 0;
    const userInput = this.homeForm.get(field)?.value || '';

    const payload = {
      field,
      name,
      roles,
      prompt: userInput ? userInput : '',
    };

    this.apiService.GetPortfolioAIGenerate(payload).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.status === 'success') {
          const aiResponse = res.data.aiText;
          const remaining = res.remaining;

          this.commonService.showToast(res.message, 'success');

          this.aiSelfDescription = '';
          this.typingIndex = 0;
          this.typingInterval = setInterval(() => {
            if (this.typingIndex < aiResponse.length) {
              this.aiSelfDescription += aiResponse[this.typingIndex];
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

  addAISelfDescription() {
    this.homeForm
      .get(this.currentSelfDecriptionField)
      ?.setValue(this.aiSelfDescription);
    this.closeAIDialog();
  }

  closeAIDialog() {
    this.showAIDialog = false;
    this.loading = false;
    this.aiSelfDescription = '';
    if (this.typingInterval) clearInterval(this.typingInterval);
  }
}
