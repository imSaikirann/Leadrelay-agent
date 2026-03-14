import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Member = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "sales_rep" | "sales_lead";
  specialty: string;
  status: "active" | "busy" | "offline";
  addedAt: string;
};

interface Company {
  name: string;
  email: string;
  industry: string;
}

interface AppStore {
  company: Company | null;
  members: Member[];
  setCompany: (company: Company) => void;
  addMember: (member: Member) => void;
  updateMember: (id: string, updates: Partial<Member>) => void;
  removeMember: (id: string) => void;
  reset: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      company: null,
      members: [
        {
          id: "1", name: "Arjun Mehta", email: "arjun@company.com",
          role: "sales_lead", specialty: "EdTech",
          status: "active", addedAt: "Jan 12, 2025",
        },
        {
          id: "2", name: "Sneha Rao", email: "sneha@company.com",
          role: "sales_rep", specialty: "SaaS",
          status: "busy", addedAt: "Feb 3, 2025",
        },
        {
          id: "3", name: "Dev Patel", email: "dev@company.com",
          role: "sales_rep", specialty: "Real Estate",
          status: "offline", addedAt: "Mar 18, 2025",
        },
      ],
      setCompany: (company) => set({ company }),
      addMember: (member) =>
        set((state) => ({ members: [...state.members, member] })),
      updateMember: (id, updates) =>
        set((state) => ({
          members: state.members.map((m) =>
            m.id === id ? { ...m, ...updates } : m
          ),
        })),
      removeMember: (id) =>
        set((state) => ({
          members: state.members.filter((m) => m.id !== id),
        })),
      reset: () => set({ company: null, members: [] }),
    }),
    { name: "inboq-store" }
  )
);