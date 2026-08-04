/* ============================================================
   chat.jsx — FLO CHAT: channels / personal + message feed
   ============================================================ */

const { useState } = React;

const MEM_MONTHS = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
const memSinceTs = (s) => { const [mo, yr] = s.split(" "); return new Date(+yr, MEM_MONTHS[mo] || 0).getTime(); };

const CHANNELS = [
  { name: "General - group" }, { name: "Welcome - group", active: true },
  { name: "announcements" }, { name: "Automation Home", caret: true },
  { name: "Cyber security", caret: true }, { name: "Data Analytics", caret: true },
  { name: "Design-Marketing", caret: true }, { name: "Dev & Mobile", caret: true },
  { name: "Ethics & Legal" }, { name: "Moodchanger", caret: true }, { name: "Influencer" },
];
const PEOPLE = [
  { name: "Ceren Genc" }, { name: "Dina Tarek" },
  { name: "Mohamed Abdelmohsen", online: true }, { name: "Kendra Avery" },
  { name: "Meryll Robles", online: true }, { name: "Paula Admin" },
];
// Full member records for the Members directory (right-side panel in Members view)
const MEMBERS = [
  { name: "Ceren Genc",          initials: "CG", screen: "@ceren.g",   since: "Jan 2024", teams: ["Leadership", "MoodChanger"] },
  { name: "Dina Tarek",          initials: "DT", screen: "@dina.t",    since: "Mar 2024", teams: ["Design & UX/UI", "Marketing"] },
  { name: "Mohamed Abdelmohsen", initials: "MA", screen: "@mo.abdel",  since: "Nov 2023", teams: ["Dev & Mobile", "Automation"], online: true },
  { name: "Kendra Avery",        initials: "KA", screen: "@kendra.a",  since: "Feb 2025", teams: ["Data Analytics"] },
  { name: "Meryll Robles",       initials: "MR", screen: "@meryll.r",  since: "Aug 2024", teams: ["Cyber Security", "Ethics & Legal"], online: true },
  { name: "Paula Admin",         initials: "PA", screen: "@paula.adm", since: "Jun 2023", teams: ["Operations"] },
];
const MSG_TEXT = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do";
const MESSAGES = [
  { who: "CL", date: "04-5-2026" }, { who: "SF", date: "04-5-2026" },
  { who: "CG", date: "04-5-2026" }, { who: "WD", date: "04-6-2026", online: true },
  { who: "MA", date: "04-6-2026", online: true }, { who: "PT", date: "04-6-2026" },
];

const AV_COLORS = { CL: "#8478FF", SF: "#FF628D", CG: "#2DD4BF", WD: "#FF9442", MA: "#0ACF83", PT: "#349CFF" };

// Dashboard-tile blue: avatars use the same violet→blue gradient as the home tiles,
// so they read as part of the app and don't clash with the right-side folder tabs.
const AV_TILE = "linear-gradient(150deg, #4F4AB3 0%, #5b56c9 50%, #349CFF 130%)";

function Avatar({ who, online }) {
  return (
    <span className="avatar" style={{ background: AV_TILE }}>
      {who}{online && <i className="av-dot" />}
    </span>
  );
}

function Chat() {
  const [view, setView] = useState("welcome"); // welcome | personal — main feed
  const [side, setSide] = useState("channels"); // channels | members — sidebar list
  const [memQ, setMemQ] = useState("");
  const [memSort, setMemSort] = useState("newest"); // newest | oldest — Member Since order
  const personal = view === "personal";
  const members = side === "members";
  const list = members ? PEOPLE : CHANNELS;
  const memList = MEMBERS
    .filter(m => (m.name + " " + m.screen).toLowerCase().includes(memQ.trim().toLowerCase()))
    .sort((a, b) => memSort === "newest" ? memSinceTs(b.since) - memSinceTs(a.since) : memSinceTs(a.since) - memSinceTs(b.since));
  const subnav = [
    { k: "user", on: personal, go: "personal" },
    { k: "users", on: !personal, go: "welcome" },
    { k: "userAdd" }, { k: "printer" },
  ];
  return (
    <div className="panel chat-panel fade-up">
      <div className="chat-subnav">
        {subnav.map((s, i) => (
          <button key={i}
            className={"csub" + (s.on ? " csub-on" : "")}
            onClick={() => s.go && setView(s.go)}>
            {React.createElement(Icon[s.k], { s: 20 })}
          </button>
        ))}
      </div>

      <div className="chat-channels">
        <div className="chan-toggle" role="tablist" aria-label="Sidebar list">
          <button role="tab" aria-selected={!members}
            className={"chan-tg" + (!members ? " chan-tg-on" : "")}
            onClick={() => setSide("channels")}>Channels</button>
          <button role="tab" aria-selected={members}
            className={"chan-tg chan-tg-mem" + (members ? " chan-tg-on" : "")}
            onClick={() => setSide("members")}>Members List</button>
        </div>
        <div className="chan-list scroll">
          {list.map((c, i) => (
            <button key={i} className={"chan-item" + (c.active ? " chan-on" : "")}>
              {members && <span className="chan-pdot" style={{ background: c.online ? "var(--green)" : "var(--ink-faint)" }} />}
              <span>{c.name}</span>
              {!members && c.caret && <span className="chan-caret">^</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="chat-main">
        <div className="chat-head">
          {React.createElement(Icon[members ? "users" : (personal ? "user" : "users")], { s: 20 })}
          <span className="chat-head-title">{members ? "Recent Members" : (personal ? "Personal chat" : "Welcome - chat")}</span>
          <span className="spacer" />
          {members ? (
            <div className="field mem-search">
              {React.createElement(Icon.search, { s: 16 })}
              <input value={memQ} onChange={e => setMemQ(e.target.value)} placeholder="Search members…" />
            </div>
          ) : (
            <span className="chat-head-name">Claudia Lopez</span>
          )}
          <button className="chat-ic">{React.createElement(Icon.dots, { s: 18 })}</button>
          {members ? (
            <button className="chat-ic mem-sort"
              onClick={() => setMemSort(s => s === "newest" ? "oldest" : "newest")}
              title={memSort === "newest" ? "Newest first" : "Oldest first"}>
              {React.createElement(Icon.upDown, { s: 19 })}
              <span className="mem-sort-lbl">{memSort === "newest" ? "Newest" : "Oldest"}</span>
            </button>
          ) : (
            <button className="chat-ic chat-bell">
              {React.createElement(Icon.bell, { s: 20 })}<i className="bell-badge" />
            </button>
          )}
        </div>

        {members ? (
          <div className="mem-dir scroll">
            <div className="mem-list">
              {memList.map((m, i) => (
                <div className="mem-rowit" key={i}>
                  <Avatar who={m.initials} online={m.online} />
                  <div className="mem-id">
                    <span className="mem-name">{m.name}</span>
                    <span className="mem-screen">{m.screen}</span>
                  </div>
                  <div className="mem-since">
                    <span className="mem-lbl">Member Since</span>
                    <span className="mem-val">{m.since}</span>
                  </div>
                  <div className="mem-teams">{m.teams.join(", ")}</div>
                </div>
              ))}
              {memList.length === 0 && <div className="mem-empty">No members match "{memQ}"</div>}
            </div>
          </div>
        ) : (
          <React.Fragment>
            <div className="chat-feed scroll">
              {MESSAGES.map((m, i) => (
                <div className={"msg" + (m.who === "CL" ? " msg-self" : "")} key={i}>
                  <div className="msg-head">
                    <Avatar who={m.who} online={m.online} />
                    <span className="msg-meta">{m.who} - {m.date}</span>
                  </div>
                  <p className="msg-body">{MSG_TEXT}</p>
                </div>
              ))}
            </div>
            <div className="chat-compose">
              <button className="compose-attach">{React.createElement(Icon.attach, { s: 19 })}</button>
              <input placeholder="Message Welcome - chat…" />
              <button className="compose-send">{React.createElement(Icon.send, { s: 18 })}</button>
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

window.Chat = Chat;
