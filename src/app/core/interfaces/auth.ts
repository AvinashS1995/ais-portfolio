export interface SaveNewAdmin {
  fullName: string;
  email: string;
  role: string;
  password: string;
}

export interface LoginAdmin {
  password: string;
}

export interface AdminLockUnlock {
  id: string;
}
