import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SHARED_MODULES } from '../../../core/common/shared-module';
import { debounceTime, of, switchMap } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { CommonService } from '../../../core/services/common.service';
import { ActivatedRoute } from '@angular/router';

const allowedImageFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [SHARED_MODULES],
  templateUrl: './admin-profile.component.html',
  styleUrl: './admin-profile.component.css',
})
export class AdminProfileComponent {
  profileForm!: FormGroup;
  isEditing = false;
  originalValue: any;
  showPassword = false;

  checkingUsername = false;
  checkingSlug = false;
  selectedProfileImage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private commonService: CommonService,
    private activateRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.getparams();

    this.setSubscription();
  }

  initializeForm() {
    this.profileForm = this.fb.group({
      avatar: [],
      fullName: ['', Validators.required],
      portfolioWebsiteName: ['', Validators.required],
      username: ['', Validators.required],
      slug: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      password: ['', Validators.required],
      role: [''],
      joined: [''],
    });

    this.originalValue = this.profileForm.value;
    this.profileForm.disable();
  }

  getparams() {
    this.activateRoute.data.subscribe((params) => {
      console.log('Admin Profile Params ---->', params);

      const admin = params?.['data']?.getAdminDetails?.data?.admin;

      const joinedDate = admin.createAt
        ? new Date(admin.createAt).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })
        : '';

      if (admin) {
        this.profileForm.patchValue({
          avatar: admin.profileImage || '',
          fullName: admin.fullName || '',
          portfolioWebsiteName: admin.portfolioWebsiteName || '',
          username: admin.username || '',
          slug: admin.slug || '',
          email: admin.email || '',
          phone: admin.mobile || '',
          password: admin.password || '',
          role: admin.role || '',
          joined: joinedDate || '',
        });

        this.selectedProfileImage = admin.profileImage || '';

        console.log(this.profileForm.getRawValue());

        this.originalValue = this.profileForm.value;
        this.profileForm.disable();
      }
    });
  }

  setSubscription() {
    this.profileForm
      .get('username')!
      .valueChanges.pipe(
        debounceTime(500),
        switchMap((value) => {
          if (!value || !this.isEditing) return of(null);
          this.checkingUsername = true;
          const payload = {
            field: 'username',
            value: value,
            id: this.commonService.userInfo?.id,
          };
          return this.apiService.CheckUniqueUserNameSlug(payload);
        })
      )
      .subscribe((res) => {
        this.checkingUsername = false;
        const ctrl = this.profileForm.get('username')!;
        if (res?.exists) ctrl.setErrors({ uniqueError: true });
        else ctrl.setErrors(null);
      });

    this.profileForm
      .get('slug')!
      .valueChanges.pipe(
        debounceTime(500),
        switchMap((value) => {
          if (!value || !this.isEditing) return of(null);
          this.checkingSlug = true;
          const payload = {
            field: 'slug',
            value: value,
            id: this.commonService.userInfo?.id,
          };
          return this.apiService.CheckUniqueUserNameSlug(payload);
        })
      )
      .subscribe((res) => {
        this.checkingSlug = false;
        const ctrl = this.profileForm.get('slug')!;
        if (res?.exists) ctrl.setErrors({ uniqueError: true });
        else ctrl.setErrors(null);
      });
  }
  enableEdit() {
    this.isEditing = true;
    this.originalValue = this.profileForm.value;
    this.profileForm.enable();
  }

  cancelEdit() {
    this.profileForm.setValue(this.originalValue);
    this.isEditing = false;
    this.showPassword = false;
    this.profileForm.disable();
  }

  saveChanges() {
    console.log(this.profileForm);
    if (this.profileForm.invalid) {
      const errorMsg = this.commonService.getFormErrors(this.profileForm);
      this.commonService.showToast(errorMsg, 'error');
      return;
    }

    this.originalValue = this.profileForm.value;

    const {
      avatar,
      fullName,
      email,
      password,
      phone,
      username,
      slug,
      role,
      portfolioWebsiteName,
    } = this.originalValue;

    const payload = {
      id: this.commonService.userInfo?.id || '',
      profileImage: avatar.split('/').pop() || '',
      fullName,
      email,
      password,
      mobile: phone || '',
      username,
      slug,
      role,
      portfolioWebsiteName,
    };

    console.log(payload);

    this.apiService.UpdateAdmin(payload).subscribe({
      next: (res) => {
        console.log('Updated:', res);
        this.isEditing = false;
        this.showPassword = false;
        console.log('Profile Updated:', this.profileForm.value);
        this.profileForm.disable();
        this.commonService.showToast(res.message, 'success');
      },
      error: (err) => this.commonService.showToast(err.error.message, 'error'),
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onImageUpload(event: any) {
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

        this.profileForm.patchValue({
          avatar: uploaded.fileUrl,
        });
      },
    });
  }
}
