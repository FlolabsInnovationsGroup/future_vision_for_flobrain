/* ============================================================
   health-mvp.jsx — FloHealth Buddy MVP
   Mobile-first, single-column scrollable app.
   Phone-frame shell · 5-tab bottom nav · card feed.
   Uses the same --h-* and --t-* tokens as full Health Buddy.
   ============================================================ */

/* ---------- MVP data ---------- */
const MVP_GOALS = [
  { id: 1, label: "Drink 8 glasses of water daily",              target: 7, completed: 0 },
  { id: 2, label: "30 min walk, 5× per week",                    target: 7, completed: 0 },
  { id: 3, label: "Eat at least 5 servings of fruits & veggies", target: 7, completed: 0 },
  { id: 4, label: "Track calories three times this week",         target: 7, completed: 0 },
];

const MVP_COMMUNITY = [
  { title: "Saturday Yoga in the Park",       date: "Jun 29", time: "7:00 AM",  loc: "Riverside Park, Miami FL",         cat: "Fitness",   going: 24,  desc: "Start your weekend with a free outdoor yoga session led by certified instructors. All levels welcome.", organizer: "Miami Wellness Collective", cost: "Free", duration: "60 min", target: "Adults, Seniors" },
  { title: "Diabetes Support Group",          date: "Jul 1",  time: "6:00 PM",  loc: "FloHealth Community Center",       cat: "Support",   going: 12,  desc: "A safe and supportive space for those living with diabetes to share experiences, tips, and encouragement.", organizer: "FloHealth Community", cost: "Free", duration: "90 min", target: "Adults, Seniors" },
  { title: "Heart Health Seminar",            date: "Jul 5",  time: "10:00 AM", loc: "Baptist Health Auditorium",        cat: "Education", going: 45,  desc: "Learn from cardiologists about preventing heart disease, understanding risk factors, and making healthy changes.", organizer: "Baptist Health South Florida", cost: "Free", duration: "2 hrs", target: "Adults, Seniors" },
  { title: "5K Charity Walk — Mental Health", date: "Jul 8",  time: "8:00 AM",  loc: "Downtown Bayfront, Miami",         cat: "Charity",   going: 200, desc: "Join hundreds of community members walking to raise awareness and funds for mental health services in South Florida.", organizer: "Miami Mental Health Alliance", cost: "$20 registration", duration: "1–2 hrs", target: "All Ages" },
  { title: "Nutrition & Wellness Workshop",   date: "Jul 10", time: "5:30 PM",  loc: "Miami Beach Community Hall",       cat: "Education", going: 30,  desc: "Hands-on workshop covering balanced eating, reading nutrition labels, and building sustainable meal habits.", organizer: "SFL Dietitians Association", cost: "$10", duration: "2 hrs", target: "Adults" },
  { title: "Seniors Fitness Circle",          date: "Jul 12", time: "9:00 AM",  loc: "Coral Gables Recreation Center",   cat: "Fitness",   going: 18,  desc: "Low-impact exercises designed specifically for older adults to improve strength, balance, and flexibility.", organizer: "Coral Gables Parks & Rec", cost: "Free", duration: "45 min", target: "Seniors 60+" },
];

const MVP_TRIALS = [
  { title: "Type 2 Diabetes Management Study",       org: "University of Miami",     status: "Recruiting", match: "High",   cond: "Diabetes",      loc: "Miami, FL"  },
  { title: "Hypertension Lifestyle Intervention",    org: "Jackson Memorial",        status: "Recruiting", match: "Medium", cond: "Hypertension",  loc: "Miami, FL"  },
  { title: "Sleep Quality & Cardiovascular Health",  org: "NIH-sponsored",           status: "Recruiting", match: "Medium", cond: "General",       loc: "Remote"     },
  { title: "Asthma Management & Air Quality",        org: "UM Miller School",        status: "Recruiting", match: "Low",    cond: "Asthma",        loc: "Miami, FL"  },
];

const MVP_REC_CATS = [
  { key: "labs",      label: "Lab Results",            count: 24, last: "Jun 12" },
  { key: "imaging",   label: "Imaging",                count: 3,  last: "Jun 10" },
  { key: "visits",    label: "Visit Summaries",        count: 4,  last: "Jun 15" },
  { key: "discharge", label: "Discharge Instructions", count: 1,  last: "May 8"  },
  { key: "immuno",    label: "Immunizations",          count: 8,  last: "Jan 2026"},
  { key: "medhistory",label: "Medication History",     count: 6,  last: "Jun 5"  },
];

const MVP_REC_DETAIL = {
  labs: [
    { title: "A1C", date: "June 12", result: "6.8%", status: "Improved ↓", note: "Moving toward target range." },
    { title: "Cholesterol – LDL", date: "May 14", result: "110 mg/dL", status: "Borderline", note: "Heart health markers improving." },
    { title: "Vitamin D", date: "April 22", result: "38 ng/mL", status: "Normalized", note: "Supplement routine effective." },
    { title: "CBC – Complete Blood Count", date: "March 3", result: "Normal", status: "Normal", note: "All values within range." },
  ],
  imaging: [
    { title: "Chest X-Ray", date: "June 10, 2026", reason: "Persistent cough", result: "Normal", findings: "No acute cardiopulmonary issues." },
    { title: "Thyroid Ultrasound", date: "March 12, 2026", reason: "Hormone imbalance check", result: "Benign nodules", findings: "Small nodules, no suspicious features." },
    { title: "Abdominal Ultrasound", date: "Jan 5, 2026", reason: "Abdominal discomfort", result: "Normal", findings: "No abnormalities detected." },
  ],
  visits: [
    { title: "Primary Care Visit", date: "June 15, 2026", prov: "Dr. Smith · Primary Care", type: "Routine check-up", summary: "BP stable. Continue current medications. Walk 30 min/day." },
    { title: "Cardiology Consultation", date: "May 20, 2026", prov: "Dr. Emily Johnson · Cardiology", type: "Specialist Consultation", summary: "EKG normal. Lipid panel ordered. Follow up in 3 months." },
    { title: "Lab Review Visit", date: "May 14, 2026", prov: "Dr. Lee · Primary Care", type: "Lab follow-up", summary: "A1C improving. Maintain current diet plan." },
    { title: "Urgent Care Visit", date: "April 2, 2026", prov: "Urgent Care Clinician", type: "Urgent Care", summary: "Chest X-ray ordered. Prescribed antibiotic. Rest 3 days." },
  ],
  discharge: [
    { title: "Urgent Care Discharge", date: "April 2, 2026", inst: "Complete full antibiotic course. Rest for 3 days. Return if fever > 101°F or shortness of breath worsens." },
  ],
  immuno: [
    { title: "COVID-19 (Booster)", date: "Jan 2026" },
    { title: "Influenza", date: "Oct 2025" },
    { title: "Tdap (Tetanus/Diphtheria/Pertussis)", date: "Mar 2023" },
    { title: "Hepatitis B (Series complete)", date: "2019" },
    { title: "MMR", date: "Childhood" },
    { title: "Varicella", date: "Childhood" },
    { title: "Pneumococcal (PPSV23)", date: "2022" },
    { title: "HPV (Series complete)", date: "2018" },
  ],
  medhistory: [
    { name: "Lisinopril 10 mg", from: "Nov 2022", status: "Active",   reason: "Hypertension" },
    { name: "Metformin 500 mg",  from: "Aug 2021", status: "Active",   reason: "Type 2 Diabetes" },
    { name: "Vitamin D 1000 IU", from: "Jan 2024", status: "Active",   reason: "Deficiency" },
    { name: "Amoxicillin 500 mg",from: "Apr 2026", status: "Completed",reason: "Respiratory infection" },
    { name: "Azithromycin",      from: "Jul 2024", status: "Completed",reason: "Sinusitis" },
    { name: "Ibuprofen 400 mg",  from: "Oct 2023", status: "Completed",reason: "Inflammation" },
  ],
};

/* ---------- Records screen ---------- */
function MVPRecordsScreen() {
  const [q, setQ] = React.useState("");
  const [openCat, setOpenCat] = React.useState(null);
  const [showUpload, setShowUpload] = React.useState(false);
  const [upForm, setUpForm] = React.useState({ cat: "", name: "", date: "", notes: "" });

  if (openCat) {
    const detail = MVP_REC_DETAIL[openCat.key] || [];
    const catLabel = openCat.label;
    return (
      <div className="mvp-feed">
        <button className="mvp-back-btn" onClick={() => setOpenCat(null)}>
          {React.createElement(Icon.chevRight, { s: 16 })} Back to Records
        </button>
        <h3 className="mvp-sec-title">{catLabel}</h3>
        {openCat.key === "labs" && detail.map((r, i) => (
          <MVPCard key={i}>
            <div className="mvp-rec-row"><strong>{r.title}</strong><span className="mvp-rec-status">{r.status}</span></div>
            <div className="mvp-rec-row"><span className="mvp-rec-date">{r.date}</span><span className="mvp-rec-val">{r.result}</span></div>
            {r.note && <p className="mvp-rec-note">{r.note}</p>}
          </MVPCard>
        ))}
        {openCat.key === "imaging" && detail.map((r, i) => (
          <MVPCard key={i}>
            <strong className="mvp-evt-title">{r.title}</strong>
            <span className="mvp-rec-date">{r.date}</span>
            <div className="mvp-rec-meta"><span>Reason</span><span>{r.reason}</span></div>
            <div className="mvp-rec-meta"><span>Result</span><strong>{r.result}</strong></div>
            <p className="mvp-rec-note">{r.findings}</p>
            <div className="mvp-rec-btns">
              <button className="mvp-btn-sm">View Report</button>
              <button className="mvp-btn-sm">View Image</button>
            </div>
          </MVPCard>
        ))}
        {openCat.key === "visits" && detail.map((r, i) => (
          <MVPCard key={i}>
            <strong className="mvp-evt-title">{r.title}</strong>
            <span className="mvp-rec-date">{r.date}</span>
            <div className="mvp-rec-meta"><span>Provider</span><span>{r.prov}</span></div>
            <div className="mvp-rec-meta"><span>Type</span><span>{r.type}</span></div>
            <p className="mvp-rec-note">{r.summary}</p>
            <button className="mvp-btn-sm">View Full Summary</button>
          </MVPCard>
        ))}
        {openCat.key === "discharge" && detail.map((r, i) => (
          <MVPCard key={i}>
            <strong className="mvp-evt-title">{r.title}</strong>
            <span className="mvp-rec-date">{r.date}</span>
            <p className="mvp-rec-note">{r.inst}</p>
          </MVPCard>
        ))}
        {openCat.key === "immuno" && detail.map((r, i) => (
          <div key={i} className="mvp-immuno-row">
            <span className="mvp-lab-n">{r.title}</span>
            <span className="mvp-lab-d">{r.date}</span>
          </div>
        ))}
        {openCat.key === "medhistory" && detail.map((r, i) => (
          <MVPCard key={i}>
            <div className="mvp-rec-row"><strong>{r.name}</strong><span className={"mvp-rec-status" + (r.status === "Active" ? " on" : "")}>{r.status}</span></div>
            <div className="mvp-rec-meta"><span>Started</span><span>{r.from}</span></div>
            <div className="mvp-rec-meta"><span>Reason</span><span>{r.reason}</span></div>
          </MVPCard>
        ))}
      </div>
    );
  }

  return (
    <div className="mvp-feed">
      <div className="mvp-rec-toprow">
        <div className="mvp-search-bar">
          {React.createElement(Icon.search, { s: 16 })}
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search records, labs, imaging…" />
        </div>
        <button className="mvp-add-med-btn" onClick={() => setShowUpload(v => !v)}>
          {showUpload ? "✕ Cancel" : "+ Upload"}
        </button>
      </div>

      {showUpload && (
        <div className="mvp-add-form">
          <h4 className="mvp-add-form-h">Upload Health Record</h4>
          <select className="mvp-checkin-input mvp-rec-select" value={upForm.cat} onChange={e => setUpForm(f=>({...f,cat:e.target.value}))}>
            <option value="">Select record type *</option>
            {MVP_REC_CATS.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
          </select>
          <input className="mvp-checkin-input" placeholder="Record name *" value={upForm.name} onChange={e => setUpForm(f=>({...f,name:e.target.value}))} />
          <input className="mvp-checkin-input" type="date" value={upForm.date} onChange={e => setUpForm(f=>({...f,date:e.target.value}))} />
          <input className="mvp-checkin-input" placeholder="Notes (optional)" value={upForm.notes} onChange={e => setUpForm(f=>({...f,notes:e.target.value}))} />
          <div className="mvp-rec-upload-drop">
            {React.createElement(Icon.upload, { s: 22 })}
            <span>Drag &amp; drop a file or <span className="mvp-rec-browse">browse</span></span>
            <span className="mvp-rec-types">PDF, JPG, PNG, DOCX — up to 25 MB</span>
          </div>
          <button className="mvp-btn-primary" onClick={() => { if(upForm.cat&&upForm.name){ setUpForm({cat:"",name:"",date:"",notes:""}); setShowUpload(false); } }}>Save Record</button>
        </div>
      )}

      <div className="mvp-rec-grid">
        {MVP_REC_CATS.filter(c => !q || c.label.toLowerCase().includes(q.toLowerCase())).map((c, i) => (
          <div key={i} className="mvp-rec-card" onClick={() => setOpenCat(c)}>
            {React.createElement(Icon.file, { s: 20 })}
            <strong>{c.label}</strong>
            <span>{c.count} records</span>
            <span className="mvp-rec-last">Last: {c.last}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const MVP_MOTIVATION = [
  { quote: "Taking small steps every day leads to lasting healthy habits.", tip: "Try drinking a glass of water first thing in the morning.", type: "Wellness Tip" },
  { quote: "Consistency is more powerful than intensity. Show up every day.", tip: "A 30-minute evening walk after dinner improves sleep quality.", type: "Health Insight" },
  { quote: "Sleep is not a luxury — it is a foundation of good health.", tip: "A consistent bedtime adds meaningful rest over time.", type: "Preventive Health" },
  { quote: "Small healthy choices add up to a lifetime of wellness.", tip: "Add more fresh fruits and vegetables to your daily meals.", type: "Seasonal Advice" },
  { quote: "Your health is an investment, not an expense.", tip: "Staying on top of your medications builds a strong foundation.", type: "Medication Reminder" },
];
const MVP_CHECKIN_MOODS = ["😊","😐","😔","😴"];
const MVP_CHECKIN_ENERGY = ["High","Moderate","Low"];
const MVP_CHECKIN_TREND = [
  { day: "Su", mood: "😊", energy: "High"     },
  { day: "Mo", mood: "😊", energy: "High"     },
  { day: "Tu", mood: "😐", energy: "Moderate" },
  { day: "We", mood: "😴", energy: "Low"      },
  { day: "Th", mood: "😊", energy: "Moderate" },
  { day: "Fr", mood: "😊", energy: "High"     },
  { day: "Sa", mood: null,  energy: null,  today: true },
];

const GOAL_SUGGESTIONS = {
  default: ["Drink 8 glasses of water daily","Walk 30 minutes, 5 days a week","Eat at least 5 servings of fruits and vegetables","Aim for 7–8 hours of sleep each night","Track your meals three times this week"],
  weight:  ["Drink 8 glasses of water daily","Walk 30 minutes, 5 days a week","Eat at least 5 servings of fruits and vegetables","Track calories three times this week"],
  sleep:   ["Set a consistent bedtime by 10:30 PM","Reduce screen time 1 hour before bed","Create a calming wind-down routine","Limit caffeine after 2:00 PM","Aim for 7–8 hours of uninterrupted sleep"],
  stress:  ["Practice 5-minute deep breathing daily","Take a 20-minute outdoor walk each day","Journal your thoughts before bed","Limit news consumption to 30 min/day","Maintain a consistent sleep schedule"],
  diabetes:["Take medications on time every day","Monitor blood sugar as directed","Walk 30 minutes after dinner","Reduce refined carbohydrates","Eat balanced meals at consistent times"],
};
function getGoalSuggestions(txt) {
  const t = txt.toLowerCase();
  if (/weight|fat|pound|lbs|slim/.test(t)) return GOAL_SUGGESTIONS.weight;
  if (/sleep|rest|tired|insomnia/.test(t)) return GOAL_SUGGESTIONS.sleep;
  if (/stress|anxi|calm|relax/.test(t)) return GOAL_SUGGESTIONS.stress;
  if (/diabet|sugar|glucose|a1c/.test(t)) return GOAL_SUGGESTIONS.diabetes;
  return GOAL_SUGGESTIONS.default;
}
function MVPWellnessGoals() {
  const init = MVP_GOALS.map(g => ({ ...g }));
  const [goals, setGoals] = React.useState(init);
  const [parentGoal] = React.useState("Lose 5 lbs");
  const [input, setInput] = React.useState("");
  const [showSugg, setShowSugg] = React.useState(false);
  const initSugg = getGoalSuggestions("lose 5 lbs");
  const [suggestions, setSuggestions] = React.useState(initSugg);
  const [selSug, setSelSug] = React.useState(new Set(initSugg.map((_, i) => i)));
  const [custom, setCustom] = React.useState("");
  const generate = () => { if (!input.trim()) return; setSuggestions(getGoalSuggestions(input)); setSelSug(new Set(getGoalSuggestions(input).map((_, i) => i))); };
  const acceptAll = () => {
    const toAdd = suggestions.filter((_, i) => selSug.has(i)).map((l, i) => ({ id: Date.now() + i, label: l, target: 7, completed: 0 }));
    setGoals(g => [...g, ...toAdd]);
    setSuggestions(null); setInput(""); setSelSug(new Set());
  };
  const addCustom = () => {
    if (!custom.trim()) return;
    setGoals(g => [...g, { id: Date.now(), label: custom.trim(), target: 7, completed: 0 }]);
    setCustom("");
  };
  const removeGoal = (id) => setGoals(g => g.filter(x => x.id !== id));
  const logDone = (id) => setGoals(g => g.map(x => x.id === id && x.completed < x.target ? { ...x, completed: x.completed + 1 } : x));
  const toggleSug = (i) => setSelSug(s => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; });
  return (
    <MVPCard className="mvp-wellness-card">
      <MVPSectionHead label="Weekly Wellness Goals" />
      {parentGoal && (
        <div className="mvp-parent-goal">
          <span className="mvp-parent-goal-eye">CURRENT GOAL</span>
          <strong className="mvp-parent-goal-v">{parentGoal}</strong>
          <span className="mvp-parent-goal-sub">AI-recommended habits below</span>
        </div>
      )}

      {goals.map(g => {
        const pct = Math.round(g.completed / g.target * 100);
        const done = g.completed >= g.target;
        return (
          <div key={g.id} className="mvp-goal-item">
            <div className="mvp-goal-top">
              <label className="mvp-goal-chk-row">
                <span className="mvp-goal-label">{g.label}</span>
              </label>
            </div>
            <div className="mvp-goal-track">
              <div className="mvp-gc-days">{["S","M","T","W","T","F","S"].map((d,ci)=><span key={ci}>{d}</span>)}</div>
              <div className="mvp-goal-checks">
                {Array.from({length: g.target}).map((_, ci) => (
                  <button key={ci}
                    className={"mvp-gc" + (ci < g.completed ? " on" : "")}
                    onClick={() => setGoals(gg => gg.map(x => x.id === g.id ? { ...x, completed: ci < x.completed ? ci : Math.min(x.target, ci+1) } : x))}
                    title={"Day " + (ci+1)} />
                ))}
              </div>
              <span className="mvp-gc-count">{g.completed}/7</span>
            </div>
            {done && <span className="mvp-goal-done">✅ Goal met this week!</span>}
          </div>
        );
      })}

      {/* Goal entry + AI suggestions */}
      {!suggestions ? (
        <div className="mvp-goal-entry">
          <input className="mvp-checkin-input" value={input} onChange={e => setInput(e.target.value)}
            placeholder="Enter a new health goal" onKeyDown={e => e.key === "Enter" && generate()} />
          <button className="mvp-btn-primary" onClick={generate}>✨ Get AI Suggestions</button>
        </div>
      ) : (
        <div className="mvp-sugg-section">
          <button className={"mvp-sugg-toggle" + (showSugg ? " open" : "")} onClick={() => setShowSugg(o => !o)}>
            ✨ AI-recommended habits for "{parentGoal}"
            <span className="mvp-sugg-chev">{showSugg ? "▲" : "▼"}</span>
          </button>
          {showSugg && (
            <div className="mvp-goal-sugg">
              {suggestions.map((s, i) => (
                <label key={i} className="mvp-sugg-row">
                  <input type="checkbox" checked={selSug.has(i)} onChange={() => toggleSug(i)} className="mvp-sugg-chk" />
                  <span>{s}</span>
                </label>
              ))}
              <div className="mvp-sugg-btns">
                <button className="mvp-btn-primary" onClick={acceptAll}>Accept Selected</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add your own habit — always visible */}
      <div className="mvp-goal-custom">
        <input className="mvp-checkin-input" value={custom} onChange={e => setCustom(e.target.value)}
          placeholder="+ Add your own habit" onKeyDown={e => e.key === "Enter" && addCustom()} />
        {custom.trim() && <button className="mvp-btn-sm" onClick={addCustom}>Add</button>}
      </div>
    </MVPCard>
  );
}
const MVP_NAV = [
  { id: "home",      label: "Home",      ic: "home"     },
  { id: "scheduler", label: "Scheduler", ic: "calendar" },
  { id: "community", label: "Community", ic: "users"    },
  { id: "records",   label: "Records",   ic: "file"     },
];

const CAT_COLOR = { Fitness: "#159385", Support: "#8478FF", Education: "#349CFF", Charity: "#FF9442", Wellness: "#FF628D" };
const MATCH_C   = { High: "#0ACF83", Medium: "#FF9442", Low: "#94A3B8" };

/* ---------- Shared mini components ---------- */
function MVPCard({ children, className = "" }) {
  return <div className={"mvp-card " + className}>{children}</div>;
}
function MVPSectionHead({ label, action, onAction }) {
  return (
    <div className="mvp-sh">
      <span className="mvp-sh-l">{label}</span>
      {action && <button className="mvp-sh-r" onClick={onAction}>{action} →</button>}
    </div>
  );
}
function MVPProgressBar({ pct }) {
  return (
    <span className="mvp-prog"><i style={{ width: pct + "%" }} /></span>
  );
}

/* ---------- Home screen ---------- */
function GreetCard({ today }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <MVPCard className="mvp-greet">
      <div className="mvp-greet-top">
        <div>
          <span className="mvp-greet-eye">FLOBRAIN // HEALTH</span>
          <h2 className="mvp-greet-name">Good morning, Claudia</h2>
          <span className="mvp-greet-date">{today}</span>
        </div>
        <div className="mvp-greet-menu-wrap" ref={ref}>
          <button className="mvp-greet-dots" onClick={() => setOpen(o => !o)}>⋯</button>
          {open && (
            <div className="mvp-greet-menu">
              <button className="mvp-greet-menu-item" onClick={() => setOpen(false)}>
                {React.createElement(Icon.pulse, { s: 15 })} Connect Device
              </button>
              <button className="mvp-greet-menu-item" onClick={() => setOpen(false)}>
                {React.createElement(Icon.lock, { s: 15 })} Privacy Settings
              </button>
              <button className="mvp-greet-menu-item" onClick={() => setOpen(false)}>
                {React.createElement(Icon.bolt, { s: 15 })} Share &amp; Sync
              </button>
            </div>
          )}
        </div>
      </div>
    </MVPCard>
  );
}
function MVPHomeScreen({ onNav }) {
  const today = "Saturday, June 28";
  const doneToday = H_MED_SCHEDULE.filter(d => d.taken).length;
  const total = H_MED_SCHEDULE.length;
  const [motIdx, setMotIdx] = React.useState(0);
  const mot = MVP_MOTIVATION[motIdx];
  const [mood, setMood] = React.useState(null);
  const [energy, setEnergy] = React.useState(null);
  const [intention, setIntention] = React.useState("");

  return (
    <div className="mvp-feed">
      {/* Greeting */}
      <GreetCard today={today} />

      {/* Medications today */}
      <MVPCard>
        <MVPSectionHead label="Today's Medications" action="View all" onAction={() => onNav("scheduler")} />
        <div className="mvp-med-summary">
          <span className="mvp-med-count">{doneToday} / {total}</span>
          <span className="mvp-med-label">doses taken today</span>
        </div>
        <MVPProgressBar pct={Math.round(doneToday / total * 100)} />
        <div className="mvp-med-list">
          {H_MED_SCHEDULE.map((d, i) => (
            <div key={i} className={"mvp-med-row" + (d.taken ? " done" : "")}>
              <span className="mvp-med-dot">{d.taken ? "✓" : "○"}</span>
              <span className="mvp-med-t">{d.t}</span>
              <span className="mvp-med-n">{d.m}</span>
            </div>
          ))}
        </div>
        <button className="mvp-btn-sm" onClick={() => onNav("scheduler")}>Log Dose</button>
      </MVPCard>

      {/* Wellness Goals */}
      <MVPWellnessGoals />

      {/* Daily Motivation */}
      <MVPCard className="mvp-mot-card">
        <MVPSectionHead label="Daily Motivation" />
        <span className="mvp-mot-type">{mot.type}</span>
        <p className="mvp-mot-quote">"{mot.quote}"</p>
        <div className="mvp-mot-tip">
          <span className="mvp-mot-tip-ic">💡</span>
          <span className="mvp-mot-tip-t">{mot.tip}</span>
        </div>
        <div className="mvp-mot-nav">
          <button className="mvp-mot-arr" onClick={() => setMotIdx(i => (i - 1 + MVP_MOTIVATION.length) % MVP_MOTIVATION.length)}>‹</button>
          <span className="mvp-mot-dots">{MVP_MOTIVATION.map((_, i) => <i key={i} className={"mvp-mot-dot" + (i === motIdx ? " on" : "")} />)}</span>
          <button className="mvp-mot-arr" onClick={() => setMotIdx(i => (i + 1) % MVP_MOTIVATION.length)}>›</button>
        </div>
      </MVPCard>

      {/* Daily Check-In */}
      <MVPCard className="mvp-checkin-card">
        <MVPSectionHead label="Daily Check-In" />
        <p className="mvp-checkin-q">How are you feeling today?</p>
        <div className="mvp-checkin-moods">
          {MVP_CHECKIN_MOODS.map(m => (
            <button key={m} className={"mvp-checkin-mood" + (mood === m ? " on" : "")} onClick={() => setMood(m)}>{m}</button>
          ))}
        </div>
        <p className="mvp-checkin-q">Energy Level</p>
        <div className="mvp-checkin-energy">
          {MVP_CHECKIN_ENERGY.map(e => (
            <button key={e} className={"mvp-checkin-en" + (energy === e ? " on" : "")} onClick={() => setEnergy(e)}>{e}</button>
          ))}
        </div>
        <p className="mvp-checkin-q">Today's Intention</p>
        <input className="mvp-checkin-input" value={intention} onChange={e => setIntention(e.target.value)} placeholder="e.g. Take a 20-minute walk." />
        <div className="mvp-ci-trend">
          <span className="mvp-ci-trend-h">7-Day Mood Trend</span>
          <div className="mvp-ci-trend-row">
            {MVP_CHECKIN_TREND.map((d, i) => (
              <div key={i} className={"mvp-ci-day" + (d.today ? " today" : "")}>
                <span className="mvp-ci-emoji">{d.mood || "·"}</span>
                <span className="mvp-ci-d">{d.day}</span>
              </div>
            ))}
          </div>
        </div>
      </MVPCard>

    </div>
  );
}

/* ---------- Scheduler screen (Meds + Appts combined) ---------- */
function MVPSchedulerScreen() {
  const [tab, setTab] = React.useState("meds"); // meds | appts
  return (
    <div className="mvp-feed">
      <div className="mvp-sched-tabs">
        <button className={"mvp-comm-tab" + (tab === "meds" ? " on" : "")} onClick={() => setTab("meds")}>Medications</button>
        <button className={"mvp-comm-tab" + (tab === "appts" ? " on" : "")} onClick={() => setTab("appts")}>Appointments</button>
      </div>
      {tab === "meds" ? <MVPMedsContent /> : <MVPApptsContent />}
    </div>
  );
}
function MVPMedsContent() {
  const [meds, setMeds] = React.useState(H_MED_SCHEDULE.map((d, i) => ({ ...d, id: i })));
  const [showForm, setShowForm] = React.useState(false);
  const [form, setForm] = React.useState({ name: "", dose: "", time: "", reminder: true });
  const addMed = () => {
    if (!form.name.trim() || !form.time.trim()) return;
    setMeds(m => [...m, { id: Date.now(), m: form.name.trim() + (form.dose ? " " + form.dose.trim() : ""), t: form.time.trim(), taken: false, reminder: form.reminder }]);
    setForm({ name: "", dose: "", time: "", reminder: true });
    setShowForm(false);
  };
  const logDose = (id) => setMeds(m => m.map(x => x.id === id ? { ...x, taken: !x.taken } : x));
  const doneCount = meds.filter(d => d.taken).length;
  return (
    <div className="mvp-feed">
      <MVPCard className="mvp-meds-hero">
        <div className="mvp-meds-top">
          <h3 className="mvp-sec-title">Today's Medication Schedule</h3>
          <button className="mvp-add-med-btn" onClick={() => setShowForm(s => !s)}>+ Add</button>
        </div>
        <span className="mvp-meds-count">{doneCount} of {meds.length} doses taken</span>

        {meds.map(d => (
          <div key={d.id} className={"mvp-sched-row" + (d.taken ? " done" : "")}>
            <button className={"mvp-sched-chk-btn" + (d.taken ? " on" : "")} onClick={() => logDone(d.id)}>{d.taken ? "✓" : "○"}</button>
            <div className="mvp-sched-info"><strong>{d.m}</strong><span>{d.t}</span></div>
            {d.reminder !== false && <span className="mvp-remind">{React.createElement(Icon.clock, { s: 12 })} Reminder Set</span>}
          </div>
        ))}

        {showForm && (
          <div className="mvp-add-form">
            <h4 className="mvp-add-form-h">Add Medication</h4>
            <input className="mvp-checkin-input" placeholder="Medication name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <input className="mvp-checkin-input" placeholder="Dosage (e.g. 10 mg)" value={form.dose} onChange={e => setForm(f => ({ ...f, dose: e.target.value }))} />
            <input className="mvp-checkin-input" type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
            <label className="mvp-remind-toggle">
              <span>Set Reminder</span>
              <button className={"mvp-toggle" + (form.reminder ? " on" : "")} onClick={() => setForm(f => ({ ...f, reminder: !f.reminder }))} />
            </label>
            <div className="mvp-add-form-btns">
              <button className="mvp-btn-primary" onClick={addMed}>Save Medication</button>
              <button className="mvp-btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        )}
      </MVPCard>

      <MVPCard>
        <h3 className="mvp-sec-title">My Medications &amp; Refills</h3>
        {H_MED_REFILLS.map((r, i) => (
          <div key={i} className="mvp-refill-row">
            <div className="mvp-refill-info"><strong>{r.m}</strong><span>{r.cond}</span></div>
            <div className="mvp-refill-right">
              <span className={"mvp-refill-d" + (r.low ? " low" : "")}>{r.low ? "⚠ " : ""}{r.d}</span>
              {r.se !== "None" && <span className="mvp-refill-se">{r.se}</span>}
            </div>
          </div>
        ))}
      </MVPCard>
    </div>
  );
}

/* ---------- Appointments screen ---------- */
function MVPApptsContent() {
  const [appts, setAppts] = React.useState([
    { id: 1, prov: "Dr. Sarah Chen", spec: "Cardiology", dt: "June 24, 2026 · 10:30 AM", loc: "FloHealth Medical Center, Suite 320" },
  ]);
  const [showForm, setShowForm] = React.useState(false);
  const [form, setForm] = React.useState({ prov: "", spec: "", date: "", time: "", loc: "", remind: true });
  const saveAppt = () => {
    if (!form.prov.trim() || !form.date) return;
    const dt = form.date + (form.time ? " · " + form.time : "");
    setAppts(a => [...a, { id: Date.now(), prov: form.prov, spec: form.spec, dt, loc: form.loc }]);
    setForm({ prov: "", spec: "", date: "", time: "", loc: "", remind: true });
    setShowForm(false);
  };
  return (
    <div className="mvp-feed">
      <div className="mvp-meds-top">
        <h3 className="mvp-sec-title">My Appointments</h3>
        <button className="mvp-add-med-btn" onClick={() => setShowForm(v => !v)}>
          {showForm ? "✕ Cancel" : "+ Add"}
        </button>
      </div>

      {showForm && (
        <div className="mvp-add-form">
          <h4 className="mvp-add-form-h">New Appointment</h4>
          <input className="mvp-checkin-input" placeholder="Provider name *" value={form.prov} onChange={e => setForm(f => ({ ...f, prov: e.target.value }))} />
          <input className="mvp-checkin-input" placeholder="Specialty (e.g. Cardiology)" value={form.spec} onChange={e => setForm(f => ({ ...f, spec: e.target.value }))} />
          <input className="mvp-checkin-input" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
          <input className="mvp-checkin-input" type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
          <input className="mvp-checkin-input" placeholder="Location / address" value={form.loc} onChange={e => setForm(f => ({ ...f, loc: e.target.value }))} />
          <label className="mvp-remind-toggle">
            <span>Set Reminder</span>
            <button className={"mvp-toggle" + (form.remind ? " on" : "")} onClick={() => setForm(f => ({ ...f, remind: !f.remind }))} />
          </label>
          <div className="mvp-add-form-btns">
            <button className="mvp-btn-primary" onClick={saveAppt}>Save Appointment</button>
          </div>
        </div>
      )}

      {appts.map((a, i) => (
        <MVPCard key={a.id} className="mvp-appt-primary">
          <span className="mvp-appt-eye">{i === 0 ? "UPCOMING APPOINTMENT" : "APPOINTMENT"}</span>
          <h3 className="mvp-appt-h3">{a.prov}</h3>
          {a.spec && <span className="mvp-spec-badge">{a.spec}</span>}
          <ul className="mvp-appt-meta-list">
            <li><span>Date &amp; Time</span><strong>{a.dt}</strong></li>
            {a.loc && <li><span>Location</span><strong>{a.loc}</strong></li>}
          </ul>
          <button className="mvp-btn-primary">View Details</button>
        </MVPCard>
      ))}

      <MVPCard>
        <h3 className="mvp-sec-title">Lab Work</h3>
        {[{n:"Lipid Panel",d:"June 22",s:"Scheduled"},{n:"A1C Test",d:"June 22",s:"Scheduled"},{n:"Vitamin D",d:"July 5",s:"Pending order"}].map((l,i)=>(
          <div key={i} className="mvp-lab-row">
            <span className="mvp-lab-n">{l.n}</span>
            <span className="mvp-lab-d">{l.d}</span>
            <span className={"mvp-lab-s" + (l.s==="Scheduled"?" on":"")}>{l.s}</span>
          </div>
        ))}
      </MVPCard>

      <MVPCard>
        <h3 className="mvp-sec-title">Follow-Ups</h3>
        {[{n:"Cardiology recheck",d:"Due July 24"},{n:"Primary care annual",d:"Due Aug 12"}].map((f,i)=>(
          <div key={i} className="mvp-lab-row">
            <span className="mvp-lab-n">{f.n}</span>
            <span className="mvp-lab-d">{f.d}</span>
            <span className="mvp-lab-s">Pending</span>
          </div>
        ))}
      </MVPCard>

      <MVPCard>
        <h3 className="mvp-sec-title">Visit Preparation</h3>
        {["Medication list","Questions for provider","Insurance card","Symptoms to discuss"].map((c,i)=>(
          <div key={i} className="mvp-prep-row"><span className="mvp-prep-box"/>{c}</div>
        ))}
      </MVPCard>
    </div>
  );
}

/* ---------- Community screen ---------- */
function MVPCommunityScreen() {
  const [catFilter, setCatFilter] = React.useState("All");
  const [tab, setTab] = React.useState("events");
  const [selectedEvent, setSelectedEvent] = React.useState(null);
  const cats = ["All", "Fitness", "Support", "Education", "Charity"];
  const events = catFilter === "All" ? MVP_COMMUNITY : MVP_COMMUNITY.filter(e => e.cat === catFilter);
  return (
    <div className="mvp-feed">
      <div className="mvp-comm-tabs">
        {[["events","Events"],["trials","Research & Trials"]].map(([id,lbl])=>(
          <button key={id} className={"mvp-comm-tab"+(tab===id?" on":"")} onClick={()=>setTab(id)}>{lbl}</button>
        ))}
      </div>

      {tab === "events" && (
        <React.Fragment>
          <div className="mvp-loc-row">{React.createElement(Icon.pulse,{s:14})} Miami, FL</div>
          <div className="mvp-cat-chips">
            {cats.map(c => <button key={c} className={"mvp-cat-chip"+(catFilter===c?" on":"")} onClick={()=>setCatFilter(c)}>{c}</button>)}
          </div>
          {selectedEvent ? (
            <MVPCard className="mvp-evt-detail">
              <button className="mvp-back-btn" onClick={() => setSelectedEvent(null)}>
                {React.createElement(Icon.chevRight, { s: 16 })} Back to Events
              </button>
              <div className="mvp-evt-top">
                <span className="mvp-evt-cat" style={{background:CAT_COLOR[selectedEvent.cat]+"22",color:CAT_COLOR[selectedEvent.cat]}}>{selectedEvent.cat}</span>
                <span className="mvp-evt-going">{selectedEvent.going} interested</span>
              </div>
              <strong className="mvp-evt-title">{selectedEvent.title}</strong>
              {selectedEvent.desc && <p className="mvp-evt-desc">{selectedEvent.desc}</p>}
              <div className="mvp-evt-detail-row"><span>Date</span><span>{selectedEvent.date}</span></div>
              <div className="mvp-evt-detail-row"><span>Time</span><span>{selectedEvent.time}</span></div>
              <div className="mvp-evt-detail-row"><span>Duration</span><span>{selectedEvent.duration}</span></div>
              <div className="mvp-evt-detail-row"><span>Location</span><span>{selectedEvent.loc}</span></div>
              <div className="mvp-evt-detail-row"><span>Organizer</span><span>{selectedEvent.organizer}</span></div>
              <div className="mvp-evt-detail-row"><span>Cost</span><span>{selectedEvent.cost}</span></div>
              <div className="mvp-evt-detail-row"><span>Target</span><span>{selectedEvent.target}</span></div>
              <button className="mvp-btn-primary">I'm Interested</button>
            </MVPCard>
          ) : events.map((e,i) => (
            <MVPCard key={i} className="mvp-evt-card" style={{cursor:"pointer"}} onClick={() => setSelectedEvent(e)}>
              <div className="mvp-evt-top">
                <span className="mvp-evt-cat" style={{background:CAT_COLOR[e.cat]+"22",color:CAT_COLOR[e.cat]}}>{e.cat}</span>
                <span className="mvp-evt-going">{e.going} going</span>
              </div>
              <strong className="mvp-evt-title">{e.title}</strong>
              <span className="mvp-evt-meta">{e.date} · {e.time}</span>
              <span className="mvp-evt-loc">{e.loc}</span>
              <button className="mvp-btn-sm" onClick={ev => { ev.stopPropagation(); setSelectedEvent(e); }}>View Details</button>
            </MVPCard>
          ))}
        </React.Fragment>
      )}

      {tab === "trials" && MVP_TRIALS.map((t,i) => (
        <MVPCard key={i}>
          <div className="mvp-trial-head">
            <span className="mvp-trial-match" style={{color:MATCH_C[t.match]}}>{t.match} match</span>
            <span className="mvp-trial-status">{t.status}</span>
          </div>
          <strong className="mvp-evt-title">{t.title}</strong>
          <span className="mvp-trial-org">{t.org}</span>
          <div className="mvp-trial-meta">
            <span>{t.cond}</span><span>{t.loc}</span>
          </div>
          <button className="mvp-btn-sm">Learn More</button>
        </MVPCard>
      ))}

      {tab === "goals" && (
        <React.Fragment>
          <p className="mvp-goals-intro">Build healthy habits. Track your progress daily.</p>
          {MVP_GOALS.map(g => (
            <MVPCard key={g.id}>
              <p className="mvp-goal-label">{g.label}</p>
              <MVPProgressBar pct={g.pct} />
              <div className="mvp-goal-foot">
                <span className="mvp-goal-pct">{g.pct}%</span>
                <span className="mvp-goal-streak">{g.streak}-day streak 🔥</span>
              </div>
            </MVPCard>
          ))}
          <button className="mvp-btn-primary">+ Add New Goal</button>
        </React.Fragment>
      )}
    </div>
  );
}

/* old MVPRecordsScreen replaced above */

/* ---------- Root: phone frame + bottom nav ---------- */
function HealthMVP({ onExit }) {
  const [activeTab, setActiveTab] = React.useState("home");
  const screens = {
    home:      <MVPHomeScreen onNav={setActiveTab} />,
    scheduler: <MVPSchedulerScreen />,
    community: <MVPCommunityScreen />,
    records:   <MVPRecordsScreen />,
  };
  return (
    <div className="health fade-up mvp-outer">
      <div className="mvp-phone">
        {/* Scrollable content */}
        <div className="mvp-content scroll">
          {screens[activeTab]}
        </div>
        {/* Bottom navigation */}
        <nav className="mvp-bnav">
          {MVP_NAV.map(n => (
            <button key={n.id} className={"mvp-bnav-item"+(activeTab===n.id?" on":"")} onClick={() => setActiveTab(n.id)}>
              {React.createElement(Icon[n.ic], { s: 22 })}
              <span>{n.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

window.HealthMVP = HealthMVP;
