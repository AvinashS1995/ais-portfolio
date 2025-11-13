import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../common/api-constant';
import { AdminLockUnlock, LoginAdmin, SaveNewAdmin } from '../interfaces/auth';
import {
  AdminActivity,
  AdminUserList,
  DeleteAdmin,
  UpdateAdmin,
} from '../interfaces/admin';

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
}
