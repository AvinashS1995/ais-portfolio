import { Component } from '@angular/core';
import { SHARED_MODULES } from '../../../core/common/shared-module';

interface ContactInfo {
  location: {
    company: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
    mapEmbedUrl: string;
  };
  email: string;
  phone: string;
  socialMedia: {
    linkedin: string;
    github: string;
    twitter: string;
    instagram: string;
    facebook: string;
  };
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [SHARED_MODULES],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  contactInfo: ContactInfo = {
    location: {
      company: 'My Portfolio Studio',
      address: 'MG Road',
      city: 'Mumbai',
      country: 'India',
      postalCode: '400001',
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!...', // replace with your map embed link
    },
    email: 'hello@example.com',
    phone: '+91 98765 43210',
    socialMedia: {
      linkedin: 'https://linkedin.com/in/yourprofile',
      github: 'https://github.com/yourprofile',
      twitter: '',
      instagram: '',
      facebook: '',
    },
  };

  formData = {
    name: '',
    email: '',
    subject: '',
    message: '',
  };

  handleSubmit() {
    console.log('Message sent:', this.formData);
    alert('✅ Message sent successfully!');
    this.formData = { name: '', email: '', subject: '', message: '' };
  }
}
