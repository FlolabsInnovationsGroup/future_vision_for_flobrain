/* ============================================================
   chrome.jsx — shared desktop shell:
   TabBar · LeftRail · TopBar (search + profile) · ColorRail
   ============================================================ */
const { useState, useRef, useEffect } = React;

const TABS = [
  { id: "home",        label: "HOME",        icon: null },
  { id: "chat",        label: "FLO CHAT",    icon: "chat" },
  { id: "timer",       label: "00:00:00",    icon: "clock" },
  { id: "member",      label: "INTERN WORKSPACE", icon: null },
  { id: "tasks",       label: "MY TASKS",            icon: "check" },
  { id: "onboarding",  label: "MY ONBOARDING",       icon: "openBook" },
  { id: "brainwriting",label: "MY BRAINWRITING",     icon: "bolt" },
  { id: "personal",    label: "MY DOCS", icon: "book" },
  { id: "calendar",    label: "CALENDAR", icon: "calendar" },
  { id: "meetings",    label: "MEETINGS & RECORDINGS", icon: "video" },
  { id: "progress",    label: "PROGRESS TRACKER", icon: "chart" },
  { id: "payments",    label: "PAYMENTS & REFERRALS", icon: "dollar" },
  { id: "teamMgmt",    label: "TEAM MANAGEMENT", icon: "users" },
  { id: "memberMgmt",  label: "MEMBER MANAGEMENT", icon: "userAdd" },
  { id: "teamPerf",    label: "TEAM PERFORMANCE", icon: "pulse" },
  { id: "projectsOverview", label: "PROJECTS OVERVIEW", icon: "grid" },
  { id: "taskDelegation",   label: "TASK DELEGATION", icon: "send" },
  { id: "reports",     label: "REPORTS", icon: "file" },
  { id: "opsWorkflow", label: "OPERATIONAL WORKFLOW & DOCUMENTATION", icon: "book" },
  { id: "organizations", label: "ORGANIZATIONS", icon: "grid" },
  { id: "ventures",    label: "VENTURES", icon: "planet" },
  { id: "finance",     label: "FINANCE OVERVIEW", icon: "dollar" },
  { id: "systemHealth", label: "SYSTEM HEALTH", icon: "pulse" },
  { id: "logs",        label: "LOGS", icon: "file" },
  { id: "administration", label: "ADMINISTRATION", icon: "lock" },
  { id: "highLevelReports", label: "HIGH-LEVEL REPORTS", icon: "data" },
  { id: "vault",       label: "FLOVAULT",    icon: "lock" },
  { id: "leaderboard", label: "LEADERBOARD", icon: "trophy" },
];

const SUB_TAB_IDS = ["tasks", "onboarding", "brainwriting", "personal", "calendar", "meetings", "progress", "payments", "teamMgmt", "memberMgmt", "teamPerf", "projectsOverview", "taskDelegation", "reports", "opsWorkflow", "organizations", "ventures", "finance", "systemHealth", "logs", "administration", "highLevelReports"];

const RAIL_TABS = [
  { label: "Health",  icon: "health",   c: "#FF5247" },
  { label: "Dash MVP", icon: "spark",    c: "#349CFF", key: "dashmvp" },
  { label: "Space",   icon: "planet",   c: "#2DD4BF" },
  { label: "Data",    icon: "data",     c: "#FF628D" },
  { label: "Legal",   icon: "scale",    c: "#FF9442" },
  { label: "Finance", icon: "dollar",   c: "#0ACF83" },
  { label: "Travel",  icon: "airplane", c: "#8478FF" },
];

function TabBar({ active, onTab, timerLabel, timerRunning, healthOpen, onCloseHealth, onCloseTab, tabsShown, hideHome }) {
  const shown = tabsShown || {};
  const baseTabs = TABS.filter(t => {
    // Executive dashboard is always the base view — no HOME tab needed
    if (t.id === "home" && hideHome) return false;
    // Flo Chat, Timer & Workspace tabs only appear once the user opens them
    if (t.id === "chat")      return shown.chat;
    if (t.id === "timer")     return shown.timer;
    if (t.id === "member")    return shown.member;
    if (SUB_TAB_IDS.includes(t.id)) return shown[t.id];
    if (t.id === "vault")     return shown.vault;
    if (t.id === "leaderboard") return shown.leaderboard;
    return true;
  });

  // user-defined drag order, reconciled with whichever tabs are currently visible
  const [order, setOrder] = React.useState([]);
  const [dragId, setDragId] = React.useState(null);
  const [overId, setOverId] = React.useState(null);

  const visibleTabs = React.useMemo(() => {
    const byId = Object.fromEntries(baseTabs.map(t => [t.id, t]));
    const ordered = order.filter(id => byId[id]).map(id => byId[id]);
    const seen = new Set(order);
    baseTabs.forEach(t => { if (!seen.has(t.id)) ordered.push(t); });
    return ordered;
  }, [baseTabs, order]);

  const reorder = (fromId, toId) => {
    if (!fromId || fromId === toId) return;
    const ids = visibleTabs.map(t => t.id);
    const from = ids.indexOf(fromId), to = ids.indexOf(toId);
    if (from < 0 || to < 0) return;
    ids.splice(to, 0, ids.splice(from, 1)[0]);
    setOrder(ids);
  };

  return (
    <div className="tabbar">
      <div className="tabbar-inner">
        {visibleTabs.map(t => {
          const isActive = active === t.id;
          const label = t.id === "timer" ? timerLabel : t.label;
          return (
            <button key={t.id}
              className={"wtab" + (isActive ? " wtab-on" : "") + (dragId === t.id ? " wtab-dragging" : "") + (overId === t.id && dragId !== t.id ? " wtab-dragover" : "")}
              draggable
              onDragStart={(e) => { setDragId(t.id); e.dataTransfer.effectAllowed = "move"; }}
              onDragOver={(e) => { e.preventDefault(); if (overId !== t.id) setOverId(t.id); }}
              onDrop={(e) => { e.preventDefault(); reorder(dragId, t.id); setDragId(null); setOverId(null); }}
              onDragEnd={() => { setDragId(null); setOverId(null); }}
              onClick={() => onTab(t.id)}>
              {t.icon && React.createElement(Icon[t.icon], { s: 18 })}
              {t.id === "timer" && timerRunning && <span className="rec-dot" />}
              <span>{label}</span>
              {t.id !== "home" && onCloseTab && (
                <span className="wtab-close" role="button" title="Close"
                  onClick={(e) => { e.stopPropagation(); onCloseTab(t.id); }}>
                  {React.createElement(Icon.close, { s: 12 })}
                </span>
              )}
            </button>
          );
        })}
        {healthOpen && (
          <button
            className={"wtab wtab-health" + (active === "health" ? " wtab-on" : "")}
            onClick={() => onTab("health")}>
            {React.createElement(Icon.health, { s: 18 })}
            <span>HEALTH</span>
            <span className="wtab-close" role="button" title="Close"
              onClick={(e) => { e.stopPropagation(); if (onCloseHealth) onCloseHealth(); }}>
              {React.createElement(Icon.close, { s: 12 })}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

function LeftRail({ active, onOpenChat, onOpenTimer, onOpenVault, timerRunning, timerLabel, execChrome, theme, onTheme, onLogout }) {
  const [menu, setMenu] = useState(false);
  const pref = useRef(null);
  useEffect(() => {
    if (!execChrome) return;
    const h = (e) => { if (pref.current && !pref.current.contains(e.target)) setMenu(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [execChrome]);
  const apps = ["figma", "canva", "github", "sketch", "marvel"];
  const firstTool = "clock";
  const tools = execChrome ? [] : [firstTool, "chat", "openBook", "help"];
  const onTool = {
    clock: onOpenTimer,
    chat:  onOpenChat,
    lock:  onOpenVault,
  };
  const appLabel = { figma: "Figma", canva: "Canva", github: "GitHub", sketch: "Sketch", marvel: "Marvel" };
  const toolLabel = { clock: "Timer", calendar: "Calendar", chat: "Flo Chat", openBook: "Knowledge Base", help: "How To", lock: "FloVault" };
  return (
    <aside className={"leftrail glass" + (execChrome ? " rail-flat" : "")}>
      <div className="rail-logo" style={{opacity:0,pointerEvents:'none'}}><HandLogo s={28} /></div>
      <div className="rail-apps">
        {apps.map(a => (
          <button key={a} className="rail-tool rail-appline" data-tip={appLabel[a] || a}>
            {React.createElement(AppLine[a], { s: 22 })}
          </button>
        ))}
      </div>
      <div className="rail-div" />
      <div className="rail-tools">
        {tools.map((t, i) => {
          const handler = onTool[t];
          const isClock = t === "clock";
          const clockActive = isClock && timerRunning;
          return (
            <button key={t + i}
              className={"rail-tool" + (((t === "chat" && active === "chat") || (t === "clock" && active === "timer")) ? " rail-tool-on" : "") + (clockActive ? " rail-clock-live" : "")}
              onClick={handler}
              data-tip={clockActive ? "Tracking · " + timerLabel : (toolLabel[t] || t)}>
              {React.createElement(Icon[t], { s: 21 })}
              {clockActive && <span className="rail-clock-dot" />}
              {clockActive && <span className="rail-clock-time">{timerLabel}</span>}
            </button>
          );
        })}
        {execChrome && (
          <React.Fragment>
            <div className="rail-div" />
            <button className="rail-tool" onClick={onTheme} data-tip={theme === "light" ? "Dark mode" : "Light mode"}>
              {theme === "light" ? <G_moon /> : <G_sun />}
            </button>
          </React.Fragment>
        )}
      </div>
    </aside>
  );
}

function ProfileMenu({ onClose, onLogout }) {
  const items = ["My Profile", "Account", "Settings", "Notifications", "Language", "Log Off"];
  return (
    <div className="profile-menu glass fade-up">
      {items.map((it, i) => {
        const isLogout = i === items.length - 1;
        return (
          <button key={it}
            className={"pm-item" + (isLogout ? " pm-strong" : "")}
            onClick={() => { if (isLogout && onLogout) onLogout(); onClose(); }}>
            {it}
          </button>
        );
      })}
    </div>
  );
}

function TopBar({ theme, onTheme, onLogout }) {
  const [menu, setMenu] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setMenu(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div className="topbar">
      <span className="spacer" />
      <div className="field topsearch">
        {React.createElement(Icon.search, { s: 18 })}
        <input placeholder="Search clients, deals, transactions…" />
      </div>
      <button className="icon-btn theme-toggle" onClick={onTheme} title="Toggle theme">
        {theme === "light"
          ? <G_moon />
          : <G_sun />}
      </button>
      <div className="profile-wrap" ref={ref}>
        <button className="icon-btn profile-btn" onClick={() => setMenu(m => !m)}
          style={{ color: "#1e2a6e" }}>
          {React.createElement(Icon.user, { s: 22 })}
        </button>
        {menu && <ProfileMenu onClose={() => setMenu(false)} onLogout={onLogout} />}
      </div>
    </div>
  );
}

function G_moon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M20 14.5A8 8 0 1 1 9.5 4 6.5 6.5 0 0 0 20 14.5z"/></svg>;
}
function G_sun() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"/></svg>;
}

function ColorRail({ onOpen, onOpenMvp, active }) {
  const [hot, setHot] = useState(-1);
  return (
    <div className="colorrail">
      {RAIL_TABS.map((t, i) => {
        const tabKey = t.key || (t.icon === "health" ? "health" : t.label.toLowerCase());
        const isActive = active === tabKey;
        return (
          <button key={i}
            className={"folder-tab" + ((hot === i || isActive) ? " folder-on" : "")}
            style={{ "--c": t.c, zIndex: hot === i ? 30 : (RAIL_TABS.length - i) }}
            onMouseEnter={() => setHot(i)}
            onMouseLeave={() => setHot(-1)}
            onFocus={() => setHot(i)}
            onBlur={() => setHot(-1)}
            onClick={() => { if (t.icon === "health" && onOpen) onOpen(); else if (t.key === "dashmvp" && onOpenMvp) onOpenMvp(); }}>
            <span className="ft-ic">{React.createElement(Icon[t.icon], { s: 16 })}</span>
            <span className="ft-label">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function AppShell({ active, onTab, timerLabel, timerRunning, theme, onTheme, onLogout, onOpenHealth, onOpenMvp, onOpenVault, healthOpen, onCloseHealth, onCloseTab, onOpenChat, onOpenTimer, tabsShown, children, fullBleed, hideTopBar, hideHome, execChrome }) {
  return (
    <div className="app">
      <TabBar active={active} onTab={onTab} timerLabel={timerLabel} timerRunning={timerRunning}
        healthOpen={healthOpen} onCloseHealth={onCloseHealth} onCloseTab={onCloseTab} tabsShown={tabsShown} hideHome={hideHome} />
      <div className={"app-body" + (hideTopBar ? " no-topbar" : "") + (execChrome ? " rail-overlay" : "")}>
        {!hideTopBar && <TopBar theme={theme} onTheme={onTheme} onLogout={onLogout} />}
        <LeftRail active={active} onOpenChat={onOpenChat} onOpenTimer={onOpenTimer} onOpenVault={onOpenVault} timerRunning={timerRunning} timerLabel={timerLabel} execChrome={execChrome} theme={theme} onTheme={onTheme} onLogout={onLogout} />
        <div className={"screen" + (execChrome ? "" : " has-rail") + (fullBleed ? " screen-bleed" : "")}>
          <div className="screen-stage">{children}</div>
          {!execChrome && <ColorRail onOpen={onOpenHealth} onOpenMvp={onOpenMvp || (() => {})} active={active} />}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AppShell, TabBar, LeftRail, TopBar, ColorRail, RAIL_TABS });
