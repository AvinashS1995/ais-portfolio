import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SHARED_MODULES } from '../../../core/common/shared-module';
import { AlertDialogComponent } from '../../../shared/components/alert-dialog/alert-dialog.component';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ActivityLogDialogComponent } from '../../../shared/components/activity-log-dialog/activity-log-dialog.component';
import { ApiService } from '../../../core/services/api.service';
import { CommonService } from '../../../core/services/common.service';

interface AdminUser {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  status: 'active' | 'locked';
}

interface AdminActivity {
  id: string;
  adminName: string;
  action: string;
  timestamp: Date;
  details: string;
  type: 'create' | 'update' | 'delete' | 'lock' | 'unlock' | 'view';
}

@Component({
  selector: 'app-admin-user-management',
  standalone: true,
  imports: [
    SHARED_MODULES,
    AlertDialogComponent,
    ConfirmationDialogComponent,
    ActivityLogDialogComponent,
  ],
  templateUrl: './admin-user-management.component.html',
  styleUrl: './admin-user-management.component.css',
})
export class AdminUserManagementComponent {
  admins: AdminUser[] = [];
  paginatedUsers: AdminUser[] = [];
  page = 1;
  pageSize = 10;

  showDialog = false;
  editingUser: AdminUser | null = null;
  userForm: FormGroup;

  confirmDialog = { show: false, message: '', id: '' };
  alertDialog = {
    show: false,
    title: '',
    message: '',
    type: 'info' as 'success' | 'error' | 'info',
  };

  Math = Math;

  showActivityDialog = false;
  activityUserName = '';
  userActivities: any[] = [];
  isSuperAdmin: string = '';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private commonService: CommonService
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['Admin', Validators.required],
      password: ['', [Validators.minLength(6)]],
    });
  }

  ngOnInit() {
    this.isSuperAdmin = this.commonService.userInfo?.role || '';
    this.fetchAdmins();
  }

  fetchAdmins() {
    const payload = { role: this.commonService.userInfo?.role || '' };
    this.apiService.GetAdminUserList(payload).subscribe((res: any) => {
      this.admins = res.data.admins;
      this.paginatedUsers = this.admins;
    });
  }

  nextPage() {
    if (this.page * this.pageSize < this.admins.length) {
      this.page++;
      this.fetchAdmins();
    }
  }
  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.fetchAdmins();
    }
  }

  openDialog(user?: AdminUser) {
    this.editingUser = user || null;
    this.userForm.reset({
      name: user?.fullName || '',
      email: user?.email || '',
      role: user?.role || 'Admin',
      password: '',
    });
    this.showDialog = true;
  }

  closeDialog() {
    this.showDialog = false;
  }

  saveUser() {
    if (this.userForm.invalid) return;
    const { name, email, role, password } = this.userForm.getRawValue();
    const payload: any = { fullName: name, email, role };

    if (this.editingUser) {
      payload.id = this.editingUser._id;
      if (password) payload.password = password;
      this.apiService.UpdateAdmin(payload).subscribe((res: any) => {
        this.alertDialog = {
          show: true,
          title: 'Updated!',
          message: res.message,
          type: 'success',
        };
        this.fetchAdmins();
        this.closeDialog();
      });
    } else {
      payload.password = password;
      this.apiService.SaveNewAdminCreation(payload).subscribe((res: any) => {
        this.alertDialog = {
          show: true,
          title: 'Created!',
          message: res.message,
          type: 'success',
        };
        this.fetchAdmins();
        this.closeDialog();
      });
    }
  }

  toggleLock(user: AdminUser) {
    const newStatus = user.status === 'active' ? 'locked' : 'active';
    this.apiService
      .toggleLockUnlockAdmin({ id: user._id })
      .subscribe((res: any) => {
        user.status = newStatus;
        this.alertDialog = {
          show: true,
          title: newStatus === 'active' ? 'Unlocked!' : 'Locked!',
          message: `Admin ${user.fullName} is now ${newStatus}.`,
          type: newStatus === 'active' ? 'success' : 'error',
        };
      });
  }

  deleteUser(id: string) {
    const user = this.admins.find((u) => u._id === id);
    if (!user) return;
    this.confirmDialog = {
      show: true,
      message: `Delete ${user.fullName}?`,
      id,
    };
  }

  handleConfirm(result: boolean) {
    if (result && this.confirmDialog.id) {
      this.apiService.DeleteAdmin({ id: this.confirmDialog.id }).subscribe({
        next: (res: any) => {
          this.alertDialog = {
            show: true,
            title: 'Deleted!',
            message: res.message,
            type: 'success',
          };
          this.fetchAdmins();
        },
        error: (err) => {
          this.alertDialog = {
            show: true,
            title: 'Error!',
            message: err.error.message,
            type: 'error',
          };
        },
      });
    }
    this.confirmDialog.show = false;
  }

  viewActivity(user: AdminUser) {
    this.activityUserName = user.fullName;
    this.apiService.GetAdminActivity({ id: user._id }).subscribe({
      next: (res: any) => {
        this.userActivities = res.activities || [];
        this.showActivityDialog = true;
      },
      error: () => {
        this.alertDialog = {
          show: true,
          title: 'Error!',
          message: 'Failed to load activity log.',
          type: 'error',
        };
      },
    });
  }
}
