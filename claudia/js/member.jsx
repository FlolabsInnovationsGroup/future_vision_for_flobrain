/* ============================================================
   member.jsx — Intern Workspace member landing page
   (task table + task detail moved in from the old workspace)
   ============================================================ */

const { useState } = React;

const MEMBER_NAV = ["My Tasks"];

const M_TASKS = [
  { id: "Design Buddy Workspace", team: "UX Design", project: "HealthBuddy", status: "In Progress", assignees: ["CL", "DM", "RA", "JS"], last: "Today" },
  { id: "Standard Footer Template", team: "UX Design", project: "FloBrain", status: "Done", assignees: ["CL", "DM"], last: "2 days ago" },
  { id: "Onboarding", team: "UX Design", project: "FloBrain", status: "In Progress", assignees: ["CL", "RA", "TN"], last: "5 days ago" },
  { id: "Design System", team: "UX Design", project: "HealthBuddy", status: "In Progress", assignees: ["CL", "DM", "RA", "JS", "TN"], last: "5 days ago" },
  { id: "Design System Audit", team: "UX Design", project: "HealthBuddy", status: "In Progress", assignees: ["CL", "JS"], last: "3 days ago" },
  { id: "Design System Color Scales", team: "UX Design", project: "FloBrain", status: "In Progress", assignees: ["CL", "DM", "RA"], last: "1 days ago" },
];

function MStatusPill({ status }) {
  const map = { "In Progress": "pill-progress", "Done": "pill-done", "Pending": "pill-pending" };
  return <span className={"pill " + (map[status] || "pill-progress")}><i className="dot" />{status}</span>;
}

const M_AVCOLORS = { CL: "#4f4ab3", DM: "#2563eb", RA: "#0891b2", JS: "#7c3aed", TN: "#0d9488" };
function MAssignees({ people, onOpen }) {
  const max = 3;
  const shown = people.slice(0, max);
  const extra = people.length - shown.length;
  return (
    <span role="button" tabIndex={0} className="ws-assignees" title="Open team chat"
      onClick={(e) => { e.stopPropagation(); onOpen && onOpen(); }}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); onOpen && onOpen(); } }}>
      {shown.map((p, i) => (
        <span key={i} className="ws-av" style={{ background: M_AVCOLORS[p] || "#475569", zIndex: max - i }}>{p}</span>
      ))}
      {extra > 0 && <span className="ws-av ws-av-more">+{extra}</span>}
    </span>
  );
}

function MemberDropdown({ label, opts }) {
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState(null);
  return (
    <div className="mp-dd">
      <button className="mp-dd-btn" onClick={() => setOpen(o => !o)}>
        <span>{val || label}</span>
        {React.createElement(Icon.chevDown, { s: 15 })}
      </button>
      {open && (
        <div className="mp-dd-menu fade-up">
          {opts.length === 0
            ? <span className="mp-dd-empty">No projects yet</span>
            : opts.map(o => (
                <button key={o} className={"mp-dd-opt" + (o === val ? " on" : "")}
                  onClick={() => { setVal(o); setOpen(false); }}>{o}</button>
              ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Task table ---------- */
function MTaskTable({ onOpen, onOpenChat, title, projects }) {
  return (
    <div className="ws-table fade-up">
      <div className="ws-toolbar">
        {title && <h2 className="det-title">{title}</h2>}
        <div className="ws-filters">
          <MemberDropdown label="Teams" opts={["UX/UI Design", "MoodChanger"]} />
          <MemberDropdown label="Projects" opts={projects || []} />
        </div>
      </div>
      <div className="ws-trow ws-thead">
        <div>Task</div><div>Team</div><div>Project</div><div>Assignees</div><div>Last Acessed</div><div>Status</div>
      </div>
      <div className="ws-tbody scroll">
        {M_TASKS.map((t, i) => (
          <button key={i} className="ws-trow ws-tr" onClick={() => onOpen(t)}>
            <div className="ws-tid">{t.id}</div>
            <div>{t.team}</div>
            <div>{t.project}</div>
            <div><MAssignees people={t.assignees} onOpen={onOpenChat} /></div>
            <div className="ws-dim">{t.last}</div>
            <div><MStatusPill status={t.status} /></div>
          </button>
        ))}
      </div>
      <div className="ws-tfoot">View 10 per page</div>
    </div>
  );
}

/* ---------- Task detail ---------- */
const M_REQS = [
  ["Figma Links", true], ["website design files", false], ["brand assets", false],
  ["logo files", false], ["ai image tools", true], ["current design tasks", true],
  ["team meeting links", true], ["design tutorials", false], ["pdf resources", false],
  ["website version links", false], ["inspiration examples", false],
];
const M_STEPS = [
  ["Meet with buddy to identify task goals and steps, and distribute activities (based on identified steps", false],
  ["Work on activities", true],
  ["Meet with buddy to talk about task progress (optional)", false],
  ["Meet with buddy to discuss the task's result and anything that needs improving", false],
  ["Present the final task result to the team", false],
];

function MCheck({ on, label }) {
  const [c, setC] = useState(on);
  return (
    <label className="ck-row">
      <span className={"chk" + (c ? " on" : "")} onClick={() => setC(v => !v)} />
      <span>{label}</span>
    </label>
  );
}

function MAccordion({ title, open, onToggle, children }) {
  return (
    <div className="acc">
      <button className="acc-head" onClick={onToggle}>
        <span>{title}</span>
        <span className="acc-caret">{open ? "▲" : "▼"}</span>
      </button>
      {open && <div className="acc-body fade-up">{children}</div>}
    </div>
  );
}

function MInfoCard({ title, hint, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="info-card">
      <button className="info-head" onClick={() => setOpen(o => !o)}>
        <span className="info-title">{title}{hint && <em className="info-hint"> ({hint})</em>}</span>
        <span className="info-toggle">{open ? "–" : "+"}</span>
      </button>
      {open && <div className="info-body">{children}</div>}
    </div>
  );
}

function MTaskDetail({ onBack }) {
  const [acc, setAcc] = useState({ Steps: true });
  const tog = (k) => setAcc(a => ({ ...a, [k]: !a[k] }));
  const meta = [
    ["ASSIGNEES", "Claudia Lopez + 5"], ["STATUS", "In Progress"],
    ["TEAM", "UX Design"], ["PROJECT", "Design Workspace"], ["EXTRA", ""],
  ];
  return (
    <div className="ws-detail scroll fade-up">
      <button className="ws-back" onClick={onBack}>{React.createElement(Icon.chevRight, { s: 15 })} Back to tasks</button>
      <div className="det-title-row">
        <h2 className="det-title">Create a Design Buddy / Design Workspace inside FloBrain</h2>
      </div>
      <div className="det-meta">
        {meta.map(([k, v]) => (
          <div key={k} className="det-mcell"><span className="cap">{k}:</span><span className="det-mval">{v || "—"}</span></div>
        ))}
      </div>

      <MAccordion title="Objective" open={acc.Objective} onToggle={() => tog("Objective")}>
        <p className="acc-text">Design and build a reusable Design Buddy / Design Workspace inside FloBrain that lets interns launch, track, and document their tasks end to end.</p>
      </MAccordion>
      <MAccordion title="Context" open={acc.Context} onToggle={() => tog("Context")}>
        <p className="acc-text">Interns currently move between Figma, chat, and docs with no single source of truth. This workspace consolidates briefs, progress, and resources in one place.</p>
      </MAccordion>
      <MAccordion title="Requirements" open={acc.Requirements} onToggle={() => tog("Requirements")}>
        <div className="req-grid">{M_REQS.map(([l, c]) => <MCheck key={l} on={c} label={l} />)}</div>
      </MAccordion>
      <MAccordion title="Steps" open={acc.Steps} onToggle={() => tog("Steps")}>
        <div className="step-list">{M_STEPS.map(([l, c]) => <MCheck key={l} on={c} label={l} />)}</div>
      </MAccordion>
      <MAccordion title="Deliverables" open={acc.Deliverables} onToggle={() => tog("Deliverables")}>
        <ul className="acc-ul"><li>Working workspace launcher + task detail template</li><li>Reusable glass component library</li><li>Light & dark theme tokens</li></ul>
      </MAccordion>
      <MAccordion title="Acceptance Criteria" open={acc.Accept} onToggle={() => tog("Accept")}>
        <ul className="acc-ul"><li>Matches the FloBrain style guide</li><li>Responsive desktop layout</li><li>Passes design review with buddy</li></ul>
      </MAccordion>

      <div className="info-stack">
        <MInfoCard title="Progress Updates / WIP" hint="files, progress, next steps">
          <ul className="dot-list">
            <li>5/23/2026 - CL - <a className="lnk">FIGMA FILE URL</a></li>
            <li>5/21/2026 - CL - <a className="lnk">CANVA SLIDE URL</a></li>
          </ul>
        </MInfoCard>
        <MInfoCard title="Team/Task Comments" hint="feedback, questions, blockers">
          <ul className="dot-list">
            <li>5/21/2026 - CG - what is this supposed to be? is this an ai buddy?</li>
          </ul>
        </MInfoCard>
        <MInfoCard title="Related Resources" hint="docs, specs, reports, designs">
          <div className="res-links"><a className="lnk">Typography Guide.pdf</a><a className="lnk">Color Scales.pdf</a></div>
        </MInfoCard>
        <MInfoCard title="Brainwriting">
          <p className="acc-text" style={{ opacity: .6 }}>Drop loose ideas, sketches, and what-ifs here…</p>
        </MInfoCard>
      </div>

      <div className="det-footer">
        <div><span className="df-k">Meeting Link:</span> <a className="lnk">Zoom Login</a></div>
        <div><span className="df-k">FloLabs Email:</span> zoom@flomadlabs.com</div>
        <div><span className="df-k">Password:</span> 7Usd4vR!2</div>
      </div>
    </div>
  );
}

/* ---------- My Onboarding (reuses the task-detail accordion vocabulary) ---------- */
function MyOnboarding({ who = "Claudia Lopez" }) {
  const [acc, setAcc] = useState({ LinkedIn: true, Policies: true });
  const tog = (k) => setAcc(a => ({ ...a, [k]: !a[k] }));
  return (
    <div className="ob fade-up">
      <div className="det-title-row">
        <h2 className="det-title">{who}'s Onboarding</h2>
        <span className="ob-status">Status: <MStatusPill status="In Progress" /></span>
      </div>
      <p className="ob-welcome">Welcome to FloLabs Innovations Group! We're so glad to have you 😊 Here's a list of action items to help you get started.</p>

      <MAccordion title={'Update Your LinkedIn "Experience" Section'} open={acc.LinkedIn} onToggle={() => tog("LinkedIn")}>
        <ol className="ob-ol">
          <li>Go to Your LinkedIn Profile
            <ul className="ob-ul"><li>Click on the pencil icon next to the section "Experience."</li></ul>
          </li>
          <li>Enter the Following Details
            <ul className="ob-ul">
              <li>Title: Your current role (example: Robotics Engineering Intern, UI/UX Design Intern, etc.)</li>
              <li>Company: FloLabs R&D (tag the company page)</li>
              <li>Employment type: Internship</li>
              <li>**Mark: *"I am currently working in this role"</li>
              <li>Start date: (month and year you joined)</li>
              <li>End date: leave unchecked since you're still active</li>
              <li>Location: Leave empty</li>
              <li>Location type: Remote</li>
            </ul>
          </li>
          <li>Description (Copy the template below)</li>
          <li>Replace the example role/team line at the bottom with your own details.</li>
        </ol>
      </MAccordion>

      <MAccordion title="Important Things To Note" open={acc.Note} onToggle={() => tog("Note")}>
        <p className="acc-text ob-soon">Notes coming soon…</p>
      </MAccordion>

      <MAccordion title="Company Policies & Guidelines" open={acc.Policies} onToggle={() => tog("Policies")}>
        <div className="ob-policies">
          <div className="ob-pgroup">
            <span className="ob-pitem">Onboarding Completion</span>
            <span className="ob-pitem">Masterclass Completion</span>
          </div>
          <div className="ob-pgroup">
            <strong className="ob-plabel">FloTimer &amp; Tracked Time</strong>
            <span className="ob-pitem">Program Tasks Hours:</span>
            <span className="ob-pitem">Time Tracking:</span>
            <span className="ob-pitem">Approval for Additional Activities</span>
            <span className="ob-pitem">Integrity &amp; Accurate Time Reporting:</span>
          </div>
          <div className="ob-pgroup">
            <strong className="ob-plabel">Brainwriting Requirements</strong>
            <ol className="ob-ol ob-ol-empty"><li></li><li></li><li></li></ol>
          </div>
        </div>
      </MAccordion>

      <MAccordion title="Important Security Warning: Email / WhatsApp Scams (Impersonation of FloLabs Leadership)" open={acc.Security} onToggle={() => tog("Security")}>
        <p className="acc-text ob-soon">Details coming soon…</p>
      </MAccordion>
      <MAccordion title="General Tools Training / Tutorials" open={acc.Tools} onToggle={() => tog("Tools")}>
        <p className="acc-text ob-soon">Details coming soon…</p>
      </MAccordion>
      <MAccordion title="How To?" open={acc.How} onToggle={() => tog("How")}>
        <p className="acc-text ob-soon">Details coming soon…</p>
      </MAccordion>
      <MAccordion title="Information about current projects" open={acc.Projects} onToggle={() => tog("Projects")}>
        <p className="acc-text ob-soon">Details coming soon…</p>
      </MAccordion>

      <div className="ob-mc">
        <button className="acc-head ob-mc-head" onClick={() => tog("MasterClasses")}>
          <span className="ob-mc-title">{who}'s Master Classes</span>
          <span className="ob-status">Status: <MStatusPill status="In Progress" /></span>
          <span className="acc-caret">{acc.MasterClasses ? "▲" : "▼"}</span>
        </button>
        {acc.MasterClasses && (
          <div className="acc-body fade-up">
            <ul className="ob-mc-list">
              <li>Mid Journey</li>
              <li>UnSplash</li>
              <li>Canva</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- My Brainwriting ---------- */
function MyBrainwriting({ who = "Claudia Lopez" }) {
  const fields = ["Idea Title", "Description", "Category/Topic", "Date Submitted"];
  return (
    <div className="bw fade-up">
      <div className="bw-head">
        <h2 className="det-title">{who}'s Brainwriting</h2>
        <div className="bw-head-r">
          <span className="bw-last">Last Entry: <b>6/12/2026</b></span>
          <button className="bw-new">{React.createElement(Icon.plus, { s: 15 })} New Entry</button>
        </div>
      </div>
      <ul className="bw-fields">
        {fields.map(f => <li key={f}>{f}</li>)}
      </ul>
    </div>
  );
}

/* ---------- Progress Tracker (Internship) ---------- */
function ProgBar({ label, pct, value, note, overall }) {
  return (
    <div className={"pt-row" + (overall ? " pt-overall" : "")}>
      <div className="pt-row-head">
        <span className="pt-label">{label}</span>
        <span className="pt-value">{value || (pct + "%")}</span>
      </div>
      <div className="pt-track"><i style={{ width: pct + "%" }} /></div>
      {note && <span className="pt-note">{note}</span>}
    </div>
  );
}

function ProgressTracker() {
  const onboarding = 80;
  const mcHours = 15, mcMax = 50;
  const masterclass = Math.round((mcHours / mcMax) * 100);
  const hours = 250, hoursMax = 500;
  const hoursPct = Math.round((hours / hoursMax) * 100);
  const overall = Math.round((onboarding + masterclass + hoursPct) / 3);
  return (
    <div className="pt fade-up">
      <div className="ps-subhead">
        <span className="ps-sub">Internship Progress Tracker</span>
      </div>
      <div className="pt-card">
        <ProgBar label="Onboarding Progress" pct={onboarding} note="8 of 10 onboarding tasks completed" />
        <ProgBar label="Masterclass Progress" pct={masterclass} value={mcHours + " / " + mcMax + " Hours"} note={mcHours + " of " + mcMax + " hours completed"} />
        <ProgBar label="Program Hours" pct={hoursPct} value={hours + " / " + hoursMax + " Hours"} note={(hoursMax - hours) + " hours remaining to reach the 500-hour goal"} />
        <div className="pt-divide" />
        <ProgBar label="Overall Internship Progress" pct={overall} note="Combined completion across onboarding, masterclasses, and program hours" overall />
      </div>
    </div>
  );
}

/* ---------- Personal Space & Calendar ---------- */
const PS_WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
function PSCalendar() {
  const [cur, setCur] = useState(() => new Date(2026, 5, 1)); // June 2026
  const [openDay, setOpenDay] = useState(null);
  const year = cur.getFullYear(), month = cur.getMonth();
  const monthName = cur.toLocaleString("en-US", { month: "long" });
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = { y: 2026, m: 5, d: 18 };
  // Example events keyed by "month-day" (June = 5)
  const PS_EVENTS = { "5-17": ["Permission tile updates due"] };
  const eventsFor = (d) => PS_EVENTS[month + "-" + d] || [];
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const isToday = (d) => d === today.d && month === today.m && year === today.y;
  return (
    <div className="ps-cal">
      <div className="ps-cal-head">
        <button className="ps-cal-nav" onClick={() => { setCur(new Date(year, month - 1, 1)); setOpenDay(null); }} aria-label="Previous month">‹</button>
        <span className="ps-cal-month">{monthName} {year}</span>
        <button className="ps-cal-nav" onClick={() => { setCur(new Date(year, month + 1, 1)); setOpenDay(null); }} aria-label="Next month">›</button>
      </div>
      <div className="ps-cal-week">
        {PS_WD.map(d => <span key={d} className="ps-cal-wd">{d}</span>)}
      </div>
      <div className="ps-cal-days">
        {cells.map((d, i) => {
          const evs = d ? eventsFor(d) : [];
          const hasEv = evs.length > 0;
          return (
            <div key={i}
              className={"ps-cal-day" + (d ? "" : " ps-cal-blank") + (isToday(d) ? " ps-cal-today" : "") + (hasEv ? " ps-cal-event" : "")}
              onClick={hasEv ? () => setOpenDay(o => o === d ? null : d) : undefined}>
              {d ? <span className="ps-cal-num">{d}</span> : null}
              {hasEv && openDay === d && (
                <div className="ps-cal-pop" onClick={(e) => e.stopPropagation()}>
                  <span className="ps-cal-pop-date">{monthName} {d}</span>
                  {evs.map((e, j) => <span key={j} className="ps-cal-pop-ev">{e}</span>)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TodoLine({ label }) {
  const [done, setDone] = useState(false);
  return (
    <label className={"ps-todo-row ps-todo-item" + (done ? " is-done" : "")}>
      <span className={"ps-todo-chk" + (done ? " on" : "")} onClick={(e) => { e.preventDefault(); setDone(v => !v); }} />
      <span className="ps-todo-text">{label}</span>
    </label>
  );
}

function MyCalendar() {
  const [showEvent, setShowEvent] = useState(false);
  return (
    <div className="ps fade-up">
      <div className="ps-subhead">
        <span className="ps-sub">View and manage your schedule</span>
        <button className="bw-new" onClick={() => setShowEvent(true)}>{React.createElement(Icon.plus, { s: 15 })} New Event</button>
      </div>

      <div className="ps-board">
        <div className="ps-calwrap"><PSCalendar /></div>
        <div className="ps-todo">
          <div className="ps-todo-head">
            <span className="ps-todo-title">To-Do</span>
            <button className="ps-todo-add" aria-label="Add to-do task">{React.createElement(Icon.plus, { s: 16 })}</button>
          </div>
          <div className="ps-todo-list">
            {["Send Kendra HealthBuddy content", "Forward file to Ceren for feedback", "Connect my Claude to my GitHub"].map((t, i) => (
              <TodoLine label={t} key={i} />
            ))}
            {[0, 1].map(i => <div key={"e" + i} className="ps-todo-row" />)}
          </div>
        </div>
      </div>

      {showEvent && <NewEventModal onClose={() => setShowEvent(false)} />}
    </div>
  );
}

/* ---------- New Attachment: drag-and-drop / browse uploader ---------- */
function fmtSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}
function AttachUpload({ onBack }) {
  const [files, setFiles] = useState([]);
  const [drag, setDrag] = useState(false);
  const inputRef = React.useRef(null);
  const add = (list) => {
    const arr = Array.from(list || []).map(f => ({ name: f.name, size: f.size }));
    if (arr.length) setFiles(prev => [...arr, ...prev]);
  };
  return (
    <div className="ps fade-up">
      <button className="ws-back" onClick={onBack}>{React.createElement(Icon.chevRight, { s: 15 })} Back to My Docs</button>
      <div className="ps-subhead">
        <span className="ps-sub">New Attachment</span>
      </div>

      <div className={"att-drop" + (drag ? " is-drag" : "")}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); add(e.dataTransfer.files); }}
        onClick={() => inputRef.current && inputRef.current.click()}>
        <span className="att-ic">{React.createElement(Icon.upload || Icon.attach, { s: 30 })}</span>
        <p className="att-title">Drag &amp; drop files here</p>
        <p className="att-sub">or <span className="att-browse">browse files</span> from your device</p>
        <input ref={inputRef} type="file" multiple style={{ display: "none" }}
          onChange={(e) => add(e.target.files)} />
      </div>
      <p className="att-types">Supported file types: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, PNG, JPG, SVG, FIG, ZIP &middot; up to 25&nbsp;MB</p>

      {files.length > 0 && (
        <div className="att-list">
          <div className="att-list-head">{files.length} file{files.length === 1 ? "" : "s"} ready</div>
          {files.map((f, i) => (
            <div className="att-row" key={i}>
              <span className="att-row-ic">{React.createElement(Icon.file, { s: 16 })}</span>
              <span className="att-name">{f.name}</span>
              <span className="att-size">{fmtSize(f.size)}</span>
              <button className="att-x" onClick={() => setFiles(list => list.filter((_, j) => j !== i))}>{React.createElement(Icon.close, { s: 14 })}</button>
            </div>
          ))}
          <div className="att-actions">
            <button className="ev-save">Upload {files.length} file{files.length === 1 ? "" : "s"}</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- New Doc: Google-Docs-style editor ---------- */
function DocEditor({ onBack }) {
  const bodyRef = React.useRef(null);
  const exec = (cmd, val) => { document.execCommand(cmd, false, val || null); bodyRef.current && bodyRef.current.focus(); };
  const TB = (props) => (
    <button type="button" className={"doc-tb" + (props.wide ? " doc-tb-wide" : "")}
      title={props.title} onMouseDown={(e) => { e.preventDefault(); exec(props.cmd, props.val); }}>
      {props.children}
    </button>
  );
  return (
    <div className="ps fade-up doc-wrap">
      <button className="ws-back" onClick={onBack}>{React.createElement(Icon.chevRight, { s: 15 })} Back to My Docs</button>
      <div className="doc-toolbar">
        <TB cmd="formatBlock" val="H1" title="Heading 1" wide>H1</TB>
        <TB cmd="formatBlock" val="H2" title="Heading 2" wide>H2</TB>
        <TB cmd="formatBlock" val="P" title="Body text" wide>Body</TB>
        <span className="doc-div" />
        <TB cmd="bold" title="Bold"><b>B</b></TB>
        <TB cmd="italic" title="Italic"><i>I</i></TB>
        <TB cmd="underline" title="Underline"><u>U</u></TB>
        <span className="doc-div" />
        <TB cmd="insertUnorderedList" title="Bulleted list">•≡</TB>
        <TB cmd="insertOrderedList" title="Numbered list">1.≡</TB>
        <span className="doc-div" />
        <TB cmd="justifyLeft" title="Align left">⇤</TB>
        <TB cmd="justifyCenter" title="Align center">↔</TB>
        <TB cmd="justifyRight" title="Align right">⇥</TB>
      </div>
      <div className="doc-page">
        <input className="doc-title" placeholder="Untitled document" defaultValue="" />
        <div className="doc-body" contentEditable suppressContentEditableWarning ref={bodyRef} data-ph="Start writing…"></div>
      </div>
    </div>
  );
}

const PS_ACTIVITY = [
  { action: "Recording Tile Update", item: "— New recording published", time: "Today", icon: "video" },
  { action: "Vendor Requirements Brief", item: "— Draft updated", time: "Today", icon: "file" },
  { action: "MoodChanger Feedback", item: "— Submitted", time: "Yesterday", icon: "chat" },
  { action: "Meeting Notes", item: "— Leadership Sync", time: "Today", icon: "file" },
  { action: "Brainwriting Submission", item: "— Missed Meeting Reflection", time: "Yesterday", icon: "bolt" },
  { action: "FloVault Reference Opened", item: "— Permissions Guide", time: "Yesterday", icon: "lock" },
  { action: "UX Dashboard Update", item: "— Intern View", time: "2 days ago", icon: "grid" },
  { action: "Meeting Recording Viewed", item: "— FloLabs Weekly Standup", time: "2 days ago", icon: "video" },
];

function MyPersonalSpace({ who = "Claudia Lopez", noBrainwriting }) {
  const [showLibrary, setShowLibrary] = useState(false);
  const [showBrain, setShowBrain] = useState(false);
  const [showDoc, setShowDoc] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  if (showLibrary) return <LibraryPage onBack={() => setShowLibrary(false)} />;
  if (showDoc) return <DocEditor onBack={() => setShowDoc(false)} />;
  if (showUpload) return <AttachUpload onBack={() => setShowUpload(false)} />;
  if (showBrain) return (
    <div className="ps fade-up">
      <button className="ws-back" onClick={() => setShowBrain(false)}>{React.createElement(Icon.chevRight, { s: 15 })} Back to My Docs</button>
      <MyBrainwriting who={who} />
    </div>
  );

  if (showLibrary) return <LibraryPage onBack={() => setShowLibrary(false)} />;

  return (
    <div className="ps fade-up">
      <div className="ps-subhead">
        <span className="ps-sub">My Docs</span>
      </div>

      <div className="ps-docs">
        <div className="ps-docs-actions">
          <button className="bw-new ps-tip" data-tip="Create a new document" onClick={() => setShowDoc(true)}>{React.createElement(Icon.plus, { s: 15 })} New Doc</button>
          <button className="bw-new ps-tip" data-tip="Upload a file or attachment" onClick={() => setShowUpload(true)}>{React.createElement(Icon.plus, { s: 15 })} New Attachment</button>
          {!noBrainwriting && <button className="bw-new ps-tip" data-tip="Open your Brainwriting" onClick={() => setShowBrain(true)}>{React.createElement(Icon.bolt, { s: 15 })} Brainwriting</button>}
          <button className="bw-new ps-tip ps-lib-btn" data-tip="Browse recent documents & tasks" onClick={() => setShowLibrary(true)}>{React.createElement(Icon.book, { s: 15 })} Library</button>
        </div>
        <div className="ps-act">
          <div className="ps-act-head">{React.createElement(Icon.pulse, { s: 15 })}<span>Recent Activity</span></div>
          <div className="ps-act-list">
            {PS_ACTIVITY.map((a, i) => (
              <div className="ps-act-row" key={i}>
                <span className="ps-act-ic">{React.createElement(Icon[a.icon] || Icon.file, { s: 16 })}</span>
                <span className="ps-act-text"><b>{a.action}</b> {a.item}</span>
                <span className="ps-act-time">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Library page: recent documents + active tasks ---------- */
const LIB_DOCS = [
  { name: "Design Buddy Workspace — Spec", last: "Today" },
  { name: "Vendor Requirements Brief", last: "Today" },
  { name: "Vendor Requirements Checklist", last: "Yesterday" },
  { name: "Design System Color Scales", last: "Yesterday" },
  { name: "Style Guide Scope", last: "2 days ago" },
  { name: "Onboarding Flow Notes", last: "2 days ago" },
  { name: "GitHub Crash Notes", last: "3 days ago" },
  { name: "Footer Template Redlines", last: "4 days ago" },
];
const LIB_ATTACH = [
  { name: "Permissions Guide.pdf", last: "Yesterday" },
  { name: "FloLabs Brand Assets.zip", last: "3 days ago" },
  { name: "Standup Recording.mp4", last: "3 days ago" },
  { name: "Intern View Mockups.fig", last: "5 days ago" },
];
const DOC_TOTAL = 50;
const ATTACH_TOTAL = 50;
function LibraryPage({ onBack }) {
  const [favs, setFavs] = useState([]);
  const [showFavs, setShowFavs] = useState(false);
  const isFav = (k) => favs.includes(k);
  const toggle = (k) => setFavs(f => f.includes(k) ? f.filter(x => x !== k) : [...f, k]);

  const docItems = LIB_DOCS.map(d => ({ key: "doc:" + d.name, name: d.name, last: d.last }));
  const attachItems = LIB_ATTACH.map(a => ({ key: "att:" + a.name, name: a.name, last: a.last }));
  const favItems = [...docItems, ...attachItems].filter(it => isFav(it.key));

  const Row = ({ it }) => (
    <div className="lib-row">
      <button className={"lib-star" + (isFav(it.key) ? " on" : "")} onClick={() => toggle(it.key)}
        title={isFav(it.key) ? "Remove from favorites" : "Add to favorites"}>
        {React.createElement(Icon.star, { s: 15 })}
      </button>
      <span className="lib-name">{it.name}</span>
      <span className="lib-last">{it.last}</span>
    </div>
  );

  return (
    <div className="ps fade-up lib-page">
      <div className="ps-subhead lib-subhead">
        <button className="lib-backarrow" onClick={onBack} aria-label="Back to My Docs">{React.createElement(Icon.chevRight, { s: 20 })}</button>
        <span className="ps-sub">{showFavs ? "Favorites" : "Library"}</span>
        {showFavs
          ? <button className="lib-favlink" onClick={() => setShowFavs(false)}>{React.createElement(Icon.chevRight, { s: 14 })} Back to Library</button>
          : <button className="lib-favlink" onClick={() => setShowFavs(true)}>{React.createElement(Icon.star, { s: 14 })} Favorites{favItems.length > 0 ? " (" + favItems.length + ")" : ""}</button>}
      </div>

      {showFavs ? (
        <div className="lib-sect">
          <div className="lib-card">
            {favItems.map((it, i) => <Row it={it} key={i} />)}
          </div>
        </div>
      ) : (
        <React.Fragment>
          <div className="lib-sect">
            <div className="lib-sect-head">{React.createElement(Icon.file, { s: 15 })}<span>Recent Documents</span></div>
            <div className="lib-card lib-card-scroll scroll">
              {docItems.map((it, i) => <Row it={it} key={i} />)}
            </div>
            <div className="lib-count">{docItems.length} of {DOC_TOTAL}</div>
          </div>

          <div className="lib-sect">
            <div className="lib-sect-head">{React.createElement(Icon.attach, { s: 15 })}<span>Recent Attachments</span></div>
            <div className="lib-card lib-card-scroll scroll">
              {attachItems.map((it, i) => <Row it={it} key={i} />)}
            </div>
            <div className="lib-count">{attachItems.length} of {ATTACH_TOTAL}</div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

function NewEventModal({ onClose }) {
  const [saved, setSaved] = useState(false);
  return (
    <div className="ev-scrim" onMouseDown={onClose}>
      <div className="ev-modal fade-up" onMouseDown={e => e.stopPropagation()}>
        <button className="gate-x" onClick={onClose}>{React.createElement(Icon.close, { s: 16 })}</button>
        <h3 className="ev-title">New Event</h3>
        {saved ? (
          <p className="ev-saved">{React.createElement(Icon.check, { s: 16 })} Event saved</p>
        ) : (
          <form className="ev-form" onSubmit={e => { e.preventDefault(); setSaved(true); setTimeout(onClose, 850); }}>
            <label className="ev-row">
              <span className="ev-lbl">Event Name</span>
              <input className="ev-input" type="text" placeholder="e.g. Design review" autoFocus />
            </label>
            <label className="ev-row">
              <span className="ev-lbl">Date</span>
              <input className="ev-input" type="date" defaultValue="2026-06-13" />
            </label>
            <div className="ev-row">
              <span className="ev-lbl">Time</span>
              <div className="ev-times">
                <input className="ev-input" type="time" defaultValue="09:00" aria-label="Start time" />
                <span className="ev-dash">–</span>
                <input className="ev-input" type="time" defaultValue="10:00" aria-label="End time" />
              </div>
            </div>
            <div className="ev-actions">
              <button type="submit" className="ev-save">Save</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function MemberPage({ onOpenChat, onOpenLeaderboard, onOpenTimer, initialView }) {
  const [view, setView] = useState(initialView || "My Tasks");
  const [task, setTask] = useState(null);
  React.useEffect(() => { if (initialView) { setView(initialView); setTask(null); } }, [initialView]);
  return (
    <div className="panel member-panel scroll">
      <div className="mp-toprow" style={{ display: "none" }}>
        <div className="mp-greet">
          <span className="mp-eyebrow">Intern</span>
          <h1 className="mp-welcome">Welcome back, Claudia</h1>
        </div>
      </div>

      <nav className="mp-nav">
        {MEMBER_NAV.map(item => (
          <button key={item}
            className={"mp-navlink" + (view === item ? " on" : "")}
            onClick={() => {
              if (item === "Leaderboard") { onOpenLeaderboard && onOpenLeaderboard(); return; }
              if (item === "FloTimer Entries") { onOpenTimer && onOpenTimer(); return; }
              setView(item); setTask(null);
            }}>{item}</button>
        ))}
      </nav>
      <div className="mp-divider" />

      <div className="mp-content">
        {view === "My Tasks" ? (
          task ? <MTaskDetail onBack={() => setTask(null)} /> : <MTaskTable onOpen={setTask} onOpenChat={onOpenChat} />
        ) : view === "My Onboarding" ? (
          <MyOnboarding />
        ) : view === "My Brainwriting" ? (
          <MyBrainwriting />
        ) : view === "My Docs" ? (
          <MyPersonalSpace />
        ) : view === "Calendar" ? (
          <MyCalendar />
        ) : (
          <div className="mp-empty">
            {React.createElement(Icon.sliders, { s: 24 })}
            <p>{view} — coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
}

window.MemberPage = MemberPage;

/* ---------- Standalone sub-page (each opens in its own top tab) ---------- */
function MemberSub({ view, who, projects, role, onOpenChat, onOpenLeaderboard, onOpenTimer }) {
  const [task, setTask] = useState(null);
  React.useEffect(() => { setTask(null); }, [view]);
  return (
    <div className="panel member-panel scroll">
      {view === "My Tasks" ? (
        task ? <MTaskDetail onBack={() => setTask(null)} /> : (
          <MTaskTable onOpen={setTask} onOpenChat={onOpenChat} title="My Tasks" projects={projects} />
        )
      ) : view === "My Onboarding" ? (
        <MyOnboarding who={who} />
      ) : view === "My Brainwriting" ? (
        <MyBrainwriting who={who} />
      ) : view === "My Docs" ? (
        <MyPersonalSpace who={who} />
      ) : view === "Calendar" ? (
        <MyCalendar />
      ) : view === "Meetings & Recordings" ? (
        <MyMeetings role={role} />
      ) : view === "Progress Tracker" ? (
        <ProgressTracker />
      ) : (
        <div className="mp-empty">
          {React.createElement(Icon.sliders, { s: 24 })}
          <p>{view} — coming soon</p>
        </div>
      )}
    </div>
  );
}

window.MemberSub = MemberSub;
