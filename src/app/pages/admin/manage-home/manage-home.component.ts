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

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.homeForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
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

          // populate image preview
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
        description: data.description,
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

    const { name, description, roles, profileImage } =
      this.homeForm.getRawValue();

    const payload = {
      adminId: this.commonService.userInfo?.id,
      name: name || '',
      description: description || '',
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
}
