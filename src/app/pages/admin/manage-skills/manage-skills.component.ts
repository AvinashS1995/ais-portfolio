import { Component } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { CommonService } from '../../../core/services/common.service';
import { SHARED_MODULES } from '../../../core/common/shared-module';

interface Skill {
  name: string;
  icon: string;
}

interface SkillCategory {
  _id: string;
  title: string;
  color: string;
  icon: string;
  skills: Skill[];
}

@Component({
  selector: 'app-manage-skills',
  standalone: true,
  imports: [SHARED_MODULES],
  templateUrl: './manage-skills.component.html',
  styleUrl: './manage-skills.component.css',
})
export class ManageSkillsComponent {
  skillCategories: SkillCategory[] = [];

  skillForm!: FormGroup;
  showDialog = false;
  editingCategory: SkillCategory | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadCategories();
  }

  initializeForm() {
    this.skillForm = this.fb.group({
      title: ['', Validators.required],
      color: ['#f58b49', Validators.required],
      icon: ['', Validators.required],
      skills: this.fb.array([]),
    });
  }

  get skillFormSkills(): FormArray {
    return this.skillForm.get('skills') as FormArray;
  }

  getSkillControl(skill: AbstractControl, field: string): FormControl {
    return skill.get(field) as FormControl;
  }

  addSkill(skill?: Skill) {
    this.skillFormSkills.push(
      this.fb.group({
        name: [skill?.name || '', Validators.required],
        icon: [skill?.icon || '', Validators.required],
      })
    );
  }

  removeSkill(index: number) {
    this.skillFormSkills.removeAt(index);
  }

  openDialog(category?: SkillCategory) {
    if (category) {
      this.editingCategory = category;
      this.skillForm.patchValue(category);
      this.skillFormSkills.clear();
      category.skills.forEach((s) => this.addSkill(s));
    } else {
      this.editingCategory = null;
      this.skillForm.reset({ color: '#f58b49' });
      this.skillFormSkills.clear();
    }
    this.showDialog = true;
  }

  closeDialog() {
    this.showDialog = false;
  }

  loadCategories() {
    const payload = { id: this.commonService.userInfo?.id };
    this.apiService.GetPortfolioSkills(payload).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.skillCategories = res.data.skills || [];
        }
      },
      error: (err) => this.commonService.showToast(err.error.message, 'error'),
    });
  }

  saveCategory() {
    if (this.skillForm.invalid) return;

    const payload = {
      adminId: this.commonService.userInfo?.id,
      ...this.skillForm.getRawValue(),
    };

    this.apiService.SavePortfolioSkills(payload).subscribe({
      next: () => {
        this.loadCategories();
        this.commonService.showToast('Skill category added!', 'success');
        this.closeDialog();
      },
      error: (err) => this.commonService.showToast(err.error.message, 'error'),
    });
  }

  updateCategory() {
    if (!this.editingCategory || this.skillForm.invalid) return;

    const payload = {
      adminId: this.commonService.userInfo?.id,
      skillId: this.editingCategory._id,
      title: this.editingCategory.title,
      ...this.skillForm.getRawValue(),
    };

    this.apiService.UpdatePortfolioSkills(payload).subscribe({
      next: () => {
        this.loadCategories();
        this.commonService.showToast('Skill category updated!', 'success');
        this.closeDialog();
      },
      error: (err) => this.commonService.showToast(err.error.message, 'error'),
    });
  }

  deleteCategory(title: string) {
    if (!confirm(`Are you sure you want to delete ${title}?`)) return;

    const payload = { adminId: this.commonService.userInfo?.id, title };
    this.apiService.DeletePortfolioSkills(payload).subscribe({
      next: () => {
        this.loadCategories();
        this.commonService.showToast('Category deleted!', 'success');
      },
      error: (err) => this.commonService.showToast(err.error.message, 'error'),
    });
  }
}
