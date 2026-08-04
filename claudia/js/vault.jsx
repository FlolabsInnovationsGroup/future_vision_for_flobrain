/* ============================================================
   vault.jsx — FloVault: secure file upload + search + results
   ============================================================ */
const { useState, useMemo, useRef } = React;

/* ---------- option sets ---------- */
const V_TYPES   = ["PDF", "DOCX", "XLSX", "PNG", "Figma", "Video", "ZIP", "HTML", "CSS", "JavaScript", "Python"];
const V_PROJECTS = ["CAIPO", "MoodChanger", "RoboCollective", "FloBrain", "Space Ventures"];
const V_TEAMS   = ["UX/UI", "Engineering", "Research", "Operations", "Marketing"];
const V_PEOPLE  = ["Claudia Lopez", "Marcus Lopez", "Liam Chen", "Amara Okafor", "Sam Rivera", "Priya Nair"];
const V_STATUS  = ["Approved", "In Review", "Pending", "Rejected"];
const V_VERSIONS = ["v1.0", "v1.1", "v1.2", "v2.0", "v2.1", "v3.0"];

/* ---------- duplicate detection ---------- */
const DUP_STOP = new Set(["the", "a", "an", "of", "for", "and", "to", "in", "on", "q1", "q2", "q3", "q4",
  "v1", "v2", "v3", "pdf", "docx", "xlsx", "fig", "png", "report", "results", "summary", "draft", "final", "copy"]);
function dupTokens(str) {
  return (str || "").toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length >= 2 && !DUP_STOP.has(w));
}
function findSimilar(cand, files) {
  const candSet = new Set([
    ...dupTokens(cand.name),
    ...(cand.keywords || []).flatMap(dupTokens),
    ...(cand.tags || []).flatMap(dupTokens),
  ]);
  return files
    .map(f => {
      if (f.project !== cand.project) return null;
      const fSet = new Set([...dupTokens(f.name), ...f.keywords.flatMap(dupTokens), ...f.tags.flatMap(dupTokens)]);
      let overlap = 0;
      candSet.forEach(t => { if (fSet.has(t)) overlap++; });
      const sameTeam = f.team === cand.team;
      const match = overlap >= 2 || (sameTeam && overlap >= 1);
      return match ? { f, overlap: overlap + (sameTeam ? 0.5 : 0) } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.overlap - a.overlap)
    .map(x => x.f);
}
function bumpVersion(v) {
  const m = /^v?(\d+)\.(\d+)$/.exec((v || "").trim());
  if (!m) return "v1.1";
  return "v" + m[1] + "." + (parseInt(m[2], 10) + 1);
}

const TYPE_COLOR = {
  PDF:   ["#2b2b2f", "#e7e7e9"],
  DOCX:  ["#37373c", "#ededee"],
  XLSX:  ["#2b2b2f", "#e7e7e9"],
  PNG:   ["#37373c", "#ededee"],
  Figma: ["#2b2b2f", "#e7e7e9"],
  Video: ["#37373c", "#ededee"],
  ZIP:   ["#56565c", "#f0f0f1"],
  HTML:  ["#2b2b2f", "#e7e7e9"],
  CSS:   ["#37373c", "#ededee"],
  JavaScript: ["#2b2b2f", "#e7e7e9"],
  Python:["#37373c", "#ededee"],
};
const statusClass = (s) => s.toLowerCase().replace(/\s+/g, "-");
const TYPE_ABBR = { JavaScript: "JS", Python: "PY", Figma: "FIG", Video: "VID" };

/* ---------- seed files ---------- */
const V_FILES = [
  { id: 1, name: "Design Buddy Workspace — Spec.pdf", type: "PDF", project: "FloBrain", team: "UX/UI",
    uploadedBy: "Claudia Lopez", date: "2026-06-02", owner: "Claudia Lopez", version: "v2.3", status: "Approved",
    tags: ["spec", "workspace"], keywords: ["buddy", "launcher", "task detail", "glass"], size: "3.4 MB",
    desc: "Full functional spec for the Design Buddy Workspace — launcher, task table, and detail template." },
  { id: 2, name: "FloBrain Color Scales.fig", type: "Figma", project: "FloBrain", team: "UX/UI",
    uploadedBy: "Sam Rivera", date: "2026-05-28", owner: "Claudia Lopez", version: "v1.0", status: "Approved",
    tags: ["tokens", "color"], keywords: ["palette", "oklch", "scales", "theme"], size: "—",
    desc: "Source Figma file containing the light/dark color token scales and component swatches." },
  { id: 3, name: "CAIPO Wearable — Test Report.docx", type: "DOCX", project: "CAIPO", team: "Engineering",
    uploadedBy: "Liam Chen", date: "2026-05-20", owner: "Amara Okafor", version: "v4.1", status: "Approved",
    tags: ["report", "hardware"], keywords: ["wearable", "battery", "thermal", "sensor"], size: "1.1 MB",
    desc: "Bench test results for the CAIPO wearable rev D — battery, thermal envelope, and sensor calibration." },
  { id: 4, name: "MoodChanger Research Findings.xlsx", type: "XLSX", project: "MoodChanger", team: "Research",
    uploadedBy: "Priya Nair", date: "2026-05-14", owner: "Priya Nair", version: "v1.6", status: "Approved",
    tags: ["data", "survey"], keywords: ["mood", "cohort", "n=240", "wellbeing"], size: "820 KB",
    desc: "Aggregated survey data and analysis from the MoodChanger pilot cohort." },
  { id: 5, name: "Space Ventures — Brand.png", type: "PNG", project: "Space Ventures", team: "Marketing",
    uploadedBy: "Sam Rivera", date: "2026-05-09", owner: "Sam Rivera", version: "v3.0", status: "Approved",
    tags: ["brand", "logo"], keywords: ["identity", "mark", "orbit", "export"], size: "5.7 MB",
    desc: "Final exported brand mark and lockups for the Space Ventures launch." },
  { id: 6, name: "Onboarding Flow — Prototype.fig", wip: true, type: "Figma", project: "FloBrain", team: "UX/UI",
    uploadedBy: "Claudia Lopez", date: "2026-05-04", owner: "Claudia Lopez", version: "v1.1", status: "Approved",
    tags: ["prototype", "flow"], keywords: ["onboarding", "intern", "steps", "welcome"], size: "—",
    desc: "First-pass onboarding prototype. Returned for revision — flow too long, missing skip path." },
  { id: 7, name: "RoboCollective Ops Review.pdf", type: "PDF", project: "RoboCollective", team: "Operations",
    uploadedBy: "Marcus Lopez", date: "2026-04-29", owner: "Marcus Lopez", version: "v1.2", status: "Approved",
    tags: ["ops", "review"], keywords: ["quarter", "metrics", "headcount", "budget"], size: "2.0 MB",
    desc: "Q1 operations review deck covering team metrics, throughput, and resourcing." },
  { id: 8, name: "Design System Audit.zip", type: "ZIP", project: "FloBrain", team: "UX/UI",
    uploadedBy: "Sam Rivera", date: "2026-04-22", owner: "Claudia Lopez", version: "v2.0", status: "Approved",
    tags: ["audit", "system"], keywords: ["components", "coverage", "deprecations", "inventory"], size: "14.3 MB",
    desc: "Complete export of the design-system audit — component inventory, coverage gaps, and deprecations." },
  { id: 9, name: "MoodChanger — UI Kit.fig", type: "Figma", project: "MoodChanger", team: "UX/UI",
    uploadedBy: "Claudia Lopez", date: "2026-06-04", owner: "Claudia Lopez", version: "v2.0", status: "Approved",
    tags: ["ui", "kit"], keywords: ["moodchanger", "components", "library", "figma"], size: "6.2 MB",
    desc: "Production UI kit for MoodChanger — components, tokens, and screen templates." },
  { id: 10, name: "MoodChanger — Mobile Screens.fig", type: "Figma", project: "MoodChanger", team: "UX/UI",
    uploadedBy: "Sam Rivera", date: "2026-06-03", owner: "Sam Rivera", version: "v2.1", status: "Approved",
    tags: ["mobile", "screens"], keywords: ["moodchanger", "ios", "android", "flow"], size: "8.9 MB",
    desc: "Full mobile screen set for MoodChanger — onboarding, home, and mood journaling flows." },
  { id: 11, name: "MoodChanger — Design Tokens.fig", type: "Figma", project: "MoodChanger", team: "UX/UI",
    uploadedBy: "Priya Nair", date: "2026-06-01", owner: "Claudia Lopez", version: "v2.3", status: "Approved",
    tags: ["tokens", "theme"], keywords: ["moodchanger", "color", "type", "spacing"], size: "1.3 MB",
    desc: "Source-of-truth token library for MoodChanger — color, type, spacing, and elevation styles." },
  { id: 12, name: "MoodChanger — Component Audit.fig", type: "Figma", project: "MoodChanger", team: "UX/UI",
    uploadedBy: "Claudia Lopez", date: "2026-05-30", owner: "Amara Okafor", version: "v2.0", status: "Approved",
    tags: ["audit", "components"], keywords: ["moodchanger", "coverage", "variants", "inventory"], size: "2.7 MB",
    desc: "Component coverage audit for the MoodChanger UI kit — variants, gaps, and deprecations." },
  { id: 13, name: "MoodChanger — Wireframes.fig", type: "Figma", project: "MoodChanger", team: "UX/UI",
    uploadedBy: "Liam Chen", date: "2026-04-18", owner: "Liam Chen", version: "v1.0", status: "Approved",
    tags: ["wireframe", "lofi"], keywords: ["moodchanger", "wireframe", "skeleton", "layout"], size: "740 KB",
    desc: "Low-fidelity wireframes for the original MoodChanger concept — pre-visual-design." },
  { id: 14, name: "MoodChanger — Brand Explorations.fig", wip: true, type: "Figma", project: "MoodChanger", team: "UX/UI",
    uploadedBy: "Sam Rivera", date: "2026-04-25", owner: "Claudia Lopez", version: "v1.2", status: "Approved",
    tags: ["brand", "explore"], keywords: ["moodchanger", "logo", "palette", "direction"], size: "3.1 MB",
    desc: "Early brand and visual-direction explorations for MoodChanger." },
  { id: 15, name: "MoodChanger — Marketing Site.fig", type: "Figma", project: "MoodChanger", team: "UX/UI",
    uploadedBy: "Priya Nair", date: "2026-06-05", owner: "Sam Rivera", version: "v3.0", status: "Approved",
    tags: ["web", "marketing"], keywords: ["moodchanger", "landing", "site", "responsive"], size: "9.4 MB",
    desc: "Production marketing-site design for the MoodChanger launch — desktop and mobile." },
  { id: 16, name: "MoodChanger — Onboarding Wireframes.fig", type: "Figma", project: "MoodChanger", team: "UX/UI",
    uploadedBy: "Liam Chen", date: "2026-04-15", owner: "Liam Chen", version: "v1.0", status: "Approved",
    tags: ["wireframe", "onboarding"], keywords: ["moodchanger", "wireframe", "signup", "welcome"], size: "610 KB",
    desc: "Low-fidelity onboarding wireframes for MoodChanger — signup, welcome, and first-run flow." },
  { id: 17, name: "MoodChanger — Dashboard Wireframes.fig", wip: true, type: "Figma", project: "MoodChanger", team: "UX/UI",
    uploadedBy: "Amara Okafor", date: "2026-04-16", owner: "Claudia Lopez", version: "v1.1", status: "Approved",
    tags: ["wireframe", "dashboard"], keywords: ["moodchanger", "wireframe", "home", "layout"], size: "880 KB",
    desc: "Dashboard and home-screen wireframes for MoodChanger — module placement and hierarchy." },
  { id: 18, name: "MoodChanger — Settings Wireframes.fig", type: "Figma", project: "MoodChanger", team: "UX/UI",
    uploadedBy: "Sam Rivera", date: "2026-04-17", owner: "Sam Rivera", version: "v1.2", status: "Approved",
    tags: ["wireframe", "settings"], keywords: ["moodchanger", "wireframe", "preferences", "account"], size: "520 KB",
    desc: "Settings and account-management wireframes for MoodChanger — preferences and privacy." },
  { id: 19, name: "MoodChanger — Icon Library.fig", type: "Figma", project: "MoodChanger", team: "UX/UI",
    uploadedBy: "Amara Okafor", date: "2026-05-22", owner: "Amara Okafor", version: "v2.1", status: "Approved",
    tags: ["icons", "library"], keywords: ["moodchanger", "glyphs", "set", "assets"], size: "1.9 MB",
    desc: "Full icon library for MoodChanger — line and filled glyph sets with export presets." },
  { id: 20, name: "MoodChanger — Prototype Flows.fig", wip: true, type: "Figma", project: "MoodChanger", team: "UX/UI",
    uploadedBy: "Marcus Lopez", date: "2026-05-26", owner: "Claudia Lopez", version: "v3.0", status: "Approved",
    tags: ["prototype", "flows"], keywords: ["moodchanger", "interactive", "clickthrough", "demo"], size: "7.8 MB",
    desc: "Interactive prototype flows for MoodChanger — clickable demo of the core journeys." },
  { id: 21, name: "AI User Research Findings.pdf", type: "PDF", project: "FloBrain", team: "Research",
    uploadedBy: "Priya Nair", date: "2026-03-12", owner: "Priya Nair", version: "v1.0", status: "Approved",
    tags: ["user interviews", "research"], keywords: ["ai", "user research", "usability", "productivity"], size: "1.4 MB",
    desc: "Q1 research findings and recommendations from user interviews conducted for FloBrain." },
  { id: 22, name: "FloBrain User Interviews Analysis.docx", type: "DOCX", project: "FloBrain", team: "Research",
    uploadedBy: "Liam Chen", date: "2026-03-20", owner: "Priya Nair", version: "v1.2", status: "Approved",
    tags: ["user interviews", "analysis"], keywords: ["ai", "user research", "interviews", "insights"], size: "920 KB",
    desc: "Thematic analysis of FloBrain user interviews — pain points, motivations, and opportunity areas." },
  { id: 23, name: "AI Productivity Assistant Research Report.pdf", wip: true, type: "PDF", project: "FloBrain", team: "Research",
    uploadedBy: "Amara Okafor", date: "2026-04-02", owner: "Amara Okafor", version: "v2.0", status: "Approved",
    tags: ["report", "research"], keywords: ["ai", "productivity", "assistant", "workflow"], size: "2.1 MB",
    desc: "Research report on the AI productivity assistant concept — feasibility, demand, and usability signals." },
  { id: 24, name: "Usability Study Results — FloBrain Dashboard.xlsx", type: "XLSX", project: "FloBrain", team: "Research",
    uploadedBy: "Priya Nair", date: "2026-04-19", owner: "Priya Nair", version: "v1.3", status: "Approved",
    tags: ["usability", "study"], keywords: ["usability", "dashboard", "tasks", "productivity"], size: "640 KB",
    desc: "Usability study results for the FloBrain dashboard — task completion, time-on-task, and SUS scores." },
  { id: 25, name: "User Feedback Summary for AI Features.docx", type: "DOCX", project: "FloBrain", team: "Research",
    uploadedBy: "Sam Rivera", date: "2026-05-08", owner: "Priya Nair", version: "v1.1", status: "Approved",
    tags: ["feedback", "summary"], keywords: ["ai", "feedback", "features", "usability"], size: "510 KB",
    desc: "Summary of user feedback across AI features — sentiment, top requests, and recurring friction." },
];

/* ---------- custom select ---------- */
function VSelect({ value, placeholder, options, onChange, inForm }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  React.useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div className="v-sel" ref={ref}>
      <button type="button" className={"v-selbtn" + (value && !inForm ? " is-set" : "")} onClick={() => setOpen(o => !o)}>
        {value ? <span>{value}</span> : <span className="v-sel-ph">{placeholder}</span>}
        <span className="spc" />
        {React.createElement(Icon.chevDown, { s: 15 })}
      </button>
      {open && (
        <div className="v-drop">
          {!inForm && (
            <button type="button" className={"v-opt" + (!value ? " on" : "")} onClick={() => { onChange(""); setOpen(false); }}>
              {placeholder}
            </button>
          )}
          {options.map(o => (
            <button type="button" key={o} className={"v-opt" + (o === value ? " on" : "")} onClick={() => { onChange(o); setOpen(false); }}>
              {o}{o === value && <span className="v-opt-ck">{React.createElement(Icon.check, { s: 14 })}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- combobox: type freely OR pick from carrot dropdown ---------- */
function VCombo({ value, placeholder, options, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  React.useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const matches = options.filter(o => !value || o.toLowerCase().includes(value.toLowerCase()));
  const list = matches.length ? matches : options;
  return (
    <div className="v-combo" ref={ref}>
      <input className="v-fbox v-combo-in" value={value}
        placeholder={placeholder}
        onChange={e => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)} />
      <button type="button" className={"v-combo-carrot" + (open ? " on" : "")} onClick={() => setOpen(o => !o)}>
        {React.createElement(Icon.chevDown, { s: 15 })}
      </button>
      {open && (
        <div className="v-drop v-combo-drop">
          {list.map(o => (
            <button type="button" key={o} className={"v-opt" + (o === value ? " on" : "")} onClick={() => { onChange(o); setOpen(false); }}>
              {o}{o === value && <span className="v-opt-ck">{React.createElement(Icon.check, { s: 14 })}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- chip input ---------- */
function ChipInput({ value, onChange, placeholder, kw, onReveal }) {
  const [draft, setDraft] = useState("");
  const add = () => { const v = draft.trim(); if (v && !value.includes(v)) onChange([...value, v]); setDraft(""); };
  return (
    <div className="v-chipin">
      {value.map(t => (
        <span key={t} className={"v-chip" + (kw ? " kw" : "")}>
          {t}
          <button type="button" onClick={() => onChange(value.filter(x => x !== t))}>{React.createElement(Icon.close, { s: 11 })}</button>
        </span>
      ))}
      <input value={draft} placeholder={value.length ? "" : placeholder}
        onFocus={() => onReveal && onReveal()}
        onChange={e => setDraft(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); } else if (e.key === "Backspace" && !draft && value.length) onChange(value.slice(0, -1)); }}
        onBlur={add} />
    </div>
  );
}

/* ---------- file type badge ---------- */
function TypeBadge({ type }) {
  const [c, bg] = TYPE_COLOR[type] || TYPE_COLOR.ZIP;
  return (
    <span className="v-ftype" style={{ color: c, background: bg }}>
      {React.createElement(Icon.file, { s: 20 })}
      <span>{TYPE_ABBR[type] || type}</span>
    </span>
  );
}

/* ---------- one result row ---------- */
/* Real browser download. The prototype has no binary store, so the saved file
   carries the record's full metadata — the save-to-disk flow itself is genuine. */
function downloadFile(f) {
  const body = [
    "FLOVAULT — FILE RECORD",
    "=".repeat(46), "",
    "Name:        " + f.name,
    "Type:        " + f.type,
    "Size:        " + f.size,
    "Version:     " + f.version,
    "Status:      " + (f.wip ? "WIP" : "Approved"),
    "",
    "Project:     " + f.project,
    "Team:        " + f.team,
    "Owner:       " + f.owner,
    "Uploaded by: " + f.uploadedBy,
    "Date:        " + f.date,
    "",
    "Tags:        " + (f.tags || []).join(", "),
    "Keywords:    " + (f.keywords || []).join(", "),
    "",
    "Description", "-".repeat(46), f.desc || "—",
    "", "=".repeat(46),
    "Retrieved " + new Date().toLocaleString(),
  ].join("\n");
  const base = f.name.replace(/\.[^.]+$/, "");
  const blob = new Blob([body], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = base + ".txt";
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function FileRow({ f, fav, onFav, onWip }) {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const save = (e) => {
    e.stopPropagation();
    downloadFile(f);
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };
  const fmtDate = (d) => { const dt = new Date(d + "T00:00"); return dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); };
  return (
    <div className={"v-file" + (open ? " open" : "")}>
      <div className="v-file-row" onClick={() => setOpen(o => !o)}>
        <TypeBadge type={f.type} />
        <div className="v-fmain">
          <div className="v-fname">{f.name}</div>
          <div className="v-fmeta">
            <b>{f.project}</b><span className="v-dotsep" />{f.team}<span className="v-dotsep" />{f.size}
          </div>
        </div>
        <span className="v-fver">{f.version || "—"}</span>
        {onWip
          ? <button type="button" className={"v-status v-status-btn " + (f.wip ? "wip" : "approved")}
              title={f.wip ? "WIP — click to mark Approved" : "Click to mark as WIP"}
              onClick={(e) => { e.stopPropagation(); onWip(f.id); }}><i />{f.wip ? "WIP" : "Approved"}</button>
          : (f.wip
              ? <span className="v-status wip"><i />WIP</span>
              : <span className="v-status approved"><i />Approved</span>)}
        {onFav && (
          <button type="button" className={"v-favbtn" + (fav ? " on" : "")}
            title={fav ? "Remove from favorites" : "Save to favorites"}
            onClick={(e) => { e.stopPropagation(); onFav(f.id); }}>
            {React.createElement(Icon.star, { s: 18 })}
          </button>
        )}
        <span className="v-fchev">{React.createElement(Icon.chevDown, { s: 17 })}</span>
      </div>
      {open && (
        <div className="v-file-detail fade-up">
          <div className="v-detgrid">
            <div className="v-detcell"><div className="v-detk">File Type</div><div className="v-detv">{f.type}</div></div>
            <div className="v-detcell"><div className="v-detk">Version</div><div className="v-detv">{f.version || "—"}</div></div>
            <div className="v-detcell"><div className="v-detk">Uploaded By</div><div className="v-detv">{f.uploadedBy}</div></div>
            <div className="v-detcell"><div className="v-detk">Upload Date</div><div className="v-detv">{fmtDate(f.date)}</div></div>
            <div className="v-detcell"><div className="v-detk">Project</div><div className="v-detv">{f.project}</div></div>
            <div className="v-detcell"><div className="v-detk">Team</div><div className="v-detv">{f.team}</div></div>
            <div className="v-detcell"><div className="v-detk">Document Owner</div><div className="v-detv">{f.owner}</div></div>
            <div className="v-detcell"><div className="v-detk">Stage</div><div className="v-detv">{f.wip ? "WIP" : "Approved"}</div></div>
            <div className="v-detcell wide">
              <div className="v-detk">Tags</div>
              <div className="v-tagrow">{f.tags.map(t => <span key={t} className="v-tag">{React.createElement(Icon.tag, { s: 11 })}{t}</span>)}</div>
            </div>
            <div className="v-detcell wide">
              <div className="v-detk">Keywords</div>
              <div className="v-tagrow">{f.keywords.map(t => <span key={t} className="v-tag kw">{t}</span>)}</div>
            </div>
            <div className="v-detcell full">
              <div className="v-detk">Description</div>
              <div className="v-detv v-detv-desc">{f.desc}</div>
            </div>
          </div>
          <div className="v-detactions">
            <button className={"v-dbtn primary" + (saved ? " is-saved" : "")} onClick={save}>
              {saved
                ? <React.Fragment>{React.createElement(Icon.check, { s: 15 })} Saved to your device</React.Fragment>
                : <React.Fragment>{React.createElement(Icon.download, { s: 15 })} Download</React.Fragment>}
            </button>
            <button className="v-dbtn">{React.createElement(Icon.history, { s: 15 })} Version history</button>
            <button className="v-dbtn">{React.createElement(Icon.eye, { s: 15 })} Preview</button>
            <span className="v-detnote" style={{ marginLeft: "auto" }}>{React.createElement(Icon.lock, { s: 13 })} Removal restricted to leadership</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- inline upload form (mirrors the search bar) ---------- */
const BLANK = { name: "", type: "", project: "", team: "", uploadedBy: "Claudia Lopez", date: new Date().toISOString().slice(0, 10),
  owner: "", version: "", tags: [], keywords: [], status: "Approved", wip: false, desc: "" };

/* example data pre-filled into the upload form so the fields show what would be entered */
const PREFILL = {
  name: "User Research Findings", type: "PDF", project: "FloBrain", team: "Research",
  uploadedBy: "Claudia Lopez", date: new Date().toISOString().slice(0, 10),
  owner: "Claudia Lopez", version: "",
  tags: ["user interviews"],
  keywords: ["ai", "user research", "usability", "productivity"],
  status: "Approved", wip: false,
  desc: "Research findings and recommendations from user interviews conducted for FloBrain" };

function UploadForm({ armed, onArm, onClose, onSave }) {
  const [f, setF] = useState({ ...PREFILL, name: "", project: "", team: "", tags: [], keywords: [], desc: "" });
  const [hot, setHot] = useState(false);
  const [seen, setSeen] = useState({});
  const set = (k, v) => setF(s => ({ ...s, [k]: v }));
  const reveal = (k) => {
    if (seen[k]) return;
    setSeen(s => ({ ...s, [k]: true }));
    setF(s => {
      const cur = s[k];
      const empty = Array.isArray(cur) ? cur.length === 0 : !cur;
      return empty ? { ...s, [k]: PREFILL[k] } : s;
    });
  };
  const pickFile = (name) => { set("name", name); const ext = (name.split(".").pop() || "").toUpperCase(); const guess = { PDF: "PDF", DOC: "DOCX", DOCX: "DOCX", XLS: "XLSX", XLSX: "XLSX", PNG: "PNG", JPG: "PNG", FIG: "Figma", MP4: "Video", MOV: "Video", ZIP: "ZIP", HTML: "HTML", CSS: "CSS", JS: "JavaScript", PY: "Python" }[ext]; set("type", guess || "DOCX"); };
  const canSave = !!f.name.trim();
  if (!armed) {
    return (
      <button type="button" className="v-uf-collapsed" onClick={onArm}>
        <span className="v-uf-armplus">{React.createElement(Icon.plus, { s: 24 })}</span>
        <span className="v-uf-collapsed-txt">
          <span className="v-uf-armtitle">Start a new upload</span>
          <span className="v-uf-armsub">Press + to add a file &amp; its details</span>
        </span>
        <span className="v-uf-armchev">{React.createElement(Icon.chevDown, { s: 18 })}</span>
      </button>
    );
  }
  return (
    <div className="v-uploadform fade-up">
      <div className="v-uf-body">
      <div className="v-uf-dz-wrap">
        <div className={"v-dropzone" + (hot ? " hot" : "")}
          onDragOver={e => { e.preventDefault(); setHot(true); }}
          onDragLeave={() => setHot(false)}
          onDrop={e => { e.preventDefault(); setHot(false); const n = e.dataTransfer.files?.[0]?.name; if (n) pickFile(n); }}
          onClick={() => pickFile(f.name || "Untitled Document.pdf")}>
          <span className="v-dz-ic">{React.createElement(Icon.upload, { s: 22 })}</span>
          {f.name
            ? <div className="v-dz-file">{React.createElement(Icon.file, { s: 15 })}{f.name}</div>
            : <React.Fragment><p className="v-dz-t">Drag a file here or <b>browse</b></p><p className="v-dz-s">PDF · DOCX · XLSX · PNG · Figma · Video · ZIP · HTML · CSS · JS · Python</p></React.Fragment>}
        </div>
      </div>

      {/* row of fields — same controls as the search bar */}
      <div className="v-uf-rowtop">
        <input className="v-fbox" value={f.name} onFocus={() => reveal("name")} onChange={e => set("name", e.target.value)} placeholder="File Name" />
        <VSelect inForm value={f.project} placeholder="Project" options={V_PROJECTS} onChange={v => set("project", v)} />
        <VSelect inForm value={f.team} placeholder="Team" options={V_TEAMS} onChange={v => set("team", v)} />
        <VSelect inForm value={f.version} placeholder="Version" options={V_VERSIONS} onChange={v => set("version", v)} />
        <label className={"v-wipchip" + (f.wip ? " on" : "")} title="Mark as Work in Progress">
          <input type="checkbox" checked={!!f.wip} onChange={e => set("wip", e.target.checked)} />
          <span className="v-wipbox">{f.wip && React.createElement(Icon.check, { s: 13 })}</span>
          <span>WIP</span>
        </label>
      </div>
      <div className="v-uf-row">
        <div className="v-uf-cell"><span className="v-uf-cap">Tags</span><ChipInput value={f.tags} onReveal={() => reveal("tags")} onChange={v => set("tags", v)} placeholder="Add a tag…" /></div>
        <div className="v-uf-cell"><span className="v-uf-cap">Keywords <em>— searchable</em></span><ChipInput kw value={f.keywords} onReveal={() => reveal("keywords")} onChange={v => set("keywords", v)} placeholder="Add a keyword…" /></div>
      </div>
      <div className="v-uf-row">
        <div className="v-uf-cell full"><span className="v-uf-cap">Description</span><textarea className="v-textarea" value={f.desc} onFocus={() => reveal("desc")} onChange={e => set("desc", e.target.value)} placeholder="What is this file and why does it matter?" /></div>
      </div>

      <div className="v-uf-foot">
        <button className="v-dbtn v-cancel" onClick={onClose}>Cancel</button>
        <button className="v-dbtn primary v-uf-save" style={{ opacity: canSave ? 1 : .5, pointerEvents: canSave ? "auto" : "none" }}          onClick={() => { if (canSave) { onSave({ ...f, id: Date.now(), size: "—", type: f.type || "DOCX", owner: f.owner || f.uploadedBy }); } }}>
          {React.createElement(Icon.lock, { s: 15 })} Save to Vault
        </button>
      </div>
      </div>
    </div>
  );
}

/* ---------- root ---------- */
function Vault() {
  const [files, setFiles] = useState(V_FILES);
  const [q, setQ] = useState("");
  const [fName, setFName] = useState("");
  const [fType, setFType] = useState("");
  const [fTeam, setFTeam] = useState("");
  const [fProject, setFProject] = useState("");
  const [fVersion, setFVersion] = useState("");
  const [fStatus, setFStatus] = useState("");
  const [mode, setMode] = useState("search"); // search | upload | favorites
  const [searchTab, setSearchTab] = useState("ai"); // ai | custom
  const [armed, setArmed] = useState(false);
  const [searched, setSearched] = useState(false);
  const [conflict, setConflict] = useState(null);
  const [formKey, setFormKey] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const toggleFav = (id) => setFavorites(list => list.includes(id) ? list.filter(x => x !== id) : [...list, id]);
  const toggleWip = (id) => setFiles(list => list.map(f => f.id === id ? { ...f, wip: !f.wip } : f));
  const favFiles = useMemo(() => files.filter(f => favorites.includes(f.id)), [files, favorites]);

  const resetAll = () => {
    setQ(""); setFName(""); setFType(""); setFTeam(""); setFProject(""); setFVersion(""); setFStatus("");
    setSearched(false); setArmed(false); setConflict(null); setMode("search");
    setFormKey(k => k + 1);
  };

  // when the user X's out every filter chip, fully reset the search:
  // results clear and the upload tile moves back up under the search bar.
  React.useEffect(() => {
    if (searched && !q.trim() && !fName.trim() && !fType && !fTeam && !fProject && !fVersion && !fStatus) setSearched(false);
  }, [searched, q, fName, fType, fTeam, fProject, fVersion, fStatus]);

  const versions = useMemo(() => [...new Set(files.map(f => f.version))].sort(), [files]);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    return files.filter(f => {
      if (fName.trim() && !f.name.toLowerCase().includes(fName.trim().toLowerCase())) return false;
      if (fType && f.type !== fType) return false;
      if (fTeam && f.team !== fTeam) return false;
      if (fProject && f.project !== fProject) return false;
      if (fVersion && f.version.split(".")[0] !== fVersion.split(".")[0]) return false;
      if (fStatus === "WIP" && !f.wip) return false;
      if (fStatus === "Approved" && f.wip) return false;
      if (s) {
        const hay = [f.name, f.keywords.join(" "), f.tags.join(" ")].join(" ").toLowerCase();
        if (!hay.includes(s)) return false;
      }
      return true;
    });
  }, [files, q, fName, fType, fTeam, fProject, fVersion, fStatus]);

  const activeFilters = [
    q.trim() && ["Search: " + q.trim(), () => setQ("")],
    fName.trim() && ["File: " + fName.trim(), () => setFName("")],
    fType && ["Type: " + fType, () => setFType("")],
    fTeam && ["Team: " + fTeam, () => setFTeam("")],
    fProject && ["Project: " + fProject, () => setFProject("")],
    fVersion && ["Version: " + fVersion, () => setFVersion("")],
    fStatus && ["Status: " + fStatus, () => setFStatus("")],
  ].filter(Boolean);

  const hasSearched = searched || !!(q.trim() || fName.trim() || fType || fTeam || fProject || fVersion || fStatus);

  const attemptSave = (cand) => {
    const matches = findSimilar(cand, files);
    if (matches.length) setConflict({ candidate: cand, matches });
    else commitUpload(cand, "new");
  };
  const commitUpload = (cand, mode) => {
    let nf = cand;
    if (mode === "updated") {
      const base = (conflict && conflict.matches[0]) || findSimilar(cand, files)[0];
      if (base) nf = { ...cand, name: base.name, version: bumpVersion(base.version), status: "Approved" };
    }
    setFiles(list => [nf, ...list]);
    setConflict(null);
    setArmed(false);
    setFormKey(k => k + 1);
  };

  const resultsView = mode === "favorites" ? (
    <React.Fragment>
      <div className="v-results-head">
        <span className="v-results-count"><b>{favFiles.length}</b> favorite{favFiles.length === 1 ? "" : "s"}</span>
        <button className="v-activechip" onClick={() => setMode("search")}>Close favorites {React.createElement(Icon.close, { s: 11 })}</button>
      </div>
      {favFiles.length ? (
        <div className="v-list">
          {favFiles.map(f => <FileRow key={f.id} f={f} fav={true} onFav={toggleFav} onWip={toggleWip} />)}
        </div>
      ) : (
        <div className="v-empty">
          {React.createElement(Icon.star, { s: 40 })}
          <p>No favorites yet.<br /><span>Tap the star on any file to save it here for quick access.</span></p>
        </div>
      )}
    </React.Fragment>
  ) : (mode === "search" && hasSearched) ? (
    <React.Fragment>
      <div className="v-results-head">
        <span className="v-results-count"><b>{results.length}</b> {results.length === 1 ? "file" : "files"} found</span>
        <div className="v-chipset">
          {activeFilters.map(([label, clear], i) => (
            <button key={i} className="v-activechip" onClick={clear}>{label} {React.createElement(Icon.close, { s: 11 })}</button>
          ))}
        </div>
      </div>
      {results.length ? (
        <div className="v-list">
          {results.map(f => <FileRow key={f.id} f={f} fav={favorites.includes(f.id)} onFav={toggleFav} onWip={toggleWip} />)}
        </div>
      ) : (
        <div className="v-empty">
          {React.createElement(Icon.search, { s: 40 })}
          <p>No files match your search.<br /><span>Try a different keyword or clear the filters.</span></p>
        </div>
      )}
    </React.Fragment>
  ) : null;

  return (
    <div className="panel" style={{ position: "absolute", inset: 0, padding: 0, overflow: "hidden" }}>
      <div className="vault">
        <header className="v-head">
          <div className="v-head-l">
            <span className="v-dial">{React.createElement(Icon.lock, { s: 26 })}</span>
            <div>
              <h1 className="v-title">FloVault</h1>
            </div>
          </div>
          <nav className="v-nav">
            <button type="button" className="v-navlink" onClick={resetAll}>
              {React.createElement(Icon.refresh, { s: 15 })}<span>Reset</span>
            </button>
            <button className="v-navlink" onClick={()=>window.open('https://flobrain.notion.site','_blank')}>
              {React.createElement(Icon.openBook, { s: 15 })}<span>Knowledge Base</span>
            </button>
            <button className="v-navlink" onClick={()=>window.open('https://flobrain.notion.site/how-to','_blank')}>
              {React.createElement(Icon.help, { s: 15 })}<span>How To</span>
            </button>
          </nav>
        </header>

        <div className="scroll-area scroll">
          {mode === "favorites" ? resultsView : (
            <React.Fragment>
              <div className="v-sectlabel v-search-toplabel">FloVault.ai</div>
              <div className="v-searchbar">
                <div className={"v-search3" + (q ? " is-set" : "")}>
                  {React.createElement(Icon.search, { s: 17 })}
                  <input value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => { if (e.key === "Enter") setSearched(true); }} placeholder="Find the newest Figma wireframe for the Wearables page  OR  Locate the newest prototype for the intern dashboard" />
                  {q && <button type="button" className="v-search3-x" onClick={() => setQ("")}>{React.createElement(Icon.close, { s: 14 })}</button>}
                </div>
                <button type="button" className="v-searchcta" onClick={() => { document.activeElement && document.activeElement.blur(); setSearched(true); }}>
                  {React.createElement(Icon.search, { s: 16 })} Search
                </button>
              </div>

              <div className="v-sectlabel">Custom Search</div>
              <div className="v-searchbar v-searchbar-filters">
                <div className="v-fname">
                  <input value={fName} onChange={e => setFName(e.target.value)} placeholder="Enter file name or keywords" />
                  {fName && <button type="button" className="v-search3-x" onClick={() => setFName("")}>{React.createElement(Icon.close, { s: 14 })}</button>}
                </div>
                <VSelect value={fType} placeholder="File Type" options={V_TYPES} onChange={setFType} />
                <VSelect value={fTeam} placeholder="Teams" options={V_TEAMS} onChange={setFTeam} />
                <VSelect value={fProject} placeholder="Project" options={V_PROJECTS} onChange={setFProject} />
                <VSelect value={fVersion} placeholder="Version" options={versions} onChange={setFVersion} />
                <VSelect value={fStatus} placeholder="Status" options={["Approved", "WIP"]} onChange={setFStatus} />
              </div>

              {resultsView}

              <div className="v-sectlabel v-upload-label">Vault Upload</div>
              <UploadForm key={formKey} armed={armed} onArm={() => setArmed(true)} onClose={() => setArmed(false)} onSave={attemptSave} />
            </React.Fragment>
          )}
        </div>

        {conflict && (
          <div className="v-conf-scrim" onMouseDown={(e) => { if (e.target === e.currentTarget) setConflict(null); }}>
            <div className="v-conflict fade-up">
              <div className="v-conf-head">
                <span className="v-conf-warn">{React.createElement(Icon.alertTri, { s: 20 })}</span>
                <div className="v-conf-htext">
                  <h2>Similar file already exists</h2>
                  <p>{conflict.matches.length} file{conflict.matches.length === 1 ? "" : "s"} in {conflict.candidate.project} look similar to &ldquo;{conflict.candidate.name}&rdquo;. Review before adding.</p>
                </div>
                <button className="v-conf-x" onClick={() => setConflict(null)}>{React.createElement(Icon.close, { s: 16 })}</button>
              </div>

              <div className="v-conf-youup">
                <span className="v-conf-label">You&rsquo;re uploading</span>
                <div className="v-conf-cand">
                  {React.createElement(Icon.file, { s: 16 })}
                  <b>{conflict.candidate.name}</b>
                  <span>{[conflict.candidate.project, conflict.candidate.team, conflict.candidate.version].filter(Boolean).join(" · ")}</span>
                </div>
              </div>

              <span className="v-conf-label">Similar files in the vault</span>
              <div className="v-list v-conf-list scroll">
                {conflict.matches.map(f => <FileRow key={f.id} f={f} />)}
              </div>

              <div className="v-conf-foot">
                <button className="v-dbtn v-cancel" onClick={() => setConflict(null)}>Cancel upload</button>
                <button className="v-dbtn" onClick={() => commitUpload(conflict.candidate, "new")}>Upload as new</button>
                <button className="v-dbtn primary" onClick={() => commitUpload(conflict.candidate, "updated")}>Upload as updated version</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

window.Vault = Vault;
