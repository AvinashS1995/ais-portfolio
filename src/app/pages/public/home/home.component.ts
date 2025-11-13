import { Component } from '@angular/core';
import { SHARED_MODULES } from '../../../core/common/shared-module';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SHARED_MODULES],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  aboutData = {
    name: 'Avinash Suryawanshi',
    profileImage: 'assets/profile.jpg', // ✅ Replace with your real image URL or presigned URL
  };

  roles = ['Angular Developer', 'Frontend Developer', 'Full Stack Developer'];
  displayedText = '';
  currentRoleIndex = 0;
  currentCharIndex = 0;
  isDeleting = false;

  ngOnInit(): void {
    this.typeEffect();
  }

  typeEffect() {
    const currentRole = this.roles[this.currentRoleIndex];
    const typingSpeed = this.isDeleting ? 70 : 120;

    setTimeout(() => {
      if (this.isDeleting) {
        this.displayedText = currentRole.substring(
          0,
          this.currentCharIndex - 1
        );
        this.currentCharIndex--;
      } else {
        this.displayedText = currentRole.substring(
          0,
          this.currentCharIndex + 1
        );
        this.currentCharIndex++;
      }

      if (!this.isDeleting && this.currentCharIndex === currentRole.length) {
        setTimeout(() => (this.isDeleting = true), 1000);
      } else if (this.isDeleting && this.currentCharIndex === 0) {
        this.isDeleting = false;
        this.currentRoleIndex = (this.currentRoleIndex + 1) % this.roles.length;
      }

      this.typeEffect();
    }, typingSpeed);
  }
}
