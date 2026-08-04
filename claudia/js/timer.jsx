/* ============================================================
   timer.jsx — time-tracking calendar (00:00:00 tab)
   ============================================================ */

const { useState } = React;

const CAL_DAYS = [
  { n: 25, d: "Monday" }, { n: 26, d: "Tuesday" }, { n: 27, d: "Wednesday" },
  { n: 28, d: "Thursday" }, { n: 29, d: "Friday" }, { n: 30, d: "Saturday" }, { n: 1, d: "Sunday" },
];
const CAL_HOURS = Array.from({ length: 15 }, (_, i) => 7 + i); // 07..21
const CAL_EVENTS = [
  { day: 0, s: 9, e: 11, label: "13:00 (60 min)" },
  { day: 0, s: 13, e: 14, label: "13:00 (60 min)" },
  { day: 1, s: 13, e: 14, label: "13:00 (info here)" },
  { day: 2, s: 9, e: 14, label: "13:00 (60 min)" },
  { day: 3, s: 10, e: 12, label: "13:00 (60 min)" },
  { day: 5, s: 12, e: 13, label: "13:00 (60 min)" },
  { day: 5, s: 17, e: 21, label: "13:00 (60 min)" },
  { day: 6, s: 9, e: 10, label: "13:00 (15 min)" },
];
const PERIODS = ["Today", "Yesterday", "Last Week", "This Week", "This Month", "Last Month", "Year to Date", "Custom Range"];

function fmtHMS(total) {
  const h = String(Math.floor(total / 3600)).padStart(2, "0");
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function MiniSelect({ value, options }) {
  const [open, setOpen] = useState(false);
  const [v, setV] = useState(value);
  return (
    <div className="mini-sel">
      <button className="field mini-selbtn" onClick={() => setOpen(o => !o)}>
        <span>{v}</span>{React.createElement(Icon.chevDown, { s: 15 })}
      </button>
      {open && (
        <div className="mini-drop glass fade-up">
          {options.map(o => (
            <button key={o} className={"ws-opt" + (o === v ? " ws-opt-on" : "")}
              onClick={() => { setV(o); setOpen(false); }}>{o}</button>
          ))}
        </div>
      )}
    </div>
  );
}

function Timer({ running, elapsed, onToggle }) {
  const span = 14; // 21 - 7
  const pct = (h) => ((h - 7) / span) * 100;
  const ringPct = Math.min(100, (elapsed % 3600) / 3600 * 100);
  const thisWeek = 24863 + elapsed;

  return (
    <div className="panel timer-panel fade-up">
      <div className="timer-top">
        <MiniSelect value="2026" options={["2024", "2025", "2026", "2027"]} />
        <MiniSelect value="May" options={["March", "April", "May", "June", "July"]} />
        <MiniSelect value="Week" options={["Day", "Week", "Month"]} />
        <div className="field timer-task">
          <input defaultValue="Workspace protoype" placeholder="What are you working on?" />
        </div>
        <div className="timer-module glass">
          <div className="timer-ring" style={{ "--p": ringPct + "%" }}>
            <span className="timer-time">{fmtHMS(elapsed)}</span>
          </div>
          <button className={"timer-btn" + (running ? " timer-stop" : "")} onClick={onToggle}>
            {React.createElement(running ? Icon.stop : Icon.play, { s: 20 })}
          </button>
        </div>
      </div>

      <div className="timer-body">
        <div className="cal-mini">
          {["Date", "Goals", "Projects"].map((t, i) => (
            <button key={t} className={"calmini-tab" + (i === 0 ? " calmini-on" : "")}>{t}</button>
          ))}
        </div>

        <div className="cal scroll">
          <div className="cal-head">
            <div className="cal-corner" />
            {CAL_DAYS.map(d => (
              <div key={d.d} className="cal-dayhead">
                <b>{String(d.n).padStart(2, "0")}</b><span>{d.d}</span>
              </div>
            ))}
          </div>
          <div className="cal-body">
            <div className="cal-times">
              {CAL_HOURS.map(h => <div key={h} className="cal-time">{String(h).padStart(2, "0")}:00</div>)}
            </div>
            {CAL_DAYS.map((d, di) => (
              <div key={di} className="cal-col">
                {CAL_HOURS.map(h => <div key={h} className="cal-cell" />)}
                {CAL_EVENTS.filter(e => e.day === di).map((e, i) => (
                  <div key={i} className="cal-event"
                    style={{ top: pct(e.s) + "%", height: (pct(e.e) - pct(e.s)) + "%" }}>
                    {e.label}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="cal-periods">
          {PERIODS.map(p => {
            const active = p === "This Week";
            return (
              <div key={p} className={"period" + (active ? " period-on" : "")}>
                <span>{p}</span>
                {active && <span className="period-time">{fmtHMS(thisWeek)}</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

window.Timer = Timer;
