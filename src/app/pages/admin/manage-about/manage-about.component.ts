import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../../../core/services/common.service';
import { SHARED_MODULES } from '../../../core/common/shared-module';

@Component({
  selector: 'app-manage-about',
  standalone: true,
  imports: [SHARED_MODULES],
  templateUrl: './manage-about.component.html',
  styleUrl: './manage-about.component.css',
})
export class ManageAboutComponent {
  aboutForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cs: CommonService
  ) {}

  ngOnInit(): void {
    // Sample default data (replace with API data if available)
    const aboutData = {
      name: 'John Doe',
      title: 'Frontend Developer',
      bio: 'I love building scalable and creative web applications.',
      bio2: 'Passionate about design systems and user experience.',
      profileImage: 'https://via.placeholder.com/150',
      resumeUrl: 'https://example.com/resume.pdf',
      stats: { experience: 4, clients: 12, recruiters: 8 },
    };

    this.aboutForm = this.fb.group({
      name: [aboutData.name],
      title: [aboutData.title],
      bio: [aboutData.bio],
      bio2: [aboutData.bio2],
      profileImage: [aboutData.profileImage],
      resumeUrl: [aboutData.resumeUrl],
      stats: this.fb.group({
        experience: [aboutData.stats.experience],
        clients: [aboutData.stats.clients],
        recruiters: [aboutData.stats.recruiters],
      }),
    });
  }

  onSubmit(): void {
    if (this.aboutForm.valid) {
      const formData = this.aboutForm.value;
      console.log('Updated About Data:', formData);

      this.cs.showToast('About section updated successfully!', 'success');
      this.router.navigate(['/admin/dashboard']);
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/dashboard']);
  }
}
