/* ============================================================
   health.jsx — Health Monitor (wearables-connected dashboard)
   Aesthetic: solid teal scale (#2DD4BF · #0c3d37 · white).
   Sections: Connected Devices · customizable Today snapshot ·
   Current Vitals (core + advanced) · Recovery/Readiness ·
   Food + Hydration · Alerts · Tasks.
   ============================================================ */

const { useState, useEffect } = React;

/* ---------- data ---------- */
const H_DEVICES = [
  { name: "Apple Watch Series 9", sub: "Synced 2 min ago",  ic: "watch", batt: 82 },
  { name: "Garmin",               sub: "Synced 9 min ago",  ic: "watch", batt: 74 },
  { name: "WHOOP",                sub: "Synced 6 min ago",  ic: "ring",  batt: 51 },
  { name: "Smart Water Bottle",   sub: "Synced 4 min ago",  ic: "drop",  batt: 67 },
];

const H_SNAP = [
  { key: "sleep",    k: "Sleep",    v: "7h 24m", sub: "Score 88",      ic: "moon",  pct: 88, color: "#159385" },
  { key: "energy",   k: "Energy",   v: "76%",    sub: "High",          ic: "bolt",  pct: 76, color: "#1cb6a4" },
  { key: "mood",     k: "Mood",     v: "Calm",   sub: "Steady",        ic: "smile", pct: 72, color: "#2DD4BF" },
  { key: "hydration",k: "Hydration",v: "1.6 L",  sub: "of 2.5 L goal", ic: "drop",  pct: 64, color: "#11665d" },
  { key: "activity", k: "Activity", v: "8.6k",   sub: "42 min active", ic: "pulse", pct: 70, color: "#159385" },
];

const H_CORE = [
  { k: "Heart Rate",  v: "72",   unit: "bpm",   ic: "pulse",  trend: [70,72,69,74,71,73,72] },
  { k: "SpO₂",        v: "98",   unit: "%",     ic: "lungs",  trend: [97,97,98,98,97,98,98] },
  { k: "Respiratory", v: "16",   unit: "/min",  ic: "wind",   trend: [16,17,15,16,16,16,16] },
  { k: "Temperature", v: "36.6", unit: "°C",    ic: "thermo", trend: [36.5,36.6,36.6,36.7,36.6,36.6,36.6] },
];

const H_ADV = [
  { k: "HRV",     v: "64", unit: "ms",     ic: "pulse" },
  { k: "VO₂ Max", v: "42", unit: "mL/kg",  ic: "lungs" },
];

const H_READY = [
  { k: "HRV",               v: "64 ms",    pct: 80, status: "Good" },
  { k: "Resting HR",        v: "58 bpm",   pct: 78, status: "Good" },
  { k: "Sleep",             v: "7.4 h",    pct: 82, status: "Good" },
  { k: "Activity Load",     v: "Balanced", pct: 70, status: "Optimal" },
  { k: "Subjective Fatigue",v: "Low",      pct: 85, status: "Good" },
];

const H_MEALS = [
  { k: "Breakfast", t: "8:10 AM",  done: true },
  { k: "Lunch",     t: "1:00 PM",  done: true },
  { k: "Snack",     t: "4:30 PM",  done: true },
  { k: "Dinner",    t: "Pending",  done: false },
];
const H_GAPS = [
  { k: "Fiber",   status: "Low",        low: true },
  { k: "Iron",    status: "Low",        low: true },
  { k: "Protein", status: "On target",  low: false },
];

const H_ALERTS = [
  { sev: "warn", ic: "alertTri", txt: "Elevated resting HR trend over the last 3 days", tag: "Abnormal trend" },
  { sev: "med",  ic: "pill",     txt: "Missed dose — Magnesium (last night)",           tag: "Medication" },
  { sev: "info", ic: "stetho",   txt: "Provider: avoid high-intensity training until Jun 12", tag: "Restriction" },
];

const H_TASKS = [
  { k: "Upcoming appointment",       meta: "Dr. Liam Chen · Jun 12, 10:00 AM", ic: "calendar" },
  { k: "Vitamin D recheck",          meta: "Lab follow-up · due Jun 10",   ic: "flask" },
  { k: "Dr. Okafor — Cardiology",    meta: "Appointment · Today 2:30 PM",  ic: "calendar", soon: true },
  { k: "Lipid panel",                meta: "Lab follow-up · Jun 20",       ic: "flask" },
];

const H_BODYMETRICS = [
  { k: "Weight",      v: "165", unit: "lbs", ic: "scale", delta: "2 lbs",  dir: "up",   note: "vs last week" },
  { k: "BMI",         v: "24.2", unit: "",   ic: "gauge", status: "Normal",               note: "Healthy range" },
  { k: "Body Fat",    v: "29",  unit: "%",   ic: "data",  delta: "1.2%",  dir: "down", note: "vs last week" },
  { k: "Muscle Mass", v: "62",  unit: "lbs", ic: "bolt",  delta: "0.5 lb", dir: "up",   note: "vs last week" },
  { k: "Body Water",  v: "52",  unit: "%",   ic: "drop",  status: "Optimal",            note: "Well hydrated" },
  { k: "Lean Mass",   v: "118", unit: "lbs", ic: "pulse", delta: "0.8 lbs", dir: "up",  note: "vs last week" },
];

const ECG_PATH = "M0 22 H22 l3 0 l2 -4 l2 4 H38 l2 0 l1.5 3 l2 -18 l2 26 l2 -11 l2 1 H62 l2 0 l2 -4 l2 4 H86 l3 0 l1.5 3 l2 -18 l2 26 l2 -11 l2 1 H118 l2 -4 l2 4 H140 l1.5 3 l2 -18 l2 26 l2 -11 l2 1 H176 l2 -4 l2 4 H200";

/* ---------- helpers ---------- */
function buildLine(data, w, h, pad) {
  const min = Math.min(...data), max = Math.max(...data), span = (max - min) || 1;
  const ix = (w - pad * 2) / (data.length - 1);
  return data.map((d, i) => (i ? "L" : "M") + (pad + i * ix).toFixed(1) + " " + (h - pad - ((d - min) / span) * (h - pad * 2)).toFixed(1)).join(" ");
}
function MiniSpark({ data }) {
  const w = 72, h = 24, pad = 3;
  return (
    <svg className="h-spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <path d={buildLine(data, w, h, pad)} fill="none" stroke="#2DD4BF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HAvatar({ ini, size = 38 }) {
  return <span className="h-av" style={{ width: size, height: size, fontSize: size * .36 }}>{ini}</span>;
}

function HCard({ title, hint, ic, action, children, className = "", style, collapsible, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className={"h-card " + className + (collapsible && !open ? " is-collapsed" : "")} style={style}>
      {title && (
        <header className={"h-card-h" + (collapsible ? " h-card-toggle" : "")}
          onClick={collapsible ? () => setOpen(o => !o) : undefined}>
          {ic && <span className="h-card-ic">{React.createElement(Icon[ic], { s: 17 })}</span>}
          <h3>{title}</h3>
          {hint && <span className="h-card-hint">{hint}</span>}
          {action && <span className="h-card-action">{action}</span>}
          {collapsible && <span className={"h-card-chev" + (open ? " open" : "")}>{React.createElement(Icon.chevDown, { s: 17 })}</span>}
        </header>
      )}
      {(!collapsible || open) && children}
    </section>
  );
}

/* ---------- header + devices ---------- */
function HHeader() {
  return (
    <header className="h-head">
      <div className="h-head-l">
        <HAvatar ini="CL" size={48} />
        <div>
          <h1 className="h-name">Claudia Lopez</h1>
          <p className="h-meta">HEALTH MONITOR · FL-2048 &nbsp;·&nbsp; <span className="h-live"><i />3 devices connected</span></p>
        </div>
      </div>
      <div className="h-head-r">
        <span className="h-date">{React.createElement(Icon.calendar, { s: 16 })} Fri, Jun 5</span>
        <button className="h-btn h-btn-ghost">{React.createElement(Icon.plus, { s: 15 })} Add device</button>
      </div>
    </header>
  );
}

function HDevices() {
  return (
    <div className="h-devices">
      {H_DEVICES.map((d, i) => (
        <div key={i} className="h-device">
          <span className="h-device-ic">{React.createElement(Icon[d.ic], { s: 20 })}</span>
          <div className="h-device-body">
            <strong>{d.name}</strong>
            <span className="h-device-sync"><i className="h-syncdot" />{d.sub}</span>
          </div>
          {d.batt != null && (
            <span className="h-device-batt">{React.createElement(Icon.battery, { s: 18 })}{d.batt}%</span>
          )}
        </div>
      ))}
    </div>
  );
}

/* ---------- customizable Today snapshot ---------- */
function Snapshot() {
  const allKeys = H_SNAP.map(s => s.key);
  const [vis, setVis] = useState(() => {
    try { const r = JSON.parse(localStorage.getItem("fl_health_snap")); if (Array.isArray(r)) return r; } catch (e) {}
    return allKeys;
  });
  const [editing, setEditing] = useState(false);
  const [period, setPeriod] = useState("Today");
  useEffect(() => { try { localStorage.setItem("fl_health_snap", JSON.stringify(vis)); } catch (e) {} }, [vis]);
  const toggle = (k) => setVis(v => v.includes(k) ? v.filter(x => x !== k) : [...allKeys.filter(a => v.includes(a) || a === k)]);
  const shown = H_SNAP.filter(s => vis.includes(s.key));
  const hidden = H_SNAP.filter(s => !vis.includes(s.key));

  const PERIODS = ["Today", "Weekly", "Monthly"];
  const TITLE = { Today: ["Today", "· Daily Snapshot"], Weekly: ["This Week", "· Weekly Snapshot"], Monthly: ["This Month", "· Monthly Snapshot"] };
  const [lead, tail] = TITLE[period];

  return (
    <section className="h-snap-section">
      <div className="h-snap-head">
        <span className="h-snap-title">{lead} <em>{tail}</em></span>
        <div className="h-snap-controls">
          <div className="h-snap-seg">
            {PERIODS.map(p => (
              <button key={p} className={period === p ? "on" : ""} onClick={() => setPeriod(p)}>{p}</button>
            ))}
          </div>
          <button className={"h-customize" + (editing ? " on" : "")} onClick={() => setEditing(e => !e)}>
            {React.createElement(Icon.sliders, { s: 15 })} {editing ? "Done" : "Customize"}
          </button>
        </div>
      </div>
      <div className="h-snap-grid">
        {shown.map(s => (
          <div key={s.key} className={"h-snap" + (editing ? " is-editing" : "")} style={{ "--sc": s.color }}>
            {editing && (
              <button className="h-snap-hide" title="Hide" onClick={() => toggle(s.key)}>
                {React.createElement(Icon.close, { s: 12 })}
              </button>
            )}
            <div className="h-snap-ring" style={{ background: `conic-gradient(var(--sc) ${s.pct * 3.6}deg, var(--t-100) 0)` }}>
              <span className="h-snap-ic">{React.createElement(Icon[s.ic], { s: 18 })}</span>
            </div>
            <div className="h-snap-body">
              <span className="h-snap-k">{s.k}</span>
              <strong className="h-snap-v">{s.v}</strong>
              <span className="h-snap-sub">{s.sub}</span>
            </div>
          </div>
        ))}
        {editing && hidden.map(s => (
          <button key={s.key} className="h-snap-add" onClick={() => toggle(s.key)}>
            {React.createElement(Icon.plus, { s: 15 })}
            <span>{s.k}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

/* ---------- current vitals (core + advanced) ---------- */
function Vitals() {
  return (
    <HCard title="Current Vitals" ic="pulse" className="h-vitals-card"
      action={
        <span className="h-vitals-src">
          <span className="h-source">{React.createElement(Icon.watch, { s: 14 })} Apple Watch</span>
          <button className="h-switch-dev">{React.createElement(Icon.link, { s: 13 })} Switch device</button>
        </span>
      }>
      <div className="h-vgroup-label">Core Vitals</div>
      <div className="h-core">
        {H_CORE.map(v => (
          <div key={v.k} className="h-core-stat">
            <span className="h-core-ic">{React.createElement(Icon[v.ic], { s: 17 })}</span>
            <div className="h-core-val"><strong>{v.v}</strong><span>{v.unit}</span></div>
            <span className="h-core-k">{v.k}</span>
            <MiniSpark data={v.trend} />
          </div>
        ))}
      </div>
      <div className="h-vgroup-label">Advanced Health Metrics</div>
      <div className="h-adv">
        {H_ADV.map(v => (
          <div key={v.k} className="h-adv-stat">
            <span className="h-core-ic">{React.createElement(Icon[v.ic], { s: 16 })}</span>
            <div><span className="h-core-k">{v.k}</span><div className="h-core-val"><strong>{v.v}</strong><span>{v.unit}</span></div></div>
          </div>
        ))}
        <div className="h-ecg">
          <div className="h-ecg-top"><span className="h-core-k">ECG</span><span className="h-ecg-tag">Sinus rhythm</span></div>
          <svg className="h-ecg-wave" viewBox="0 0 200 44" preserveAspectRatio="none">
            <path d={ECG_PATH} fill="none" stroke="#159385" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </HCard>
  );
}

/* ---------- recovery / readiness ---------- */
function Readiness() {
  const score = 82, r = 50, c = 2 * Math.PI * r, off = c * (1 - score / 100);
  return (
    <HCard title="Recovery / Readiness" ic="heart" hint="today" collapsible className="h-r2">
      <div className="h-ready-top">
        <div className="h-ring">
          <svg viewBox="0 0 120 120">
            <circle className="h-ring-track" cx="60" cy="60" r={r} fill="none" stroke="#e3efec" strokeWidth="11" />
            <circle cx="60" cy="60" r={r} fill="none" stroke="#2DD4BF" strokeWidth="11" strokeLinecap="round"
              strokeDasharray={c} strokeDashoffset={off} transform="rotate(-90 60 60)" />
          </svg>
          <div className="h-ring-mid"><strong>{score}</strong><span>READY</span></div>
        </div>
        <div className="h-ready-tag">Primed to perform<em>Recovery is high — a good day for moderate training.</em></div>
      </div>
      <ul className="h-ready-list">
        {H_READY.map(f => (
          <li key={f.k}>
            <span className="h-ready-k">{f.k}</span>
            <span className="h-ready-bar"><i style={{ width: f.pct + "%" }} /></span>
            <b>{f.v}</b>
          </li>
        ))}
      </ul>
    </HCard>
  );
}

/* ---------- food + hydration ---------- */
function Food() {
  const water = 1.6, goal = 2.5, pct = Math.round(water / goal * 100);
  return (
    <HCard title="Food + Hydration" ic="drop" hint="today" className="h-food-card">
      <div className="h-water">
        <div className="h-water-bar"><i style={{ width: pct + "%" }} /></div>
        <div className="h-water-meta"><strong>{water} L</strong><span>of {goal} L · {pct}%</span></div>
      </div>
      <div className="h-vgroup-label">Meal pattern</div>
      <ul className="h-meals">
        {H_MEALS.map((m, i) => (
          <li key={i} className={"h-meal" + (m.done ? " done" : "")}>
            <span className="h-meal-dot">{m.done && React.createElement(Icon.check, { s: 11 })}</span>
            <span className="h-meal-k">{m.k}</span>
            <span className="h-meal-t">{m.t}</span>
          </li>
        ))}
      </ul>
      <div className="h-vgroup-label">Nutrition gaps</div>
      <div className="h-gaps">
        {H_GAPS.map((g, i) => (
          <span key={i} className={"h-gap" + (g.low ? " low" : "")}>{g.k} · {g.status}</span>
        ))}
      </div>
    </HCard>
  );
}

/* ---------- alerts ---------- */
function Alerts() {
  return (
    <HCard title="Alerts" ic="alertTri" hint="3 active" collapsible className="h-r2">
      <ul className="h-alerts">
        {H_ALERTS.map((a, i) => (
          <li key={i} className={"h-alert sev-" + a.sev}>
            <span className="h-alert-ic">{React.createElement(Icon[a.ic], { s: 17 })}</span>
            <div className="h-alert-body">
              <span className="h-alert-tag">{a.tag}</span>
              <p>{a.txt}</p>
            </div>
          </li>
        ))}
      </ul>
    </HCard>
  );
}

/* ---------- tasks ---------- */
function Tasks() {
  const [done, setDone] = useState({});
  return (
    <HCard title="Tasks" ic="check" hint="follow-ups · reminders" collapsible className="h-r2">
      <ul className="h-tasks">
        {H_TASKS.map((t, i) => (
          <li key={i} className={"h-task" + (done[i] ? " is-done" : "")}>
            <button className="h-task-check" onClick={() => setDone(d => ({ ...d, [i]: !d[i] }))}>
              {done[i] && React.createElement(Icon.check, { s: 13 })}
            </button>
            <span className="h-task-ic">{React.createElement(Icon[t.ic], { s: 16 })}</span>
            <div className="h-task-body">
              <strong>{t.k}</strong>
              <span>{t.meta}</span>
            </div>
            {t.soon && <span className="h-soon">SOON</span>}
          </li>
        ))}
      </ul>
    </HCard>
  );
}

/* ---------- left sub-nav ---------- */
function HNav({ active, onNav }) {
  return (
    <nav className="h-nav">
      <button className={"h-nav-user" + (active === "profile" ? " on" : "")} onClick={() => onNav("profile")} title="View profile">
        <HAvatar ini="CL" size={36} />
        <div className="h-nav-user-t">
          <strong>Claudia Lopez</strong>
          <span>FL-2048</span>
        </div>
        <span className="h-nav-user-chev">{React.createElement(Icon.chevDown, { s: 16 })}</span>
      </button>
      <div className="h-nav-list">
        {H_NAV.map(n => (
          <button key={n.key} className={"h-navitem" + (active === n.key ? " on" : "")} onClick={() => onNav(n.key)}>
            <span className="h-navic">{React.createElement(Icon[n.ic], { s: 17 })}</span>
            <span>{n.label}</span>
          </button>
        ))}
      </div>
      <div className="h-nav-foot"><span className="h-live"><i />3 devices connected</span></div>
    </nav>
  );
}

/* ---------- tiles / groups (render only listed labels) ---------- */
function Tile({ label, wide }) {
  return (
    <button className={"h-tile" + (wide ? " h-tile-wide" : "")}>
      <span className="h-tile-dot" />
      <span className="h-tile-label">{label}</span>
      <span className="h-tile-arrow">→</span>
    </button>
  );
}
function TileGrid({ items }) {
  return <div className="h-tilegrid">{items.map(it => <Tile key={it} label={it} />)}</div>;
}
function AddTile({ label }) {
  return (
    <button className="h-tile h-tile-add">
      <span className="h-tile-plus">{React.createElement(Icon.plus, { s: 16 })}</span>
      <span className="h-tile-label">{label}</span>
    </button>
  );
}
function GroupedView({ groups }) {
  return (
    <div className="h-groups">
      {groups.map(grp => grp.items ? (
        <section key={grp.g} className="h-group">
          <h4 className="h-group-h">{grp.g}<em>{grp.items.length}</em></h4>
          <div className="h-tilegrid">
            {grp.items.map(it => <Tile key={it} label={it} />)}
            {grp.add && <AddTile label={grp.add} />}
          </div>
        </section>
      ) : (
        <Tile key={grp.g} label={grp.g} wide />
      ))}
    </div>
  );
}
const H_MED_SCHEDULE = [
  { t: "8:00 AM", m: "Lisinopril 10 mg", taken: true },
  { t: "1:00 PM", m: "Vitamin D 1000 IU", taken: true },
  { t: "8:00 PM", m: "Metformin 500 mg", taken: false },
];
const H_MED_REFILLS = [
  { m: "Lisinopril 10 mg", cond: "High Blood Pressure", d: "12 days", low: false, se: "None" },
  { m: "Metformin 500 mg", cond: "Type 2 Diabetes", d: "5 days", low: true, se: "Mild dizziness" },
  { m: "Vitamin D 1000 IU", cond: "Supplement", d: "18 days", low: false, se: "None" },
];
function PlannerView() {
  const [schedOpen, setSchedOpen] = useState(true);
  const [medOpen, setMedOpen] = useState(true);
  const [apptOpen, setApptOpen] = useState(true);
  return (
    <div className="h-planner">
      <button className={"h-plan-toggle h-plan-toggle-solo" + (schedOpen ? " is-open" : "")} onClick={() => setSchedOpen(o => !o)}>
        Today's Medication Schedule<span className="h-plan-chev">{React.createElement(Icon.chevDown, { s: 16 })}</span>
      </button>
      {schedOpen && (
      <section className="h-med-hero">
        <div className="h-med-sched">
          {H_MED_SCHEDULE.map((d, i) => (
            <div key={i} className={"h-med-row" + (d.taken ? " is-taken" : "")}>
              <span className="h-med-check">{d.taken ? "✓" : "○"}</span>
              <span className="h-med-time">{d.t}</span>
              <span className="h-med-name">{d.m}</span>
              <span className="h-med-remind">{React.createElement(Icon.clock, { s: 13 })} Reminder Set</span>
            </div>
          ))}
        </div>
        <button className="h-med-log">Log Dose</button>
      </section>
      )}

      <div className="h-plan-sechead">
        <button className={"h-plan-toggle" + (medOpen ? " is-open" : "")} onClick={() => setMedOpen(o => !o)}>
          My Medications Refills<span className="h-plan-chev">{React.createElement(Icon.chevDown, { s: 16 })}</span>
        </button>
        {medOpen && <button className="h-med-viewall">View All →</button>}
      </div>
      {medOpen && (
      <section className="h-med-card">
        <div className="h-medtable">
          <div className="h-medtable-row h-medtable-head">
            <span>Active Medication</span><span>Refill in</span>
            <span>Side Effects</span><span>Reminders</span>
          </div>
          {H_MED_REFILLS.map((r, i) => (
            <div className="h-medtable-row" key={i}>
              <span className="h-medt-med"><b>{r.m}</b><em>{r.cond}</em></span>
              <span className={"h-medt-refill" + (r.low ? " low" : "")}>{r.low ? "⚠ " : ""}{r.d}</span>
              <span className="h-medt-se">{r.se === "None" ? <button className="h-med-report">+ Report</button> : r.se}</span>
              <span className="h-med-remind">{React.createElement(Icon.clock, { s: 13 })} Reminder Set</span>
            </div>
          ))}
        </div>
      </section>
      )}

      <button className={"h-plan-toggle h-plan-toggle-solo" + (apptOpen ? " is-open" : "")} onClick={() => setApptOpen(o => !o)}>
        My Scheduled Appointments<span className="h-plan-chev">{React.createElement(Icon.chevDown, { s: 16 })}</span>
      </button>
      {apptOpen && <ApptSection />}

      <GroupedView groups={H_GROUPS.planner} />
    </div>
  );
}
function ApptSection() {
  return (
    <div className="h-appt">
      <div className="h-appt-grid">
        <section className="h-appt-card h-appt-primary">
          <span className="h-appt-eyebrow">Upcoming Appointment</span>
          <h4 className="h-appt-prov">Dr. Sarah Chen</h4>
          <span className="h-appt-spec">Cardiology</span>
          <ul className="h-appt-meta">
            <li><span>Date &amp; Time</span><strong>June 24, 2026 · 10:30 AM</strong></li>
            <li><span>Location</span><strong>FloHealth Medical Center, Suite 320</strong></li>
          </ul>
          <button className="h-appt-btn">View Details</button>
        </section>

        <section className="h-appt-card">
          <h4 className="h-appt-card-h">Calendar</h4>
          <ApptMiniCal />
          <div className="h-appt-legend">
            <span><i className="h-appt-dot appt" />Appointment</span>
            <span><i className="h-appt-dot lab" />Lab</span>
          </div>
        </section>

        <section className="h-appt-card">
          <h4 className="h-appt-card-h">Lab Work</h4>
          <ul className="h-appt-list">
            {[
              { n: "Lipid Panel", d: "June 22", s: "Scheduled" },
              { n: "A1C Test", d: "June 22", s: "Scheduled" },
              { n: "Vitamin D", d: "July 5", s: "Pending order" },
            ].map((l, i) => (
              <li key={i}><span className="h-appt-li-n">{l.n}</span><span className="h-appt-li-d">{l.d}</span><span className={"h-appt-li-s" + (l.s === "Scheduled" ? " on" : "")}>{l.s}</span></li>
            ))}
          </ul>
          <h4 className="h-appt-card-h h-appt-subh">Follow-Ups</h4>
          <ul className="h-appt-list">
            {[
              { n: "Cardiology recheck", d: "Due July 24", s: "Pending" },
              { n: "Primary care annual", d: "Due Aug 12", s: "Pending" },
            ].map((f, i) => (
              <li key={i}><span className="h-appt-li-n">{f.n}</span><span className="h-appt-li-d">{f.d}</span><span className="h-appt-li-s">{f.s}</span></li>
            ))}
          </ul>
        </section>

        <section className="h-appt-card">
          <h4 className="h-appt-card-h">Visit Preparation</h4>
          <ul className="h-appt-checks">
            {["Medication list", "Questions for provider", "Insurance card", "Symptoms to discuss"].map(c => (
              <li key={c}><span className="h-appt-box" />{c}</li>
            ))}
          </ul>
        </section>

        <section className="h-appt-card">
          <h4 className="h-appt-card-h">After Visit Summary</h4>
          <span className="h-appt-sub">Most recent visit · June 10, 2026</span>
          <div className="h-appt-avs">
            <span className="h-appt-avs-cap">Provider</span>
            <span className="h-appt-avs-v">Dr. James Patel · Primary Care</span>
          </div>
          <div className="h-appt-avs">
            <span className="h-appt-avs-cap">Key Recommendations</span>
            <span className="h-appt-avs-v">Continue current medications; increase daily activity.</span>
          </div>
          <div className="h-appt-avs">
            <span className="h-appt-avs-cap">Next Steps</span>
            <span className="h-appt-avs-v">Schedule lab work before next visit.</span>
          </div>
          <button className="h-appt-link">View Summary →</button>
        </section>
      </div>
    </div>
  );
}
function ApptMiniCal() {
  const days = []; const firstDow = 0; // June 2026 starts Mon=1; keep simple grid
  const start = new Date(2026, 5, 1).getDay();
  for (let i = 0; i < start; i++) days.push(null);
  for (let d = 1; d <= 30; d++) days.push(d);
  const appt = [24]; const lab = [22]; const today = 20;
  return (
    <div className="h-appt-cal">
      <div className="h-appt-cal-h">June 2026</div>
      <div className="h-appt-cal-wd">{["S","M","T","W","T","F","S"].map((d, i) => <span key={i}>{d}</span>)}</div>
      <div className="h-appt-cal-grid">
        {days.map((d, i) => (
          <span key={i} className={"h-appt-cal-d" + (d === today ? " today" : "") + (appt.includes(d) ? " appt" : "") + (lab.includes(d) ? " lab" : "")}>{d || ""}</span>
        ))}
      </div>
    </div>
  );
}
const H_WELLNESS_SUMMARY = [
  { k: "Overall Wellness Score", v: "Good" },
  { k: "Sleep", v: "Improving" },
  { k: "Activity", v: "On Track" },
  { k: "Hydration", v: "Below Goal" },
  { k: "Recovery", v: "Moderate" },
];
const H_CHANGES_DETECTED = [
  { dir: "up", label: "Sleep", val: "+45 min/night" },
  { dir: "down", label: "Body Fat", val: "-1.2%" },
  { dir: "up", label: "Weight", val: "+2 lbs" },
  { dir: "down", label: "Hydration", val: "-10%" },
];
const H_CONTRIBUTORS = [
  "Later bedtimes",
  "Reduced water intake",
  "Increased activity",
  "Missed medication reminders",
];
const H_RECOMMENDED = [
  "Drink 16 oz water",
  "Take evening walk",
  "Maintain bedtime routine",
  "Review medication schedule",
];
function WellnessSummary({ rest }) {
  const [open, setOpen] = useState(false);
  const restTiles = rest.filter(x => x !== "Changes Detected" && x !== "Possible Contributors" && x !== "Recommended Actions" && x !== "Provider Questions");
  return (
    <section className="h-group">
      <button className={"h-group-h wsum-toggle" + (open ? " is-open" : "")} onClick={() => setOpen(o => !o)}>
        Wellness Summary<em>{rest.length + 1}</em>
        <span className="wsum-chev">{React.createElement(Icon.chevDown, { s: 16 })}</span>
      </button>
      {open && (
      <div className="wsum-body">
      <div className="wsum-card">
        <h3 className="wsum-title">Current Health Status</h3>
        <ul className="wsum-list">
          {H_WELLNESS_SUMMARY.map(r => (
            <li className="wsum-row" key={r.k}>
              <span className="wsum-k">{r.k}</span>
              <span className="wsum-v">{r.v}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="wsum-row2">
        <div className="wsum-card">
          <h3 className="wsum-title">Changes Detected</h3>
          <ul className="wsum-list">
            {H_CHANGES_DETECTED.map(c => (
              <li className="wsum-row" key={c.label}>
                <span className="wsum-k">
                  <span className={"wsum-arrow wsum-" + c.dir}>{c.dir === "up" ? "↑" : "↓"}</span>
                  {c.label}
                </span>
                <span className="wsum-v">{c.val}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="wsum-card">
          <h3 className="wsum-title">Possible Contributors</h3>
          <ul className="wsum-bullets">
            {H_CONTRIBUTORS.map(c => <li key={c}>{c}</li>)}
          </ul>
        </div>
      </div>
      <div className="wsum-card">
        <h3 className="wsum-title">Recommended Actions</h3>
        <ul className="wsum-checks">
          {H_RECOMMENDED.map(a => (
            <li className="wsum-check" key={a}><span className="wsum-box" />{a}</li>
          ))}
        </ul>
      </div>
      {restTiles.length > 0 && <TileGrid items={restTiles} />}
      </div>
      )}
    </section>
  );
}
const H_STORYBOOK_CATS = ["All", "Timeline", "Lab Changes", "Behavior Patterns", "Wins", "Warning Flags"];
const H_STORIES = [
  { date: "Jun 15, 2026", cat: "Wins", title: "Sleep crossed 7-hour average",
    baseline: "Averaging 6h 5m/night over the prior month.", change: "7-night average rose to 7h 2m (+45 min/night).",
    context: "Consistent 10:30 PM bedtime and reduced evening screen time.", action: "Kept the wind-down routine and logged sleep nightly.",
    outcome: "Morning energy and recovery scores improved.", flag: "No provider action needed." },
  { date: "Jun 10, 2026", cat: "Wins", title: "30-day medication adherence streak",
    baseline: "Missed 1–2 doses most weeks.", change: "30 consecutive days with every dose logged on time.",
    context: "Enabled evening medication reminders.", action: "Kept reminders on and confirmed each dose.",
    outcome: "Steadier symptom control through the month.", flag: "Mention streak at next visit." },
  { date: "Jun 3, 2026", cat: "Wins", title: "Reached hydration goal 7 days in a row",
    baseline: "Hitting the 2.6 L goal ~3 days/week.", change: "7 straight days at or above goal.",
    context: "Smart Water Bottle syncs and midday reminders.", action: "Continue midday hydration prompts.",
    outcome: "Energy and recovery trending up.", flag: "No provider action needed." },
  { date: "May 22, 2026", cat: "Wins", title: "Weight down 5 lbs from baseline",
    baseline: "Baseline weight 170 lbs.", change: "Smart Scale trend now 165 lbs (-5 lbs).",
    context: "Increased activity and consistent routines.", action: "Maintain current activity and nutrition plan.",
    outcome: "Lean mass held steady through the change.", flag: "Share trend at next physical." },
  { date: "May 10, 2026", cat: "Wins", title: "10,000 steps for 14 consecutive days",
    baseline: "Averaging ~6,400 steps/day.", change: "14 straight days at 10,000+ steps.",
    context: "Added morning and evening walks.", action: "Keep the daily walk habit.",
    outcome: "Activity consistently On Track.", flag: "No provider action needed." },
  { date: "Jun 12, 2026", cat: "Lab Changes", title: "Body fat down 1.2%",
    baseline: "Body fat steady at 30.4% for 6 weeks.", change: "Smart Scale 7-reading trend dropped to 29.2% (-1.2%).",
    context: "Increased activity and improved protein intake.", action: "Continue current activity plan.",
    outcome: "Lean mass held steady while fat decreased.", flag: "Share trend at next physical." },
  { date: "May 28, 2026", cat: "Lab Changes", title: "Muscle mass increased 0.4 lbs",
    baseline: "Muscle mass flat at 61.6 lbs.", change: "Smart Scale trend up to 62.0 lbs (+0.4 lbs).",
    context: "Added strength sessions twice weekly.", action: "Maintain strength routine.",
    outcome: "Gradual lean-mass gain confirmed.", flag: "No provider action needed." },
  { date: "May 14, 2026", cat: "Lab Changes", title: "A1C improved 7.2 → 6.8",
    baseline: "Last A1C 7.2%.", change: "New result 6.8% (-0.4).",
    context: "Better medication adherence and diet changes.", action: "Continue current management plan.",
    outcome: "Moving toward target range.", flag: "Confirm trend with provider." },
  { date: "Apr 30, 2026", cat: "Lab Changes", title: "Vitamin D returned to normal range",
    baseline: "Vitamin D low at 24 ng/mL.", change: "Repeat test now 38 ng/mL (normal).",
    context: "Daily supplement and more outdoor time.", action: "Maintain supplement routine.",
    outcome: "Levels normalized.", flag: "No provider action needed." },
  { date: "Jun 8, 2026", cat: "Behavior Patterns", title: "Higher activity levels on weekdays",
    baseline: "Activity even across the week.", change: "Weekday steps now ~30% higher than weekends.",
    context: "Commute and walking meetings on weekdays.", action: "Add weekend movement to balance.",
    outcome: "Pattern identified.", flag: "No provider action needed." },
  { date: "May 25, 2026", cat: "Behavior Patterns", title: "Sleep improves when bedtime is before 10 PM",
    baseline: "Variable bedtimes, mixed sleep quality.", change: "Nights before 10 PM average +35 min sleep.",
    context: "Earlier wind-down on those nights.", action: "Target a pre-10 PM bedtime.",
    outcome: "Clear link between bedtime and quality.", flag: "No provider action needed." },
  { date: "May 12, 2026", cat: "Behavior Patterns", title: "Hydration decreases on weekends",
    baseline: "Weekday hydration at goal.", change: "Weekend intake drops ~15% below goal.",
    context: "Routine disruption on weekends.", action: "Set weekend hydration reminders.",
    outcome: "Pattern identified; adjustment in progress.", flag: "No provider action needed." },
  { date: "Apr 20, 2026", cat: "Behavior Patterns", title: "Energy levels correlate with sleep duration",
    baseline: "Energy fluctuating day to day.", change: "Higher self-reported energy after 7h+ sleep nights.",
    context: "Tracked energy against nightly sleep.", action: "Prioritize consistent 7h+ sleep.",
    outcome: "Strong correlation observed.", flag: "No provider action needed." },
  { date: "Jun 17, 2026", cat: "Warning Flags", title: "Hydration below target for 5 days",
    baseline: "Typically hitting 2.6 L/day.", change: "5 consecutive days below the daily goal.",
    context: "Busier schedule, fewer water-bottle syncs logged.", action: "Set midday hydration reminders.",
    outcome: "Monitoring — not yet back to goal.", flag: "Flag if it persists another week." },
  { date: "Jun 2, 2026", cat: "Warning Flags", title: "Sleep quality declining",
    baseline: "Sleep quality steady the prior month.", change: "Quality score trending down over 7 nights.",
    context: "Later bedtimes and more screen time.", action: "Restore consistent wind-down routine.",
    outcome: "Watching for recovery.", flag: "Flag if decline continues." },
  { date: "May 18, 2026", cat: "Warning Flags", title: "Missed medication reminders",
    baseline: "Consistent on-time dosing.", change: "3 missed reminders in one week.",
    context: "Schedule disruptions and travel.", action: "Re-enable and confirm evening reminders.",
    outcome: "Adherence being re-established.", flag: "Mention at next visit if it recurs." },
  { date: "May 5, 2026", cat: "Warning Flags", title: "Activity levels trending downward",
    baseline: "Averaging ~9,000 steps/day.", change: "7-day average fell to ~6,200 steps/day.",
    context: "Fewer walks and busier work days.", action: "Re-add daily walk blocks.",
    outcome: "Monitoring — working to reverse.", flag: "Flag if downward trend persists." },
  { date: "May 28, 2026", cat: "Timeline", title: "Started evening walk habit",
    baseline: "Sedentary evenings, ~3,200 steps/day.", change: "Added a 25-minute evening walk, 5,900 steps/day.",
    context: "New routine after dinner.", action: "Logged walks to the activity tracker.",
    outcome: "Activity now consistently On Track.", flag: "No provider action needed." },
];
const H_TIMELINE = [
  { date: "June 15, 2026", month: "June 2026", cat: "Wins", title: "Sleep crossed 7-hour average",
    baseline: "Averaging 6h 5m/night over the prior month.", change: "7-night average rose to 7h 2m (+45 min/night).",
    context: "Consistent 10:30 PM bedtime and reduced evening screen time.", action: "Kept the wind-down routine and logged sleep nightly.",
    outcome: "Morning energy and recovery scores improved.", flag: "No provider action needed." },
  { date: "June 12, 2026", month: "June 2026", cat: "Lab Changes", title: "Body fat decreased 1.2%",
    baseline: "Body fat steady at 30.4% for 6 weeks.", change: "Smart Scale 7-reading trend dropped to 29.2% (-1.2%).",
    context: "Increased activity and improved protein intake.", action: "Continue current activity plan.",
    outcome: "Lean mass held steady while fat decreased.", flag: "Share trend at next physical." },
  { date: "June 8, 2026", month: "June 2026", cat: "Behavior Patterns", title: "Consistent hydration pattern detected",
    baseline: "Hydration varied day to day.", change: "7 straight days at or above the daily goal.",
    context: "Smart Water Bottle syncs and midday reminders.", action: "Keep midday hydration prompts on.",
    outcome: "Steadier energy and recovery.", flag: "No provider action needed." },
  { date: "June 2, 2026", month: "June 2026", cat: "Warning Flags", title: "Hydration below target for 5 days",
    baseline: "Typically hitting 2.6 L/day.", change: "5 consecutive days below the daily goal.",
    context: "Busier schedule, fewer water-bottle syncs logged.", action: "Set midday hydration reminders.",
    outcome: "Monitoring — not yet back to goal.", flag: "Flag if it persists another week." },
  { date: "May 22, 2026", month: "May 2026", cat: "Wins", title: "30-Day Medication Adherence",
    baseline: "Missed 1–2 doses most weeks.", change: "30 consecutive days with every dose logged on time.",
    context: "Enabled evening medication reminders.", action: "Kept reminders on and confirmed each dose.",
    outcome: "Steadier symptom control through the month.", flag: "Mention streak at next visit." },
  { date: "May 14, 2026", month: "May 2026", cat: "Lab Changes", title: "A1C improved from 7.2 → 6.8",
    baseline: "Last A1C 7.2%.", change: "New result 6.8% (-0.4).",
    context: "Better medication adherence and diet changes.", action: "Continue current management plan.",
    outcome: "Moving toward target range.", flag: "Confirm trend with provider." },
  { date: "May 12, 2026", month: "May 2026", cat: "Behavior Patterns", title: "Activity increases on weekdays",
    baseline: "Activity even across the week.", change: "Weekday steps now ~30% higher than weekends.",
    context: "Commute and walking meetings on weekdays.", action: "Add weekend movement to balance.",
    outcome: "Pattern identified.", flag: "No provider action needed." },
  { date: "May 5, 2026", month: "May 2026", cat: "Warning Flags", title: "Sleep quality declining",
    baseline: "Sleep quality steady the prior month.", change: "Quality score trending down over 7 nights.",
    context: "Later bedtimes and more screen time.", action: "Restore consistent wind-down routine.",
    outcome: "Watching for recovery.", flag: "Flag if decline continues." },
];
function HealthStorybook() {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const [story, setStory] = useState(null);
  const isTimeline = filter === "Timeline";
  const list = H_STORIES
    .filter(s => filter === "All" || s.cat === filter)
    .slice()
    .sort((a, b) => filter === "All" ? Date.parse(b.date) - Date.parse(a.date) : 0);
  // group timeline entries by month for a chronological view
  const tlMonths = [];
  H_TIMELINE.forEach(s => {
    let grp = tlMonths.find(g => g.month === s.month);
    if (!grp) { grp = { month: s.month, items: [] }; tlMonths.push(grp); }
    grp.items.push(s);
  });
  return (
    <section className="h-group">
      <button className={"h-group-h wsum-toggle" + (open ? " is-open" : "")} onClick={() => setOpen(o => !o)}>
        Health Storybook<em>{H_STORIES.length}</em>
        <span className="wsum-chev">{React.createElement(Icon.chevDown, { s: 16 })}</span>
      </button>
      {open && (
        <div className="wsum-body">
          {story ? (
            <div className="wsum-card hsb-detail">
              <button className="hsb-back" onClick={() => setStory(null)}>{React.createElement(Icon.chevDown, { s: 15 })} Back to stories</button>
              <span className="hsb-cat-chip">{story.cat}</span>
              <h3 className="wsum-title">{story.title}</h3>
              <span className="hsb-date">{story.date}</span>
              <dl className="hsb-dl">
                <div><dt>Baseline</dt><dd>{story.baseline}</dd></div>
                <div><dt>Change Detected</dt><dd>{story.change}</dd></div>
                <div><dt>Possible Context</dt><dd>{story.context}</dd></div>
                <div><dt>Action Taken</dt><dd>{story.action}</dd></div>
                <div><dt>Outcome</dt><dd>{story.outcome}</dd></div>
                <div><dt>Provider Flag</dt><dd>{story.flag}</dd></div>
              </dl>
            </div>
          ) : (
            <React.Fragment>
              <div className="hsb-chips">
                {H_STORYBOOK_CATS.map(c => (
                  <button key={c} className={"hsb-chip" + (filter === c ? " on" : "")} onClick={() => setFilter(c)}>{c}</button>
                ))}
              </div>
              {isTimeline ? (
                <div className="hsb-timeline">
                  {tlMonths.map(g => (
                    <div className="hsb-tl-month" key={g.month}>
                      <h5 className="hsb-tl-mhead">{g.month}</h5>
                      <div className="hsb-feed">
                        {g.items.map((s, i) => (
                          <button className="hsb-item" key={i} onClick={() => setStory(s)}>
                            <span className="hsb-item-date">{s.date}</span>
                            <span className="hsb-item-main"><span className="hsb-item-title">{s.title}</span></span>
                            <span className="hsb-item-arrow">{React.createElement(Icon.chevDown, { s: 15 })}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="hsb-feed">
                  {list.map((s, i) => (
                    <button className="hsb-item" key={i} onClick={() => setStory(s)}>
                      <span className="hsb-item-date">{s.date}</span>
                      <span className="hsb-item-main"><span className="hsb-item-title">{s.title}</span></span>
                      <span className="hsb-item-arrow">{React.createElement(Icon.chevDown, { s: 15 })}</span>
                    </button>
                  ))}
                </div>
              )}
            </React.Fragment>
          )}
        </div>
      )}
    </section>
  );
}
const H_TRENDS_CARDS = [
  { k: "Sleep", rows: [["Average Sleep", "7.2 hrs"], ["Monthly Change", "+0.6 hrs"], ["Best Week", "Week 3"]], insight: "Sleep consistency improved 18% this month." },
  { k: "Activity", rows: [["Active Days", "22"], ["Steps Average", "8,450/day"], ["Monthly Change", "+12%"]], insight: "Activity peaked during the second half of the month." },
  { k: "Nutrition", rows: [["Goal Adherence", "81%"], ["Protein Goal Met", "24 days"], ["Monthly Change", "+9%"]], insight: "Protein intake increased while processed foods decreased." },
  { k: "Hydration", rows: [["Daily Average", "72 oz"], ["Goal Met", "26 days"], ["Monthly Change", "+15%"]], insight: "Hydration remained consistent throughout the month." },
  { k: "Recovery", rows: [["Recovery Score", "78"], ["Monthly Change", "+11%"]], insight: "Recovery improved alongside increased sleep duration." },
];
const H_TRENDS_TABLE = [
  { c: "Sleep", s: 82, t: "Improving", dir: "up" },
  { c: "Activity", s: 76, t: "Improving", dir: "up" },
  { c: "Nutrition", s: 71, t: "Stable", dir: "flat" },
  { c: "Hydration", s: 88, t: "Improving", dir: "up" },
  { c: "Recovery", s: 79, t: "Improving", dir: "up" },
];
function WellnessScoresChart() {
  const max = 100, ticks = [100, 75, 50, 25, 0];
  const data = H_TRENDS_TABLE.map(r => ({ k: r.c, v: r.s }));
  return (
    <div className="h-bc">
      <h4 className="h-bc-title">Monthly wellness scores</h4>
      <p className="h-bc-sub">Comparison of wellness category performance during the month.</p>
      <div className="h-bc-grid">
        <div className="h-bc-yaxis">{ticks.map(t => <span key={t}>{t}</span>)}</div>
        <div className="h-bc-chart">
          {ticks.map(t => <div key={t} className="h-bc-gridline" style={{ bottom: (t / max * 100) + "%" }} />)}
          <div className="h-bc-bars">
            {data.map(b => <div key={b.k} className="h-bc-col"><div className="h-bc-bar" style={{ height: (b.v / max * 100) + "%" }} /></div>)}
          </div>
        </div>
      </div>
      <div className="h-bc-xrow"><span /><div className="h-bc-xlabels">{data.map(b => <span key={b.k}>{b.k}</span>)}</div></div>
    </div>
  );
}
function TrendsGroup() {
  const [open, setOpen] = useState(false);
  return (
    <section className="h-group">
      <button className={"h-group-h wsum-toggle" + (open ? " is-open" : "")} onClick={() => setOpen(o => !o)}>
        Trends<em>{H_TRENDS_TABLE.length}</em>
        <span className="wsum-chev">{React.createElement(Icon.chevDown, { s: 16 })}</span>
      </button>
      {open && (
        <div className="wsum-body">
          <div className="h-trtable">
            <div className="h-trtable-row h-trtable-head"><span>Category</span><span>Score</span><span>Trend</span></div>
            {H_TRENDS_TABLE.map(r => (
              <div className="h-trtable-row" key={r.c}>
                <span className="h-trt-cat">{r.c}</span>
                <span className="h-trt-score">{r.s}</span>
                <span className={"h-trt-trend " + r.dir}>{r.dir === "up" ? "↑" : "→"} {r.t}</span>
              </div>
            ))}
          </div>
          <div className="h-trcards">
            {H_TRENDS_CARDS.map(c => (
              <div className="h-trcard" key={c.k}>
                <h4 className="h-trcard-h">{c.k}</h4>
                <ul className="h-trcard-list">
                  {c.rows.map(([l, v]) => (<li key={l}><span>{l}</span><strong>{v}</strong></li>))}
                </ul>
                <p className="h-trcard-insight">{c.insight}</p>
              </div>
            ))}
          </div>
          <WellnessScoresChart />
        </div>
      )}
    </section>
  );
}
function MixedView({ entries }) {
  const out = [];
  let buf = [];
  const flush = (key) => {
    if (buf.length) { out.push(<div className="h-tilegrid" key={"t" + key}>{buf.map(l => <Tile key={l} label={l} />)}</div>); buf = []; }
  };
  entries.forEach((e, i) => {
    if (e.g === "Wellness Summary") {
      flush(i);
      out.push(<WellnessSummary key={e.g} rest={e.items.filter(x => x !== "Current Health Status")} />);
    } else if (e.g === "Health Storybook") {
      flush(i);
      out.push(<HealthStorybook key={e.g} />);
    } else if (e.g === "Trends") {
      flush(i);
      out.push(<TrendsGroup key={e.g} items={e.items} />);
    } else if (e.items) {
      flush(i);
      out.push(
        <section key={e.g} className="h-group">
          <h4 className="h-group-h">{e.g}<em>{e.items.length}</em></h4>
          <TileGrid items={e.items} />
        </section>
      );
    } else { buf.push(e.label); }
  });
  flush("end");
  return <div className="h-groups">{out}</div>;
}
function LibraryView() {
  const [openCard, setOpenCard] = useState(null);
  const [imgOpen, setImgOpen] = useState(0);
  const [labOpen, setLabOpen] = useState(null);
  const [fullVisits, setFullVisits] = useState(new Set());
  const toggleFullVisit = (k) => setFullVisits(prev => { const s = new Set(prev); s.has(k) ? s.delete(k) : s.add(k); return s; });
  const H_LIB_CARDS = [
    { t: "Lab Results", ic: "chart", count: "24 records", last: "June 12", tags: "A1C • Cholesterol • CBC",
      detail: [
        { d: "June 12", v: "A1C 6.8% ↓ Improved", name: "A1C (Blood Sugar Control)", result: "6.8%", prev: "7.2%", status: "Improved", meaning: "Long-term blood sugar control is improving" },
        { d: "May 14", v: "Cholesterol LDL 110 Borderline", name: "Cholesterol", rows: [["LDL", "110 (Borderline High)"], ["HDL", "55 (Good)"], ["Total", "185 (Normal)"]], meaning: "Heart health markers improving" },
        { d: "April 22", v: "Vitamin D Normalized", name: "Vitamin D", result: "32 ng/mL", status: "Normal (Previously Low)", meaning: "Vitamin levels now in healthy range" },
      ] },
    { t: "Imaging", ic: "scan", count: "6 records", last: "May 18", tags: "MRI • X-ray • CT scan",
      imaging: [
        { title: "Chest X-Ray", date: "June 10, 2026", reason: "Persistent cough", result: "Normal", findings: "No acute cardiopulmonary issues" },
        { title: "Knee MRI", date: "May 18, 2026", reason: "Knee pain/swelling", result: "Mild inflammation", findings: "Minor soft tissue strain, no tear detected" },
        { title: "Thyroid Ultrasound", date: "March 12, 2026", reason: "Hormone imbalance check", result: "Benign nodules", findings: "Small nodules, no suspicious features" },
      ] },
    { t: "Visit Summaries", ic: "file", count: "12 records", last: "June 5", tags: "Hypertension follow-up",
      visits: [
        { title: "Primary Care Visit", date: "June 5, 2026", reason: "Hypertension follow-up", provider: "Dr. Smith", summary: ["Blood pressure improving", "Medication continued"],
          full: [["Reason for Visit", "Hypertension follow-up"], ["Visit Type", "Routine check-up"], ["Provider", "Dr. Smith (Primary Care)"], ["Blood Pressure", "132/84 (Improved from 142/90)"], ["Heart Rate", "78 bpm"], ["Weight", "165 lbs (Stable)"], ["Assessment", "Blood pressure is improving and currently well-controlled on medication. No signs of acute cardiovascular risk. Condition considered stable."], ["Reviewed", "A1C: 6.8% (Improved) · LDL: 110 (Borderline) · Vitamin D: Normal"], ["Continue", "Lisinopril 10 mg daily. No changes to medication at this time."], ["Instructions", "Continue current medication · Maintain low-sodium diet · Increase daily water intake · Monitor blood pressure weekly"], ["Next Visit", "3 months"], ["Condition Monitoring", "Hypertension + routine labs"], ["Risk Level", "Low — No urgent concerns identified."]] },
        { title: "Lab Review Visit", date: "May 14, 2026", reason: "Blood work review", provider: "Dr. Lee", summary: ["A1C improved to 6.8%", "Cholesterol slightly elevated"],
          full: [["Reason for Visit", "Review recent lab results"], ["Visit Type", "Lab follow-up"], ["Provider", "Dr. Lee (Primary Care)"], ["Assessment", "Overall metabolic health improving. Blood sugar control trending in the right direction. Cholesterol requires continued monitoring. No immediate concerns."], ["A1C", "6.8% (Improved from 7.2%)"], ["LDL Cholesterol", "110 mg/dL (Borderline High)"], ["HDL Cholesterol", "55 mg/dL (Good)"], ["Vitamin D", "32 ng/mL (Normal)"], ["Interpretation", "Blood sugar control has improved significantly. Cholesterol levels show mild cardiovascular risk but are stable. Vitamin D is within healthy range."], ["Continue", "Metformin 500 mg twice daily · Lisinopril 10 mg daily. No new medications prescribed."], ["Instructions", "Continue current medication routine · Reduce saturated fat intake · Maintain consistent meal timing · Continue daily activity and hydration tracking"], ["Next Review", "3–6 months"], ["Labs Ordered", "Repeat A1C and lipid panel"], ["Monitoring Focus", "Blood sugar + cholesterol trends"], ["Risk Level", "Low–Moderate"], ["Notes", "LDL remains slightly elevated and should be monitored over time."]] },
        { title: "Urgent Care Visit", date: "April 22, 2026", reason: "Respiratory symptoms", provider: "—", summary: ["No infection found", "Symptoms resolved"],
          full: [["Reason for Visit", "Shortness of breath and cough"], ["Visit Type", "Urgent Care (Same-day evaluation)"], ["Provider", "Urgent Care Clinician"], ["Assessment", "No signs of pneumonia or acute infection. Symptoms likely related to mild respiratory irritation. Condition not life-threatening."], ["Temperature", "98.6°F (Normal)"], ["Oxygen Saturation", "98% (Normal)"], ["Heart Rate", "82 bpm (Normal)"], ["Chest X-Ray", "Normal"], ["COVID/Flu Test", "Negative"], ["Treatment", "Inhaler prescribed for symptom relief · Recommended over-the-counter antihistamine"], ["Instructions", "Rest and increase fluid intake · Use inhaler as needed · Monitor symptoms for 48–72 hours · Return if symptoms worsen"], ["Follow-Up", "Primary care if symptoms persist beyond 1 week"], ["Condition Status", "Resolved / Improving"], ["Risk Level", "Low — No emergency findings at time of visit."]] },
        { title: "Cardiology Visit", date: "March 30, 2026", reason: "Heart evaluation", provider: "—", summary: ["Stable heart function", "No medication changes"],
          full: [["Reason for Visit", "Routine cardiovascular evaluation"], ["Visit Type", "Specialist Consultation"], ["Provider", "Dr. Emily Johnson, Cardiology"], ["Symptoms Discussed", "Occasional shortness of breath · Mild fatigue with exercise"], ["Current Status", "No chest pain or dizziness reported"], ["Blood Pressure", "128/82 mmHg"], ["Heart Rate", "72 bpm"], ["Weight", "165 lbs"], ["Electrocardiogram (ECG)", "Normal sinus rhythm"], ["Lipid Panel", "LDL: 110 mg/dL (Borderline) · HDL: 55 mg/dL (Good)"], ["Assessment", "Heart rhythm is normal. Blood pressure remains well controlled. No evidence of acute cardiovascular concerns. Continue current management plan."], ["Continue", "Lisinopril 10 mg daily. No medication changes recommended."], ["Provider Recommendations", "Maintain heart-healthy diet · Exercise at least 150 minutes per week · Limit sodium intake · Continue home blood pressure monitoring"], ["Next Appointment", "6 months"], ["Monitoring", "Blood pressure and cholesterol"], ["Additional Testing", "Repeat lipid panel before next visit"], ["Overall Status", "Stable"], ["Risk Level", "Low"], ["Next Action", "Continue current treatment plan and preventive care."]] },
      ] },
    { t: "Discharge Instructions", ic: "file", count: "3 records", last: "April 30", tags: "ER visit summary available" },
    { t: "Immunizations", ic: "shield", count: "8 records", last: "Flu shot (2025)", tags: "Up to date ✓" },
    { t: "Medication History", ic: "pill", count: "5 changes", last: "Metformin started 2024", tags: "Lisinopril dose adjusted" },
    { t: "Doctor Orders", ic: "file", count: "9 records", last: "Pending review", tags: "Labs + referrals pending review" },
  ];
  return (
    <div className="h-groups">
      <div className="h-lib-top">
        <div className="h-lib-search">
          {React.createElement(Icon.search, { s: 16 })}
          <input placeholder="Search records, labs, imaging..." />
        </div>
        <div className="h-lib-filters">
          {["All", "Recent", "By Type", "By Date"].map((f, i) => (
            <button key={f} className={"h-lib-filter" + (i === 0 ? " on" : "")}>{f}</button>
          ))}
        </div>
        <button className="h-upload-btn">
          {React.createElement(Icon.upload, { s: 16 })}
          <span>Upload</span>
        </button>
      </div>
      <div className="h-lib-cards">
        {openCard != null ? (
          <div className="h-lib-detail">
            <button className="h-lib-back" onClick={() => setOpenCard(null)}>{React.createElement(Icon.chevDown, { s: 14 })} Back to Library</button>
            <h3 className="h-plan-sectitle">{H_LIB_CARDS[openCard].t}</h3>
            {H_LIB_CARDS[openCard].visits ? (
              <div className="h-lib-detail">
                <div className="h-vs-bar">
                  <div className="h-lib-filters">
                    {["All", "PCP", "Specialist", "ER", "Follow-ups"].map((f, k) => (
                      <button key={f} className={"h-lib-filter" + (k === 0 ? " on" : "")}>{f}</button>
                    ))}
                  </div>
                  <span className="h-vs-sort">Sort: <b>Most Recent</b></span>
                </div>
                <div className="h-lib-imglist">
                  {H_LIB_CARDS[openCard].visits.map((v, k) => (
                    <div className={"h-lib-card lib-detail-list h-lib-imgdd" + (imgOpen === k ? " is-open" : "")} key={k}>
                      <button className="h-lib-imgdd-h" onClick={() => setImgOpen(o => o === k ? null : k)}>
                        <span><b className="h-lib-img-t">{v.title}</b><span className="h-lib-img-date">{v.date}</span></span>
                        <span className="h-plan-chev">{React.createElement(Icon.chevDown, { s: 16 })}</span>
                      </button>
                      {imgOpen === k && (
                        <React.Fragment>
                          <div className="h-lib-img-meta">
                            <div><span className="h-appt-avs-cap">Reason</span><span className="h-appt-avs-v">{v.reason}</span></div>
                            {v.provider && v.provider !== "—" && <div><span className="h-appt-avs-cap">Provider</span><span className="h-appt-avs-v">{v.provider}</span></div>}
                            <div><span className="h-appt-avs-cap">Summary</span><span className="h-appt-avs-v">{v.summary.join(" · ")}</span></div>
                          </div>
                          <div className="h-lib-img-btns"><button className="h-appt-btn" onClick={() => v.full && toggleFullVisit(k)}>{fullVisits.has(k) ? "Hide Full Summary" : "View Full Summary"}</button></div>
                          {v.full && fullVisits.has(k) && (
                            <div className="h-lib-img-meta h-vs-full">
                              {v.full.map(([cap, val], fi) => (
                                <div key={fi}><span className="h-appt-avs-cap">{cap}</span><span className="h-appt-avs-v">{val}</span></div>
                              ))}
                            </div>
                          )}
                        </React.Fragment>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : H_LIB_CARDS[openCard].imaging ? (
              <div className="h-lib-imglist">
                {H_LIB_CARDS[openCard].imaging.map((im, k) => (
                  <div className={"h-lib-card lib-detail-list h-lib-imgdd" + (imgOpen === k ? " is-open" : "")} key={k}>
                    <button className="h-lib-imgdd-h" onClick={() => setImgOpen(o => o === k ? null : k)}>
                      <span><b className="h-lib-img-t">{im.title}</b><span className="h-lib-img-date">{im.date}</span></span>
                      <span className="h-plan-chev">{React.createElement(Icon.chevDown, { s: 16 })}</span>
                    </button>
                    {imgOpen === k && (
                      <React.Fragment>
                        <div className="h-lib-img-meta">
                          <div><span className="h-appt-avs-cap">Reason</span><span className="h-appt-avs-v">{im.reason}</span></div>
                          <div><span className="h-appt-avs-cap">Result</span><span className="h-appt-avs-v">{im.result}</span></div>
                          <div><span className="h-appt-avs-cap">Findings</span><span className="h-appt-avs-v">{im.findings}</span></div>
                        </div>
                        <div className="h-lib-img-btns">
                          <button className="h-appt-btn">View Report</button>
                          <button className="h-med-report">View Image</button>
                        </div>
                      </React.Fragment>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-lib-card lib-detail-list">
                {(H_LIB_CARDS[openCard].detail || []).map((r, i) => (
                  <div className={"h-lib-labrow" + (labOpen === i ? " is-open" : "")} key={i}>
                    <button className="h-lib-lab-h" onClick={() => setLabOpen(o => o === i ? null : i)}>
                      <span className="h-lib-drow-d">{r.d}</span>
                      <span className="h-lib-drow-v">{r.v}</span>
                      {r.name && <span className="h-plan-chev">{React.createElement(Icon.chevDown, { s: 15 })}</span>}
                    </button>
                    {r.name && labOpen === i && (
                      <div className="h-lib-lab-detail">
                        <h4 className="h-lib-img-t">{r.name}</h4>
                        <div className="h-lib-img-meta">
                          {r.rows ? (
                            <React.Fragment>
                              <div><span className="h-appt-avs-cap">Date</span><span className="h-appt-avs-v">{r.d}, 2026</span></div>
                              {r.rows.map(([k, val], ri) => (
                                <div key={ri}><span className="h-appt-avs-cap">{k}</span><span className="h-appt-avs-v">{val}</span></div>
                              ))}
                              <div><span className="h-appt-avs-cap">Meaning</span><span className="h-appt-avs-v">{r.meaning}</span></div>
                            </React.Fragment>
                          ) : (
                            <React.Fragment>
                              <div><span className="h-appt-avs-cap">Date</span><span className="h-appt-avs-v">{r.d}, 2026</span></div>
                              <div><span className="h-appt-avs-cap">Result</span><span className="h-appt-avs-v">{r.result}</span></div>
                              {r.prev && <div><span className="h-appt-avs-cap">Previous</span><span className="h-appt-avs-v">{r.prev}</span></div>}
                              <div><span className="h-appt-avs-cap">Status</span><span className="h-appt-avs-v">{r.status}</span></div>
                              <div><span className="h-appt-avs-cap">Meaning</span><span className="h-appt-avs-v">{r.meaning}</span></div>
                            </React.Fragment>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : H_LIB_CARDS.map((c, i) => (
          <button className="h-lib-card" key={i} onClick={() => (c.detail || c.imaging || c.visits) && setOpenCard(i)}>
            <div className="h-lib-card-h">
              <span className="h-lib-card-ic">{React.createElement(Icon[c.ic] || Icon.file, { s: 18 })}</span>
              <h4 className="h-lib-card-t">{c.t}</h4>
            </div>
            <span className="h-lib-card-count">{c.count}</span>
            <span className="h-lib-card-last">Last: {c.last}</span>
            <span className="h-lib-card-tags">{c.tags}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
const H_MOOD_HERO = [
  { k: "Mood",   v: "Calm", sub: "Steady",        ic: "smile", pct: 72, color: "#159385" },
  { k: "Energy", v: "76%",  sub: "High",          ic: "bolt",  pct: 76, color: "#159385" },
  { k: "Stress", v: "Low",  sub: "HRV trending up", ic: "heart", pct: 22, color: "#159385" },
];
const H_MOOD = [
  { k: "Symptoms",   v: "None",     sub: "Nothing logged today", ic: "thermo", color: "#159385" },
  { k: "Motivation", v: "Strong",   sub: "On track with goals",  ic: "flame",  color: "#159385" },
];
const MOOD_TONE = {
  "Calm":          { tone: "calm",    color: "#159385" },
  "Neutral":       { tone: "neutral", color: "#94a3a0" },
  "Slight Stress": { tone: "stress",  color: "#d98a2b" },
};
const H_MOOD_TREND = [
  { d: "Mon", m: "Calm" }, { d: "Tue", m: "Calm" }, { d: "Wed", m: "Neutral" },
  { d: "Thu", m: "Calm" }, { d: "Fri", m: "Slight Stress" }, { d: "Sat", m: "Calm" },
];
const H_ENERGY_TREND = [
  { d: "Mon", v: 82 }, { d: "Tue", v: 72 }, { d: "Wed", v: 91 }, { d: "Thu", v: 76 }, { d: "Fri", v: 74 },
];
const STRESS_TONE = { "Low": "#159385", "Moderate": "#d98a2b", "High": "#d9534f" };
const H_STRESS_TREND = [
  { d: "Mon", m: "Low" }, { d: "Tue", m: "Low" }, { d: "Wed", m: "Moderate" },
  { d: "Thu", m: "Low" }, { d: "Fri", m: "Moderate" }, { d: "Sat", m: "Low" },
];
const H_MOTIV_TREND = [
  { d: "Mon", v: 80 }, { d: "Tue", v: 82 }, { d: "Wed", v: 78 }, { d: "Thu", v: 85 }, { d: "Fri", v: 90 },
];
const CUR_MOOD = "Calm";
const H_MOOD_METERS = [
  { k: "Mood", v: "Calm", sub: "Steady", ic: "smile", pct: 72 },
  { k: "Energy", v: "76%", sub: "High", ic: "bolt", pct: 76 },
  { k: "Stress", v: "Low", sub: "HRV trending up", ic: "heart", pct: 22 },
  { k: "Motivation", v: "Strong", sub: "On track with goals", ic: "flame", pct: 85 },
];
const MGAUGE_LEN = Math.PI * 44;
function MoodGauge({ k, v, sub, ic, pct }) {
  return (
    <div className="mgauge">
      <div className="mgauge-arcwrap">
        <svg viewBox="0 0 100 56" className="mgauge-svg">
          <path d="M6 50 A44 44 0 0 1 94 50" className="mgauge-track" />
          <path d="M6 50 A44 44 0 0 1 94 50" className="mgauge-fill"
            style={{ strokeDasharray: `${MGAUGE_LEN * pct / 100} ${MGAUGE_LEN}` }} />
        </svg>
      </div>
      <strong className="mgauge-v">{v}</strong>
      <span className="mgauge-k">{k}</span>
      <span className="mgauge-sub">{sub}</span>
    </div>
  );
}
function TrendLine({ data }) {
  const n = data.length, pad = 8, top = 18, bot = 66;
  const xs = data.map((_, i) => pad + i * ((100 - 2 * pad) / (n - 1)));
  const ys = data.map(p => bot - (p.v / 100) * (bot - top));
  const pts = xs.map((x, i) => `${x},${ys[i]}`).join(" ");
  return (
    <div className="h-line">
      <svg className="h-line-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline className="h-line-path" points={pts} />
      </svg>
      {data.map((p, i) => (
        <React.Fragment key={i}>
          <span className="h-line-val" style={{ left: xs[i] + "%", top: ys[i] + "%" }}>{p.v}%</span>
          <span className="h-line-dot" style={{ left: xs[i] + "%", top: ys[i] + "%" }} />
        </React.Fragment>
      ))}
      <div className="h-line-labels">{data.map((p, i) => <span key={i}>{p.d}</span>)}</div>
    </div>
  );
}
function MoodGraph({ data }) {
  const sev = { "Calm": 85, "Neutral": 55, "Slight Stress": 30 };
  const n = data.length, pad = 8, top = 20, bot = 66;
  const xs = data.map((_, i) => pad + i * ((100 - 2 * pad) / (n - 1)));
  const ys = data.map(p => bot - ((sev[p.m] || 50) / 100) * (bot - top));
  const pts = xs.map((x, i) => `${x},${ys[i]}`).join(" ");
  return (
    <div className="h-line">
      <svg className="h-line-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline className="h-line-path" points={pts} />
      </svg>
      {data.map((p, i) => (
        <React.Fragment key={i}>
          <span className="h-line-val" style={{ left: xs[i] + "%", top: ys[i] + "%" }}>{p.m}</span>
          <span className="h-line-dot" style={{ left: xs[i] + "%", top: ys[i] + "%", background: MOOD_TONE[p.m].color, boxShadow: "0 0 0 1px " + MOOD_TONE[p.m].color }} />
        </React.Fragment>
      ))}
      <div className="h-line-labels">{data.map((p, i) => <span key={i}>{p.d}</span>)}</div>
    </div>
  );
}
function StressGraph({ data }) {
  const sev = { Low: 30, Moderate: 64, High: 94 };
  const n = data.length, pad = 8, top = 20, bot = 66;
  const xs = data.map((_, i) => pad + i * ((100 - 2 * pad) / (n - 1)));
  const ys = data.map(p => bot - (sev[p.m] / 100) * (bot - top));
  const pts = xs.map((x, i) => `${x},${ys[i]}`).join(" ");
  return (
    <div className="h-line">
      <svg className="h-line-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline className="h-line-path h-line-path-stress" points={pts} />
      </svg>
      {data.map((p, i) => (
        <React.Fragment key={i}>
          <span className="h-line-val" style={{ left: xs[i] + "%", top: ys[i] + "%" }}>{p.m}</span>
          <span className="h-line-dot" style={{ left: xs[i] + "%", top: ys[i] + "%", background: STRESS_TONE[p.m], boxShadow: "0 0 0 1px " + STRESS_TONE[p.m] }} />
        </React.Fragment>
      ))}
      <div className="h-line-labels">{data.map((p, i) => <span key={i}>{p.d}</span>)}</div>
    </div>
  );
}
function MoodPanel() {
  return (
    <React.Fragment>
    <section className="h-mood-hero">
      <header className="h-mood-hero-h h-mood-hero-h2">
        <h3>Current State</h3>
        <div className="h-mood-hero-r2">
          <h3 className="h-me-weektitle">Weekly View</h3>
        </div>
      </header>
      <div className="h-mood-hero-body">
        <div className="h-me-pairs">
          <div className="h-me-row">
            <MoodGauge {...H_MOOD_METERS[0]} />
            <section className="h-trend">
              <header className="h-trend-h">
                <span className="h-trend-ic">{React.createElement(Icon.smile, { s: 15 })}</span>
                <h4>Mood Trend</h4>
                <span className="h-trend-range">7 days</span>
              </header>
              <MoodGraph data={H_MOOD_TREND} />
            </section>
          </div>
          <div className="h-me-row">
            <MoodGauge {...H_MOOD_METERS[1]} />
            <section className="h-trend">
              <header className="h-trend-h">
                <span className="h-trend-ic">{React.createElement(Icon.bolt, { s: 15 })}</span>
                <h4>Energy Trend</h4>
                <span className="h-trend-range">7 days</span>
              </header>
              <div className="h-batt-list">
                {H_ENERGY_TREND.map((p, i) => (
                  <div key={i} className="h-batt-row">
                    <span className="h-batt-day">{p.d}</span>
                    <span className="h-batt"><span className="h-batt-fill" style={{ width: p.v + "%" }} /></span>
                    <span className="h-batt-pct">{p.v}%</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
          <div className="h-me-row">
            <MoodGauge {...H_MOOD_METERS[2]} />
            <section className="h-trend">
              <header className="h-trend-h">
                <span className="h-trend-ic">{React.createElement(Icon.heart, { s: 15 })}</span>
                <h4>Stress Trend</h4>
                <span className="h-trend-range">7 days</span>
              </header>
              <StressGraph data={H_STRESS_TREND} />
            </section>
          </div>
          <div className="h-me-row">
            <MoodGauge {...H_MOOD_METERS[3]} />
            <section className="h-trend">
              <header className="h-trend-h">
                <span className="h-trend-ic">{React.createElement(Icon.flame, { s: 15 })}</span>
                <h4>Motivation Trend</h4>
                <span className="h-trend-range">7 days</span>
              </header>
              <div className="h-batt-list">
                {H_MOTIV_TREND.map((p, i) => (
                  <div key={i} className="h-batt-row">
                    <span className="h-batt-day">{p.d}</span>
                    <span className="h-batt"><span className="h-batt-fill" style={{ width: p.v + "%" }} /></span>
                    <span className="h-batt-pct">{p.v}%</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
      </section>
    </React.Fragment>
  );
}
function BuddyChatView() {
  const [q, setQ] = useState("");
  return (
    <div className="h-buddy">
      <div className="h-buddy-ask">
        <span className="h-buddy-ic">{React.createElement(Icon.smile, { s: 20 })}</span>
        <input
          className="h-buddy-input"
          placeholder="Ask Buddy a health question…"
          value={q}
          onChange={e => setQ(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") setQ(""); }}
        />
        <button className="h-buddy-send" onClick={() => setQ("")}>{React.createElement(Icon.send, { s: 17 })}</button>
      </div>
      <TileGrid items={H_FLAT.buddychat} />
    </div>
  );
}
function DestEmpty({ label }) {
  return (
    <div className="h-empty">
      {React.createElement(Icon.sliders, { s: 26 })}
      <p>No {label.toLowerCase()} configured yet.</p>
    </div>
  );
}

/* ---------- Profile ---------- */
function ProfileView() {
  const p = H_PROFILE;
  return (
    <div className="h-profile">
      <div className="h-prof-top">
        <section className="h-prof-id">
          <HAvatar ini={p.ini} size={46} />
          <div className="h-prof-id-body">
            <h2>{p.name}</h2>
            <span className="h-prof-pid">PATIENT ID · FL-2048</span>
            <span className="h-prof-pronoun">{React.createElement(Icon.user, { s: 12 })} {p.pronoun}</span>
          </div>
        </section>
        <section className="h-prof-fields">
          {p.fields.map(f => (
            <div key={f.k} className="h-prof-field">
              <span className="h-prof-fic">{React.createElement(Icon[f.ic], { s: 16 })}</span>
              <div>
                <span className="h-prof-k">{f.k}</span>
                <strong className="h-prof-v">{f.v}</strong>
              </div>
            </div>
          ))}
          <div className="h-prof-field h-prof-emerg">
            <span className="h-prof-fic">{React.createElement(Icon.alertTri, { s: 16 })}</span>
            <div>
              <span className="h-prof-k">Emergency Contact</span>
              <strong className="h-prof-v">{p.emergency.name} · {p.emergency.relation}</strong>
              <span className="h-prof-phone">{p.emergency.phone}</span>
            </div>
          </div>
          {p.insurance && (
            <div className="h-prof-field h-prof-insurance">
              <span className="h-prof-fic">{React.createElement(Icon.shield, { s: 16 })}</span>
              <div>
                <span className="h-prof-k">Insurance{p.insurance.status && <em className="h-prof-insbadge">{p.insurance.status}</em>}</span>
                <strong className="h-prof-v">{p.insurance.provider || <em className="h-cond-blank">Provider not recorded</em>}</strong>
                {(p.insurance.plan || p.insurance.memberId) && (
                  <span className="h-prof-phone">{[p.insurance.plan, p.insurance.memberId && ("Member · " + p.insurance.memberId)].filter(Boolean).join(" · ")}</span>
                )}
              </div>
            </div>
          )}
        </section>
      </div>

    </div>
  );
}

/* ---------- Care Team cards (shown under Medical Profile tab) ---------- */
function CareTeamCards() {
  const p = H_PROFILE;
  return (
    <div className="h-careteam">
      {p.careTeam.map(c => (
        <div key={c.type} className="h-care">
          <div className="h-care-h">
            <span className="h-care-ic">{React.createElement(Icon[c.ic], { s: 17 })}</span>
            <span className="h-care-type">{c.type}</span>
          </div>
          <strong className="h-care-name">{c.name}</strong>
          <span className="h-care-place">{c.place}</span>
          <div className="h-care-row">{React.createElement(Icon.pin, { s: 13 })}<span>{c.addr}</span></div>
          <div className="h-care-row">{React.createElement(Icon.phone, { s: 13 })}<span>{c.phone}</span></div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Body Metrics tab ---------- */
const H_BODYCOMP = [
  { k: "Weight", v: 165 }, { k: "Lean Mass", v: 118 }, { k: "Muscle Mass", v: 62 },
  { k: "Body Fat %", v: 29 }, { k: "Body Water %", v: 52 },
];
const BC_MAX = 180, BC_TICKS = [180, 135, 90, 45, 0];
function BodyCompChart() {
  return (
    <div className="h-bc">
      <h4 className="h-bc-h">Comparison of major body composition measurements.</h4>
      <div className="h-bc-grid">
        <div className="h-bc-yaxis">{BC_TICKS.map(t => <span key={t}>{t}</span>)}</div>
        <div className="h-bc-chart">
          {BC_TICKS.map(t => <div key={t} className="h-bc-gridline" style={{ bottom: (t / BC_MAX * 100) + "%" }} />)}
          <div className="h-bc-bars">
            {H_BODYCOMP.map(b => (
              <div key={b.k} className="h-bc-col"><div className="h-bc-bar" style={{ height: (b.v / BC_MAX * 100) + "%" }} /></div>
            ))}
          </div>
        </div>
      </div>
      <div className="h-bc-xrow">
        <span />
        <div className="h-bc-xlabels">{H_BODYCOMP.map(b => <span key={b.k}>{b.k}</span>)}</div>
      </div>
    </div>
  );
}
function Arrow({ dir }) {
  return (
    <svg className="h-bm-arrow" width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {dir === "up"
        ? <g><path d="M6 10V2.5" /><path d="M2.8 5.7 6 2.5l3.2 3.2" /></g>
        : <g><path d="M6 2v7.5" /><path d="M2.8 6.3 6 9.5l3.2-3.2" /></g>}
    </svg>
  );
}
function BodyMetricsView() {
  return (
    <div className="h-bm-wrap">
      <div className="h-bm-srcbar">
        <span className="h-bm-src"><span className="h-bm-src-ic">{React.createElement(Icon.scale, { s: 15 })}</span>Source: <strong>Smart Scale</strong></span>
        <span className="h-bm-sync"><span className="h-bm-dot" />Last Sync: <strong>Today</strong></span>
      </div>
      <div className="h-bm-summary">
        <h4 className="h-bm-summary-h">Composition Summary</h4>
        Weight increased 2 lbs this week, while body fat decreased 1.2%. Muscle mass and lean mass both increased, suggesting the weight gain may be associated with improved body composition rather than additional body fat.
      </div>
      <div className="h-bm-grid">
      {H_BODYMETRICS.map(m => (
        <div key={m.k} className="h-bm">
          <div className="h-bm-top">
            <span className="h-bm-ic">{React.createElement(Icon[m.ic], { s: 18 })}</span>
            <span className="h-bm-k">{m.k}</span>
          </div>
          <div className="h-bm-valrow">
            <strong className="h-bm-v">{m.v}</strong>
            {m.unit && <span className="h-bm-unit">{m.unit}</span>}
          </div>
          <div className="h-bm-foot">
            {m.status
              ? <span className="h-bm-status">{m.status}</span>
              : <span className={"h-bm-delta " + m.dir}><Arrow dir={m.dir} />{m.dir === "up" ? "+" : "−"}{m.delta}</span>}
            <span className="h-bm-note">{m.note}</span>
          </div>
        </div>
      ))}
      </div>
      <BodyCompChart />
    </div>
  );
}

/* ---------- Medical Profile tab (records + Care Team) ---------- */
const H_MED_SUMMARY = [
  { k: "Conditions", ic: "health", count: "3", label: "Active" },
  { k: "Allergies",  ic: "alertTri", count: "2", label: "Critical" },
  { k: "Surgeries",  ic: "stetho", count: "2", label: "Records" },
  { k: "Family History", ic: "users", count: "2", label: "Records" },
];
// Placeholder — awaiting real content for the 3 active conditions.
const H_CONDITIONS = [
  { name: "Hypertension", status: "Active", diagnosed: "11/22/2022", provider: "", notes: "" },
  { name: "Asthma", status: "Controlled", diagnosed: "03/20/2023", provider: "", notes: "" },
  { name: "Diabetes", status: "Managed with Medication", diagnosed: "08/14/2021", provider: "", notes: "" },
];
function MedSummaryCard({ c, onOpen }) {
  return (
    <button className="h-medsum" onClick={() => onOpen && onOpen(c.k)}>
      <div className="h-medsum-h">
        <span className="h-medsum-ic">{React.createElement(Icon[c.ic], { s: 17 })}</span>
        <span className="h-medsum-k">{c.k}</span>
      </div>
      <div className="h-medsum-stat">
        {c.count
          ? <React.Fragment><strong>{c.count}</strong><span>{c.label}</span></React.Fragment>
          : <span className="h-medsum-empty">No records yet</span>}
      </div>
      <span className="h-medsum-view">View {React.createElement(Icon.chevRight, { s: 14 })}</span>
    </button>
  );
}
function ConditionsDetail({ onBack }) {
  return (
    <div className="h-detail">
      <header className="h-detail-h">
        <button className="h-detail-back" onClick={onBack}>{React.createElement(Icon.chevRight, { s: 16 })} Medical Profile</button>
        <h2 className="h-detail-title">Conditions</h2>
        <span className="h-detail-count">{H_CONDITIONS.length} Active</span>
      </header>
      <div className="h-cond-list">
        {H_CONDITIONS.map((c, i) => (
          <article key={i} className="h-cond">
            <div className="h-cond-top">
              <h3 className="h-cond-name">{c.name}</h3>
              <span className={"h-cond-status " + c.status.toLowerCase()}>{c.status}</span>
            </div>
            <div className="h-cond-meta">
              <div className="h-cond-field">
                <span className="h-cond-lbl">{React.createElement(Icon.calendar, { s: 13 })} Diagnosed</span>
                <span className="h-cond-val">{c.diagnosed}</span>
              </div>
              <div className="h-cond-field">
                <span className="h-cond-lbl">{React.createElement(Icon.stetho, { s: 13 })} Provider</span>
                <span className="h-cond-val">{c.provider || <em className="h-cond-blank">Not recorded</em>}</span>
              </div>
            </div>
            <div className="h-cond-notes">
              <span className="h-cond-lbl">{React.createElement(Icon.file, { s: 13 })} Notes</span>
              <p>{c.notes || <em className="h-cond-blank">No notes yet</em>}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

// Allergy categories — Type / Reaction / Severity / Date Noted per item. Awaiting content.
const H_ALLERGIES = [
  { cat: "Food",          ic: "flame", items: [
    { type: "Peanuts", reaction: "Anaphylaxis", severity: "Medium", date: "", management: [
      { med: "Antihistamine", when: "for mild reactions" },
      { med: "Epinephrine", when: "for severe reactions" },
      { med: "Topical cream", when: "for skin reactions" },
    ] },
  ] },
  { cat: "Medication",    ic: "pill",  items: [
    { type: "Penicillin", reaction: "Rash", severity: "Mild", date: "", management: [
      { med: "Antihistamine", when: "(e.g., diphenhydramine)" },
      { med: "Monitor symptoms", when: "(rash, itching)" },
      { med: "Avoid re-exposure", when: "to penicillin or related antibiotics" },
    ] },
  ] },
  { cat: "Environmental", ic: "wind",  items: [
    { type: "Pet Dander", reaction: ["Sneezing", "Runny or stuffy nose", "Itchy, watery eyes"], severity: "Mild–Moderate", date: "", management: [
      { med: "Antihistamine", when: "(e.g., loratadine, cetirizine)" },
      { med: "Nasal spray", when: "(saline or corticosteroid if prescribed)" },
      { med: "Eye drops", when: "for irritation" },
    ] },
    { type: "Mold",       reaction: ["Wheezing", "Chest tightness", "Fatigue / brain fog"], severity: "Mild–Moderate", date: "", mgmtLabel: "Trigger Avoidance", mgmtIcon: "shield", management: [
      { med: "Avoid damp or humid environments", when: "" },
      { med: "Use a dehumidifier indoors", when: "" },
    ] },
  ] },
];
function AllergiesDetail({ onBack }) {
  const total = H_ALLERGIES.reduce((n, c) => n + c.items.length, 0);
  return (
    <div className="h-detail">
      <header className="h-detail-h">
        <button className="h-detail-back" onClick={onBack}>{React.createElement(Icon.chevRight, { s: 16 })} Medical Profile</button>
        <h2 className="h-detail-title">Allergies</h2>
        <span className="h-detail-count">{total} Logged</span>
      </header>
      <div className="h-allergy-cats">
        {H_ALLERGIES.map(cat => (
          <section key={cat.cat} className="h-allergy-cat">
            <header className="h-allergy-cath">
              <span className="h-allergy-catic">{React.createElement(Icon[cat.ic], { s: 16 })}</span>
              <h3>{cat.cat}</h3>
              <span className="h-allergy-catn">{cat.items.length}</span>
            </header>
            {cat.items.length === 0 ? (
              <div className="h-allergy-empty">No {cat.cat.toLowerCase()} allergies logged yet</div>
            ) : (
              <div className="h-allergy-list">
                {cat.items.map((a, i) => (
                  <article key={i} className="h-allergy">
                    <div className="h-allergy-top">
                      <h4 className="h-allergy-name">{a.type}</h4>
                      <span className={"h-allergy-sev " + (a.severity || "").toLowerCase()}>{a.severity}</span>
                    </div>
                    <div className="h-allergy-fields">
                      <div className="h-allergy-field">
                        <span className="h-cond-lbl">{React.createElement(Icon.alertTri, { s: 13 })} Reaction</span>
                        {Array.isArray(a.reaction)
                          ? <ul className="h-allergy-reactlist">{a.reaction.map((r, k) => <li key={k}>{r}</li>)}</ul>
                          : <span className="h-cond-val">{a.reaction || <em className="h-cond-blank">Not recorded</em>}</span>}
                      </div>
                      <div className="h-allergy-field">
                        <span className="h-cond-lbl">{React.createElement(Icon.calendar, { s: 13 })} Date Noted</span>
                        <span className="h-cond-val">{a.date || <em className="h-cond-blank">Not recorded</em>}</span>
                      </div>
                    </div>
                    {a.management && a.management.length > 0 && (
                      <div className="h-allergy-mgmt">
                        <span className="h-cond-lbl">{React.createElement(Icon[a.mgmtIcon || "pill"], { s: 13 })} {a.mgmtLabel || "Reaction Management"}</span>
                        <ul className="h-allergy-mgmt-list">
                          {a.management.map((m, j) => (
                            <li key={j}><strong>{m.med}</strong>{m.when && <span> {m.when}</span>}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
            {cat.blocks && cat.blocks.map((b, bi) => (
              <div key={bi} className="h-allergy-catmgmt">
                <span className="h-cond-lbl">{React.createElement(Icon.shield, { s: 13 })} {b.label}</span>
                <ul className="h-allergy-mgmt-list">
                  {b.items.map((m, j) => (
                    <li key={j}><strong>{m.med}</strong>{m.when && <span> {m.when}</span>}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
// Surgery records — awaiting content for the 2 records.
const H_SURGERIES = [
  { name: "Appendectomy", date: "June 2015", facility: "St. Mary's Medical Center", surgeon: "Dr. Lee", reason: "Acute appendicitis", notes: "Successful, no complications", recovery: "Fully Recovered" },
  { name: "Procedure 2", date: "", facility: "", surgeon: "", reason: "", notes: "", recovery: "" },
];
function SurgeriesDetail({ onBack }) {
  const blank = <em className="h-cond-blank">Not recorded</em>;
  return (
    <div className="h-detail">
      <header className="h-detail-h">
        <button className="h-detail-back" onClick={onBack}>{React.createElement(Icon.chevRight, { s: 16 })} Medical Profile</button>
        <h2 className="h-detail-title">Surgeries</h2>
        <span className="h-detail-count">{H_SURGERIES.length} Records</span>
      </header>
      <div className="h-cond-list">
        {H_SURGERIES.map((s, i) => (
          <article key={i} className="h-cond">
            <div className="h-cond-top">
              <h3 className="h-cond-name">{s.name}</h3>
              {s.recovery && <span className={"h-cond-status " + s.recovery.toLowerCase().replace(/[^a-z]+/g, "-")}>{s.recovery}</span>}
            </div>
            <div className="h-cond-meta h-surg-meta">
              <div className="h-cond-field">
                <span className="h-cond-lbl">{React.createElement(Icon.calendar, { s: 13 })} Date</span>
                <span className="h-cond-val">{s.date || blank}</span>
              </div>
              <div className="h-cond-field">
                <span className="h-cond-lbl">{React.createElement(Icon.home, { s: 13 })} Hospital / Facility</span>
                <span className="h-cond-val">{s.facility || blank}</span>
              </div>
              <div className="h-cond-field">
                <span className="h-cond-lbl">{React.createElement(Icon.stetho, { s: 13 })} Surgeon</span>
                <span className="h-cond-val">{s.surgeon || blank}</span>
              </div>
            </div>
            <div className="h-cond-notes">
              <span className="h-cond-lbl">{React.createElement(Icon.health, { s: 13 })} Reason for Surgery</span>
              <p>{s.reason || <em className="h-cond-blank">Not recorded</em>}</p>
            </div>
            <div className="h-cond-notes">
              <span className="h-cond-lbl">{React.createElement(Icon.file, { s: 13 })} Outcome / Notes</span>
              <p>{s.notes || <em className="h-cond-blank">No notes yet</em>}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
// Family history records.
const H_FAMILY = [
  { relation: "Father", condition: "Hypertension", onset: "Age 55", status: "Living", notes: "Managed with medication" },
  { relation: "Grandmother", condition: "Breast Cancer", onset: "Age 62", status: "Deceased", notes: "" },
];
function FamilyHistoryDetail({ onBack }) {
  const blank = <em className="h-cond-blank">Not recorded</em>;
  return (
    <div className="h-detail">
      <header className="h-detail-h">
        <button className="h-detail-back" onClick={onBack}>{React.createElement(Icon.chevRight, { s: 16 })} Medical Profile</button>
        <h2 className="h-detail-title">Family History</h2>
        <span className="h-detail-count">{H_FAMILY.length} Record{H_FAMILY.length === 1 ? "" : "s"}</span>
      </header>
      <div className="h-cond-list">
        {H_FAMILY.map((f, i) => (
          <article key={i} className="h-cond">
            <div className="h-cond-top">
              <h3 className="h-cond-name">{f.relation}</h3>
              {f.status && <span className={"h-cond-status " + f.status.toLowerCase().replace(/[^a-z]+/g, "-")}>{f.status}</span>}
            </div>
            <div className="h-cond-meta">
              <div className="h-cond-field">
                <span className="h-cond-lbl">{React.createElement(Icon.health, { s: 13 })} Condition</span>
                <span className="h-cond-val">{f.condition || blank}</span>
              </div>
              <div className="h-cond-field">
                <span className="h-cond-lbl">{React.createElement(Icon.clock, { s: 13 })} Onset</span>
                <span className="h-cond-val">{f.onset || blank}</span>
              </div>
            </div>
            <div className="h-cond-notes">
              <span className="h-cond-lbl">{React.createElement(Icon.file, { s: 13 })} Notes</span>
              <p>{f.notes || <em className="h-cond-blank">No notes yet</em>}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
function MedicalProfileView() {
  const [detail, setDetail] = useState(null);
  const summaryKeys = H_MED_SUMMARY.map(s => s.k);
  const tiles = H_HEALTH_SECTIONS[0].items.filter(i => !summaryKeys.includes(i));
  if (detail === "Conditions") return <ConditionsDetail onBack={() => setDetail(null)} />;
  if (detail === "Allergies") return <AllergiesDetail onBack={() => setDetail(null)} />;
  if (detail === "Surgeries") return <SurgeriesDetail onBack={() => setDetail(null)} />;
  if (detail === "Family History") return <FamilyHistoryDetail onBack={() => setDetail(null)} />;
  return (
    <div className="h-medprofile">
      <div className="h-medsum-grid">
        {H_MED_SUMMARY.map(c => <MedSummaryCard key={c.k} c={c} onOpen={setDetail} />)}
      </div>
      {tiles.length > 0 && <TileGrid items={tiles} />}
      <div className="h-vgroup-label">Care Team</div>
      <CareTeamCards />
    </div>
  );
}

/* ---------- Health destination (Overview + My Health sections) ---------- */
function Overview() {
  return (
    <div className="h-overview">
      <HDevices />
      <Snapshot />
      <div className="h-grid">
        <Vitals />
        <Food />
        <Readiness />
        <Alerts />
        <Tasks />
      </div>
    </div>
  );
}
function HealthView() {
  const tabs = ["Overview", "Medical Profile", "Body Metrics", "Mood & Energy"];
  const [tab, setTab] = useState("Overview");
  return (
    <div className="h-healthview">
      <div className="h-seg h-seg-lg">
        {tabs.map(t => <button key={t} className={tab === t ? "on" : ""} onClick={() => setTab(t)}>{t}</button>)}
      </div>
      {tab === "Overview" && <Overview />}
      {tab === "Medical Profile" && <MedicalProfileView />}
      {tab === "Body Metrics" && <BodyMetricsView />}
      {tab === "Mood & Energy" && <MoodPanel />}
    </div>
  );
}

/* ---------- root ---------- */
/* ---------- Health Buddy MVP (placeholder) ---------- */
function HealthMVP() {
  return (
    <div className="h-shell fade-up">
      <div className="h-mvp-ph">
        <span className="h-mvp-ph-ic">{React.createElement(Icon.spark, { s: 32 })}</span>
        <h2 className="h-mvp-ph-title">Health Buddy — Dash MVP</h2>
        <p className="h-mvp-ph-sub">This view will contain the curated MVP experience.<br />Start by stripping this placeholder down to the sections you want.</p>
      </div>
    </div>
  );
}
/* ---------- Community: events + trials ---------- */
function CommunityView() {
  const [tab, setTab] = useState("events");
  const [cat, setCat] = useState("All");
  const [joined, setJoined] = useState(() => H_COM_EVENTS.filter(e => e.joined).map(e => e.id));
  const toggle = (id) => setJoined(j => j.includes(id) ? j.filter(x => x !== id) : j.concat(id));
  const shown = cat === "All" ? H_COM_EVENTS : H_COM_EVENTS.filter(e => e.cat === cat);
  const Row = ({ ic, children }) => (
    <span className="h-com-meta">{React.createElement(Icon[ic], { s: 14 })}{children}</span>
  );
  return (
    <div className="h-com">
      <div className="h-com-tabs">
        <button className={"h-com-tab" + (tab === "events" ? " on" : "")} onClick={() => setTab("events")}>
          Community Events <em>{H_COM_EVENTS.length}</em>
        </button>
        <button className={"h-com-tab" + (tab === "trials" ? " on" : "")} onClick={() => setTab("trials")}>
          Trials &amp; Research <em>{H_COM_TRIALS.length}</em>
        </button>
      </div>

      {tab === "events" ? (
        <React.Fragment>
          <div className="h-com-cats">
            {H_COM_CATS.map(c => (
              <button key={c} className={"h-com-cat" + (cat === c ? " on" : "")} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>
          <div className="h-com-note">You are registered for {joined.length} event{joined.length === 1 ? "" : "s"}.</div>
          <div className="h-com-grid">
            {shown.map(e => {
              const on = joined.includes(e.id);
              return (
                <article key={e.id} className={"h-com-card" + (on ? " is-joined" : "")}>
                  <div className="h-com-card-top">
                    <span className={"h-com-badge cat-" + e.cat.toLowerCase().replace(/\s+/g, "-")}>{e.cat}</span>
                    {on && <span className="h-com-reg">✓ Registered</span>}
                  </div>
                  <h4 className="h-com-title">{e.title}</h4>
                  <div className="h-com-metas">
                    <Row ic="calendar">{e.date}</Row>
                    <Row ic="clock">{e.time}</Row>
                    <Row ic="pin">{e.loc}</Row>
                    <Row ic="user">{e.host}</Row>
                  </div>
                  <div className="h-com-foot">
                    <span className="h-com-spots">{e.spots}</span>
                    <button className="h-btn h-btn-ghost">Details</button>
                    <button className={"h-btn " + (on ? "h-btn-ghost" : "h-btn-primary")} onClick={() => toggle(e.id)}>
                      {on ? "Leave" : "Join"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </React.Fragment>
      ) : (
        <div className="h-com-grid">
          {H_COM_TRIALS.map(t => (
            <article key={t.id} className="h-com-card">
              <div className="h-com-card-top">
                <span className="h-com-badge cat-wellness">{t.status}</span>
                <span className={"h-com-match m-" + t.match.toLowerCase()}>{t.match} match</span>
              </div>
              <h4 className="h-com-title">{t.title}</h4>
              <div className="h-com-metas">
                <Row ic="users">{t.org}</Row>
                <Row ic="heart">{t.cond}</Row>
                <Row ic="pin">{t.loc}</Row>
              </div>
              <div className="h-com-foot">
                <span className="h-com-spots">Enrolling</span>
                <button className="h-btn h-btn-ghost">Details</button>
                <button className="h-btn h-btn-primary">Learn more</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function HealthDash() {
  const [nav, setNav] = useState("health");
  const TITLES = { health: "My Health Dashboard", profile: "Profile", insights: "Insights", planner: "Planner", library: "Library", connections: "Connections", community: "Community", buddychat: "BuddyChat", governance: "Governance & Safety", settings: "Settings" };
  return (
    <div className="health fade-up">
      <div className="h-shell">
        <HNav active={nav} onNav={setNav} />
        <div className="h-pane scroll">
          <header className="h-pane-head">
            <h1 className="h-name">{TITLES[nav]}</h1>
            <span className="h-date">{React.createElement(Icon.calendar, { s: 15 })} Fri, Jun 5</span>
          </header>
          {nav === "health" && <HealthView />}
          {nav === "profile" && <ProfileView />}
          {nav === "insights" && <MixedView entries={H_INSIGHTS} />}
          {nav === "library" && <LibraryView />}
          {nav === "buddychat" && <BuddyChatView />}
          {nav === "planner" && <PlannerView />}
          {nav === "connections" && <GroupedView groups={H_GROUPS.connections} />}
          {nav === "community" && <CommunityView />}
          {nav === "settings" && <GroupedView groups={H_GROUPS.settings} />}
          {nav === "governance" && <DestEmpty label="Governance & Safety" />}
        </div>
      </div>
    </div>
  );
}

window.HealthDash = HealthDash;
