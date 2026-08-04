/* ============================================================
   health-data.jsx — Health companion information architecture.
   ONLY the destinations + items the user specified. No invented
   records. Groups with items:null are terminal destinations.
   ============================================================ */

const H_NAV = [
  { key: "health",      label: "My Health Dashboard",      ic: "heart" },
  { key: "insights",    label: "Insights",    ic: "chart" },
  { key: "planner",     label: "Planner",     ic: "calendar" },
  { key: "library",     label: "Library",     ic: "openBook" },
  { key: "connections", label: "Connections", ic: "link" },
  { key: "community",   label: "Community",   ic: "users" },
  { key: "buddychat",   label: "BuddyChat",   ic: "smile" },
  { key: "settings",    label: "Settings",    ic: "sliders" },
];

/* flat destinations — render as a tile grid */
const H_FLAT = {
  library: ["Lab Results", "Imaging", "Doctor Orders", "Visit Summaries", "Discharge Instructions", "Immunizations", "Uploaded Documents"],
  buddychat: ["Health Questions", "Questions to Ask", "Discussion Topics", "Health Summary", "Find Documents", "Provider Prep", "Daily Guidance"],
};

/* Insights — ordered mix of expandable groups + standalone tiles */
const H_INSIGHTS = [
  { g: "Wellness Summary", items: ["Current Health Status", "Changes Detected", "Possible Contributors", "Recommended Actions", "Provider Questions"] },
  { g: "Health Storybook", items: ["Health Timeline", "Lab Changes", "Behavior Patterns", "Wins", "Warning Flags", "Outcomes"] },
  { g: "Trends", items: ["Sleep Trends", "Activity Trends", "Nutrition Trends", "Hydration Trends", "Recovery Trends"] },
];

/* grouped destinations — render as compact sections. items:null = terminal group (single tile) */
const H_GROUPS = {
  planner: [
    { g: "Care Plans",   items: ["Provider Instructions", "Care List", "Wellness Goals"] },
  ],
  connections: [
    { g: "Wearables",        items: ["Apple Health", "Garmin", "WHOOP"], add: "Add wearable" },
    { g: "FloHealth Devices", items: ["Smart Scale", "Smart Water Bottle", "FloHealth Kits"], add: "Add FloHealth device" },
    { g: "Apps",             items: ["MyFitnessPal", "Nutrition Apps"], add: "Add app" },
  ],
  settings: [
    { g: "Security",        items: ["Password and authentication"] },
    { g: "App Permissions", items: ["Connected Accounts", "Data Sharing", "Authorization Settings"] },
    { g: "Caregiver Access", items: ["Share Settings", "Caregiver Authorization"] },
    { g: "Preferences",     items: ["Dashboard Customization", "Notifications", "Goals"] },
  ],
};

/* My Health sub-sections (shown under the Health destination, beside Overview) */
const H_HEALTH_SECTIONS = [
  { g: "Medical Profile", items: ["Conditions", "Allergies", "Surgeries", "Family History"] },
  { g: "Body Metrics",    items: ["Weight", "BMI", "Body Composition", "Muscle Mass"] },
  { g: "Mood & Energy",   items: null },
];

/* Community — events + trials, matching the desktop reference */
const H_COM_CATS = ["All", "Wellness", "Nutrition", "Activity", "Sleep", "Chronic Care"];
const H_COM_EVENTS = [
  { id: 1, cat: "Wellness",     title: "Morning Yoga & Mindfulness",              date: "Jul 5, 2026",  time: "7:00 AM – 8:00 AM",   loc: "Virtual · Zoom",   host: "Dr. Maya Chen",                        spots: "12 spots left", joined: false },
  { id: 2, cat: "Nutrition",    title: "Nutrition Workshop: Anti-Inflammatory Eating", date: "Jul 8, 2026",  time: "12:00 PM – 1:30 PM",  loc: "Virtual · Zoom",   host: "Registered Dietitian Sarah Park",      spots: "8 spots left",  joined: false },
  { id: 3, cat: "Activity",     title: "Community Walk: Central Park Loop",       date: "Jul 12, 2026", time: "9:00 AM – 10:30 AM",  loc: "Central Park, NY", host: "FloHealth Community Team",              spots: "Open",          joined: true  },
  { id: 4, cat: "Sleep",        title: "Sleep Health Q&A",                        date: "Jul 15, 2026", time: "6:00 PM – 7:00 PM",   loc: "Virtual · Zoom",   host: "Dr. James Okafor, Sleep Specialist",   spots: "No limit",      joined: false },
  { id: 5, cat: "Chronic Care", title: "Diabetes Management: Real Talk",          date: "Jul 19, 2026", time: "2:00 PM – 3:30 PM",   loc: "Virtual · Zoom",   host: "Certified Diabetes Educator Lena Torres", spots: "15 spots left", joined: false },
  { id: 6, cat: "Activity",     title: "Strength Training Basics",                date: "Jul 22, 2026", time: "10:00 AM – 11:00 AM", loc: "Virtual · Zoom",   host: "Certified Trainer Marcus Webb",        spots: "20 spots left", joined: false },
];
const H_COM_TRIALS = [
  { id: 1, title: "Type 2 Diabetes Management Study",      org: "University of Miami", status: "Recruiting", match: "High",   cond: "Diabetes",     loc: "Miami, FL" },
  { id: 2, title: "Hypertension Lifestyle Intervention",   org: "Jackson Memorial",    status: "Recruiting", match: "Medium", cond: "Hypertension", loc: "Miami, FL" },
  { id: 3, title: "Sleep Quality & Cardiovascular Health", org: "NIH-sponsored",       status: "Recruiting", match: "Medium", cond: "General",      loc: "Remote"    },
  { id: 4, title: "Asthma Management & Air Quality",       org: "UM Miller School",    status: "Recruiting", match: "Low",    cond: "Asthma",       loc: "Miami, FL" },
];

window.H_COM_CATS = H_COM_CATS;
window.H_COM_EVENTS = H_COM_EVENTS;
window.H_COM_TRIALS = H_COM_TRIALS;
window.H_NAV = H_NAV;window.H_FLAT = H_FLAT;
window.H_INSIGHTS = H_INSIGHTS;
window.H_GROUPS = H_GROUPS;
window.H_HEALTH_SECTIONS = H_HEALTH_SECTIONS;

/* Library → Medication Records sub-items */
const H_LIB_MED = ["Medication History"];
window.H_LIB_MED = H_LIB_MED;

/* ---------- Profile (fields the user specified) ---------- */
const H_PROFILE = {
  name: "Claudia Lopez",
  ini: "CL",
  pronoun: "She / Her",
  fields: [
    { k: "Date of Birth", v: "March 14, 2002", ic: "calendar" },
    { k: "Address", v: "1428 Orbit Lane, Apt 3B\nAustin, TX 78701", ic: "compass" },
  ],
  emergency: { name: "Marcus Lopez", relation: "Brother", phone: "(512) 555-0184" },
  insurance: { status: "Active", provider: "", plan: "", memberId: "", group: "" },
  careTeam: [
    { type: "Primary Care Provider", ic: "stetho", name: "Dr. Liam Chen",      place: "Austin Family Medicine",  addr: "902 Cedar St, Austin, TX 78701",   phone: "(512) 555-0110" },
    { type: "Pharmacy",             ic: "pill",   name: "CVS Pharmacy",        place: "Main St Location",        addr: "540 Main St, Austin, TX 78701",    phone: "(512) 555-0143" },
    { type: "Specialist",           ic: "heart",  name: "Dr. Amara Okafor",    place: "Cardiology · Heart Center", addr: "77 Vista Ridge Blvd, Austin, TX 78704", phone: "(512) 555-0192" },
    { type: "Clinic",               ic: "flask",  name: "Riverside Health Clinic", place: "Outpatient & Labs",   addr: "310 Riverside Dr, Austin, TX 78704", phone: "(512) 555-0167" },
    { type: "Hospital",             ic: "alertTri", name: "Mercy General Hospital", place: "Emergency & Inpatient", addr: "1900 Galaxy Pkwy, Austin, TX 78723", phone: "(512) 555-0100" },
  ],
};
window.H_PROFILE = H_PROFILE;
