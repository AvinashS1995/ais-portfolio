import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SHARED_MODULES } from '../../../core/common/shared-module';
import { ApiService } from '../../../core/services/api.service';
import { CommonService } from '../../../core/services/common.service';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';

export interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

@Component({
  selector: 'app-manage-messages',
  standalone: true,
  imports: [SHARED_MODULES, ConfirmationDialogComponent],
  templateUrl: './manage-messages.component.html',
  styleUrl: './manage-messages.component.css',
})
export class ManageMessagesComponent {
  contactMessages: Message[] = [];

  confirmDialog = { show: false, message: '', messageId: '' };

  constructor(
    private apiService: ApiService,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    const payload = {
      id: this.commonService.userInfo?.id,
    };

    this.apiService.GetPortfolioContactMessages(payload).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.contactMessages = res.data.messages || [];
        }
      },
      error: (err) => {
        this.commonService.showToast(
          err.error?.message || 'Error loading messages',
          'error'
        );
      },
    });
  }

  deleteMessage(messageId: string) {
    const msg = this.contactMessages.find((e) => e._id === messageId);
    if (!msg) return;

    console.log(msg);

    this.confirmDialog = {
      show: true,
      message: `Are you sure you want to delete ${msg.name} Message?`,
      messageId,
    };
  }

  handleConfirm(result: boolean) {
    if (result && this.confirmDialog.messageId) {
      const payload = {
        adminId: this.commonService.userInfo?.id,
        messageId: this.confirmDialog.messageId,
      };

      this.apiService.DeletePortfolioContactMessage(payload).subscribe({
        next: (res) => {
          this.loadMessages();
          this.commonService.showToast(res.message, 'success');
        },
        error: (err) =>
          this.commonService.showToast(err.error.message, 'error'),
      });
    }
    this.confirmDialog.show = false;
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
