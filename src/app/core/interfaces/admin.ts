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
