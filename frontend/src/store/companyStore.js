import { create } from 'zustand';

const useCompanyStore = create((set) => ({
  company: null,
  jobs: [],
  applications: [],

  setCompany: (company) => set({ company }),
  setJobs: (jobs) => set({ jobs }),
  setApplications: (applications) => set({ applications }),
}));

export default useCompanyStore;
