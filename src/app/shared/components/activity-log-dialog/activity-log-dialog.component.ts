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
  @Input() activities: AdminActivity[] = [];
  @Output() close = new EventEmitter<void>();

  getIcon(type: string) {
    switch (type) {
      case 'create':
        return 'fa-plus-circle text-green-400';
      case 'update':
        return 'fa-pen text-blue-400';
      case 'delete':
        return 'fa-trash text-red-400';
      case 'lock':
        return 'fa-lock text-red-400';
      case 'unlock':
        return 'fa-unlock text-green-400';
      default:
        return 'fa-info-circle text-gray-400';
    }
  }

  getTypeLabel(type: string) {
    switch (type) {
      case 'create':
        return 'Created';
      case 'update':
        return 'Updated';
      case 'delete':
        return 'Deleted';
      case 'lock':
        return 'Locked';
      case 'unlock':
        return 'Unlocked';
      default:
        return 'Viewed';
    }
  }
}
