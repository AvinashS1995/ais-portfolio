export interface AdminUserList {
  role: string;
}
export interface UpdateAdmin {
  id: string;
  fullName: string;
  email: string;
  role: string;
  password: string;
}

export interface DeleteAdmin {
  id: string;
}

export interface AdminActivity {
  id: string;
}

export interface DashboardCard {
  icon: string;
  title: string;
  desc: string;
  link: string;
}

export type UserRole = 'Super Admin' | 'Admin';

export interface DashboardStat {
  label: string;
  count: number;
  icon: string;
  link: string;
  color: string;
}

export interface GetDashboardPayload {
  role: string;
}

export interface SaveDashboardCardsPayload {
  role: string;
  cards: DashboardCard[];
}

export interface SaveDashboardStatsPayload {
  role: string;
  stats: DashboardStat[];
}
