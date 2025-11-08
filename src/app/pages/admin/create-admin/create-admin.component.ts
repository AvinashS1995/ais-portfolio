import { Component } from '@angular/core';
import { SHARED_MODULES } from '../../../core/common/shared-module';

@Component({
  selector: 'app-create-admin',
  standalone: true,
  imports: [SHARED_MODULES],
  templateUrl: './create-admin.component.html',
  styleUrl: './create-admin.component.css',
})
export class CreateAdminComponent {}
