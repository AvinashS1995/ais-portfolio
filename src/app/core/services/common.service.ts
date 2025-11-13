import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  role?: string;
  email?: string;
  name?: string;
  exp?: number;
}

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private isAdminSubject = new BehaviorSubject<boolean>(this.hasToken());
  isAdmin$ = this.isAdminSubject.asObservable();

  private userInfoSubject = new BehaviorSubject<DecodedToken | null>(null);
  userInfo$ = this.userInfoSubject.asObservable();

  constructor() {
    this.loadUserFromToken();
  }

  loadUserFromToken(): void {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        this.userInfoSubject.next(decoded);
      } catch (err) {
        console.error('Invalid token:', err);
        this.userInfoSubject.next(null);
      }
    } else {
      this.userInfoSubject.next(null);
    }
  }

  get userInfo(): DecodedToken | null {
    return this.userInfoSubject.value;
  }

  clearUserInfo(): void {
    this.userInfoSubject.next(null);
  }

  // ✅ Checks whether tokens exist
  private hasToken(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  // ✅ Call this on login
  setLoginState(): void {
    this.isAdminSubject.next(true);
  }

  // ✅ Call this on logout
  clearSession(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.isAdminSubject.next(false);
  }

  // 🌟 Custom Toast Notification (Beautiful YouWare Theme)
  showToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
    const toast = document.createElement('div');
    toast.className = `
    fixed bottom-6 right-6 flex items-center gap-3 w-full max-w-sm px-5 py-4 rounded-2xl shadow-[0_0_25px_rgba(245,139,73,0.2)]
    border border-[#f58b49]/30 backdrop-blur-xl text-sm font-medium z-[9999]
    transition-all duration-500 ease-in-out animate-slide-up
    ${
      type === 'success'
        ? 'bg-[#0f1a0f]/90 text-green-100 border-green-500/40'
        : type === 'error'
        ? 'bg-[#1a0f0f]/90 text-red-100 border-red-500/40'
        : 'bg-[#111]/90 text-[#f58b49]'
    }
  `;

    // Icon setup based on type
    const iconClass =
      type === 'success'
        ? 'fa-check-circle text-green-400'
        : type === 'error'
        ? 'fa-circle-xmark text-red-400'
        : 'fa-circle-info text-[#f58b49]';

    // 🌟 Toast HTML structure
    toast.innerHTML = `
    <div class="flex items-center w-full">
      <div class="flex items-center justify-center w-9 h-9 rounded-full 
        ${
          type === 'success'
            ? 'bg-green-700/40'
            : type === 'error'
            ? 'bg-red-700/40'
            : 'bg-[#f58b49]/20'
        }">
        <i class="fa-solid ${iconClass} text-lg"></i>
      </div>
      <div class="ml-4 flex-1 text-[15px] leading-snug">${message}</div>
      <button 
        class="ml-3 text-gray-400 hover:text-white transition duration-200"
        onclick="this.closest('.toast-item')?.remove() || this.parentElement.parentElement.remove()">
        <i class="fa-solid fa-xmark text-lg"></i>
      </button>
    </div>
  `;

    // Add animation identifier
    toast.classList.add('toast-item');

    // Append toast to DOM
    document.body.appendChild(toast);

    // ⏳ Auto remove after 3 seconds with fade-out
    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-3', 'scale-95');
      setTimeout(() => toast.remove(), 600);
    }, 3000);
  }
}
