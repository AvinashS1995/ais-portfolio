import { Component } from '@angular/core';
import { SHARED_MODULES } from '../../../core/common/shared-module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../core/services/common.service';
import { ApiService } from '../../../core/services/api.service';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';

interface Service {
  _id: string;
  title: string;
  icon: string;
  color: string;
  description: string;
}

@Component({
  selector: 'app-manage-services',
  standalone: true,
  imports: [SHARED_MODULES, ConfirmationDialogComponent],
  templateUrl: './manage-services.component.html',
  styleUrl: './manage-services.component.css',
})
export class ManageServicesComponent {
  services: Service[] = [];

  isDialogOpen = false;
  editingService: Service | null = null;
  serviceForm!: FormGroup;
  confirmDialog = { show: false, message: '', serviceId: '' };

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadServices();
  }

  initializeForm() {
    this.serviceForm = this.fb.group({
      title: ['', Validators.required],
      icon: ['fa-code', Validators.required],
      color: ['#f58b49', Validators.required],
      description: ['', Validators.required],
    });
  }

  openDialog(service?: Service) {
    if (service) {
      this.editingService = service;
      this.serviceForm.patchValue(service);
    } else {
      this.editingService = null;
      this.serviceForm.reset({
        icon: 'fa-code',
        color: '#f58b49',
      });
    }
    this.isDialogOpen = true;
  }

  closeDialog() {
    this.isDialogOpen = false;
  }

  loadServices() {
    const payload = { id: this.commonService.userInfo?.id };
    this.apiService.GetPortfolioServices(payload).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.services = res.data.services || [];
        }
      },
      error: (err) => this.commonService.showToast(err.error.message, 'error'),
    });
  }

  saveServices() {
    if (this.serviceForm.invalid) return;

    const { title, icon, color, description } = this.serviceForm.getRawValue();
    const payload = {
      adminId: this.commonService.userInfo?.id,
      title,
      icon,
      color,
      description,
    };

    this.apiService.SavePortfolioServices(payload).subscribe({
      next: () => {
        this.loadServices();
        this.commonService.showToast(
          'Education added successfully!',
          'success'
        );
        this.closeDialog();
      },
      error: (err) => this.commonService.showToast(err.error.message, 'error'),
    });
  }

  updateServices() {
    if (!this.editingService || this.serviceForm.invalid) return;

    const { title, icon, color, description } = this.serviceForm.getRawValue();
    const payload = {
      adminId: this.commonService.userInfo?.id,
      serviceId: this.editingService._id,
      title,
      icon,
      color,
      description,
    };

    this.apiService.UpdatePortfolioServices(payload).subscribe({
      next: (res) => {
        this.loadServices();
        this.commonService.showToast(res.message, 'success');
        this.closeDialog();
      },
      error: (err) => this.commonService.showToast(err.error.message, 'error'),
    });
  }

  deleteService(serviceId: string) {
    const service = this.services.find((e) => e._id === serviceId);
    if (!service) return;

    console.log(service);

    this.confirmDialog = {
      show: true,
      message: `Are you sure you want to delete ${service.title}?`,
      serviceId,
    };
  }

  handleConfirm(result: boolean) {
    debugger;
    if (result && this.confirmDialog.serviceId) {
      const payload = {
        adminId: this.commonService.userInfo?.id,
        serviceId: this.confirmDialog.serviceId,
      };

      this.apiService.DeletePortfolioServices(payload).subscribe({
        next: (res) => {
          this.loadServices();
          this.commonService.showToast(res.message, 'success');
        },
        error: (err) =>
          this.commonService.showToast(err.error.message, 'error'),
      });
    }
    this.confirmDialog.show = false;
  }
}
