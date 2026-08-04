/* ============================================================
   meetings.jsx — Meetings & Recordings (live meeting view)
   Built from the Figma reference, in the FloBrain glass style.
   ============================================================ */

const MTG_AV = { EF: "#8478FF", KA: "#FF628D", DT: "#2DD4BF", SZ: "#FF9442", CG: "#349CFF", MA: "#0ACF83" };

const MTG_PARTICIPANTS = [
  { name: "Emily Faulk", av: "EF", mic: "muted" },
  { name: "Kendra Avery", av: "KA", mic: "muted" },
  { name: "Dina Tarek", av: "DT", mic: "on" },
  { name: "Serina Zou", av: "SZ", mic: "muted" },
  { name: "Ceren Genc", av: "CG", mic: "muted" },
  { name: "Mohamed A.", av: "MA", mic: "muted" },
];

const MTG_MESSAGES = [
  { time: "11:01 AM", who: "Ceren Genc", av: "CG", texts: ["Good afternoon, everyone.", "We will start this meeting"] },
  { time: "11:02 AM", who: "Kendra Avery", av: "KA", texts: ["Yes, Let's start this meeting"] },
  { time: "12:04 AM", who: "Ceren Genc", av: "CG", texts: ["Today, we are here to discuss last week's designs."] },
];

function MtgMic({ state }) {
  const icon = state === "on" ? "mic" : "micOff";
  return (
    <span className={"mtg-mic mtg-mic-" + state}>
      {React.createElement(Icon[icon], { s: 13 })}
    </span>
  );
}

function MyMeetings({ role }) {
  const [chatView, setChatView] = React.useState("personal");
  const [expanded, setExpanded] = React.useState("chat"); // "chat" | "meetings"
  const canManage = role === "leadership" || role === "executive";
  return (
    <div className="mtg fade-up">
      <div className={"mtg-body mtg-body-" + expanded}>
        {expanded === "meetings" ? (
          <div className="mtg-side mtg-side-open">
            <div className="mtg-side-head">
              <span className="mtg-side-title">Meetings</span>
              <button className="mtg-collapse mtg-collapse-flip" onClick={() => setExpanded("chat")}>{React.createElement(Icon.chevRight, { s: 16 })}</button>
            </div>
            <div className="mtg-side-body scroll">
              <div className="mtg-side-sec">
                <h4>Upcoming Meetings</h4>
                <p className="mtg-side-empty">Content coming soon…</p>
              </div>
              <div className="mtg-side-sec">
                <h4>Meeting Recordings</h4>
                <p className="mtg-side-empty">Content coming soon…</p>
              </div>
            </div>
            {canManage && (
              <div className="mtg-side-actions">
                <button className="mtg-side-action">{React.createElement(Icon.plus, { s: 16 })}<span>Create New Meeting</span></button>
                <button className="mtg-side-action">{React.createElement(Icon.upload, { s: 16 })}<span>Upload New Recording</span></button>
              </div>
            )}
          </div>
        ) : (
          <button className="mtg-rail mtg-rail-left" onClick={() => setExpanded("meetings")}>
            <span className="mtg-rail-ic">{React.createElement(Icon.video, { s: 18 })}</span>
            <span className="mtg-rail-vlabel">Meetings</span>
          </button>
        )}

        <div className="mtg-center">
          <div className="mtg-stage">
            <span className="mtg-stage-av">MA</span>
            <span className="mtg-name mtg-name-tl">Mohamed A.</span>
            <div className="mtg-bar">
              <button className="mtg-cbtn">{React.createElement(Icon.mic, { s: 15 })}</button>
              <button className="mtg-cbtn">{React.createElement(Icon.video, { s: 15 })}</button>
              <span className="mtg-bar-div" />
              <button className="mtg-cbtn">{React.createElement(Icon.upload, { s: 14 })}</button>
              <button className="mtg-cbtn mtg-cbtn-rec">{React.createElement(Icon.record, { s: 16 })}</button>
              <button className="mtg-cbtn">{React.createElement(Icon.chat, { s: 14 })}</button>
              <button className="mtg-cbtn">{React.createElement(Icon.dots, { s: 14 })}</button>
              <span className="mtg-bar-div" />
              <button className="mtg-leave">Leave</button>
            </div>
          </div>
        </div>

        <div className="mtg-vstrip scroll">
          {MTG_PARTICIPANTS.map((p, i) => (
            <div key={i} className="mtg-pcard">
              <span className="mtg-pcard-av" style={{ background: MTG_AV[p.av] }}>{p.av}</span>
              <span className="mtg-pcard-name">{p.name}</span>
              <MtgMic state={p.mic} />
            </div>
          ))}
        </div>

        {expanded === "chat" ? (
        <div className="mtg-chat">
          <div className="mtg-chat-top">
            <div className="mtg-seg">
              <button className={"mtg-segbtn" + (chatView === "group" ? " on" : "")} onClick={() => setChatView("group")}>Group</button>
              <button className={"mtg-segbtn" + (chatView === "personal" ? " on" : "")} onClick={() => setChatView("personal")}>Personal</button>
            </div>
            <button className="mtg-collapse" onClick={() => setExpanded("meetings")}>{React.createElement(Icon.chevRight, { s: 16 })}</button>
          </div>
          <div className="mtg-feed scroll">
            {MTG_MESSAGES.map((m, i) => (
              <div className="mtg-mgroup" key={i}>
                <span className="mtg-time">{m.time}</span>
                <div className="mtg-mrow">
                  <span className="mtg-mav" style={{ background: MTG_AV[m.av] }} />
                  <div className="mtg-mbubbles">
                    {m.texts.map((t, j) => (
                      <div className="mtg-bubble" key={j}>
                        {j === 0 && <span className="mtg-bubble-name">{m.who}</span>}
                        <span className="mtg-bubble-text">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mtg-compose">
            <span className="mtg-typing"><i /><i /><i /></span>
            <input placeholder="Type Something…" />
          </div>
        </div>
        ) : (
          <button className="mtg-rail mtg-rail-right" onClick={() => setExpanded("chat")}>
            <span className="mtg-rail-ic">{React.createElement(Icon.chat, { s: 18 })}<i className="mtg-unread" /></span>
            <span className="mtg-rail-vlabel">Chat</span>
          </button>
        )}
      </div>
    </div>
  );
}

window.MyMeetings = MyMeetings;
