import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SHARED_MODULES } from '../../../core/common/shared-module';

@Component({
  selector: 'app-alert-dialog',
  standalone: true,
  imports: [SHARED_MODULES],
  templateUrl: './alert-dialog.component.html',
  styleUrl: './alert-dialog.component.css',
})
export class AlertDialogComponent {
  @Input() title: string = 'Alert';
  @Input() message: string = '';
  @Input() type: 'success' | 'error' | 'info' = 'info';
  @Output() close = new EventEmitter<void>();

  get iconClass() {
    switch (this.type) {
      case 'success':
        return 'fa-check-circle text-green-400';
      case 'error':
        return 'fa-circle-exclamation text-red-400';
      default:
        return 'fa-info-circle text-blue-400';
    }
  }

  get borderColor() {
    switch (this.type) {
      case 'success':
        return 'border-green-500/50';
      case 'error':
        return 'border-red-500/50';
      default:
        return 'border-blue-500/50';
    }
  }
}
