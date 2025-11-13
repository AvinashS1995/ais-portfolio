import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SHARED_MODULES } from '../../../core/common/shared-module';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [SHARED_MODULES],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.css',
})
export class ConfirmationDialogComponent {
  @Input() title: string = 'Are you sure?';
  @Input() message: string = 'Do you really want to proceed?';
  @Input() confirmText: string = 'Yes';
  @Input() cancelText: string = 'Cancel';
  @Input() icon: string = 'fa-triangle-exclamation';
  @Input() iconColor: string = 'text-yellow-500';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}
