export interface SaveNewAdmin {
  fullName: string;
  email: string;
  role: string;
  password: string;
}

export interface AdminLockUnlock {
  id: string;
}

export interface LoginAdmin {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  tokens: Tokens;
  admin: AdminInfo;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface AdminInfo {
  id: string;
  fullName: string;
  email: string;
  role: string;
}
