import { Component } from '@angular/core';
import { SHARED_MODULES } from '../../../core/common/shared-module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Service {
  id: string;
  title: string;
  icon: string;
  color: string;
  description: string;
}

@Component({
  selector: 'app-manage-services',
  standalone: true,
  imports: [SHARED_MODULES],
  templateUrl: './manage-services.component.html',
  styleUrl: './manage-services.component.css',
})
export class ManageServicesComponent {
  services: Service[] = [
    {
      id: '1',
      title: 'Web Development',
      icon: 'fa-code',
      color: '#f58b49',
      description: 'Building responsive web apps using Angular and Node.js.',
    },
    {
      id: '2',
      title: 'UI/UX Design',
      icon: 'fa-paint-brush',
      color: '#f58b49',
      description: 'Designing modern, user-friendly interfaces.',
    },
  ];

  isDialogOpen = false;
  editingService: Service | null = null;
  serviceForm: FormGroup;

  constructor(private fb: FormBuilder) {
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

  saveService() {
    if (this.serviceForm.invalid) return;

    const formValue = this.serviceForm.value;

    if (this.editingService) {
      // Update
      const index = this.services.findIndex(
        (s) => s.id === this.editingService!.id
      );
      if (index !== -1)
        this.services[index] = { ...this.editingService, ...formValue };
    } else {
      // Add new
      this.services.push({ id: Date.now().toString(), ...formValue });
    }

    this.closeDialog();
  }

  deleteService(id: string) {
    if (confirm('Are you sure you want to delete this service?')) {
      this.services = this.services.filter((s) => s.id !== id);
    }
  }
}
