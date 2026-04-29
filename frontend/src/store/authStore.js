import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  accessToken: localStorage.getItem('access_token') || null,
  refreshToken: localStorage.getItem('refresh_token') || null,
  isAuthenticated: !!localStorage.getItem('access_token'),
  companyName: localStorage.getItem('company_name') || null,
  companyId: localStorage.getItem('company_id') || null,

  login: (data) => {
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    if (data.name) localStorage.setItem('company_name', data.name);
    if (data.company_id) localStorage.setItem('company_id', String(data.company_id));
    set({
      accessToken: data.access,
      refreshToken: data.refresh,
      isAuthenticated: true,
      companyName: data.name || null,
      companyId: data.company_id ? String(data.company_id) : null,
    });
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('company_name');
    localStorage.removeItem('company_id');
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      companyName: null,
      companyId: null,
    });
  },

  setTokens: (access, refresh) => {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    set({ accessToken: access, refreshToken: refresh, isAuthenticated: true });
  },
}));

export default useAuthStore;
