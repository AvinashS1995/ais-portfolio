import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor() {}

  // 🌟 Flowbite Toast
  showToast(message: string, type: 'success' | 'error') {
    const toast = document.createElement('div');
    toast.className = `
      fixed bottom-6 right-6 flex items-center w-full max-w-xs p-4 mb-4 rounded-lg shadow-lg 
      border backdrop-blur-md z-[9999]
      ${
        type === 'success'
          ? 'border-green-500/40 bg-green-900/60 text-green-200'
          : 'border-red-500/40 bg-red-900/60 text-red-200'
      }
      animate-fade-in
    `;

    toast.innerHTML = `
      <div class="flex items-center w-full">
        <div class="flex items-center justify-center w-8 h-8 rounded-full ${
          type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }">
          <i class="fa-solid ${
            type === 'success' ? 'fa-check' : 'fa-circle-exclamation'
          } text-white"></i>
        </div>
        <div class="ml-3 text-sm font-semibold flex-1">${message}</div>
        <button class="ml-2 text-gray-400 hover:text-white transition" onclick="this.parentElement.parentElement.remove()">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    `;

    document.body.appendChild(toast);

    // ⏳ Auto remove toast after 3s
    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 500);
    }, 3000);
  }
}
