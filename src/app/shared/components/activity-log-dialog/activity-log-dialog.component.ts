import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SHARED_MODULES } from '../../../core/common/shared-module';

interface AdminActivity {
  id: string;
  adminName: string;
  action: string;
  details: string;
  timestamp: Date;
  type: 'create' | 'update' | 'delete' | 'lock' | 'unlock' | 'view';
}

@Component({
  selector: 'app-activity-log-dialog',
  standalone: true,
  imports: [SHARED_MODULES],
  templateUrl: './activity-log-dialog.component.html',
  styleUrl: './activity-log-dialog.component.css',
})
export class ActivityLogDialogComponent {
  @Input() show = false;
  @Input() userName = '';
  @Input() activities: any[] = [];
  @Output() close = new EventEmitter<void>();

  getIcon(status: string) {
    switch (status) {
      case 'success':
        return 'fa-circle-check text-green-400';
      case 'failed':
      case 'error':
        return 'fa-circle-xmark text-red-400';
      default:
        return 'fa-circle-info text-gray-400';
    }
  }
}
