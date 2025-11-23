import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SHARED_MODULES } from '../../../core/common/shared-module';

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

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.profileForm = this.fb.group({
      avatar: ['https://i.pravatar.cc/150?img=12'],
      name: ['Admin User', Validators.required],
      username: ['admin123', Validators.required],
      slug: ['admin-user'],
      email: ['admin@example.com', [Validators.required, Validators.email]],
      phone: ['9876543210'],
      password: ['Admin@123', Validators.required],
      role: ['Administrator'],
      joined: ['March 2024'],
    });

    this.originalValue = this.profileForm.value;
    this.profileForm.disable();
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
    this.originalValue = this.profileForm.value;
    this.isEditing = false;
    this.showPassword = false;
    console.log('Profile Updated:', this.profileForm.value);
    this.profileForm.disable();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.profileForm.patchValue({ avatar: reader.result });
    };
    reader.readAsDataURL(file);
  }
}
