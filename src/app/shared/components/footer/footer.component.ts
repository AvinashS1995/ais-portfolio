import { Component } from '@angular/core';
import { SHARED_MODULES } from '../../../core/common/shared-module';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [SHARED_MODULES],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
