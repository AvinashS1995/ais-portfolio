import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SHARED_MODULES } from '../../../core/common/shared-module';

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

@Component({
  selector: 'app-manage-messages',
  standalone: true,
  imports: [SHARED_MODULES],
  templateUrl: './manage-messages.component.html',
  styleUrl: './manage-messages.component.css',
})
export class ManageMessagesComponent {
  contactMessages: Message[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      subject: 'Portfolio Design Inquiry',
      message:
        'Hi, I loved your portfolio design! Can we collaborate on a freelance project?',
      createdAt: '2025-11-10T14:30:00Z',
    },
    {
      id: '2',
      name: 'Sarah Williams',
      email: 'sarah.williams@example.com',
      subject: 'Job Opportunity',
      message:
        'Hello, we are impressed with your work and would like to discuss a frontend developer role.',
      createdAt: '2025-11-09T09:45:00Z',
    },
    {
      id: '3',
      name: 'Ravi Kumar',
      email: 'ravi.kumar@example.com',
      subject: 'Project Collaboration',
      message:
        'Hey, can you help me design a landing page for my startup using Angular and Tailwind?',
      createdAt: '2025-11-08T18:15:00Z',
    },
  ];

  constructor(private router: Router) {}

  deleteMessage(id: string) {
    if (confirm('Are you sure you want to delete this message?')) {
      this.contactMessages = this.contactMessages.filter(
        (msg) => msg.id !== id
      );
      alert('Message deleted successfully!');
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
