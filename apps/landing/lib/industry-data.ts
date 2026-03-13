export const industries = [
  { value: "edtech", label: "EdTech" },
  { value: "saas", label: "SaaS" },
  { value: "real-estate", label: "Real Estate" },
  { value: "coaching", label: "Coaching" },
  { value: "healthcare", label: "Healthcare" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "agency", label: "Agency" },
  { value: "finance", label: "Finance" },
];

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  interest: string;
  context: string;
  score: "Hot" | "Warm" | "Cold";
  reason: string;
  assignedTo: string | null;
  time: string;
};

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  leads: number;
};

const team: TeamMember[] = [
  { id: "1", name: "Arjun Mehta", email: "arjun@company.com", role: "Sales Rep", leads: 12 },
  { id: "2", name: "Sneha Rao", email: "sneha@company.com", role: "Sales Rep", leads: 9 },
  { id: "3", name: "Dev Patel", email: "dev@company.com", role: "Sales Lead", leads: 17 },
];

const industryLeads: Record<string, Lead[]> = {
  edtech: [
    {
      id: "1", name: "Priya Sharma", email: "priya@techstartup.io",
      phone: "+91 98765 43210", interest: "Full-Stack Bootcamp",
      context: "Looking to switch careers in 30 days. Company sponsoring fees. Need to enroll ASAP.",
      score: "Hot", reason: "Urgency + budget signal + clear timeline",
      assignedTo: "Arjun Mehta", time: "2m ago",
    },
    {
      id: "2", name: "Rahul Mehta", email: "rahul@gmail.com",
      phone: "+91 87654 32109", interest: "Data Science",
      context: "Exploring options, comparing a few programs. Not in a rush.",
      score: "Warm", reason: "Interest present but no urgency or timeline",
      assignedTo: null, time: "15m ago",
    },
    {
      id: "3", name: "Anita Krishnan", email: "anita.k@outlook.com",
      phone: "+91 76543 21098", interest: "UI/UX Design",
      context: "My friend recommended this. Just wanted to check it out.",
      score: "Cold", reason: "Passive interest, no intent signals",
      assignedTo: null, time: "1h ago",
    },
    {
      id: "4", name: "Vikram Singh", email: "vikram@infosys.com",
      phone: "+91 65432 10987", interest: "Cloud Computing",
      context: "My manager asked me to upskill. Need a certificate by Q2.",
      score: "Hot", reason: "Deadline driven + employer backing",
      assignedTo: "Sneha Rao", time: "3h ago",
    },
    {
      id: "5", name: "Meera Nair", email: "meera@gmail.com",
      phone: "+91 54321 09876", interest: "Digital Marketing",
      context: "Thinking about a career change sometime next year maybe.",
      score: "Cold", reason: "No urgency, vague timeline",
      assignedTo: null, time: "5h ago",
    },
  ],
  saas: [
    {
      id: "1", name: "James Carter", email: "james@growthco.io",
      phone: "+1 415 234 5678", interest: "Pro Plan Trial",
      context: "We have a team of 25. Currently using HubSpot but it's too expensive. Want to migrate ASAP.",
      score: "Hot", reason: "Active pain point + team size + urgency",
      assignedTo: "Arjun Mehta", time: "5m ago",
    },
    {
      id: "2", name: "Sara Liu", email: "sara@techfirm.com",
      phone: "+1 312 345 6789", interest: "Enterprise Plan",
      context: "Evaluating tools for Q3. Will need buy-in from 2 other stakeholders.",
      score: "Warm", reason: "Intent clear but multi-stakeholder, longer cycle",
      assignedTo: null, time: "30m ago",
    },
    {
      id: "3", name: "Mike Johnson", email: "mike@gmail.com",
      phone: "+1 206 456 7890", interest: "Starter Plan",
      context: "Just browsing. Saw an ad.",
      score: "Cold", reason: "No business context or intent",
      assignedTo: null, time: "2h ago",
    },
  ],
  "real-estate": [
    {
      id: "1", name: "Rohit Gupta", email: "rohit@investments.com",
      phone: "+91 99887 76655", interest: "3BHK Apartment",
      context: "Ready to buy. Have pre-approval from bank. Looking to close in 2 weeks.",
      score: "Hot", reason: "Pre-approved + 2 week close timeline",
      assignedTo: "Dev Patel", time: "10m ago",
    },
    {
      id: "2", name: "Kavya Reddy", email: "kavya@gmail.com",
      phone: "+91 88776 65544", interest: "2BHK Flat",
      context: "Planning to buy in 6 months. Still saving up.",
      score: "Warm", reason: "Clear intent but longer timeline",
      assignedTo: null, time: "1h ago",
    },
  ],
  coaching: [
    {
      id: "1", name: "Aisha Patel", email: "aisha@startup.com",
      phone: "+91 77665 54433", interest: "Leadership Coaching",
      context: "Just got promoted to VP. Need executive coaching urgently. Budget approved.",
      score: "Hot", reason: "Life event trigger + budget + urgency",
      assignedTo: "Arjun Mehta", time: "8m ago",
    },
    {
      id: "2", name: "Nikhil Joshi", email: "nikhil@corp.com",
      phone: "+91 66554 43322", interest: "Career Coaching",
      context: "Thinking about it. Not sure if I need it yet.",
      score: "Cold", reason: "No commitment signal",
      assignedTo: null, time: "3h ago",
    },
  ],
  healthcare: [
    {
      id: "1", name: "Dr. Suresh Iyer", email: "suresh@clinic.com",
      phone: "+91 55443 32211", interest: "Clinic Management Software",
      context: "Opening new clinic in March. Need software ready before launch.",
      score: "Hot", reason: "Hard deadline + new setup urgency",
      assignedTo: "Dev Patel", time: "20m ago",
    },
  ],
  ecommerce: [
    {
      id: "1", name: "Pooja Shah", email: "pooja@fashionstore.com",
      phone: "+91 44332 21100", interest: "Growth Marketing",
      context: "Running a D2C brand. Sales dropped 40% last month. Need help NOW.",
      score: "Hot", reason: "Pain point critical + immediate need",
      assignedTo: "Sneha Rao", time: "1m ago",
    },
  ],
  agency: [
    {
      id: "1", name: "Tom Harris", email: "tom@digitalagency.io",
      phone: "+1 646 567 8901", interest: "White-label CRM",
      context: "We serve 30 clients and need a white-label solution by end of month.",
      score: "Hot", reason: "Volume buyer + deadline",
      assignedTo: "Arjun Mehta", time: "15m ago",
    },
  ],
  finance: [
    {
      id: "1", name: "Rajan Malhotra", email: "rajan@wealth.com",
      phone: "+91 33221 10099", interest: "Wealth Management",
      context: "Just sold my startup. Have 2Cr to invest. Want to meet this week.",
      score: "Hot", reason: "High-value + immediate timeline + specific ask",
      assignedTo: "Dev Patel", time: "4m ago",
    },
  ],
};

export function getLeadsByIndustry(industry: string): Lead[] {
  return industryLeads[industry] ?? industryLeads["edtech"];
}

export function getTeam(): TeamMember[] {
  return team;
}

export function getAnalytics(industry: string) {
  const leads = getLeadsByIndustry(industry);
  const hot = leads.filter((l) => l.score === "Hot").length;
  const warm = leads.filter((l) => l.score === "Warm").length;
  const cold = leads.filter((l) => l.score === "Cold").length;
  return {
    total: leads.length,
    hot,
    warm,
    cold,
    conversionRate: Math.round((hot / leads.length) * 100),
  };
}