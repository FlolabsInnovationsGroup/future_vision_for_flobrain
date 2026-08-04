/* ============================================================
   executive.jsx — Executive Dashboard
   3-column layout + top navigation area. Placeholder regions
   for now — content gets filled in per the walkthrough.
   ============================================================ */

function ExecPlaceholder({ label, hint }) {
  return (
    <div className="exec-ph">
      <span className="exec-ph-label">{label}</span>
      {hint && <span className="exec-ph-hint">{hint}</span>}
    </div>
  );
}

/* Left column — Meetings & Recordings (rooms-style panel) */
const EXEC_UPCOMING = [
  { title: "Design Room", date: "Jun 19", time: "10:00 AM", who: "6 in room" },
  { title: "Space Team Room", date: "Jun 19", time: "11:30 AM", who: "4 in room" },
  { title: "Legal Room", date: "Jun 20", time: "9:00 AM", who: "0 in room" },
  { title: "MoodChanger Room", date: "Jun 20", time: "2:00 PM", who: "3 in room" },
  { title: "Data Analytics Room", date: "Jun 23", time: "1:00 PM", who: "0 in room" },
];
const EXEC_RECORDINGS = [
  { title: "Investor Update — Mar", len: "42:10", when: "Yesterday" },
  { title: "Design Crit — Wearables", len: "28:55", when: "2 days ago" },
];

function ExecMeetings({ onOpen }) {
  const [open, setOpen] = React.useState({ upcoming: true, recordings: true });
  const toggle = (k) => setOpen(o => ({ ...o, [k]: !o[k] }));
  const SECTIONS = [
    { key: "upcoming", title: "Meeting Rooms", items: EXEC_UPCOMING, icon: "video",
      sub: (m) => m.date + " · " + m.time + " · " + m.who, label: (m) => m.title },
    { key: "recordings", title: "Meeting Recordings", items: EXEC_RECORDINGS, icon: "record",
      sub: (r) => r.len + " · " + r.when, label: (r) => r.title },
  ];
  const openSecs = SECTIONS.filter(s => open[s.key]);
  const closedSecs = SECTIONS.filter(s => !open[s.key]);
  const Head = ({ s }) => (
    <button className="exec-mtg-sechead" onClick={() => toggle(s.key)}>
      <span className="exec-mtg-sectitle">{s.title}</span>
      <span className={"exec-mtg-caret" + (open[s.key] ? " open" : "")}>{React.createElement(Icon.chevDown, { s: 15 })}</span>
    </button>
  );
  return (
    <div className="exec-mtg">
      {/* Top — block video view */}
      <button className="exec-mtg-stage exec-mtg-stage-top" onClick={onOpen}>
        <span className="exec-mtg-stage-av">MA</span>
        <span className="exec-mtg-stage-live"><i />Live</span>
        <span className="exec-mtg-stage-play">{React.createElement(Icon.video, { s: 20 })}</span>
        <span className="exec-mtg-stage-cap">UX/UI Design Sync · 6 in room</span>
      </button>

      <div className="exec-mtg-body scroll">
        {openSecs.map(s => (
          <div className="exec-mtg-sec" key={s.key}>
            <Head s={s} />
            <div className="exec-mtg-list">
              {s.items.map((it, i) => (
                <button key={i} className="exec-mtg-row" onClick={onOpen}>
                  {s.key !== "upcoming" && <span className="exec-mtg-ic">{React.createElement(Icon[s.icon], { s: 15 })}</span>}
                  <span className="exec-mtg-meta">
                    <span className="exec-mtg-title">{s.label(it)}</span>
                    <span className="exec-mtg-sub">{s.sub(it)}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {closedSecs.length > 0 && (
        <div className="exec-mtg-collapsed">
          {closedSecs.map(s => <Head key={s.key} s={s} />)}
        </div>
      )}

      <div className="exec-mtg-actions">
        <button className="exec-mtg-link">{React.createElement(Icon.plus, { s: 14 })} Create New Meeting</button>
        <button className="exec-mtg-link">{React.createElement(Icon.upload, { s: 14 })} Upload New Recording</button>
      </div>
    </div>
  );
}

/* Right column — Buddies / AI Agents (replaces the old folder tabs) */
const EXEC_BUDDIES = [
  { name: "Health Buddy", domain: "Wellness & vitals", icon: "health", c: "#FF5247", online: true },
  { name: "Space Buddy", domain: "Missions & research", icon: "planet", c: "#2DD4BF", online: true },
  { name: "Data Buddy", domain: "Analytics & insights", icon: "data", c: "#FF628D", online: false },
  { name: "Legal Buddy", domain: "Compliance & ethics", icon: "scale", c: "#FF9442", online: false },
  { name: "Finance Buddy", domain: "Budgets & payments", icon: "dollar", c: "#0ACF83", online: true },
  { name: "Travel Buddy", domain: "Trips & itineraries", icon: "airplane", c: "#8478FF", online: false },
  { name: "Vault Buddy", domain: "Files & versions", icon: "lock", c: "#349CFF", online: true },
  { name: "Design Buddy", domain: "UI, brand & assets", icon: "pen", c: "#F471B5", online: true },
];

function ExecBuddies({ collapsed, onToggle, onSelect, activeBuddy }) {
  return (
    <div className={"exec-buddies" + (collapsed ? " is-collapsed" : "")}>
      <div className="exec-buddies-head">
        {!collapsed && <span className="exec-col-title">Buddies · AI Agents</span>}
        <button className="exec-buddies-toggle" onClick={onToggle} title={collapsed ? "Expand" : "Collapse"}>
          {React.createElement(Icon.chevRight, { s: 16 })}
        </button>
      </div>
      {!collapsed && <p className="exec-buddies-hint">Tap a buddy to route chat</p>}
      <div className="exec-buddies-list scroll">
        {EXEC_BUDDIES.map((b, i) => (
          <button key={i} className={"exec-buddy" + (activeBuddy === b.name ? " on" : "")} onClick={() => onSelect && onSelect(b.name)} title={b.name} data-tip={b.name}>
            <span className="exec-buddy-ic" style={{ "--bc": b.c }}>
              {React.createElement(Icon[b.icon], { s: 17 })}
              <i className={"exec-buddy-dot" + (b.online ? " on" : "")} />
            </span>
            {!collapsed && (
              <span className="exec-buddy-meta">
                <span className="exec-buddy-name">{b.name}</span>
                <span className="exec-buddy-domain">{b.domain}</span>
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

/* Center column — AI Chat with the buddies */
const EXEC_SUGGESTED = {
  "Health Buddy": ["Summarize my latest vitals", "Any wellness flags this week?"],
  "Space Buddy": ["Status of active missions", "Latest research highlights"],
  "Data Buddy": ["This week's key metrics", "Where are we trending down?"],
  "Legal Buddy": ["Pending compliance items", "Review the latest contract"],
  "Finance Buddy": ["Current budget vs. spend", "Outstanding payments"],
  "Travel Buddy": ["My upcoming trips", "Draft a Dubai itinerary"],
  "Vault Buddy": ["Find the latest wireframe", "What changed in this file?"],
  "Design Buddy": ["Review this screen's spacing", "Suggest a color for this state"],
};
const EXEC_DEFAULT_SUGGEST = ["What needs my attention today?", "Run the weekly report", "Summarize the last meeting"];

/* Sample AI conversations per buddy (role: "you" | "ai") */
const EXEC_CONVO = {
  "Travel Buddy": [
    { role: "you", text: "I need to be in Dubai for the FloLabs summit June 24–27. Can you plan the trip?" },
    { role: "ai", text: "On it. I found a nonstop departing June 23, 8:40 PM, arriving Dubai June 24, 7:15 PM local. Want me to hold a window seat and book a hotel near the summit venue?" },
    { role: "you", text: "Yes — somewhere walkable to the venue, under $300/night." },
    { role: "ai", text: "Booked the Marsa Address (4 min walk, $268/night, free cancellation). I also blocked your calendar for travel days and added the summit agenda. Anything for the return?" },
    { role: "you", text: "Push the return to the 28th so I have a buffer day." },
    { role: "ai", text: "Done — return now June 28, 11:55 PM. I'll send the full itinerary and boarding passes to your Vault and email." },
  ],
};

/* ============================================================
   Design.ai Buddy — intelligence layer over FloBrain resources.
   It does not author design assets; it reads what already lives in
   FloVault (design system, brand standards, docs, research) and
   applies it to whatever the designer brings in.
   ============================================================ */
const DB_ACTIONS = [
  { key:"review",   label:"Review Design",            hint:"Screenshot or Figma → UX, UI & a11y notes", icon:"eye" },
  { key:"flow",     label:"Analyze UX Flow",          hint:"Map the path, flag friction by user type",  icon:"send" },
  { key:"brand",    label:"Check Brand Consistency",  hint:"Against stored brand standards",            icon:"star" },
  { key:"brief",    label:"Generate Design Brief",    hint:"Client-ready brief from project docs",      icon:"file" },
  { key:"handoff",  label:"Developer Handoff Notes",  hint:"Specs, tokens & checklist for engineering", icon:"check" },
  { key:"refs",     label:"Find Design References",   hint:"Past versions & documentation in FloVault", icon:"search" },
];

/* Each answer cites the FloVault records it reasoned from — the point is
   transparency about which stored resource drove the recommendation. */
const DB_REPLIES = {
  review: {
    text: "The dashboard follows the FloHealth Buddy structure, but three things fall outside our standards:",
    findings: [
      { sev:"high", t:"Button spacing", d:"Primary actions use 12px gaps; the design system specifies 16px between stacked actions." },
      { sev:"high", t:"Primary action color", d:"#1FB6A6 is close but not the approved brand teal — use #159385." },
      { sev:"med",  t:"Contrast", d:"Secondary label on the tinted card reads 3.1:1. WCAG AA needs 4.5:1 for body text." },
      { sev:"low",  t:"Card radius", d:"16px here vs. 12px elsewhere in the product. Minor, but worth aligning." },
    ],
    sources: ["FloLabs Design System v2.4", "FloHealth Buddy — UI Spec", "Accessibility Standards"],
  },
  flow: {
    text: "Mapped the flow across your three defined user types. Friction concentrates at step 3:",
    findings: [
      { sev:"high", t:"Step 3 — Connect a device", d:"Coach users hit a personal-health screen that doesn't apply to them. 2 extra taps to escape." },
      { sev:"med",  t:"Back navigation", d:"No way back to role selection once past onboarding." },
      { sev:"low",  t:"Empty states", d:"First-run has no guidance before any data exists." },
    ],
    sources: ["User Research — Coach Interviews", "FloHealth Buddy — User Types", "Onboarding Flow v3"],
  },
  brand: {
    text: "Checked the upload against stored brand standards. Two deviations:",
    findings: [
      { sev:"high", t:"Logo clear space", d:"Mark sits 8px from the edge; standard requires 1× mark height (24px)." },
      { sev:"med",  t:"Type pairing", d:"Body set in Inter — brand standard is Space Grotesk for UI, Roboto Mono for labels." },
      { sev:"low",  t:"Accent usage", d:"Two accents competing. Brand allows one accent per surface." },
    ],
    sources: ["FloLabs Brand Standards", "Logo Usage Guide", "Typography Rules"],
  },
  brief: {
    text: "Drafted a design brief from the project documentation already in FloBrain:",
    findings: [
      { sev:"info", t:"Problem", d:"Coaches track athlete readiness across scattered notes and spreadsheets." },
      { sev:"info", t:"Audience", d:"Team coaches (primary), athletes (secondary), athletic directors (reporting)." },
      { sev:"info", t:"Success criteria", d:"Log a full practice in under 90 seconds; readiness visible at a glance." },
      { sev:"info", t:"Constraints", d:"Mobile-first, offline-tolerant, existing FloHealth design system." },
    ],
    sources: ["FloHealth Athletics — PRD", "Coach Research Summary", "Q3 Roadmap"],
  },
  handoff: {
    text: "Handoff package assembled. Pulled tokens and specs from the design system so engineering isn't guessing:",
    findings: [
      { sev:"info", t:"Tokens", d:"12 color, 8 type, 6 spacing tokens referenced by this screen — all already defined." },
      { sev:"info", t:"States", d:"Default, hover, active, disabled, loading and empty documented per component." },
      { sev:"info", t:"Responsive", d:"Breakpoints at 390 / 834 / 1280. Field board scales by normalized coordinates." },
      { sev:"med",  t:"Open question", d:"No error state defined for a failed device sync — needs a decision." },
    ],
    sources: ["FloLabs Design System v2.4", "Component Spec Sheet", "Engineering Handoff Template"],
  },
  refs: {
    text: "Found 4 related items in FloVault, newest first:",
    findings: [
      { sev:"info", t:"FloHealth Dashboard v3 — Figma", d:"Tagged: dashboard, health, mobile · Updated Jul 18" },
      { sev:"info", t:"Coach View Wireframes", d:"Tagged: coach, wireframe, athletics · Updated Jul 11" },
      { sev:"info", t:"Design System v2.4 — Components", d:"Tagged: system, components, tokens · Updated Jun 30" },
      { sev:"info", t:"Readiness Card Explorations", d:"Tagged: exploration, cards · Updated Jun 22" },
    ],
    sources: ["FloVault — Design Library"],
  },
};
const DB_DEFAULT = {
  text: "I checked the project documentation and design standards stored in FloBrain. Here's what stands out:",
  findings: [
    { sev:"med",  t:"Design system alignment", d:"Most components match. Spacing on stacked actions is the recurring gap." },
    { sev:"info", t:"Documentation", d:"Related specs and past versions are in FloVault — ask me to pull references." },
  ],
  sources: ["FloLabs Design System v2.4", "Project Documentation"],
};

function DesignBuddy() {
  const [msgs, setMsgs] = React.useState([]);
  const [val, setVal] = React.useState("");
  const [attached, setAttached] = React.useState(null);
  const [thinking, setThinking] = React.useState(false);
  const fileRef = React.useRef(null);
  const endRef = React.useRef(null);
  React.useEffect(() => { if (endRef.current) endRef.current.scrollTop = endRef.current.scrollHeight; }, [msgs, thinking]);

  const respond = (key, prompt) => {
    const reply = DB_REPLIES[key] || DB_DEFAULT;
    setMsgs(m => [...m, { role:"you", text: prompt, file: attached }]);
    setAttached(null); setVal(""); setThinking(true);
    setTimeout(() => { setThinking(false); setMsgs(m => [...m, { role:"ai", ...reply }]); }, 700);
  };
  const send = () => {
    if (!val.trim() && !attached) return;
    const q = val.toLowerCase();
    const key = /brand|logo|consistent/.test(q) ? "brand"
      : /flow|journey|navigat/.test(q) ? "flow"
      : /brief|present|client/.test(q) ? "brief"
      : /handoff|developer|engineer|spec/.test(q) ? "handoff"
      : /find|reference|previous|version|past/.test(q) ? "refs"
      : /review|check|critique|design/.test(q) ? "review" : null;
    respond(key, val.trim() || "Review this design.");
  };
  const onFile = (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) setAttached({ name: f.name, kind: "file" });
    e.target.value = "";
  };

  return (
    <div className="dbud">
      <div className="dbud-head">
        <span className="exec-buddy-ic dbud-ic" style={{ "--bc": "#F471B5" }}>{React.createElement(Icon.pen, { s: 18 })}</span>
        <span className="exec-ai-id">
          <span className="exec-ai-name">Design.ai Buddy</span>
          <span className="exec-ai-domain">Reads your FloBrain design resources</span>
        </span>
        {msgs.length > 0 && (
          <button className="dbud-new" onClick={() => { setMsgs([]); setAttached(null); }}>New chat</button>
        )}
      </div>

      <div className="dbud-feed scroll" ref={endRef}>
        {msgs.length === 0 && !thinking ? (
          <div className="dbud-intro">
            <span className="dbud-intro-ic">{React.createElement(Icon.pen, { s: 26 })}</span>
            <h2 className="dbud-intro-t">Hello Intern</h2>
            <p className="dbud-intro-s">I'm here to help with UX/UI design decisions using FloBrain project knowledge, design standards, and team resources.</p>
            <div className="dbud-actions">
              {DB_ACTIONS.map(a => (
                <button key={a.key} className="dbud-action" onClick={() => respond(a.key, a.label)}>
                  <span className="dbud-action-ic">{React.createElement(Icon[a.icon], { s: 16 })}</span>
                  <span className="dbud-action-txt">
                    <span className="dbud-action-l">{a.label}</span>
                    <span className="dbud-action-h">{a.hint}</span>
                  </span>
                </button>
              ))}
            </div>
            <p className="dbud-note">{React.createElement(Icon.lock, { s: 12 })} Answers are grounded in FloVault — design system, brand standards, docs and research.</p>
          </div>
        ) : (
          <div className="dbud-thread">
            {msgs.map((m, i) => m.role === "you" ? (
              <div className="dbud-you" key={i}>
                {m.file && <span className="dbud-chipfile">{React.createElement(Icon.attach, { s: 12 })} {m.file.name}</span>}
                <span className="dbud-you-b">{m.text}</span>
              </div>
            ) : (
              <div className="dbud-ai" key={i}>
                <span className="dbud-ai-ic">{React.createElement(Icon.pen, { s: 14 })}</span>
                <div className="dbud-ai-body">
                  <p className="dbud-ai-t">{m.text}</p>
                  <div className="dbud-find">
                    {m.findings.map((f, j) => (
                      <div className={"dbud-f dbud-f-" + f.sev} key={j}>
                        <span className="dbud-f-dot" />
                        <span className="dbud-f-txt"><b>{f.t}</b> — {f.d}</span>
                      </div>
                    ))}
                  </div>
                  <div className="dbud-src">
                    <span className="dbud-src-l">Referenced from FloBrain</span>
                    <span className="dbud-src-list">
                      {m.sources.map((s, j) => <span className="dbud-src-i" key={j}>{React.createElement(Icon.file, { s: 11 })} {s}</span>)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {thinking && (
              <div className="dbud-ai">
                <span className="dbud-ai-ic">{React.createElement(Icon.pen, { s: 14 })}</span>
                <div className="dbud-ai-body"><p className="dbud-typing">Checking FloVault resources<i/><i/><i/></p></div>
              </div>
            )}
          </div>
        )}
      </div>

      {msgs.length > 0 && (
        <div className="dbud-quick">
          {DB_ACTIONS.map(a => (
            <button key={a.key} className="exec-ai-chip" onClick={() => respond(a.key, a.label)}>{a.label}</button>
          ))}
        </div>
      )}

      <div className="dbud-compose">
        {attached && (
          <span className="dbud-attached">
            {React.createElement(Icon.attach, { s: 13 })} {attached.name}
            <button onClick={() => setAttached(null)} aria-label="Remove attachment">{React.createElement(Icon.close, { s: 12 })}</button>
          </span>
        )}
        <div className="dbud-compose-row">
          <input ref={fileRef} type="file" accept="image/*,.pdf,.fig" style={{ display: "none" }} onChange={onFile} />
          <button className="dbud-up" onClick={() => fileRef.current && fileRef.current.click()} data-tip="Upload screenshot or file">
            {React.createElement(Icon.attach, { s: 18 })}
          </button>
          <button className="dbud-up" onClick={() => setAttached({ name: "Figma — FloHealth Dashboard v3", kind: "figma" })} data-tip="Link a Figma file">
            {React.createElement(Icon.pin, { s: 18 })}
          </button>
          <input className="dbud-input" value={val} placeholder="Ask about a design, or upload a screenshot…"
            onChange={e => setVal(e.target.value)} onKeyDown={e => { if (e.key === "Enter") send(); }} />
          <button className="exec-ai-send" onClick={send}>{React.createElement(Icon.send, { s: 17 })}</button>
        </div>
      </div>
    </div>
  );
}

function ExecAIChat({ buddy }) {
  const meta = EXEC_BUDDIES.find(b => b.name === buddy);
  const suggested = (buddy && EXEC_SUGGESTED[buddy]) || EXEC_DEFAULT_SUGGEST;
  const convo = buddy && EXEC_CONVO[buddy];
  return (
    <div className="exec-ai">
      <div className="exec-ai-head">
        {meta ? (
          <React.Fragment>
            <span className="exec-buddy-ic exec-ai-ic" style={{ "--bc": meta.c }}>{React.createElement(Icon[meta.icon], { s: 18 })}</span>
            <span className="exec-ai-id">
              <span className="exec-ai-name">{meta.name}</span>
              <span className="exec-ai-domain">{meta.domain}</span>
            </span>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <span className="exec-buddy-ic exec-ai-ic exec-ai-ic-all">{React.createElement(Icon.chat, { s: 18 })}</span>
            <span className="exec-ai-id">
              <span className="exec-ai-name">AI Chat</span>
              <span className="exec-ai-domain">Ask any buddy — finance, health, travel &amp; more</span>
            </span>
          </React.Fragment>
        )}
      </div>

      <div className={"exec-ai-feed scroll" + (convo ? " has-convo" : "")}>
        {convo ? (
          convo.map((m, i) => (
            <div key={i} className={"exec-msg exec-msg-" + m.role}>
              {m.role === "ai" && <span className="exec-msg-ic" style={{ "--bc": meta.c }}>{React.createElement(Icon[meta.icon], { s: 14 })}</span>}
              <span className="exec-msg-bubble">{m.text}</span>
            </div>
          ))
        ) : (
          <div className="exec-ai-welcome">
            <span className="exec-ai-welcome-ic">{React.createElement(Icon.chat, { s: 26 })}</span>
            <p className="exec-ai-welcome-t">{buddy ? "Ask " + buddy + " anything" : "Ask your buddies anything"}</p>
            <p className="exec-ai-welcome-s">{buddy ? meta && meta.domain : "Route a question to a buddy for finance, health, travel, legal, data, or space."}</p>
          </div>
        )}
      </div>

      <div className="exec-ai-suggest">
        {suggested.map((s, i) => (
          <button key={i} className="exec-ai-chip">{s}</button>
        ))}
      </div>

      <div className="exec-ai-compose">
        <input placeholder={buddy ? "Message " + buddy + "…" : "Ask a buddy…"} />
        <button className="exec-ai-send">{React.createElement(Icon.send, { s: 17 })}</button>
      </div>
    </div>
  );
}

/* Center — existing Tasks page (intern My Tasks) */
function ExecTasks({ onOpenChat }) {
  const [task, setTask] = React.useState(null);
  return (
    <div className="exec-tasks scroll">
      {task
        ? <MTaskDetail onBack={() => setTask(null)} />
        : <MTaskTable onOpen={setTask} onOpenChat={onOpenChat} title="My Tasks" projects={["HealthBuddy", "Athletic Performance Intelligence", "FloBrain"]} />}
    </div>
  );
}

/* Center — Reports */
const EXEC_REPORT_STATS = [
  { label: "Total Hours", value: "191", unit: "of 240 hr target", pct: 80 },
  { label: "Tasks Done", value: "24", unit: "of 34 total", pct: 71 },
  { label: "Avg Impact", value: "76", unit: "of 100", pct: 76 },
  { label: "Blocked Tasks", value: "2", unit: "need attention", flag: true },
];
const EXEC_TEAM_PERF = [
  { name: "Claudia Lopez", hours: "38 / 40", tasks: "7 / 9", impact: 82, status: "On Track" },
  { name: "Mohamed Abdelmohsen", hours: "41 / 40", tasks: "6 / 7", impact: 88, status: "On Track" },
  { name: "Dina Tarek", hours: "33 / 40", tasks: "5 / 8", impact: 71, status: "At Risk" },
  { name: "Kendra Avery", hours: "29 / 40", tasks: "3 / 6", impact: 64, status: "Blocked" },
  { name: "Meryll Robles", hours: "37 / 40", tasks: "3 / 4", impact: 79, status: "On Track" },
];
const EXEC_STATUS_CLASS = { "On Track": "ok", "At Risk": "warn", "Blocked": "blocked" };
const EXEC_DEADLINES = [
  { date: "Jun 19", task: "Permission tile updates", who: "Claudia Lopez", pri: "High" },
  { date: "Jun 20", task: "Wearables wireframe review", who: "Dina Tarek", pri: "High" },
  { date: "Jun 23", task: "Investor report draft", who: "Mohamed Abdelmohsen", pri: "Medium" },
  { date: "Jun 25", task: "Onboarding flow QA", who: "Kendra Avery", pri: "Low" },
];
const EXEC_PRI_CLASS = { High: "high", Medium: "med", Low: "low" };
function ExecReports() {
  return (
    <div className="exec-reports scroll">
      <div className="exec-rep-stats">
        {EXEC_REPORT_STATS.map((s, i) => (
          <div key={i} className={"exec-rep-stat" + (s.flag ? " is-flag" : "")}>
            <span className="exec-rep-label">{s.label}</span>
            <span className="exec-rep-value">{s.value}</span>
            <span className="exec-rep-unit">{s.unit}</span>
            {typeof s.pct === "number" && (
              <span className="exec-rep-bar"><i style={{ width: s.pct + "%" }} /></span>
            )}
          </div>
        ))}
      </div>

      <div className="exec-rep-sec">
        <h3 className="exec-rep-sectitle">Team Performance — This Week</h3>
        <div className="exec-perf">
          <div className="exec-perf-row exec-perf-head">
            <span>Member</span><span>Hours</span><span>Tasks</span><span>Impact</span><span>Status</span>
          </div>
          {EXEC_TEAM_PERF.map((m, i) => (
            <div key={i} className="exec-perf-row">
              <span className="exec-perf-name">{m.name}</span>
              <span className="exec-perf-num">{m.hours}</span>
              <span className="exec-perf-num">{m.tasks}</span>
              <span className="exec-perf-impact">
                <span className="exec-perf-impbar"><i style={{ width: m.impact + "%" }} /></span>
                <span className="exec-perf-impval">{m.impact}</span>
              </span>
              <span className={"exec-perf-status st-" + EXEC_STATUS_CLASS[m.status]}>
                <i className="exec-perf-dot" />{m.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="exec-rep-sec">
        <h3 className="exec-rep-sectitle">Upcoming Deadlines</h3>
        <div className="exec-perf">
          <div className="exec-perf-row exec-dl-row exec-perf-head">
            <span>Date</span><span>Task</span><span>Assignee</span><span>Priority</span>
          </div>
          {EXEC_DEADLINES.map((d, i) => (
            <div key={i} className="exec-perf-row exec-dl-row">
              <span className="exec-dl-date">{d.date}</span>
              <span className="exec-perf-name">{d.task}</span>
              <span className="exec-perf-num exec-dl-who">{d.who}</span>
              <span className={"exec-pri st-" + EXEC_PRI_CLASS[d.pri]}>
                <i className="exec-perf-dot" />{d.pri}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   ExecLeadership — Leadership Dashboard
   ============================================================ */

const LEAD_INTERNS = [
  { name:"Claudia Lopez",      initials:"CL", team:"Team 1", role:"UX Designer",        project:"FloBrain Portal",   status:"On Track", hours:"38/40", specialty:"Human-Computer Interaction", school:"UCLA"            },
  { name:"Mohamed Abdelmohsen",initials:"MA", team:"Team 2", role:"AI Engineer",         project:"FloHealth Buddy",   status:"On Track", hours:"41/40", specialty:"Machine Learning",            school:"Cairo Univ."     },
  { name:"Dina Tarek",         initials:"DT", team:"Team 1", role:"UX Researcher",       project:"FloBrain Portal",   status:"At Risk",  hours:"33/40", specialty:"Cognitive Psychology",        school:"AUC"             },
  { name:"Kendra Avery",       initials:"KA", team:"Team 2", role:"Data Scientist",      project:"FloHealth Buddy",   status:"Blocked",  hours:"29/40", specialty:"Biostatistics",              school:"Johns Hopkins"   },
  { name:"Meryll Robles",      initials:"MR", team:"Team 3", role:"Marketing Strategist",project:"CAIPO",             status:"On Track", hours:"37/40", specialty:"Digital Marketing",           school:"NYU"             },
  { name:"Priya Sharma",       initials:"PS", team:"Team 1", role:"Visual Designer",     project:"FloBrain Portal",   status:"On Track", hours:"40/40", specialty:"Graphic Design",              school:"RISD"            },
  { name:"Raj Patel",          initials:"RP", team:"Team 4", role:"Backend Engineer",    project:"RoboCollective",    status:"On Track", hours:"39/40", specialty:"Distributed Systems",         school:"Georgia Tech"    },
  { name:"Aisha Mohammed",     initials:"AM", team:"Team 3", role:"Content Strategist",  project:"CAIPO",             status:"On Track", hours:"36/40", specialty:"Communications",              school:"Northwestern"    },
  { name:"Leo Kim",            initials:"LK", team:"Team 4", role:"Systems Engineer",    project:"RoboCollective",    status:"On Track", hours:"40/40", specialty:"Robotics",                    school:"MIT"             },
  { name:"Sara Nasser",        initials:"SN", team:"Team 2", role:"ML Researcher",       project:"FloHealth Buddy",   status:"At Risk",  hours:"31/40", specialty:"Neural Networks",             school:"Stanford"        },
  { name:"James Park",         initials:"JP", team:"Team 3", role:"Brand Designer",      project:"CAIPO",             status:"On Track", hours:"38/40", specialty:"Brand Strategy",              school:"Parsons"         },
  { name:"Fatima Hassan",      initials:"FH", team:"Team 4", role:"Hardware Engineer",   project:"RoboCollective",    status:"On Track", hours:"40/40", specialty:"Embedded Systems",            school:"UT Austin"       },
];

const INTERN_STATUS_COLOR = { "On Track":"#0ACF83", "At Risk":"#FF9442", "Blocked":"#FF5247" };

function InternCard({ intern, onClick }) {
  const c = INTERN_STATUS_COLOR[intern.status] || "#349CFF";
  const teamC = TEAM_COLORS[intern.team] || { bg:"#349CFF22", border:"#349CFF", text:"#349CFF" };
  return (
    <div onClick={onClick} style={{background:'var(--glass-quiet,rgba(255,255,255,.06))',border:'1px solid var(--glass-border)',borderRadius:14,padding:20,cursor:'pointer',transition:'border-color .15s, transform .15s'}}
      onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(52,156,255,.4)';e.currentTarget.style.transform='translateY(-2px)';}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--glass-border)';e.currentTarget.style.transform='none';}}>
      <div style={{display:'flex',alignItems:'flex-start',gap:12,marginBottom:14}}>
        <div style={{width:44,height:44,borderRadius:12,background:`color-mix(in srgb, ${c} 20%, transparent)`,color:c,font:'700 16px/44px var(--font)',textAlign:'center',flexShrink:0}}>{intern.initials}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{font:'700 14px/1.2 var(--font)',color:'var(--ink)',marginBottom:2,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{intern.name}</div>
          <div style={{font:'400 12px/1 var(--font)',color:'var(--ink-faint)'}}>{intern.role}</div>
        </div>
        <div style={{background:`${c}22`,color:c,font:'700 10px/1 var(--font)',padding:'4px 8px',borderRadius:999,flexShrink:0}}>{intern.status}</div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:7}}>
        <div style={{display:'flex',justifyContent:'space-between'}}>
          <span style={{font:'400 11px/1 var(--font)',color:'var(--ink-faint)'}}>Team</span>
          <span style={{font:'600 11px/1 var(--font)',color:teamC.text,background:teamC.bg,padding:'2px 8px',borderRadius:999}}>{intern.team}</span>
        </div>
        <div style={{display:'flex',justifyContent:'space-between'}}>
          <span style={{font:'400 11px/1 var(--font)',color:'var(--ink-faint)'}}>Project</span>
          <span style={{font:'500 11px/1 var(--font)',color:'var(--ink)',textAlign:'right',maxWidth:120,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{intern.project}</span>
        </div>
        <div style={{display:'flex',justifyContent:'space-between'}}>
          <span style={{font:'400 11px/1 var(--font)',color:'var(--ink-faint)'}}>Hours</span>
          <span style={{font:'500 11px/1 var(--font)',color:'var(--ink)'}}>{intern.hours}</span>
        </div>
        <div style={{borderTop:'1px solid var(--glass-border)',paddingTop:8,marginTop:2}}>
          <div style={{font:'400 10px/1 var(--font)',color:'var(--ink-faint)',marginBottom:2}}>Specialization</div>
          <div style={{font:'500 11px/1.3 var(--font)',color:'var(--ink)'}}>{intern.specialty}</div>
          <div style={{font:'400 10px/1 var(--font)',color:'var(--ink-faint)',marginTop:2}}>{intern.school}</div>
        </div>
      </div>
    </div>
  );
}

function InternDetail({ intern, onBack }) {
  const c = INTERN_STATUS_COLOR[intern.status] || "#349CFF";
  const teamC = TEAM_COLORS[intern.team] || { bg:"#349CFF22", border:"#349CFF", text:"#349CFF" };
  return (
    <div>
      <button onClick={onBack} style={{background:'none',border:'none',color:'#349CFF',font:'500 13px/1 var(--font)',cursor:'pointer',marginBottom:16,display:'inline-flex',alignItems:'center',gap:4}}>← Back to Interns</button>
      <div style={{background:'var(--glass-quiet,rgba(255,255,255,.06))',border:'1px solid var(--glass-border)',borderRadius:14,padding:24,marginBottom:16}}>
        <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:20}}>
          <div style={{width:60,height:60,borderRadius:16,background:`color-mix(in srgb, ${c} 20%, transparent)`,color:c,font:'700 22px/60px var(--font)',textAlign:'center',flexShrink:0}}>{intern.initials}</div>
          <div>
            <div style={{font:'700 20px/1.2 var(--font)',color:'var(--ink)'}}>{intern.name}</div>
            <div style={{font:'400 13px/1 var(--font)',color:'var(--ink-faint)',marginTop:4}}>{intern.role}</div>
            <div style={{display:'flex',gap:8,marginTop:8}}>
              <span style={{background:`${c}22`,color:c,font:'700 10px/1 var(--font)',padding:'4px 8px',borderRadius:999}}>{intern.status}</span>
              <span style={{background:teamC.bg,color:teamC.text,font:'600 10px/1 var(--font)',padding:'4px 8px',borderRadius:999}}>{intern.team}</span>
            </div>
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:1,background:'var(--glass-border)',borderRadius:10,overflow:'hidden'}}>
          {[
            {l:'School',v:intern.school},{l:'Specialization',v:intern.specialty},
            {l:'Current Project',v:intern.project},{l:'Hours This Week',v:intern.hours},
          ].map((r,i)=>(
            <div key={i} style={{padding:'14px 16px',background:'var(--glass-quiet,rgba(255,255,255,.04))'}}>
              <div style={{font:'400 11px/1 var(--font)',color:'var(--ink-faint)',textTransform:'uppercase',letterSpacing:'.6px',marginBottom:4}}>{r.l}</div>
              <div style={{font:'600 13px/1 var(--font)',color:'var(--ink)'}}>{r.v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const DEPT_TEAMS = [
  {
    id:"design", name:"Design", icon:"🎨", color:"#349CFF",
    lead:"Sarah Chen", members:8, status:"On Track", pct:82,
    desc:"UX research, product design, prototyping and visual identity.",
    projects:["FloBrain Portal","CAIPO"],
    tasks:{done:14,total:18},
    interns:["Claudia Lopez","Dina Tarek","Priya Sharma","James Park"],
  },
  {
    id:"ai", name:"AI & Data", icon:"🤖", color:"#8478FF",
    lead:"John Marcus", members:11, status:"At Risk", pct:64,
    desc:"Machine learning models, data pipelines and AI integrations.",
    projects:["FloHealth Buddy","RoboCollective"],
    tasks:{done:9,total:14},
    interns:["Mohamed Abdelmohsen","Kendra Avery","Sara Nasser","Leo Kim"],
  },
  {
    id:"marketing", name:"Marketing", icon:"📣", color:"#0ACF83",
    lead:"Emily Torres", members:7, status:"On Track", pct:91,
    desc:"Brand, growth, content strategy, campaigns and partnerships.",
    projects:["CAIPO","FloHealth Buddy"],
    tasks:{done:21,total:23},
    interns:["Meryll Robles","Aisha Mohammed","James Park"],
  },
  {
    id:"engineering", name:"Engineering", icon:"⚙️", color:"#FF628D",
    lead:"Raj Patel", members:13, status:"On Track", pct:88,
    desc:"Backend systems, infrastructure, APIs and hardware integration.",
    projects:["FloBrain Portal","RoboCollective"],
    tasks:{done:17,total:19},
    interns:["Raj Patel","Leo Kim","Fatima Hassan"],
  },
  {
    id:"research", name:"Research", icon:"🔬", color:"#FF9442",
    lead:"Dr. Amina Osei", members:6, status:"On Track", pct:78,
    desc:"User research, competitive analysis, academic partnerships and space tech R&D.",
    projects:["CAIPO","RoboCollective"],
    tasks:{done:11,total:14},
    interns:["Sara Nasser","Dina Tarek","Priya Sharma"],
  },
];

function TeamCard({ team, onClick }) {
  const pct = team.pct;
  return (
    <div onClick={onClick}
      style={{background:'var(--glass-quiet,rgba(255,255,255,.06))',border:`1px solid var(--glass-border)`,borderRadius:14,padding:22,cursor:'pointer',transition:'border-color .15s,transform .15s',borderTop:`3px solid ${team.color}`}}
      onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.borderColor=team.color;}}
      onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.borderColor='var(--glass-border)';}}>
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:14}}>
        <div style={{width:44,height:44,borderRadius:12,background:`${team.color}22`,font:'700 22px/44px var(--font)',textAlign:'center',flexShrink:0}}>{team.icon}</div>
        <div style={{flex:1}}>
          <div style={{font:'700 16px/1 var(--font)',color:'var(--ink)',marginBottom:3}}>{team.name}</div>
          <div style={{font:'400 11px/1 var(--font)',color:'var(--ink-faint)'}}>Lead: {team.lead}</div>
        </div>
        <span style={{background:`${LEAD_STATUS_CLASS[team.status]==='ok'?'#0ACF83':LEAD_STATUS_CLASS[team.status]==='warn'?'#FF9442':'#FF5247'}22`,color:LEAD_STATUS_CLASS[team.status]==='ok'?'#0ACF83':LEAD_STATUS_CLASS[team.status]==='warn'?'#FF9442':'#FF5247',font:'700 10px/1 var(--font)',padding:'4px 8px',borderRadius:999}}>{team.status}</span>
      </div>
      <p style={{font:'400 12px/1.5 var(--font)',color:'var(--ink-faint)',marginBottom:14}}>{team.desc}</p>
      <div style={{marginBottom:10}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
          <span style={{font:'500 11px/1 var(--font)',color:'var(--ink-faint)'}}>Progress</span>
          <span style={{font:'700 11px/1 var(--font)',color:team.color}}>{pct}%</span>
        </div>
        <div style={{height:5,background:'var(--glass-border)',borderRadius:99,overflow:'hidden'}}>
          <div style={{height:'100%',width:pct+'%',background:team.color,borderRadius:99}}/>
        </div>
      </div>
      <div style={{display:'flex',justifyContent:'space-between'}}>
        <span style={{font:'400 11px/1 var(--font)',color:'var(--ink-faint)'}}>{team.members} members</span>
        <span style={{font:'400 11px/1 var(--font)',color:'var(--ink-faint)'}}>{team.tasks.done}/{team.tasks.total} tasks done</span>
      </div>
    </div>
  );
}

function TeamDetail({ team, onBack }) {
  const teamInterns = LEAD_INTERNS.filter(i => team.interns.includes(i.name));
  return (
    <div>
      <button onClick={onBack} style={{background:'none',border:'none',color:'#349CFF',font:'500 13px/1 var(--font)',cursor:'pointer',marginBottom:16,display:'inline-flex',alignItems:'center',gap:4}}>← Back to Teams</button>
      {/* Header */}
      <div style={{background:'var(--glass-quiet,rgba(255,255,255,.06))',border:`1px solid var(--glass-border)`,borderTop:`3px solid ${team.color}`,borderRadius:14,padding:24,marginBottom:16}}>
        <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:12}}>
          <div style={{width:56,height:56,borderRadius:14,background:`${team.color}22`,font:'700 26px/56px var(--font)',textAlign:'center',flexShrink:0}}>{team.icon}</div>
          <div>
            <div style={{font:'700 20px/1 var(--font)',color:'var(--ink)',marginBottom:4}}>{team.name}</div>
            <div style={{font:'400 12px/1 var(--font)',color:'var(--ink-faint)'}}>Lead: {team.lead} · {team.members} members</div>
          </div>
          <span style={{marginLeft:'auto',background:`${team.color}22`,color:team.color,font:'700 11px/1 var(--font)',padding:'5px 12px',borderRadius:999}}>{team.status}</span>
        </div>
        <p style={{font:'400 13px/1.5 var(--font)',color:'var(--ink-faint)',marginBottom:14}}>{team.desc}</p>
        {/* Progress */}
        <div style={{marginBottom:4}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
            <span style={{font:'600 12px/1 var(--font)',color:'var(--ink-faint)',textTransform:'uppercase',letterSpacing:'.6px'}}>Overall Progress</span>
            <span style={{font:'700 13px/1 var(--font)',color:team.color}}>{team.pct}%</span>
          </div>
          <div style={{height:7,background:'var(--glass-border)',borderRadius:99,overflow:'hidden'}}>
            <div style={{height:'100%',width:team.pct+'%',background:team.color,borderRadius:99}}/>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:16}}>
        {[
          {l:'Tasks Done',v:`${team.tasks.done} / ${team.tasks.total}`,c:team.color},
          {l:'Active Projects',v:team.projects.length,c:'#349CFF'},
          {l:'Interns',v:teamInterns.length,c:'#8478FF'},
        ].map((s,i)=>(
          <div key={i} style={{background:'var(--glass-quiet,rgba(255,255,255,.06))',border:'1px solid var(--glass-border)',borderRadius:10,padding:'16px',textAlign:'center'}}>
            <div style={{font:'700 24px/1 var(--font)',color:s.c,marginBottom:4}}>{s.v}</div>
            <div style={{font:'400 11px/1 var(--font)',color:'var(--ink-faint)'}}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Projects */}
      <div style={{marginBottom:16}}>
        <div style={{font:'700 12px/1 var(--font)',color:'var(--ink)',textTransform:'uppercase',letterSpacing:'.8px',marginBottom:10}}>Projects</div>
        {team.projects.map((p,i)=>{
          const proj = LEAD_PROJECTS.find(lp=>lp.name===p);
          return proj ? (
            <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 0',borderTop:i>0?'1px solid var(--glass-border)':'none'}}>
              <span style={{font:'600 13px/1 var(--font)',color:'var(--ink)',flex:1}}>{proj.name}</span>
              <div style={{width:80,height:5,background:'var(--glass-border)',borderRadius:99,overflow:'hidden'}}>
                <div style={{height:'100%',width:proj.pct+'%',background:team.color,borderRadius:99}}/>
              </div>
              <span style={{font:'600 11px/1 var(--font)',color:team.color,width:32,textAlign:'right'}}>{proj.pct}%</span>
              <span className={"exec-perf-status st-"+LEAD_STATUS_CLASS[proj.status]}><i className="exec-perf-dot"/>{proj.status}</span>
            </div>
          ) : null;
        })}
      </div>

      {/* Interns */}
      {teamInterns.length > 0 && (
        <div>
          <div style={{font:'700 12px/1 var(--font)',color:'var(--ink)',textTransform:'uppercase',letterSpacing:'.8px',marginBottom:10}}>Interns</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:10}}>
            {teamInterns.map((intern,i)=>(
              <div key={i} style={{background:'var(--glass-quiet,rgba(255,255,255,.06))',border:'1px solid var(--glass-border)',borderRadius:10,padding:'12px 14px',display:'flex',alignItems:'center',gap:10}}>
                <div style={{width:34,height:34,borderRadius:9,background:`${INTERN_STATUS_COLOR[intern.status]||'#349CFF'}22`,color:INTERN_STATUS_COLOR[intern.status]||'#349CFF',font:'700 12px/34px var(--font)',textAlign:'center',flexShrink:0}}>{intern.initials}</div>
                <div>
                  <div style={{font:'600 12px/1 var(--font)',color:'var(--ink)'}}>{intern.name}</div>
                  <div style={{font:'400 10px/1 var(--font)',color:'var(--ink-faint)',marginTop:2}}>{intern.role}</div>
                </div>
                <span style={{marginLeft:'auto',font:'700 10px/1 var(--font)',color:INTERN_STATUS_COLOR[intern.status]||'#349CFF'}}>{intern.hours}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const LEAD_SUMMARY = [
  { label: "Total Interns",              value: "39",  icon: "users",   color: "#349CFF" },
  { label: "Active Projects",            value: "4",   icon: "grid",    color: "#0ACF83" },
  { label: "Tasks Completed This Week",  value: "61",  icon: "check",   color: "#8478FF" },
  { label: "Projects Needing Attention", value: "1",   icon: "pulse",   color: "#FF5247", flag: true },
];

const LEAD_TEAMS = [
  { team: "Team 1",    lead: "Sarah Chen",   status: "On Track", pct: 82, members: 8  },
  { team: "Team 2",    lead: "John Marcus",  status: "At Risk",  pct: 64, members: 11 },
  { team: "Team 3",  lead: "Emily Torres", status: "On Track", pct: 91, members: 7  },
  { team: "Team 4",lead: "Raj Patel",    status: "On Track", pct: 88, members: 13 },
];

const LEAD_PROJECTS = [
  { name: "FloBrain Portal",        owner: "Sarah Chen",   due: "Aug 1",  pct: 78, status: "On Track" },
  { name: "FloHealth Buddy",        owner: "Raj Patel",    due: "Jul 25", pct: 64, status: "At Risk"  },
  { name: "RoboCollective",         owner: "John Marcus",  due: "Sep 15", pct: 42, status: "On Track" },
  { name: "CAIPO",                  owner: "Emily Torres", due: "Oct 1",  pct: 29, status: "On Track" },
];

const LEAD_ACTIVITY = [
  { icon: "userAdd", text: "New intern joined — Priya Sharma (Team 1)", time: "2h ago",   color: "#349CFF" },
  { icon: "check",   text: "Team Lead approved task — Figma Prototype v3", time: "4h ago", color: "#0ACF83" },
  { icon: "grid",    text: "Project milestone reached — FloBrain Portal v2", time: "Yesterday", color: "#8478FF" },
  { icon: "video",   text: "Meeting scheduled — Leadership Sync Jul 14 10am", time: "Yesterday", color: "#FF9442" },
  { icon: "trophy",  text: "Project completed — Onboarding Flow QA", time: "2 days ago",   color: "#0ACF83" },
  { icon: "send",    text: "Task delegated — Investor Deck to Mohamed A.", time: "2 days ago", color: "#FF628D" },
];

const LEAD_MEETINGS = [
  { title: "Leadership Weekly Sync",  date: "Jul 14", time: "10:00 AM", who: "All leads" },
  { title: "Team 1 Review",          date: "Jul 15", time: "2:00 PM",  who: "Team 1"   },
  { title: "Investor Update Prep",    date: "Jul 16", time: "11:00 AM", who: "Exec + Leads" },
  { title: "Team 2 Sprint Planning", date: "Jul 17", time: "9:30 AM",  who: "Team 2"   },
];

const LEAD_RESOURCES = [
  { label: "Company Policies",    icon: "file",     desc: "HR, conduct, remote work" },
  { label: "Templates",           icon: "grid",     desc: "Decks, briefs, proposals" },
  { label: "Training Guides",     icon: "openBook", desc: "Onboarding & protocols"   },
  { label: "Brand Assets",        icon: "bolt",     desc: "Logos, colors, type"      },
  { label: "Announcements",       icon: "send",     desc: "Org-wide communications"  },
];

const LEAD_STATUS_CLASS = { "On Track": "ok", "At Risk": "warn", "Blocked": "blocked" };

const TEAM_COLORS = {
  "Team 1":    { bg: "#349CFF22", border: "#349CFF", text: "#349CFF" },
  "Team 2":    { bg: "#8478FF22", border: "#8478FF", text: "#8478FF" },
  "Team 3":  { bg: "#0ACF8322", border: "#0ACF83", text: "#0ACF83" },
  "Team 4":{ bg: "#FF628D22", border: "#FF628D", text: "#FF628D" },
};

const LEAD_CAL_EVENTS = [
  { day: 1,  team: "Team 1",     title: "Design Sprint Kickoff",     time: "10:00 AM" },
  { day: 2,  team: "Team 2",     title: "Model Review Session",      time: "2:00 PM"  },
  { day: 3,  team: "Team 3",   title: "Campaign Launch",           time: "9:00 AM"  },
  { day: 5,  team: "Team 4", title: "Sprint Planning",           time: "11:00 AM" },
  { day: 7,  team: "Team 1",     title: "Prototype Review",          time: "3:00 PM"  },
  { day: 8,  team: "Team 2",     title: "Data Pipeline QA",          time: "1:00 PM"  },
  { day: 9,  team: "Team 4", title: "Backend Deploy",            time: "10:00 AM" },
  { day: 10, team: "Team 3",   title: "Content Calendar Review",   time: "2:00 PM"  },
  { day: 11, team: "Team 1",     title: "User Testing Session",      time: "10:00 AM" },
  { day: 14, team: "Team 2",     title: "Leadership Sync",           time: "10:00 AM" },
  { day: 14, team: "Team 4", title: "Architecture Review",       time: "2:00 PM"  },
  { day: 15, team: "Team 1",     title: "Figma Handoff",             time: "11:00 AM" },
  { day: 16, team: "Team 3",   title: "Investor Deck Prep",        time: "1:00 PM"  },
  { day: 17, team: "Team 4", title: "QA Testing",                time: "9:00 AM"  },
  { day: 18, team: "Team 2",     title: "Model Deployment",          time: "3:00 PM"  },
  { day: 21, team: "Team 1",     title: "Weekly Design Review",      time: "10:00 AM" },
  { day: 22, team: "Team 3",   title: "Social Media Batch",        time: "2:00 PM"  },
  { day: 23, team: "Team 4", title: "Code Freeze",               time: "5:00 PM"  },
  { day: 24, team: "Team 2",     title: "Performance Benchmarking",  time: "11:00 AM" },
  { day: 25, team: "Team 1",     title: "Stakeholder Presentation",  time: "1:00 PM"  },
  { day: 28, team: "Team 4", title: "Release v2.1",              time: "9:00 AM"  },
  { day: 29, team: "Team 3",   title: "Monthly Analytics Review",  time: "2:00 PM"  },
  { day: 30, team: "Team 2",     title: "Sprint Retrospective",      time: "3:00 PM"  },
  { day: 31, team: "Team 1",     title: "Q3 Planning Session",       time: "10:00 AM" },
];

function LeadCalendar() {
  const [selDay, setSelDay] = React.useState(11);
  const [filterTeam, setFilterTeam] = React.useState(null);
  const DAYS_IN_MONTH = 31;
  const FIRST_DAY = 2; // July 2026 starts on Wednesday (0=Sun)
  const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  const filtered = filterTeam ? LEAD_CAL_EVENTS.filter(e => e.team === filterTeam) : LEAD_CAL_EVENTS;
  const eventsForDay = (d) => filtered.filter(e => e.day === d);
  const selEvents = filtered.filter(e => e.day === selDay);

  return (
    <div style={{display:'flex',gap:24}}>
      {/* Calendar grid */}
      <div style={{flex:1}}>
        {/* Legend / filter */}
        <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:16}}>
          <button onClick={()=>setFilterTeam(null)} style={{padding:'5px 12px',borderRadius:999,border:`1.5px solid ${!filterTeam?'var(--ink)':'var(--glass-border)'}`,background:!filterTeam?'rgba(255,255,255,.08)':'transparent',font:'600 11px/1 var(--font)',color:'var(--ink)',cursor:'pointer'}}>All Teams</button>
          {Object.entries(TEAM_COLORS).map(([team,c])=>(
            <button key={team} onClick={()=>setFilterTeam(filterTeam===team?null:team)} style={{padding:'5px 12px',borderRadius:999,border:`1.5px solid ${filterTeam===team?c.border:'var(--glass-border)'}`,background:filterTeam===team?c.bg:'transparent',font:'600 11px/1 var(--font)',color:filterTeam===team?c.text:'var(--ink-faint)',cursor:'pointer'}}>{team}</button>
          ))}
        </div>

        {/* Month header */}
        <div style={{font:'700 16px/1 var(--font)',color:'var(--ink)',marginBottom:12}}>July 2026</div>

        {/* Day name row */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:4,marginBottom:4}}>
          {DAY_NAMES.map(d=><div key={d} style={{font:'600 11px/1 var(--font)',color:'var(--ink-faint)',textAlign:'center',padding:'4px 0'}}>{d}</div>)}
        </div>

        {/* Date grid */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:4}}>
          {Array.from({length: FIRST_DAY}).map((_,i)=><div key={'e'+i}/>)}
          {Array.from({length: DAYS_IN_MONTH}).map((_,i)=>{
            const day = i+1;
            const evs = eventsForDay(day);
            const isToday = day === 11;
            const isSel = day === selDay;
            return (
              <div key={day} onClick={()=>setSelDay(day)}
                style={{minHeight:72,borderRadius:8,border:`1px solid ${isSel?'rgba(52,156,255,.5)':'var(--glass-border)'}`,background:isSel?'rgba(52,156,255,.06)':isToday?'rgba(255,255,255,.04)':'transparent',cursor:'pointer',padding:'6px',transition:'border-color .15s'}}>
                <div style={{font:`${isToday?'700':'500'} 12px/1 var(--font)`,color:isToday?'#349CFF':'var(--ink)',marginBottom:4}}>{day}</div>
                {evs.slice(0,2).map((ev,ei)=>{
                  const c = TEAM_COLORS[ev.team];
                  return <div key={ei} style={{background:c.bg,border:`1px solid ${c.border}`,borderRadius:4,padding:'2px 5px',font:'500 10px/1.3 var(--font)',color:c.text,marginBottom:2,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{ev.title}</div>;
                })}
                {evs.length>2&&<div style={{font:'400 10px/1 var(--font)',color:'var(--ink-faint)'}}>+{evs.length-2} more</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Day detail sidebar */}
      <div style={{width:240,flexShrink:0}}>
        <div style={{font:'700 14px/1 var(--font)',color:'var(--ink)',marginBottom:12}}>July {selDay}, 2026</div>
        {selEvents.length === 0
          ? <div style={{font:'400 13px/1.5 var(--font)',color:'var(--ink-faint)'}}>No events for this day.</div>
          : selEvents.map((ev,i)=>{
              const c = TEAM_COLORS[ev.team];
              return (
                <div key={i} style={{background:c.bg,border:`1px solid ${c.border}`,borderRadius:10,padding:'12px 14px',marginBottom:10}}>
                  <div style={{font:'700 13px/1.2 var(--font)',color:'var(--ink)',marginBottom:4}}>{ev.title}</div>
                  <div style={{font:'500 11px/1 var(--font)',color:c.text,marginBottom:2}}>{ev.team}</div>
                  <div style={{font:'400 11px/1 var(--font)',color:'var(--ink-faint)'}}>{ev.time}</div>
                </div>
              );
            })
        }
      </div>
    </div>
  );
}

function CreateTaskModal({ onClose }) {
  const [title, setTitle] = React.useState('');
  const [team, setTeam] = React.useState('Design');
  const [assignee, setAssignee] = React.useState('');
  const [project, setProject] = React.useState('FloBrain Portal');
  const [due, setDue] = React.useState('');
  const [priority, setPriority] = React.useState('Medium');
  const [desc, setDesc] = React.useState('');
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.6)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center'}} onClick={onClose}>
      <div style={{background:'var(--ws-solid,#fff)',border:'1px solid var(--glass-border,rgba(255,255,255,.1))',borderRadius:16,padding:32,width:480,maxHeight:'88vh',overflowY:'auto',boxShadow:'0 24px 64px rgba(0,0,0,.5)'}} onClick={e=>e.stopPropagation()}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24}}>
          <span style={{font:'700 18px/1 var(--font)',color:'var(--ink)'}}>Create Task</span>
          <button onClick={onClose} style={{background:'none',border:'none',font:'600 20px/1 var(--font)',color:'var(--ink-faint)',cursor:'pointer'}}>×</button>
        </div>
        <div style={{marginBottom:16}}>
          <label style={{display:'block',font:'600 12px/1 var(--font)',color:'var(--ink)',textTransform:'uppercase',letterSpacing:'.6px',marginBottom:6}}>Task Title</label>
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Finalize onboarding flow" style={{width:'100%',background:'var(--glass-bg,rgba(255,255,255,.04))',border:'1px solid var(--glass-border)',borderRadius:8,padding:'10px 12px',font:'400 14px/1 var(--font)',color:'var(--ink)',outline:'none',boxSizing:'border-box'}}/>
        </div>
        <div style={{marginBottom:16}}>
          <label style={{display:'block',font:'600 12px/1 var(--font)',color:'var(--ink)',textTransform:'uppercase',letterSpacing:'.6px',marginBottom:6}}>Description <span style={{fontWeight:400,textTransform:'none',color:'var(--ink-faint)'}}>— optional</span></label>
          <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="What needs to be done?" rows={3} style={{width:'100%',background:'var(--glass-bg,rgba(255,255,255,.04))',border:'1px solid var(--glass-border)',borderRadius:8,padding:'10px 12px',font:'400 14px/1.5 var(--font)',color:'var(--ink)',outline:'none',resize:'none',boxSizing:'border-box'}}/>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:16}}>
          <div>
            <label style={{display:'block',font:'600 12px/1 var(--font)',color:'var(--ink)',textTransform:'uppercase',letterSpacing:'.6px',marginBottom:6}}>Team</label>
            <select value={team} onChange={e=>setTeam(e.target.value)} style={{width:'100%',background:'var(--glass-bg,rgba(255,255,255,.04))',border:'1px solid var(--glass-border)',borderRadius:8,padding:'9px 12px',font:'400 13px/1 var(--font)',color:'var(--ink)',outline:'none',cursor:'pointer',boxSizing:'border-box'}}>
              {['Design','AI & Data','Marketing','Engineering','Research'].map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={{display:'block',font:'600 12px/1 var(--font)',color:'var(--ink)',textTransform:'uppercase',letterSpacing:'.6px',marginBottom:6}}>Project</label>
            <select value={project} onChange={e=>setProject(e.target.value)} style={{width:'100%',background:'var(--glass-bg,rgba(255,255,255,.04))',border:'1px solid var(--glass-border)',borderRadius:8,padding:'9px 12px',font:'400 13px/1 var(--font)',color:'var(--ink)',outline:'none',cursor:'pointer',boxSizing:'border-box'}}>
              {['FloBrain Portal','FloHealth Buddy','RoboCollective','CAIPO'].map(p=><option key={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div style={{marginBottom:16}}>
          <label style={{display:'block',font:'600 12px/1 var(--font)',color:'var(--ink)',textTransform:'uppercase',letterSpacing:'.6px',marginBottom:6}}>Assign To</label>
          <input value={assignee} onChange={e=>setAssignee(e.target.value)} placeholder="Search member…" style={{width:'100%',background:'var(--glass-bg,rgba(255,255,255,.04))',border:'1px solid var(--glass-border)',borderRadius:8,padding:'9px 12px',font:'400 13px/1 var(--font)',color:'var(--ink)',outline:'none',boxSizing:'border-box'}}/>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:24}}>
          <div>
            <label style={{display:'block',font:'600 12px/1 var(--font)',color:'var(--ink)',textTransform:'uppercase',letterSpacing:'.6px',marginBottom:6}}>Priority</label>
            <div style={{display:'flex',gap:6}}>
              {['High','Medium','Low'].map(p=>(
                <button key={p} onClick={()=>setPriority(p)} style={{flex:1,padding:'9px 0',border:`1.5px solid ${priority===p?'#349CFF':'var(--glass-border)'}`,borderRadius:8,background:priority===p?'rgba(52,156,255,.1)':'var(--glass-bg,rgba(255,255,255,.04))',font:`${priority===p?'700':'500'} 11px/1 var(--font)`,color:priority===p?'#349CFF':'var(--ink-faint)',cursor:'pointer'}}>{p}</button>
              ))}
            </div>
          </div>
          <div>
            <label style={{display:'block',font:'600 12px/1 var(--font)',color:'var(--ink)',textTransform:'uppercase',letterSpacing:'.6px',marginBottom:6}}>Due Date</label>
            <input type="date" value={due} onChange={e=>setDue(e.target.value)} style={{width:'100%',background:'var(--glass-bg,rgba(255,255,255,.04))',border:'1px solid var(--glass-border)',borderRadius:8,padding:'9px 12px',font:'400 13px/1 var(--font)',color:'var(--ink)',outline:'none',cursor:'pointer',boxSizing:'border-box'}}/>
          </div>
        </div>
        <div style={{display:'flex',gap:10}}>
          <button onClick={onClose} style={{flex:1,background:'none',border:'1px solid var(--glass-border)',borderRadius:8,padding:'12px',font:'600 13px/1 var(--font)',color:'var(--ink-faint)',cursor:'pointer'}}>Cancel</button>
          <button onClick={onClose} style={{flex:2,background:'#349CFF',border:'none',borderRadius:8,padding:'12px',font:'700 13px/1 var(--font)',color:'#fff',cursor:'pointer'}}>Create Task</button>
        </div>
      </div>
    </div>
  );
}

function CreateProjectModal({ onClose }) {
  const [name, setName] = React.useState('');
  const [category, setCategory] = React.useState('Product');
  const [desc, setDesc] = React.useState('');
  const [owner, setOwner] = React.useState('');
  const [due, setDue] = React.useState('');
  const [status, setStatus] = React.useState('🟢 Active');
  const [priority, setPriority] = React.useState('High');
  const [search, setSearch] = React.useState('');
  const [selected, setSelected] = React.useState([]);
  const ALL_MEMBERS = ["Sarah Johnson","Michael Lee","Emily Davis","Priya Sharma","Mohamed Abdelmohsen","Dina Tarek","Kendra Avery","Meryll Robles","Claudia Lopez","Raj Patel","John Marcus","Emily Torres","Sarah Chen"];
  const filtered = ALL_MEMBERS.filter(m => m.toLowerCase().includes(search.toLowerCase()));
  const toggle = (m) => setSelected(s => s.includes(m) ? s.filter(x=>x!==m) : [...s,m]);
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.6)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center'}} onClick={onClose}>
      <div style={{background:'var(--ws-solid,#fff)',border:'1px solid var(--glass-border,rgba(255,255,255,.1))',borderRadius:16,padding:32,width:540,maxHeight:'88vh',overflowY:'auto',boxShadow:'0 24px 64px rgba(0,0,0,.5)'}} onClick={e=>e.stopPropagation()}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24}}>
          <span style={{font:'700 18px/1 var(--font)',color:'var(--ink)'}}>Create Project</span>
          <button onClick={onClose} style={{background:'none',border:'none',font:'600 20px/1 var(--font)',color:'var(--ink-faint)',cursor:'pointer'}}>×</button>
        </div>

        {/* Project Name */}
        <div style={{marginBottom:16}}>
          <label style={{display:'block',font:'600 12px/1 var(--font)',color:'var(--ink)',textTransform:'uppercase',letterSpacing:'.6px',marginBottom:6}}>Project Name</label>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. FloHealth Mobile v2" style={{width:'100%',background:'var(--glass-bg,rgba(255,255,255,.04))',border:'1px solid var(--glass-border)',borderRadius:8,padding:'10px 12px',font:'400 14px/1 var(--font)',color:'var(--ink)',outline:'none',boxSizing:'border-box'}}/>
        </div>

        {/* Category */}
        <div style={{marginBottom:16}}>
          <label style={{display:'block',font:'600 12px/1 var(--font)',color:'var(--ink)',textTransform:'uppercase',letterSpacing:'.6px',marginBottom:6}}>Category</label>
          <select value={category} onChange={e=>setCategory(e.target.value)} style={{width:'100%',background:'var(--glass-bg,rgba(255,255,255,.04))',border:'1px solid var(--glass-border)',borderRadius:8,padding:'10px 12px',font:'400 14px/1 var(--font)',color:'var(--ink)',outline:'none',cursor:'pointer',boxSizing:'border-box'}}>
            {['Product','Design','Team 4','Team 3','Research','Operations','Other'].map(c=><option key={c}>{c}</option>)}
          </select>
        </div>

        {/* Description */}
        <div style={{marginBottom:16}}>
          <label style={{display:'block',font:'600 12px/1 var(--font)',color:'var(--ink)',textTransform:'uppercase',letterSpacing:'.6px',marginBottom:6}}>Description <span style={{fontWeight:400,textTransform:'none',color:'var(--ink-faint)'}}>— optional</span></label>
          <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Brief overview of the project's goals and scope." rows={3} style={{width:'100%',background:'var(--glass-bg,rgba(255,255,255,.04))',border:'1px solid var(--glass-border)',borderRadius:8,padding:'10px 12px',font:'400 14px/1.5 var(--font)',color:'var(--ink)',outline:'none',resize:'none',boxSizing:'border-box'}}/>
        </div>

        {/* Owner + Due Date */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:16}}>
          <div>
            <label style={{display:'block',font:'600 12px/1 var(--font)',color:'var(--ink)',textTransform:'uppercase',letterSpacing:'.6px',marginBottom:6}}>Project Owner</label>
            <input value={owner} onChange={e=>setOwner(e.target.value)} placeholder="Search or select…" style={{width:'100%',background:'var(--glass-bg,rgba(255,255,255,.04))',border:'1px solid var(--glass-border)',borderRadius:8,padding:'9px 12px',font:'400 13px/1 var(--font)',color:'var(--ink)',outline:'none',boxSizing:'border-box'}}/>
          </div>
          <div>
            <label style={{display:'block',font:'600 12px/1 var(--font)',color:'var(--ink)',textTransform:'uppercase',letterSpacing:'.6px',marginBottom:6}}>Due Date</label>
            <input type="date" value={due} onChange={e=>setDue(e.target.value)} style={{width:'100%',background:'var(--glass-bg,rgba(255,255,255,.04))',border:'1px solid var(--glass-border)',borderRadius:8,padding:'9px 12px',font:'400 13px/1 var(--font)',color:'var(--ink)',outline:'none',cursor:'pointer',boxSizing:'border-box'}}/>
          </div>
        </div>

        {/* Priority + Status */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:16}}>
          <div>
            <label style={{display:'block',font:'600 12px/1 var(--font)',color:'var(--ink)',textTransform:'uppercase',letterSpacing:'.6px',marginBottom:6}}>Priority</label>
            <div style={{display:'flex',gap:6}}>
              {['High','Medium','Low'].map(p=>(
                <button key={p} onClick={()=>setPriority(p)} style={{flex:1,padding:'9px 0',border:`1.5px solid ${priority===p?'#349CFF':'var(--glass-border)'}`,borderRadius:8,background:priority===p?'rgba(52,156,255,.1)':'var(--glass-bg,rgba(255,255,255,.04))',font:`${priority===p?'700':'500'} 12px/1 var(--font)`,color:priority===p?'#349CFF':'var(--ink-faint)',cursor:'pointer'}}>{p}</button>
              ))}
            </div>
          </div>
          <div>
            <label style={{display:'block',font:'600 12px/1 var(--font)',color:'var(--ink)',textTransform:'uppercase',letterSpacing:'.6px',marginBottom:6}}>Status</label>
            <select value={status} onChange={e=>setStatus(e.target.value)} style={{width:'100%',background:'var(--glass-bg,rgba(255,255,255,.04))',border:'1px solid var(--glass-border)',borderRadius:8,padding:'9px 12px',font:'400 13px/1 var(--font)',color:'var(--ink)',outline:'none',cursor:'pointer',boxSizing:'border-box'}}>
              <option>🟢 Active</option><option>🟡 At Risk</option><option>🔴 Blocked</option><option>⏸️ On Hold</option>
            </select>
          </div>
        </div>

        {/* Add Team Members */}
        <div style={{marginBottom:24}}>
          <label style={{display:'block',font:'600 12px/1 var(--font)',color:'var(--ink)',textTransform:'uppercase',letterSpacing:'.6px',marginBottom:8}}>Add Team Members</label>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search members…" style={{width:'100%',background:'var(--glass-bg,rgba(255,255,255,.04))',border:'1px solid var(--glass-border)',borderRadius:8,padding:'9px 12px',font:'400 13px/1 var(--font)',color:'var(--ink)',outline:'none',marginBottom:8,boxSizing:'border-box'}}/>
          <div style={{maxHeight:150,overflowY:'auto',border:'1px solid var(--glass-border)',borderRadius:8}}>
            {filtered.map((m,i)=>(
              <label key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 14px',borderBottom:i<filtered.length-1?'1px solid var(--glass-border)':'none',cursor:'pointer'}}>
                <input type="checkbox" checked={selected.includes(m)} onChange={()=>toggle(m)} style={{accentColor:'#349CFF',width:15,height:15}}/>
                <span style={{font:'400 13px/1 var(--font)',color:'var(--ink)'}}>{m}</span>
              </label>
            ))}
          </div>
          {selected.length>0&&<div style={{font:'400 11px/1 var(--font)',color:'var(--ink-faint)',marginTop:6}}>{selected.length} member{selected.length>1?'s':''} selected</div>}
        </div>

        <div style={{display:'flex',gap:10}}>
          <button onClick={onClose} style={{flex:1,background:'none',border:'1px solid var(--glass-border)',borderRadius:8,padding:'12px',font:'600 13px/1 var(--font)',color:'var(--ink-faint)',cursor:'pointer'}}>Cancel</button>
          <button onClick={onClose} style={{flex:2,background:'#349CFF',border:'none',borderRadius:8,padding:'12px',font:'700 13px/1 var(--font)',color:'#fff',cursor:'pointer'}}>Create Project</button>
        </div>
      </div>
    </div>
  );
}

function AssignLeadModal({ onClose }) {
  const [search, setSearch] = React.useState('');
  const [selMember, setSelMember] = React.useState('');
  const [selTeam, setSelTeamA] = React.useState('');
  const [role, setRole] = React.useState('Team Lead');
  const [notify, setNotify] = React.useState(true);
  const ALL_MEMBERS = ["Sarah Johnson","Michael Lee","Emily Davis","Priya Sharma","Mohamed Abdelmohsen","Dina Tarek","Kendra Avery","Meryll Robles","Claudia Lopez","Raj Patel","John Marcus","Emily Torres","Sarah Chen"];
  const TEAMS = ["Team 1","Team 2","Team 3","Team 4","Product"];
  const filtered = ALL_MEMBERS.filter(m => m.toLowerCase().includes(search.toLowerCase()));
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.6)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center'}} onClick={onClose}>
      <div style={{background:'var(--ws-solid,#fff)',border:'1px solid var(--glass-border,rgba(255,255,255,.1))',borderRadius:16,padding:32,width:480,maxHeight:'88vh',overflowY:'auto',boxShadow:'0 24px 64px rgba(0,0,0,.5)'}} onClick={e=>e.stopPropagation()}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24}}>
          <span style={{font:'700 18px/1 var(--font)',color:'var(--ink)'}}>Assign Team Lead</span>
          <button onClick={onClose} style={{background:'none',border:'none',font:'600 20px/1 var(--font)',color:'var(--ink-faint)',cursor:'pointer'}}>×</button>
        </div>

        {/* Select Team */}
        <div style={{marginBottom:16}}>
          <label style={{display:'block',font:'600 12px/1 var(--font)',color:'var(--ink)',textTransform:'uppercase',letterSpacing:'.6px',marginBottom:6}}>Select Team</label>
          <select value={selTeam} onChange={e=>setSelTeamA(e.target.value)} style={{width:'100%',background:'var(--glass-bg,rgba(255,255,255,.04))',border:'1px solid var(--glass-border)',borderRadius:8,padding:'10px 12px',font:'400 14px/1 var(--font)',color:'var(--ink)',outline:'none',cursor:'pointer',boxSizing:'border-box'}}>
            <option value="">— Choose a team —</option>
            {TEAMS.map(t=><option key={t}>{t}</option>)}
          </select>
        </div>

        {/* Select Member */}
        <div style={{marginBottom:16}}>
          <label style={{display:'block',font:'600 12px/1 var(--font)',color:'var(--ink)',textTransform:'uppercase',letterSpacing:'.6px',marginBottom:6}}>Select Member</label>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search members…" style={{width:'100%',background:'var(--glass-bg,rgba(255,255,255,.04))',border:'1px solid var(--glass-border)',borderRadius:8,padding:'9px 12px',font:'400 13px/1 var(--font)',color:'var(--ink)',outline:'none',marginBottom:8,boxSizing:'border-box'}}/>
          <div style={{maxHeight:180,overflowY:'auto',border:'1px solid var(--glass-border)',borderRadius:8}}>
            {filtered.map((m,i)=>(
              <label key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 14px',borderBottom:i<filtered.length-1?'1px solid var(--glass-border)':'none',cursor:'pointer',background:selMember===m?'rgba(52,156,255,.08)':'transparent'}}>
                <input type="radio" name="lead" checked={selMember===m} onChange={()=>setSelMember(m)} style={{accentColor:'#349CFF',width:15,height:15}}/>
                <span style={{font:'400 13px/1 var(--font)',color:'var(--ink)'}}>{m}</span>
                {selMember===m&&<span style={{marginLeft:'auto',font:'600 11px/1 var(--font)',color:'#349CFF'}}>Selected</span>}
              </label>
            ))}
          </div>
        </div>

        {/* Role */}
        <div style={{marginBottom:16}}>
          <label style={{display:'block',font:'600 12px/1 var(--font)',color:'var(--ink)',textTransform:'uppercase',letterSpacing:'.6px',marginBottom:6}}>Role</label>
          <div style={{display:'flex',gap:8}}>
            {['Team Lead','Co-Lead'].map(r=>(
              <button key={r} onClick={()=>setRole(r)} style={{flex:1,padding:'10px',border:`1.5px solid ${role===r?'#349CFF':'var(--glass-border)'}`,borderRadius:8,background:role===r?'rgba(52,156,255,.1)':'var(--glass-bg,rgba(255,255,255,.04))',font:`${role===r?'700':'500'} 13px/1 var(--font)`,color:role===r?'#349CFF':'var(--ink-faint)',cursor:'pointer'}}>{r}</button>
            ))}
          </div>
        </div>

        {/* Notify */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 0',borderTop:'1px solid var(--glass-border)',marginBottom:24}}>
          <div>
            <div style={{font:'600 13px/1 var(--font)',color:'var(--ink)'}}>Notify Member</div>
            <div style={{font:'400 11px/1 var(--font)',color:'var(--ink-faint)',marginTop:2}}>Send an email notification about this assignment</div>
          </div>
          <div onClick={()=>setNotify(!notify)} style={{width:44,height:24,borderRadius:12,background:notify?'#349CFF':'var(--glass-border)',cursor:'pointer',position:'relative',transition:'background .2s',flexShrink:0}}>
            <div style={{position:'absolute',top:2,left:notify?22:2,width:20,height:20,borderRadius:10,background:'#fff',transition:'left .2s',boxShadow:'0 1px 3px rgba(0,0,0,.3)'}}/>
          </div>
        </div>

        <div style={{display:'flex',gap:10}}>
          <button onClick={onClose} style={{flex:1,background:'none',border:'1px solid var(--glass-border)',borderRadius:8,padding:'12px',font:'600 13px/1 var(--font)',color:'var(--ink-faint)',cursor:'pointer'}}>Cancel</button>
          <button onClick={onClose} style={{flex:2,background:'#349CFF',border:'none',borderRadius:8,padding:'12px',font:'700 13px/1 var(--font)',color:'#fff',cursor:'pointer'}}>Assign Lead</button>
        </div>
      </div>
    </div>
  );
}

function CreateTeamModal({ onClose }) {
  const [name, setName] = React.useState('');
  const [dept, setDept] = React.useState('UX/UI');
  const [desc, setDesc] = React.useState('');
  const [lead, setLead] = React.useState('');
  const [colead, setColead] = React.useState('');
  const [status, setStatus] = React.useState('Active');
  const [visibility, setVisibility] = React.useState('Organization-wide');
  const [channel, setChannel] = React.useState('');
  const [search, setSearch] = React.useState('');
  const [selected, setSelected] = React.useState([]);
  const ALL_MEMBERS = ["Sarah Johnson","Michael Lee","Emily Davis","Priya Sharma","Mohamed Abdelmohsen","Dina Tarek","Kendra Avery","Meryll Robles","Claudia Lopez","Raj Patel","John Marcus","Emily Torres","Sarah Chen"];
  const filtered = ALL_MEMBERS.filter(m => m.toLowerCase().includes(search.toLowerCase()));
  const toggle = (m) => setSelected(s => s.includes(m) ? s.filter(x=>x!==m) : [...s,m]);
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.6)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center'}} onClick={onClose}>
      <div style={{background:'var(--ws-solid,#fff)',border:'1px solid var(--glass-border,rgba(255,255,255,.1))',borderRadius:16,padding:32,width:540,maxHeight:'88vh',overflowY:'auto',boxShadow:'0 24px 64px rgba(0,0,0,.5)'}} onClick={e=>e.stopPropagation()}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24}}>
          <span style={{font:'700 18px/1 var(--font)',color:'var(--ink)'}}>Create Team</span>
          <button onClick={onClose} style={{background:'none',border:'none',font:'600 20px/1 var(--font)',color:'var(--ink-faint)',cursor:'pointer'}}>×</button>
        </div>

        {/* Team Name */}
        <div style={{marginBottom:16}}>
          <label style={{display:'block',font:'600 12px/1 var(--font)',color:'var(--ink)',textTransform:'uppercase',letterSpacing:'.6px',marginBottom:6}}>Team Name</label>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Wearables Team 1" style={{width:'100%',background:'var(--glass-bg,rgba(255,255,255,.04))',border:'1px solid var(--glass-border)',borderRadius:8,padding:'10px 12px',font:'400 14px/1 var(--font)',color:'var(--ink)',outline:'none',boxSizing:'border-box'}}/>
        </div>

        {/* Department */}
        <div style={{marginBottom:16}}>
          <label style={{display:'block',font:'600 12px/1 var(--font)',color:'var(--ink)',textTransform:'uppercase',letterSpacing:'.6px',marginBottom:6}}>Department</label>
          <select value={dept} onChange={e=>setDept(e.target.value)} style={{width:'100%',background:'var(--glass-bg,rgba(255,255,255,.04))',border:'1px solid var(--glass-border)',borderRadius:8,padding:'10px 12px',font:'400 14px/1 var(--font)',color:'var(--ink)',outline:'none',cursor:'pointer',boxSizing:'border-box'}}>
            {['UX/UI','AI','Team 3','Team 4','Product','Other'].map(d=><option key={d}>{d}</option>)}
          </select>
        </div>

        {/* Description */}
        <div style={{marginBottom:16}}>
          <label style={{display:'block',font:'600 12px/1 var(--font)',color:'var(--ink)',textTransform:'uppercase',letterSpacing:'.6px',marginBottom:6}}>Description <span style={{fontWeight:400,textTransform:'none',color:'var(--ink-faint)'}}>— optional</span></label>
          <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Brief overview of the team's purpose." rows={3} style={{width:'100%',background:'var(--glass-bg,rgba(255,255,255,.04))',border:'1px solid var(--glass-border)',borderRadius:8,padding:'10px 12px',font:'400 14px/1.5 var(--font)',color:'var(--ink)',outline:'none',resize:'none',boxSizing:'border-box'}}/>
        </div>

        {/* Leadership */}
        <div style={{marginBottom:8,font:'600 12px/1 var(--font)',color:'var(--ink)',textTransform:'uppercase',letterSpacing:'.6px'}}>Assign Leadership</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:16}}>
          <div>
            <label style={{display:'block',font:'400 11px/1 var(--font)',color:'var(--ink-faint)',marginBottom:5}}>Team Lead</label>
            <input value={lead} onChange={e=>setLead(e.target.value)} placeholder="Search or select…" style={{width:'100%',background:'var(--glass-bg,rgba(255,255,255,.04))',border:'1px solid var(--glass-border)',borderRadius:8,padding:'9px 12px',font:'400 13px/1 var(--font)',color:'var(--ink)',outline:'none',boxSizing:'border-box'}}/>
          </div>
          <div>
            <label style={{display:'block',font:'400 11px/1 var(--font)',color:'var(--ink-faint)',marginBottom:5}}>Co-Lead <span style={{opacity:.6}}>(optional)</span></label>
            <input value={colead} onChange={e=>setColead(e.target.value)} placeholder="Search or select…" style={{width:'100%',background:'var(--glass-bg,rgba(255,255,255,.04))',border:'1px solid var(--glass-border)',borderRadius:8,padding:'9px 12px',font:'400 13px/1 var(--font)',color:'var(--ink)',outline:'none',boxSizing:'border-box'}}/>
          </div>
        </div>

        {/* Add Members */}
        <div style={{marginBottom:16}}>
          <div style={{font:'600 12px/1 var(--font)',color:'var(--ink)',textTransform:'uppercase',letterSpacing:'.6px',marginBottom:8}}>Add Members</div>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search members…" style={{width:'100%',background:'var(--glass-bg,rgba(255,255,255,.04))',border:'1px solid var(--glass-border)',borderRadius:8,padding:'9px 12px',font:'400 13px/1 var(--font)',color:'var(--ink)',outline:'none',marginBottom:8,boxSizing:'border-box'}}/>
          <div style={{maxHeight:160,overflowY:'auto',border:'1px solid var(--glass-border)',borderRadius:8}}>
            {filtered.map((m,i)=>(
              <label key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 14px',borderBottom:i<filtered.length-1?'1px solid var(--glass-border)':'none',cursor:'pointer'}}>
                <input type="checkbox" checked={selected.includes(m)} onChange={()=>toggle(m)} style={{accentColor:'#349CFF',width:15,height:15}}/>
                <span style={{font:'400 13px/1 var(--font)',color:'var(--ink)'}}>{m}</span>
              </label>
            ))}
          </div>
          {selected.length>0&&<div style={{font:'400 11px/1 var(--font)',color:'var(--ink-faint)',marginTop:6}}>{selected.length} member{selected.length>1?'s':''} selected</div>}
        </div>

        {/* Team Settings */}
        <div style={{marginBottom:8,font:'600 12px/1 var(--font)',color:'var(--ink)',textTransform:'uppercase',letterSpacing:'.6px'}}>Team Settings</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:16}}>
          <div>
            <label style={{display:'block',font:'400 11px/1 var(--font)',color:'var(--ink-faint)',marginBottom:5}}>Team Status</label>
            <select value={status} onChange={e=>setStatus(e.target.value)} style={{width:'100%',background:'var(--glass-bg,rgba(255,255,255,.04))',border:'1px solid var(--glass-border)',borderRadius:8,padding:'9px 12px',font:'400 13px/1 var(--font)',color:'var(--ink)',outline:'none',cursor:'pointer',boxSizing:'border-box'}}>
              <option>🟢 Active</option><option>⏸️ Inactive</option>
            </select>
          </div>
          <div>
            <label style={{display:'block',font:'400 11px/1 var(--font)',color:'var(--ink-faint)',marginBottom:5}}>Visibility</label>
            <select value={visibility} onChange={e=>setVisibility(e.target.value)} style={{width:'100%',background:'var(--glass-bg,rgba(255,255,255,.04))',border:'1px solid var(--glass-border)',borderRadius:8,padding:'9px 12px',font:'400 13px/1 var(--font)',color:'var(--ink)',outline:'none',cursor:'pointer',boxSizing:'border-box'}}>
              <option>Organization-wide</option><option>Private</option>
            </select>
          </div>
        </div>
        <div style={{marginBottom:24}}>
          <label style={{display:'block',font:'400 11px/1 var(--font)',color:'var(--ink-faint)',marginBottom:5}}>Default Communication Channel <span style={{opacity:.6}}>(optional)</span></label>
          <input value={channel} onChange={e=>setChannel(e.target.value)} placeholder="e.g. #ux-team-general" style={{width:'100%',background:'var(--glass-bg,rgba(255,255,255,.04))',border:'1px solid var(--glass-border)',borderRadius:8,padding:'9px 12px',font:'400 13px/1 var(--font)',color:'var(--ink)',outline:'none',boxSizing:'border-box'}}/>
        </div>

        <div style={{display:'flex',gap:10}}>
          <button onClick={onClose} style={{flex:1,background:'none',border:'1px solid var(--glass-border)',borderRadius:8,padding:'12px',font:'600 13px/1 var(--font)',color:'var(--ink-faint)',cursor:'pointer'}}>Cancel</button>
          <button onClick={onClose} style={{flex:2,background:'#349CFF',border:'none',borderRadius:8,padding:'12px',font:'700 13px/1 var(--font)',color:'#fff',cursor:'pointer'}}>Create Team</button>
        </div>
      </div>
    </div>
  );
}

function InternsView() {
  const [selIntern, setSelIntern] = React.useState(null);
  const [filterTeam, setFilterTeam] = React.useState("All");
  const [search, setSearch] = React.useState("");
  const teams = ["All", "Team 1", "Team 2", "Team 3", "Team 4"];
  const filtered = LEAD_INTERNS.filter(i =>
    (filterTeam === "All" || i.team === filterTeam) &&
    (search === "" || i.name.toLowerCase().includes(search.toLowerCase()) || i.specialty.toLowerCase().includes(search.toLowerCase()))
  );
  if (selIntern) return <div className="lead-body"><InternDetail intern={selIntern} onBack={() => setSelIntern(null)} /></div>;
  return (
    <div className="lead-body">
      <div style={{display:'flex',gap:10,alignItems:'center',flexWrap:'wrap'}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name or specialty…"
          style={{flex:1,minWidth:200,background:'var(--glass-quiet,rgba(255,255,255,.06))',border:'1px solid var(--glass-border)',borderRadius:8,padding:'9px 12px',font:'400 13px/1 var(--font)',color:'var(--ink)',outline:'none'}}/>
        <div style={{display:'flex',gap:6}}>
          {teams.map(t=>(
            <button key={t} onClick={()=>setFilterTeam(t)} style={{padding:'7px 14px',borderRadius:999,border:`1.5px solid ${filterTeam===t?'#349CFF':'var(--glass-border)'}`,background:filterTeam===t?'rgba(52,156,255,.12)':'transparent',font:`${filterTeam===t?'700':'500'} 11px/1 var(--font)`,color:filterTeam===t?'#349CFF':'var(--ink-faint)',cursor:'pointer'}}>{t}</button>
          ))}
        </div>
      </div>
      <div style={{font:'400 12px/1 var(--font)',color:'var(--ink-faint)'}}>{filtered.length} intern{filtered.length!==1?'s':''}</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
        {filtered.map((intern,i)=>(
          <InternCard key={i} intern={intern} onClick={()=>setSelIntern(intern)}/>
        ))}
      </div>
    </div>
  );
}

function ExecLeadership() {
  const [sub, setSub] = React.useState("Dashboard");
  const [selTeam, setSelTeam] = React.useState(null);
  const [showCreateTeam, setShowCreateTeam] = React.useState(false);
  const [showAssignLead, setShowAssignLead] = React.useState(false);
  const [showCreateProject, setShowCreateProject] = React.useState(false);
  const [showCreateTask, setShowCreateTask] = React.useState(false);
  const SUBNAV = ["Dashboard", "Interns", "Teams", "Projects", "Calendar", "Reports"];

  return (
    <div className="exec-leadership scroll">
      {/* Sub-nav */}
      <div className="lead-subnav">
        {SUBNAV.map(s => (
          <button key={s}
            className={"lead-sublink" + (sub === s ? " on" : "")}
            onClick={() => { setSub(s); setSelTeam(null); }}>
            {s}
          </button>
        ))}
      </div>

      {/* Quick Actions bar */}
      <div className="lead-actions">
        {["Create Team","Create Project","Create Task"].map((a,i) => (
          <button key={i} className="lead-action-btn" onClick={a==="Create Team"?()=>setShowCreateTeam(true):a==="Create Project"?()=>setShowCreateProject(true):a==="Create Task"?()=>setShowCreateTask(true):undefined}>{a}</button>
        ))}
      </div>
      {showCreateTeam&&<CreateTeamModal onClose={()=>setShowCreateTeam(false)}/>}
      {showAssignLead&&<AssignLeadModal onClose={()=>setShowAssignLead(false)}/>}
      {showCreateProject&&<CreateProjectModal onClose={()=>setShowCreateProject(false)}/>}
      {showCreateTask&&<CreateTaskModal onClose={()=>setShowCreateTask(false)}/>}

      {/* ── Interns ── */}
      {sub === "Interns" && (
        <InternsView />
      )}

      {/* ── Dashboard ── */}
      {sub === "Dashboard" && (
        <div className="lead-body">
          {/* Summary cards */}
          <div className="lead-summary">
            {LEAD_SUMMARY.map((s,i) => (
              <div key={i} className={"lead-stat" + (s.flag ? " is-flag" : "")} style={{"--sc": s.color}}>
                <div className="lead-stat-ic">{React.createElement(Icon[s.icon], { s: 22 })}</div>
                <div className="lead-stat-val">{s.value}</div>
                <div className="lead-stat-lbl">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Team overview table */}
          <div className="lead-section">
            <h3 className="lead-sec-title">Team Overview</h3>
            <div className="exec-perf">
              <div className="exec-perf-row exec-perf-head">
                <span>Team</span><span>Lead</span><span>Members</span><span>Progress</span><span>Status</span>
              </div>
              {LEAD_TEAMS.map((t,i) => (
                <div key={i} className="exec-perf-row lead-team-row" onClick={() => { setSub("Teams"); setSelTeam(t); }}>
                  <span className="exec-perf-name">{t.team}</span>
                  <span className="exec-perf-num">{t.lead}</span>
                  <span className="exec-perf-num">{t.members}</span>
                  <span className="exec-perf-impact">
                    <span className="exec-perf-impbar"><i style={{ width: t.pct + "%" }} /></span>
                    <span className="exec-perf-impval">{t.pct}%</span>
                  </span>
                  <span className={"exec-perf-status st-" + LEAD_STATUS_CLASS[t.status]}>
                    <i className="exec-perf-dot" />{t.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity feed */}
          <div className="lead-section">
            <h3 className="lead-sec-title">Organization Activity</h3>
            <div className="lead-activity">
              {LEAD_ACTIVITY.map((a,i) => (
                <div key={i} className="lead-act-row">
                  <span className="lead-act-ic" style={{"--ac": a.color}}>{React.createElement(Icon[a.icon], { s: 14 })}</span>
                  <span className="lead-act-text">{a.text}</span>
                  <span className="lead-act-time">{a.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Teams ── */}
      {sub === "Teams" && !selTeam && (
        <div className="lead-body">
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
            {DEPT_TEAMS.map((t,i)=>(
              <TeamCard key={i} team={t} onClick={()=>setSelTeam(t)}/>
            ))}
          </div>
        </div>
      )}

      {/* ── Team Detail ── */}
      {sub === "Teams" && selTeam && (
        <div className="lead-body">
          <TeamDetail team={selTeam} onBack={()=>setSelTeam(null)}/>
        </div>
      )}

      {/* ── Projects ── */}
      {sub === "Projects" && (
        <div className="lead-body">
          <div className="lead-section">
            <h3 className="lead-sec-title">Organization Projects</h3>
            <div className="exec-perf">
              <div className="exec-perf-row exec-perf-head">
                <span>Project</span><span>Owner</span><span>Due</span><span>Progress</span><span>Status</span>
              </div>
              {LEAD_PROJECTS.map((p,i) => (
                <div key={i} className="exec-perf-row">
                  <span className="exec-perf-name">{p.name}</span>
                  <span className="exec-perf-num">{p.owner}</span>
                  <span className="exec-perf-num">{p.due}</span>
                  <span className="exec-perf-impact">
                    <span className="exec-perf-impbar"><i style={{ width: p.pct + "%" }} /></span>
                    <span className="exec-perf-impval">{p.pct}%</span>
                  </span>
                  <span className={"exec-perf-status st-" + LEAD_STATUS_CLASS[p.status]}><i className="exec-perf-dot" />{p.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Meetings ── */}
      {sub === "Meetings" && (
        <div className="lead-body">
          <div className="lead-section">
            <h3 className="lead-sec-title">Upcoming Meetings</h3>
            <div className="lead-meetings">
              {LEAD_MEETINGS.map((m,i) => (
                <div key={i} className="lead-mtg-row">
                  <div className="lead-mtg-date">{m.date}</div>
                  <div className="lead-mtg-info">
                    <div className="lead-mtg-title">{m.title}</div>
                    <div className="lead-mtg-sub">{m.time} · {m.who}</div>
                  </div>
                  <button className="lead-mtg-join">Join</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Calendar ── */}
      {sub === "Calendar" && (
        <div className="lead-body">
          <LeadCalendar />
        </div>
      )}

      {/* ── Reports ── */}
      {sub === "Reports" && (
        <div className="lead-body">
          <div className="lead-summary">
            {[
              { label: "Team Productivity",   value: "84%",  color: "#349CFF", icon: "pulse" },
              { label: "Project Completion",  value: "61%",  color: "#0ACF83", icon: "check" },
              { label: "Attendance Rate",     value: "92%",  color: "#8478FF", icon: "users" },
              { label: "Hours Logged",        value: "1,240", color: "#FF9442", icon: "clock" },
            ].map((s,i) => (
              <div key={i} className="lead-stat" style={{"--sc": s.color}}>
                <div className="lead-stat-ic">{React.createElement(Icon[s.icon], { s: 22 })}</div>
                <div className="lead-stat-val">{s.value}</div>
                <div className="lead-stat-lbl">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="lead-section">
            <h3 className="lead-sec-title">Performance Trends</h3>
            <div className="exec-perf">
              <div className="exec-perf-row exec-perf-head"><span>Metric</span><span>Score</span><span>Trend</span></div>
              {[
                { m: "Team Productivity", s: 84, t: "↑ Improving" },
                { m: "Task Completion",   s: 71, t: "→ Stable"    },
                { m: "Attendance",        s: 92, t: "↑ Improving" },
                { m: "Hours Logged",      s: 80, t: "→ Stable"    },
                { m: "Intern Satisfaction", s: 88, t: "↑ Improving" },
              ].map((r,i) => (
                <div key={i} className="exec-perf-row">
                  <span className="exec-perf-name">{r.m}</span>
                  <span className="exec-perf-impact">
                    <span className="exec-perf-impbar"><i style={{ width: r.s + "%" }} /></span>
                    <span className="exec-perf-impval">{r.s}</span>
                  </span>
                  <span className="exec-perf-num" style={{color: r.t.startsWith("↑") ? "#0ACF83" : "var(--ink-faint)"}}>{r.t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Resources ── */}
      {sub === "Resources" && (
        <div className="lead-body">
          <div className="lead-section">
            <h3 className="lead-sec-title">Leadership Resources</h3>
            <div className="lead-resources">
              {LEAD_RESOURCES.map((r,i) => (
                <button key={i} className="lead-resource-card">
                  <span className="lead-res-ic">{React.createElement(Icon[r.icon], { s: 24 })}</span>
                  <span className="lead-res-label">{r.label}</span>
                  <span className="lead-res-desc">{r.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ExecutiveDash({ onOpenMemberView, onOpenChat, onOpenVault, onOpenLeaderboard, vaultOpen, onCloseVault }) {
  const NAV = ["AI Chat", "Room Chat", "Tasks", "Leaderboard", "Docs", "Calendar", "Leadership"];
  const [navActive, setNavActive] = React.useState("Room Chat");
  const [rightCollapsed, setRightCollapsed] = React.useState(false);
  const [activeBuddy, setActiveBuddy] = React.useState(null);
  const openMeetings = () => onOpenMemberView && onOpenMemberView("Meetings & Recordings");
  const selectBuddy = (name) => {
    if (name === "Vault Buddy") { setActiveBuddy(name); onOpenVault && onOpenVault(); return; }
    setActiveBuddy(name); onCloseVault && onCloseVault(); setNavActive("AI Chat");
  };
  const healthActive = navActive === "AI Chat" && activeBuddy === "Health Buddy" && !vaultOpen;
  return (
    <div className="exec fade-up">

      {/* Top navigation area */}
      <header className="exec-topnav">
        <nav className="exec-nav">
          {NAV.map(n => (
            <button key={n}
              className={"exec-navlink" + (navActive === n ? " on" : "")}
              onClick={() => setNavActive(n)}>
              {n}
            </button>
          ))}
        </nav>
        <div style={{marginLeft:'auto',paddingLeft:16,flexShrink:0,display:'flex',alignItems:'center',gap:14}}>
          {healthActive && <button className="exec-health-back" onClick={() => setActiveBuddy(null)}>← Back to dashboard</button>}
          <HandLogo s={28}/>
        </div>
      </header>

      {/* 3-column layout */}
      {healthActive ? (
        <div className="exec-health-full">
          <div className="exec-health-inner"><HealthDash /></div>
        </div>
      ) : (
      <div className="exec-cols">
        <aside className="exec-col exec-col-left">
          <ExecMeetings onOpen={openMeetings} />
        </aside>

        <main className={"exec-col exec-col-center" + (navActive === "Room Chat" ? " exec-col-chat" : "")}>
          {vaultOpen
            ? <div className="exec-docs scroll">
                <button onClick={onCloseVault} style={{background:'none',border:'none',color:'var(--ink-faint)',font:'500 13px/1 var(--font)',cursor:'pointer',marginBottom:12,display:'inline-flex',alignItems:'center',gap:4,flexShrink:0}}>← Back</button>
                <div className="exec-vault-wrap"><Vault/></div>
              </div>
            : navActive === "AI Chat"
            ? (activeBuddy === "Design Buddy" ? <DesignBuddy /> : <ExecAIChat buddy={activeBuddy} />)
            : navActive === "Room Chat"
            ? <Chat />
            : navActive === "Tasks"
            ? <ExecTasks onOpenChat={onOpenChat} />
            : navActive === "Leaderboard"
            ? <div className="exec-lb-wrap"><Leaderboard /></div>
            : navActive === "Docs"
            ? <div className="exec-docs scroll"><MyPersonalSpace noBrainwriting={true} /></div>
            : navActive === "Reports"
            ? <ExecReports />
            : navActive === "Calendar"
            ? <div className="exec-docs scroll"><MyCalendar /></div>
            : navActive === "Leadership"
            ? <ExecLeadership />
            : <ExecPlaceholder label={navActive} hint="reserved" />}
        </main>

        <aside className={"exec-col exec-col-right" + (rightCollapsed ? " is-collapsed" : "")}>
          {rightCollapsed ? (
            <div className="exec-buddies-stub" onClick={() => setRightCollapsed(false)}>
              <span className="exec-col-title">Buddies · AI Agents</span>
              <span className="exec-buddies-stub-ic">{React.createElement(Icon.chevDown, { s: 16 })}</span>
            </div>
          ) : (
            <ExecBuddies collapsed={false} onToggle={() => setRightCollapsed(true)} onSelect={selectBuddy} activeBuddy={activeBuddy} />
          )}
        </aside>
      </div>
      )}

    </div>
  );
}

window.ExecutiveDash = ExecutiveDash;
