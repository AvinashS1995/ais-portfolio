import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../common/api-constant';
import { AdminLockUnlock, LoginAdmin, SaveNewAdmin } from '../interfaces/auth';
import {
  AdminActivity,
  AdminUserList,
  DashboardCard,
  DashboardStat,
  DeleteAdmin,
  GetDashboardPayload,
  SaveDashboardCardsPayload,
  SaveDashboardStatsPayload,
  UpdateAdmin,
} from '../interfaces/admin';
import { SavePortfolioAboutPayload } from '../interfaces/about';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  SaveNewAdminCreation(payload: SaveNewAdmin): Observable<any> {
    return this.http.post<SaveNewAdmin>(
      `${this.baseUrl}${API_ENDPOINTS.SERVICE_ADMIN_CREATION}`,
      payload
    );
  }

  LoginAdmin(payload: LoginAdmin): Observable<any> {
    return this.http.post<LoginAdmin>(
      `${this.baseUrl}${API_ENDPOINTS.SERVICE_LOGIN}`,
      payload
    );
  }

  refreshAccessToken(refreshToken: string): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}${API_ENDPOINTS.SERVICE_REFRESH_TOKEN}`,
      { refreshToken }
    );
  }

  toggleLockUnlockAdmin(payload: AdminLockUnlock): Observable<any> {
    return this.http.post<AdminLockUnlock>(
      `${this.baseUrl}${API_ENDPOINTS.SERVICE_LOCK_UNLOCK_ADMIN}`,
      payload
    );
  }

  LogOutAdmin(): Observable<any> {
    return this.http.post<AdminLockUnlock>(
      `${this.baseUrl}${API_ENDPOINTS.SERVICE_ADMIN_LOGOUT}`,
      {}
    );
  }

  GetAdminUserList(payload: AdminUserList): Observable<any> {
    return this.http.post<AdminUserList>(
      `${this.baseUrl}${API_ENDPOINTS.SERVICE_ADMIN_USER_LIST}`,
      payload
    );
  }

  UpdateAdmin(payload: UpdateAdmin): Observable<any> {
    return this.http.post<UpdateAdmin>(
      `${this.baseUrl}${API_ENDPOINTS.SERVICE_UPDATE_ADMIN}`,
      payload
    );
  }

  DeleteAdmin(payload: DeleteAdmin): Observable<any> {
    return this.http.post<DeleteAdmin>(
      `${this.baseUrl}${API_ENDPOINTS.SERVICE_DELETE_ADMIN}`,
      payload
    );
  }

  GetAdminActivity(payload: AdminActivity): Observable<any> {
    return this.http.post<AdminActivity>(
      `${this.baseUrl}${API_ENDPOINTS.SERVICE_GET_ADMIN_ACTIVITY}`,
      payload
    );
  }

  GetDashboardCards(payload: GetDashboardPayload): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}${API_ENDPOINTS.SERVICE_GET_ADMIN_DASHBOARD_CARDS}`,
      payload
    );
  }

  SaveDashboardCards(payload: SaveDashboardCardsPayload): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}${API_ENDPOINTS.SERVICE_SAVE_ADMIN_DASHBOARD_CARDS}`,
      payload
    );
  }

  GetDashboardStats(payload: GetDashboardPayload): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}${API_ENDPOINTS.SERVICE_GET_ADMIN_DASHBOARD_STATS}`,
      payload
    );
  }

  SaveDashboardStats(payload: SaveDashboardStatsPayload): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}${API_ENDPOINTS.SERVICE_SAVE_ADMIN_DASHBOARD_STATS}`,
      payload
    );
  }

  SavePortfolioAbout(payload: SavePortfolioAboutPayload): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}${API_ENDPOINTS.SERVICE_SAVE_PORTFOLIO_ABOUT_SECTION}`,
      payload
    );
  }

  GetPortfolioAbout(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}${API_ENDPOINTS.SERVICE_GET_PORTFOLIO_ABOUT_SECTION}`,
      payload
    );
  }

  SavePortfolioEducations(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}${API_ENDPOINTS.SERVICE_SAVE_PORTFOLIO_EDUCATIONS_SECTION}`,
      payload
    );
  }

  GetPortfolioEducations(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}${API_ENDPOINTS.SERVICE_GET_PORTFOLIO_EDUCATIONS_SECTION}`,
      payload
    );
  }

  UpdatePortfolioEducations(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}${API_ENDPOINTS.SERVICE_UPDATE_PORTFOLIO_EDUCATIONS_SECTION}`,
      payload
    );
  }

  DeletePortfolioEducations(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}${API_ENDPOINTS.SERVICE_DELETE_PORTFOLIO_EDUCATIONS_SECTION}`,
      payload
    );
  }

  SavePortfolioExperiences(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}${API_ENDPOINTS.SERVICE_SAVE_PORTFOLIO_EXPERIENCES_SECTION}`,
      payload
    );
  }

  GetPortfolioExperiences(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}${API_ENDPOINTS.SERVICE_GET_PORTFOLIO_EXPERIENCES_SECTION}`,
      payload
    );
  }

  UpdatePortfolioExperiences(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}${API_ENDPOINTS.SERVICE_UPDATE_PORTFOLIO_EXPERIENCES_SECTION}`,
      payload
    );
  }

  DeletePortfolioExperiences(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}${API_ENDPOINTS.SERVICE_DELETE_PORTFOLIO_EXPERIENCES_SECTION}`,
      payload
    );
  }

  SavePortfolioServices(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}${API_ENDPOINTS.SERVICE_SAVE_PORTFOLIO_SERVICE_SECTION}`,
      payload
    );
  }

  GetPortfolioServices(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}${API_ENDPOINTS.SERVICE_GET_PORTFOLIO_SERVICES_SECTION}`,
      payload
    );
  }

  UpdatePortfolioServices(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}${API_ENDPOINTS.SERVICE_UPDATE_PORTFOLIO_SERVICE_SECTION}`,
      payload
    );
  }

  DeletePortfolioServices(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}${API_ENDPOINTS.SERVICE_DELETE_PORTFOLIO_SERVICE_SECTION}`,
      payload
    );
  }

  SavePortfolioProjects(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}${API_ENDPOINTS.SERVICE_SAVE_PORTFOLIO_PROJECTS_SECTION}`,
      payload
    );
  }

  GetPortfolioProjects(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}${API_ENDPOINTS.SERVICE_GET_PORTFOLIO_PROJECTS_SECTION}`,
      payload
    );
  }

  UpdatePortfolioProjects(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}${API_ENDPOINTS.SERVICE_UPDATE_PORTFOLIO_PROJECTS_SECTION}`,
      payload
    );
  }

  DeletePortfolioProjects(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}${API_ENDPOINTS.SERVICE_DELETE_PORTFOLIO_PROJECTS_SECTION}`,
      payload
    );
  }

  SavePortfolioContactInfo(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}${API_ENDPOINTS.SERVICE_SAVE_PORTFOLIO_CONTACT_INFO_SECTION}`,
      payload
    );
  }

  GetPortfolioContactInfo(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}${API_ENDPOINTS.SERVICE_GET_PORTFOLIO_CONTACT_INFO_SECTION}`,
      payload
    );
  }

  UpdatePortfolioContactInfo(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}${API_ENDPOINTS.SERVICE_UPDATE_PORTFOLIO_CONTACT_INFO_SECTION}`,
      payload
    );
  }

  DeletePortfolioContactInfo(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}${API_ENDPOINTS.SERVICE_DELETE_PORTFOLIO_CONTACT_INFO_SECTION}`,
      payload
    );
  }
}
