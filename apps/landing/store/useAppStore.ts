import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Company {
  name: string;
  email: string;
  industry: string;
}

interface AppStore {
  company: Company | null;
  setCompany: (company: Company) => void;
  reset: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      company: null,
      setCompany: (company) => set({ company }),
      reset: () => set({ company: null }),
    }),
    { name: "leadiq-store" }
  )
);