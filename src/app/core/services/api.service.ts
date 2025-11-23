import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, from, Observable, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../common/api-constant';
import {
  AdminLockUnlock,
  LoginAdmin,
  LoginResponse,
  SaveNewAdmin,
} from '../interfaces/auth';
import {
  AdminActivity,
  AdminUserList,
  DeleteAdmin,
  GetDashboardPayload,
  SaveDashboardCardsPayload,
  SaveDashboardStatsPayload,
  UpdateAdmin,
} from '../interfaces/admin';
import { SavePortfolioAboutPayload } from '../interfaces/about';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private commonService: CommonService) {}

  async getClientIp(): Promise<string> {
    try {
      const response: any = await firstValueFrom(
        this.http.get('https://api.ipify.org?format=json')
      );
      return response.ip; // public IP
    } catch (err) {
      console.error('IP fetch failed', err);
      return '0.0.0.0';
    }
  }

  SaveNewAdminCreation(payload: SaveNewAdmin): Observable<any> {
    return this.http.post<SaveNewAdmin>(
      `${this.baseUrl}${API_ENDPOINTS.SERVICE_ADMIN_CREATION}`,
      payload
    );
  }

  LoginAdmin(payload: LoginAdmin): Observable<LoginResponse> {
    return from(this.commonService.getClientIp()).pipe(
      switchMap((ip) => {
        const updatedPayload = {
          ...payload,
          clientIp: ip,
        };

        return this.http.post<LoginResponse>(
          `${this.baseUrl}${API_ENDPOINTS.SERVICE_LOGIN}`,
          updatedPayload
        );
      })
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

  CheckUniqueUserNameSlug(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}${API_ENDPOINTS.SERVICE_CHECK_USERNAME_SLUG}`,
      payload
    );
  }
  GetAdminByID(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}${API_ENDPOINTS.SERVICE_GET_ADMIN_BY_ID}`,
      payload
    );
  }

  UpdateAdmin(payload: any): Observable<any> {
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

  UploadFile(formData: FormData): Observable<any> {
    return this.http.post(
      `${this.baseUrl}${API_ENDPOINTS.SERVICE_UPLOADFILE}`,
      formData
    );
  }

  GetPortfolioAbout(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}${API_ENDPOINTS.SERVICE_GET_PORTFOLIO_ABOUT_SECTION}`,
      payload
    );
  }

  SavePortfolioHome(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}${API_ENDPOINTS.SERVICE_SAVE_PORTFOLIO_HOME_SECTION}`,
      payload
    );
  }

  GetPortfolioHome(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}${API_ENDPOINTS.SERVICE_GET_PORTFOLIO_HOME_SECTION}`,
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

  SavePortfolioSkills(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}${API_ENDPOINTS.SERVICE_SAVE_PORTFOLIO_SKILL_SECTION}`,
      payload
    );
  }

  GetPortfolioSkills(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}${API_ENDPOINTS.SERVICE_GET_PORTFOLIO_SKILLS_SECTION}`,
      payload
    );
  }

  UpdatePortfolioSkills(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}${API_ENDPOINTS.SERVICE_UPDATE_PORTFOLIO_SKILL_SECTION}`,
      payload
    );
  }

  DeletePortfolioSkills(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}${API_ENDPOINTS.SERVICE_DELETE_PORTFOLIO_SKILL_SECTION}`,
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

  GetPortfolioAIGenerate(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}${API_ENDPOINTS.SERVICE_GET_AI_GENERATE}`,
      payload
    );
  }

  // Get all portfolio messages (Admin side)
  GetPortfolioContactMessages(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}${API_ENDPOINTS.SERVICE_GET_PORTFOLIO_CONTACT_MESSSAGES_SECTION}`,
      payload
    );
  }

  // Delete a specific portfolio message (Admin side)
  DeletePortfolioContactMessage(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}${API_ENDPOINTS.SERVICE_DELETE_PORTFOLIO_CONTACT_MESSAGE_SECTION}`,
      payload
    );
  }

  GetPublicPortfolioHome(slug: string): Observable<any> {
    const url = this.commonService.buildUrl(
      API_ENDPOINTS.SERVICE_GET_PUBLIC_PORTFOLIO_HOME_SECTION,
      { slug }
    );
    return this.http.get(`${this.baseUrl}${url}`);
  }

  GetPublicPortfolioAbout(slug: string): Observable<any> {
    const url = this.commonService.buildUrl(
      API_ENDPOINTS.SERVICE_GET_PUBLIC_PORTFOLIO_ABOUT_SECTION,
      { slug }
    );
    return this.http.get(`${this.baseUrl}${url}`);
  }

  GetPublicPortfolioEducations(slug: string): Observable<any> {
    const url = this.commonService.buildUrl(
      API_ENDPOINTS.SERVICE_GET_PUBLIC_PORTFOLIO_EDUCATIONS_SECTION,
      { slug }
    );
    return this.http.get(`${this.baseUrl}${url}`);
  }

  GetPublicPortfolioExperiences(slug: string): Observable<any> {
    const url = this.commonService.buildUrl(
      API_ENDPOINTS.SERVICE_GET_PUBLIC_PORTFOLIO_EXPERIENCES_SECTION,
      { slug }
    );
    return this.http.get(`${this.baseUrl}${url}`);
  }

  GetPublicPortfolioSkills(slug: string): Observable<any> {
    const url = this.commonService.buildUrl(
      API_ENDPOINTS.SERVICE_GET_PUBLIC_PORTFOLIO_SKILLS_SECTION,
      { slug }
    );
    return this.http.get(`${this.baseUrl}${url}`);
  }

  GetPublicPortfolioServices(slug: string): Observable<any> {
    const url = this.commonService.buildUrl(
      API_ENDPOINTS.SERVICE_GET_PUBLIC_PORTFOLIO_SERVICES_SECTION,
      { slug }
    );
    return this.http.get(`${this.baseUrl}${url}`);
  }

  GetPublicPortfolioProjects(slug: string): Observable<any> {
    const url = this.commonService.buildUrl(
      API_ENDPOINTS.SERVICE_GET_PUBLIC_PORTFOLIO_PROJECTS_SECTION,
      { slug }
    );
    return this.http.get(`${this.baseUrl}${url}`);
  }

  GetPublicPortfolioContactInfo(slug: string): Observable<any> {
    const url = this.commonService.buildUrl(
      API_ENDPOINTS.SERVICE_GET_PUBLIC_PORTFOLIO_CONTACT_INFO_SECTION,
      { slug }
    );
    return this.http.get(`${this.baseUrl}${url}`);
  }

  SavePortfolioContactMessage(slug: string, payload: any): Observable<any> {
    const url = this.commonService.buildUrl(
      API_ENDPOINTS.SERVICE_GET_PUBLIC_PORTFOLIO_SAVE_CONTACT_INFO_MESSAGE_SECTION,
      { slug }
    );
    return this.http.post(`${this.baseUrl}${url}`, payload);
  }
}
