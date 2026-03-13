export type AdminUser = {
  id: string;
  name: string;
  email: string;
  company: string;
  industry: string;
  plan: "free" | "pro" | "business";
  status: "active" | "inactive" | "suspended";
  leads: number;
  usedLeads: number;
  joinedAt: string;
  lastActive: string;
};

export type AdminLead = {
  id: string;
  userId: string;
  userName: string;
  company: string;
  leadName: string;
  email: string;
  score: "Hot" | "Warm" | "Cold";
  industry: string;
  createdAt: string;
};

export const adminUsers: AdminUser[] = [
  {
    id: "u1", name: "Arjun Mehta", email: "arjun@techstartup.io",
    company: "TechStartup", industry: "edtech", plan: "pro",
    status: "active", leads: 500, usedLeads: 312,
    joinedAt: "Jan 12, 2025", lastActive: "2h ago",
  },
  {
    id: "u2", name: "Priya Sharma", email: "priya@growthco.io",
    company: "GrowthCo", industry: "saas", plan: "business",
    status: "active", leads: 999, usedLeads: 784,
    joinedAt: "Feb 3, 2025", lastActive: "5m ago",
  },
  {
    id: "u3", name: "Rahul Nair", email: "rahul@coaching.com",
    company: "Nair Coaching", industry: "coaching", plan: "free",
    status: "active", leads: 50, usedLeads: 47,
    joinedAt: "Mar 18, 2025", lastActive: "1d ago",
  },
  {
    id: "u4", name: "Sneha Patel", email: "sneha@realty.in",
    company: "Patel Realty", industry: "real-estate", plan: "pro",
    status: "inactive", leads: 500, usedLeads: 120,
    joinedAt: "Dec 5, 2024", lastActive: "12d ago",
  },
  {
    id: "u5", name: "Dev Kumar", email: "dev@agency.io",
    company: "Dev Agency", industry: "agency", plan: "free",
    status: "suspended", leads: 50, usedLeads: 50,
    joinedAt: "Nov 22, 2024", lastActive: "30d ago",
  },
];

export const adminLeads: AdminLead[] = [
  { id: "l1", userId: "u1", userName: "Arjun Mehta", company: "TechStartup", leadName: "Vikram Singh", email: "vikram@infosys.com", score: "Hot", industry: "EdTech", createdAt: "2h ago" },
  { id: "l2", userId: "u2", userName: "Priya Sharma", company: "GrowthCo", leadName: "James Carter", email: "james@growthco.io", score: "Hot", industry: "SaaS", createdAt: "5m ago" },
  { id: "l3", userId: "u3", userName: "Rahul Nair", company: "Nair Coaching", leadName: "Aisha Patel", email: "aisha@startup.com", score: "Warm", industry: "Coaching", createdAt: "1h ago" },
  { id: "l4", userId: "u1", userName: "Arjun Mehta", company: "TechStartup", leadName: "Meera Nair", email: "meera@gmail.com", score: "Cold", industry: "EdTech", createdAt: "3h ago" },
  { id: "l5", userId: "u2", userName: "Priya Sharma", company: "GrowthCo", leadName: "Sara Liu", email: "sara@techfirm.com", score: "Warm", industry: "SaaS", createdAt: "30m ago" },
  { id: "l6", userId: "u4", userName: "Sneha Patel", company: "Patel Realty", leadName: "Rohit Gupta", email: "rohit@investments.com", score: "Hot", industry: "Real Estate", createdAt: "2d ago" },
];

export function getAdminStats() {
  const totalRevenue = adminUsers.reduce((acc, u) => {
    if (u.plan === "pro") return acc + 29;
    if (u.plan === "business") return acc + 79;
    return acc;
  }, 0);

  return {
    totalUsers: adminUsers.length,
    activeUsers: adminUsers.filter((u) => u.status === "active").length,
    totalLeads: adminLeads.length,
    hotLeads: adminLeads.filter((l) => l.score === "Hot").length,
    mrr: totalRevenue,
    proUsers: adminUsers.filter((u) => u.plan === "pro").length,
    businessUsers: adminUsers.filter((u) => u.plan === "business").length,
    freeUsers: adminUsers.filter((u) => u.plan === "free").length,
  };
}