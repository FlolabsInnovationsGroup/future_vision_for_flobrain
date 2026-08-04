/* ============================================================
   app.jsx — root: auth gate, routing, theme, timer state
   ============================================================ */
const { useState, useEffect } = React;

const SUB_VIEW = {
  tasks: "My Tasks",
  onboarding: "My Onboarding",
  brainwriting: "My Brainwriting",
  personal: "My Docs",
  calendar: "Calendar",
  meetings: "Meetings & Recordings",
  progress: "Progress Tracker",
  payments: "Payments & Referrals",
  teamMgmt: "Team Management",
  memberMgmt: "Member Management",
  teamPerf: "Team Performance",
  projectsOverview: "Projects Overview",
  taskDelegation: "Task Delegation",
  reports: "Reports",
  opsWorkflow: "Operational Workflow & Documentation",
  organizations: "Organizations",
  ventures: "Ventures",
  finance: "Finance Overview",
  systemHealth: "System Health",
  logs: "Logs",
  administration: "Administration",
  highLevelReports: "High-Level Reports",
};
const SUB_BY_LABEL = {
  "My Tasks": "tasks",
  "My Onboarding": "onboarding",
  "My Brainwriting": "brainwriting",
  "My Docs": "personal",
  "Calendar": "calendar",
  "Meetings & Recordings": "meetings",
  "Progress Tracker": "progress",
  "Payments & Referrals": "payments",
  "Team Management": "teamMgmt",
  "Member Management": "memberMgmt",
  "Team Performance": "teamPerf",
  "Projects Overview": "projectsOverview",
  "Task Delegation": "taskDelegation",
  "Reports": "reports",
  "Operational Workflow & Documentation": "opsWorkflow",
  "Organizations": "organizations",
  "Ventures": "ventures",
  "Finance Overview": "finance",
  "System Health": "systemHealth",
  "Logs": "logs",
  "Administration": "administration",
  "High-Level Reports": "highLevelReports",
};

function pad(n) { return String(n).padStart(2, "0"); }
function hms(t) { return `${pad(Math.floor(t / 3600))}:${pad(Math.floor((t % 3600) / 60))}:${pad(t % 60)}`; }

function App() {
  const [authed, setAuthed] = useState(false);
  const role = "executive"; // executive-only build
  const [tab, setTab] = useState("home");
  const [healthOpen, setHealthOpen] = useState(false);
  const [mvpOpen, setMvpOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [timerOpen, setTimerOpen] = useState(false);
  const [memberOpen, setMemberOpen] = useState(false);
  const [memberView, setMemberView] = useState("My Tasks");
  const [subOpen, setSubOpen] = useState({});
  const [vaultOpen, setVaultOpen] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  // theme attribute
  useEffect(() => { document.documentElement.setAttribute("data-theme", theme); }, [theme]);

  // timer tick
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  if (!authed) {
    return (
      <React.Fragment>
        <div className="app-bg" />
        <Login onLogin={() => { setTheme("dark"); setAuthed(true); }} />
      </React.Fragment>
    );
  }

  const timerLabel = (running || elapsed > 0) ? hms(elapsed) : "00:00:00";

  const openMember = (v) => { setMemberView(v || "My Tasks"); setMemberOpen(true); setTab("member"); };
  const openSub = (label) => { const id = SUB_BY_LABEL[label]; if (!id) return; setSubOpen(s => ({ ...s, [id]: true })); setTab(id); };
  const openLead = (label) => { /* leadership sub-pages — wired as content is added */ };

  let screen, bleed = false;
  if (tab === "home") screen = <ExecutiveDash onOpenMemberView={openSub} onOpenChat={() => { setChatOpen(true); setTab("chat"); }} onOpenVault={() => { setVaultOpen(true); }} onOpenLeaderboard={() => { setLeaderboardOpen(true); setTab("leaderboard"); }} vaultOpen={vaultOpen} onCloseVault={() => setVaultOpen(false)} />;
  else if (tab === "member") screen = <MemberPage initialView={memberView} onOpenChat={() => { setChatOpen(true); setTab("chat"); }} onOpenLeaderboard={() => { setLeaderboardOpen(true); setTab("leaderboard"); }} onOpenTimer={() => { setTimerOpen(true); setTab("timer"); }} />;
  else if (SUB_VIEW[tab]) screen = <MemberSub view={SUB_VIEW[tab]} role={role} who="Ceren Genc" projects={["HealthBuddy", "Athletic Performance Intelligence", "FloBrain"]} onOpenChat={() => { setChatOpen(true); setTab("chat"); }} onOpenLeaderboard={() => { setLeaderboardOpen(true); setTab("leaderboard"); }} onOpenTimer={() => { setTimerOpen(true); setTab("timer"); }} />;
  else if (tab === "chat") screen = <Chat />;
  else if (tab === "timer") screen = <Timer running={running} elapsed={elapsed} onToggle={() => setRunning(r => !r)} />;
  else if (tab === "vault") screen = <Vault />;
  else if (tab === "leaderboard") screen = <Leaderboard onOpenProfile={() => {}} />;
  else if (tab === "health") screen = <HealthDash />;
  else if (tab === "dashmvp") screen = <HealthMVP />;

  const openHealth = () => { setHealthOpen(true); setTab("health"); };
  const openMvp = () => { setMvpOpen(true); setTab("dashmvp"); };
  const closeMvp = () => { setMvpOpen(false); setTab(t => t === "dashmvp" ? "home" : t); };
  const closeHealth = () => { setHealthOpen(false); setTab(t => t === "health" ? "home" : t); };
  const openChat = () => { setChatOpen(true); setTab("chat"); };
  const openTimer = () => { setTimerOpen(true); setTab("timer"); };
  const openVault = () => { setVaultOpen(true); }; // shows inline in the exec center column

  const closeTab = (id) => {
    const setters = { chat: setChatOpen, timer: setTimerOpen, member: setMemberOpen, vault: setVaultOpen, leaderboard: setLeaderboardOpen };
    if (setters[id]) setters[id](false);
    if (SUB_VIEW[id]) setSubOpen(s => { const n = { ...s }; delete n[id]; return n; });
    if (id === "timer") { setRunning(false); setElapsed(0); }
    setTab(t => (t === id ? "home" : t));
  };

  /* ── Full-screen MVP overlay: bypasses all portal chrome ── */
  if (tab === "dashmvp") return (
    <React.Fragment>
      <div className="app-bg" />
      <div className="mvp-fullscreen"><HealthMVP onExit={closeMvp} /></div>
    </React.Fragment>
  );
  return (
    <React.Fragment>
      <div className="app-bg" />
      <AppShell
        active={tab}
        onTab={setTab}
        timerLabel={timerLabel}
        timerRunning={running}
        theme={theme}
        onTheme={() => setTheme(t => t === "light" ? "dark" : "light")}
        onLogout={() => { setAuthed(false); setTab("home"); setHealthOpen(false); setChatOpen(false); setTimerOpen(false); setMemberOpen(false); setSubOpen({}); setVaultOpen(false); setLeaderboardOpen(false); }}
        onOpenHealth={openHealth}
        onOpenMvp={openMvp}
        onOpenVault={openVault}
        healthOpen={healthOpen}
        onCloseHealth={closeHealth}
        onCloseTab={closeTab}
        onOpenChat={openChat}
        onOpenTimer={openTimer}
        tabsShown={{ chat: chatOpen, timer: timerOpen, member: memberOpen, vault: vaultOpen, leaderboard: leaderboardOpen, ...subOpen }}
        hideTopBar={true}
        hideHome={true}
        execChrome={true}
        fullBleed={bleed}
      >
        {screen}
      </AppShell>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
