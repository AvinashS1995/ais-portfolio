import { Component } from '@angular/core';
import { SHARED_MODULES } from '../../../core/common/shared-module';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [SHARED_MODULES],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  onSubmit(form: any) {
    if (form.valid) {
      console.log('Form submitted:', form.value);
      alert('Thank you! Your message has been sent successfully.');
      form.reset();
    }
  }
}
