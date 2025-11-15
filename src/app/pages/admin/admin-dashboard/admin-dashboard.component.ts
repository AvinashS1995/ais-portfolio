import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SHARED_MODULES } from '../../../core/common/shared-module';
import {
  DashboardCard,
  DashboardStat,
  GetDashboardPayload,
  SaveDashboardCardsPayload,
  SaveDashboardStatsPayload,
} from '../../../core/interfaces/admin';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { CommonService } from '../../../core/services/common.service';

interface StatCard {
  label: string;
  count: number;
  icon: string; // FontAwesome or lucide icon class
  link: string;
  color: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [SHARED_MODULES],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent {
  stats: DashboardStat[] = [];
  cards: DashboardCard[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private apiService: ApiService,
    public commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.loadDashboardStats();
    this.loadDashboardCards();
  }

  private loadDashboardStats(): void {
    const payload: GetDashboardPayload = {
      role: this.commonService.userInfo?.role || '',
      adminId: this.commonService.userInfo?.id || '',
    };

    this.apiService
      .GetDashboardStats(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          console.log(res);
          this.stats = res.data?.stats || [];
          console.log(this.stats);
          this.commonService.showToast(res.message, 'success');
        },
        error: (err) =>
          this.commonService.showToast(err.error.message, 'error'),
      });
  }

  private loadDashboardCards(): void {
    const payload: GetDashboardPayload = {
      role: this.commonService.userInfo?.role || '',
    };

    this.apiService
      .GetDashboardCards(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          console.log(res);
          this.cards = res.data?.cards || [];
          console.log(this.cards);
          this.commonService.showToast(res.message, 'success');
        },
        error: (err) => this.commonService.showToast(err.error.message),
      });
  }

  navigate(link: string): void {
    this.router.navigate([link]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
