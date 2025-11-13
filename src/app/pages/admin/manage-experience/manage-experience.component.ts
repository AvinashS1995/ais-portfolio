import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SHARED_MODULES } from '../../../core/common/shared-module';

interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  project: string;
  description: string;
}

@Component({
  selector: 'app-manage-experience',
  standalone: true,
  imports: [SHARED_MODULES],
  templateUrl: './manage-experience.component.html',
  styleUrl: './manage-experience.component.css',
})
export class ManageExperienceComponent {
  experiences: Experience[] = [
    {
      id: '1',
      company: 'Torrent Pharma',
      role: 'Frontend Developer',
      period: 'Mar 2024 - Present',
      project: 'Sales Force Automation (SFA)',
      description:
        'Building modern Angular frontends with Material, role-based dashboards, and UI/UX enhancements.',
    },
    {
      id: '2',
      company: 'ABC Pvt Ltd',
      role: 'Angular Developer',
      period: '2021 - 2024',
      project: 'Employee Management System',
      description:
        'Developed HRMS modules, popup notifications, and admin dashboards using Node.js backend.',
    },
  ];

  experienceForm: FormGroup;
  showDialog = false;
  editingExperience: Experience | null = null;

  constructor(private fb: FormBuilder) {
    this.experienceForm = this.fb.group({
      company: ['', Validators.required],
      role: ['', Validators.required],
      period: ['', Validators.required],
      project: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  openDialog(experience?: Experience) {
    if (experience) {
      this.editingExperience = experience;
      this.experienceForm.patchValue(experience);
    } else {
      this.editingExperience = null;
      this.experienceForm.reset();
    }
    this.showDialog = true;
  }

  closeDialog() {
    this.showDialog = false;
  }

  saveExperience() {
    if (this.experienceForm.invalid) return;
    const formData = this.experienceForm.value;

    if (this.editingExperience) {
      const index = this.experiences.findIndex(
        (e) => e.id === this.editingExperience!.id
      );
      this.experiences[index] = { ...this.editingExperience, ...formData };
    } else {
      const newExp: Experience = {
        id: Date.now().toString(),
        ...formData,
      };
      this.experiences.push(newExp);
    }

    this.showDialog = false;
  }

  deleteExperience(id: string) {
    if (confirm('Are you sure you want to delete this experience?')) {
      this.experiences = this.experiences.filter((exp) => exp.id !== id);
    }
  }
}
