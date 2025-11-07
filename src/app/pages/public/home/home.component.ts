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
  roles: string[] = [
    'Angular Developer',
    'Frontend Developer',
    'Full Stack Developer',
  ];
  displayedText = '';
  currentRoleIndex = 0;
  currentCharIndex = 0;
  typingSpeed = 120;
  deletingSpeed = 70;
  isDeleting = false;

  ngOnInit(): void {
    this.startTypingEffect();
  }

  startTypingEffect() {
    const currentRole = this.roles[this.currentRoleIndex];
    if (this.isDeleting) {
      this.displayedText = currentRole.substring(0, this.currentCharIndex--);
    } else {
      this.displayedText = currentRole.substring(0, this.currentCharIndex++);
    }

    // Continue typing/deleting
    if (!this.isDeleting && this.currentCharIndex === currentRole.length) {
      setTimeout(() => (this.isDeleting = true), 1000);
    } else if (this.isDeleting && this.currentCharIndex === 0) {
      this.isDeleting = false;
      this.currentRoleIndex = (this.currentRoleIndex + 1) % this.roles.length;
    }

    setTimeout(
      () => this.startTypingEffect(),
      this.isDeleting ? this.deletingSpeed : this.typingSpeed
    );
  }
}
