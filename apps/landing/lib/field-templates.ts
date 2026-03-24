
export const FIELD_TEMPLATES = {
  edtech: [
    { key: "name",          label: "Full Name",        type: "text",    order: 0 },
    { key: "email",         label: "Email",            type: "text",    order: 1 },
    { key: "phone",         label: "Phone",            type: "text",    order: 2 },
    { key: "course",        label: "Course Interest",  type: "text",    order: 3 },
    { key: "budget",        label: "Budget (₹)",       type: "number",  order: 4 },
    { key: "mode",          label: "Mode",             type: "select",  options: ["Online", "Offline", "Hybrid"], order: 5 },
    { key: "start_date",    label: "Start Date",       type: "date",    order: 6 },
    { key: "qualification", label: "Qualification",    type: "text",    order: 7 },
    { key: "message",       label: "Message",          type: "text",    order: 8, isRequired: true },
  ],
  realestate: [
    { key: "name",           label: "Full Name",        type: "text",   order: 0 },
    { key: "email",          label: "Email",            type: "text",   order: 1 },
    { key: "phone",          label: "Phone",            type: "text",   order: 2 },
    { key: "location",       label: "Location",         type: "text",   order: 3 },
    { key: "budget",         label: "Budget (₹)",       type: "number", order: 4 },
    { key: "property_type",  label: "Property Type",    type: "select", options: ["Apartment", "Villa", "Plot", "Commercial"], order: 5 },
    { key: "bhk",            label: "BHK",              type: "select", options: ["1BHK", "2BHK", "3BHK", "4BHK+"], order: 6 },
    { key: "possession",     label: "Possession",       type: "select", options: ["Ready", "6 months", "1 year", "2+ years"], order: 7 },
    { key: "message",        label: "Message",          type: "text",   order: 8, isRequired: true },
  ],
  agency: [
    { key: "name",         label: "Full Name",      type: "text",   order: 0 },
    { key: "email",        label: "Email",          type: "text",   order: 1 },
    { key: "phone",        label: "Phone",          type: "text",   order: 2 },
    { key: "service",      label: "Service Needed", type: "text",   order: 3 },
    { key: "budget",       label: "Budget (₹)",     type: "number", order: 4 },
    { key: "timeline",     label: "Timeline",       type: "text",   order: 5 },
    { key: "company_size", label: "Company Size",   type: "select", options: ["1-10", "10-50", "50-200", "200+"], order: 6 },
    { key: "message",      label: "Message",        type: "text",   order: 7, isRequired: true },
  ],
} as const;

export type FieldCategory = keyof typeof FIELD_TEMPLATES;