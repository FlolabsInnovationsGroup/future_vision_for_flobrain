/* ============================================================
   leaderboard.jsx — intern scoring dashboard
   Four separate score systems, deliberately NOT combined:
     1. Progress (hours)     — internship completion, not ranked
     2. Engagement (points)  — participation, ranked
     3. Achievements         — one-time unlocks
     4. Challenges           — limited-time goals
   Subjective dimensions are surfaced as review-only, never scored.
   ============================================================ */

const { useState } = React;

/* ---------- data ---------- */
const ME = "Claudia Lopez";
const HRS_TARGET = 500;
const HRS_LOGGED = 128;
const MILESTONES = [50, 100, 200, 300, 400, 500];

/* Ranked on points only. Hours are tracked but never ranked. */
const PEOPLE_LB = [
  { name: "Ceren Genc",          ini: "CG", c: "#2DD4BF", team: "Robotics",       pts: 4820, hrs: 142, wk: 385 },
  { name: "Dina Tarek",          ini: "DT", c: "#FF628D", team: "UX Design",      pts: 4510, hrs: 134, wk: 340 },
  { name: "Salih Faris",         ini: "SF", c: "#FF9442", team: "Robotics",       pts: 4180, hrs: 126, wk: 295 },
  { name: "Claudia Lopez",       ini: "CL", c: "#8478FF", team: "UX Design",      pts: 3960, hrs: 128, wk: 320 },
  { name: "Mohamed Abdelmohsen", ini: "MA", c: "#0ACF83", team: "Automation",     pts: 3720, hrs: 119, wk: 270 },
  { name: "Meryll Robles",       ini: "MR", c: "#349CFF", team: "Data Analytics", pts: 3450, hrs: 111, wk: 240 },
  { name: "Kendra Avery",        ini: "KA", c: "#FFCB45", team: "Moodchanger",    pts: 3210, hrs: 104, wk: 215 },
  { name: "Paula Reyes",         ini: "PR", c: "#21E6C1", team: "UX Design",      pts: 2980, hrs:  98, wk: 190 },
];

const TEAMS_LB = [
  { name: "Robotics",       c: "#2E6BFF", pts: 18420, members: 6, ms: [4, 6] },
  { name: "UX Design",      c: "#8478FF", pts: 16750, members: 5, ms: [3, 5] },
  { name: "Automation",     c: "#21E6C1", pts: 14310, members: 5, ms: [3, 6] },
  { name: "Marketing",      c: "#FF9442", pts: 13500, members: 5, ms: [3, 5] },
  { name: "Data Analytics", c: "#FF5F8D", pts: 12880, members: 4, ms: [2, 5] },
  { name: "Moodchanger",    c: "#FFCB45", pts: 11540, members: 4, ms: [2, 4] },
  { name: "Influencer",     c: "#C08BFF", pts: 10200, members: 4, ms: [2, 5] },
];

/* The five reporting groups. Hours and points never share a tile. */
const GROUPS = [
  { k: "Progress",      ic: "clock",  c: "#5b8bff", note: "not ranked",
    rows: [["Internship hours", "128 / 500"], ["Complete", "26%"], ["Milestone", "2 of 6"]] },
  { k: "Engagement",    ic: "bolt",   c: "#ffcb45", note: "ranked",
    rows: [["Total points", "3,960"], ["Leaderboard rank", "#4"], ["This week", "+320"]] },
  { k: "Learning",      ic: "openBook", c: "#21e6c1", note: "hours + points",
    rows: [["Onboarding", "Complete"], ["Masterclasses", "3 of 8"], ["Training modules", "5"]] },
  { k: "Contributions", ic: "spark",  c: "#ff5f8d", note: "attributed",
    rows: [["Tasks completed", "64"], ["Projects contributed to", "5"], ["Research submitted", "12"]] },
  { k: "Recognition",   ic: "medal",  c: "#c08bff", note: "earned",
    rows: [["Badges", "6 of 10"], ["Challenges won", "2"], ["Recognitions received", "4"]] },
];

/* Score System 2 — every action's point value, published for transparency. */
const POINT_RULES = [
  { k: "Complete a checklist item",          v: 5,   c: "#5b8bff" },
  { k: "Update project status",              v: 5,   c: "#5b8bff" },
  { k: "Attend a meeting",                   v: 15,  c: "#21e6c1" },
  { k: "Participate in discussion",          v: 15,  c: "#21e6c1" },
  { k: "Complete weekly check-in",           v: 15,  c: "#21e6c1" },
  { k: "Give a presentation",                v: 20,  c: "#ffcb45" },
  { k: "Submit reflection brainwrite",       v: 20,  c: "#ffcb45" },
  { k: "Receive mentor approval",            v: 25,  c: "#ffcb45" },
  { k: "Mentor someone",                     v: 30,  c: "#ff9442" },
  { k: "Upload deliverable or research",     v: 30,  c: "#ff9442" },
  { k: "Finish a training module",           v: 50,  c: "#ff5f8d" },
  { k: "Finish a masterclass",               v: 100, c: "#c08bff" },
];

/* Score System 3 — one-time accomplishments, presented as milestone badges. */
const ACHIEVEMENTS = [
  { k: "Welcome Aboard",      sub: "Onboarding complete",      pts: 100, done: true,  ic: "check",    tier: "bronze" },
  { k: "Masterclass Rookie",  sub: "First masterclass done",   pts: 75,  done: true,  ic: "openBook", tier: "bronze" },
  { k: "Masterclass Expert",  sub: "5 masterclasses done",     pts: 250, done: false, ic: "book",     tier: "gold",   now: 3, max: 5 },
  { k: "First Research", sub: "First research submitted", pts: 50,  done: true,  ic: "spark",  tier: "bronze" },
  { k: "10 Meetings",    sub: "10 meetings attended",     pts: 50,  done: true,  ic: "users",  tier: "bronze" },
  { k: "100 Hours",      sub: "100 hours logged",         pts: 100, done: true,  ic: "clock",  tier: "silver" },
  { k: "Early Bird",     sub: "5 tasks before deadline",  pts: 75,  done: true,  ic: "bolt",   tier: "silver" },
  { k: "250 Hours",      sub: "250 hours logged",         pts: 250, done: false, ic: "clock",  tier: "gold",     now: 128, max: 250 },
  { k: "Century Club",   sub: "100 tasks completed",      pts: 200, done: false, ic: "trophy", tier: "gold",     now: 64,  max: 100 },
  { k: "Full Term",      sub: "500 hours completed",      pts: 500, done: false, ic: "medal",  tier: "platinum", now: 128, max: 500 },
];

/* Score System 4 — limited-time challenges, on top of normal task points. */
const CHALLENGES = [
  { k: "Complete 5 research summaries", short: "Research Sprint",  ic: "openBook", tier: "silver", now: 3, max: 5,  ends: "this week",  reward: "+150", c: "#5b8bff" },
  { k: "Attend every meeting",          short: "Perfect Attendance", ic: "users",  tier: "gold",   now: 7, max: 9,  ends: "this month", reward: "+200", c: "#21e6c1" },
  { k: "Complete 10 checklist items",   short: "Checklist Clear",  ic: "check",    tier: "bronze", now: 8, max: 10, ends: "this week",  reward: "+100", c: "#2ee07a" },
];

/* Learning is measured twice: time spent (hours) and output (points). */
const LEARNING = [
  { k: "Intern Onboarding",      hrs: 2,   pts: 130, state: "done", sub: "brainwrite + Welcome Aboard" },
  { k: "Design Systems 101",     hrs: 3.5, pts: 120, state: "done", sub: "masterclass + brainwrite" },
  { k: "Research Methods",       hrs: 4,   pts: 120, state: "done", sub: "masterclass + brainwrite" },
  { k: "Prompt Engineering",     hrs: 1.5, pts: 20,  state: "wip",  sub: "in progress — 40%" },
  { k: "Accessibility Standards",hrs: 0,   pts: 0,   state: "todo", sub: "not started" },
];

/* Explicitly excluded from scoring — judgement calls, handled in review. */
const SUBJECTIVE = [
  "Quality of work", "Impact of contribution", "Initiative", "Learning and growth",
  "Collaboration", "Creativity", "Problem-solving", "Leadership", "Communication", "Mentorship",
];

const FLO_EARN = [
  { k: "Engagement points — 320 this week", v: "+320" },
  { k: "Achievements unlocked — 2", v: "+200" },
  { k: "Challenge bonus", v: "+150" },
];
const FLO_SHOP = [
  { k: "FloLabs Hoodie",    v: 800, ic: "gift" },
  { k: "UX Team Crewneck",  v: 700, ic: "gift" },
  { k: "MoodChanger Tank",  v: 480, ic: "gift" },
  { k: "Robotics Tee",      v: 450, ic: "gift" },
  { k: "FloLabs Coffee Mug",v: 260, ic: "gift" },
  { k: "FloBrain Mousepad", v: 180, ic: "gift" },
];

/* Feed shows the action AND the points it earned, so attribution is visible. */
const FEED = [
  { who: "DT", c: "#FF628D", txt: "completed Website Audit", t: "12m", tag: "task",       pts: 5 },
  { who: "SF", c: "#FF9442", txt: "uploaded Sensor Research v2", t: "40m", tag: "deliverable", pts: 30 },
  { who: "CG", c: "#2DD4BF", txt: "finished Robotics masterclass", t: "1h", tag: "learning", pts: 100 },
  { who: "MA", c: "#0ACF83", txt: "mentored Paula on deploy scripts", t: "2h", tag: "mentor", pts: 30 },
  { who: "MR", c: "#349CFF", txt: "submitted weekly check-in", t: "3h", tag: "checkin",  pts: 15 },
  { who: "KA", c: "#FFCB45", txt: "presented MoodChanger findings", t: "5h", tag: "present", pts: 20 },
];

const RECOGNITION = [
  { who: "Ceren Genc", c: "#2DD4BF", title: "Carried the Robotics sprint", body: "Unblocked the whole team on sensor fusion — twice in one week.", by: "Salih" },
  { who: "Dina Tarek", c: "#FF628D", title: "Design system saved hours", body: "Shipped reusable tokens everyone now builds on.", by: "Claudia" },
  { who: "Mohamed A.", c: "#0ACF83", title: "Automation wizard", body: "Cut our deploy time in half with one clever script.", by: "Meryll" },
];

/* ---------- small parts ---------- */
function LBAvatar({ ini, c, size = 38 }) {
  return (
    <span className="lb-av" style={{ background: c, width: size, height: size, fontSize: size * .34 }}>{ini}</span>
  );
}

function LBCard({ title, hint, ic, accent, wide, span, children, className = "" }) {
  const style = wide ? { gridColumn: "1 / -1" } : (span ? { gridColumn: "span " + span } : null);
  return (
    <section className={"lb-card " + className} style={style}>
      {title && (
        <header className="lb-card-h">
          {ic && <span className="lb-card-ic" style={{ color: accent }}>{React.createElement(Icon[ic], { s: 17 })}</span>}
          <h3>{title}</h3>
          {hint && <span className="lb-card-hint">{hint}</span>}
        </header>
      )}
      {children}
    </section>
  );
}

/* ---------- hero ---------- */
function LBHero() {
  return (
    <div className="lb-hero">
      <div className="lb-hero-shapes" aria-hidden="true">
        <span className="ps-shape ps-tri" /><span className="ps-shape ps-cir" />
        <span className="ps-shape ps-x" /><span className="ps-shape ps-sq" />
      </div>
      <div className="lb-hero-l">
        <span className="lb-season">FloLabs Innovations Group</span>
        <h1 className="lb-title" aria-label="Intern Leaderboard">
          {"INTERN LEADERBOARD".split(" ").map((word, wi, arr) => {
            const offset = arr.slice(0, wi).reduce((n, w) => n + w.length + 1, 0);
            return (
              <span key={wi} className="wd">
                {word.split("").map((ch, i) => (
                  <span key={i} className="ltr" style={{ "--i": offset + i }}>{ch}</span>
                ))}
              </span>
            );
          })}
        </h1>
      </div>
      <div className="lb-hero-r">
        <div className="lb-hero-stat">
          <span className="cap">POINTS RANK</span>
          <strong>#4</strong>
          <span className="lb-hs-sub">of 39 interns</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- Score System 1: internship progress (never ranked) ---------- */
function InternProgress() {
  const hrs = HRS_LOGGED;
  const pct = Math.round(hrs / HRS_TARGET * 100);
  return (
    <LBCard title="Internship Progress" ic="clock" accent="#5b8bff" span={7}
      hint="tracks completion — not a ranking">
      <div className="prog-head">
        <div>
          <strong className="prog-big">{hrs}<em>/{HRS_TARGET}</em></strong>
          <span className="cap">HOURS LOGGED</span>
        </div>
        <div className="prog-pct"><strong>{pct}%</strong><span className="cap">COMPLETE</span></div>
      </div>
      <div className="prog-track">
        <i style={{ width: pct + "%" }} />
        {MILESTONES.map(m => (
          <span key={m} className={"prog-tick" + (hrs >= m ? " hit" : "")} style={{ left: (m / HRS_TARGET * 100) + "%" }} />
        ))}
      </div>
      <div className="prog-ms">
        {MILESTONES.map(m => (
          <span key={m} className={"prog-ms-chip" + (hrs >= m ? " hit" : "")}>
            {hrs >= m && React.createElement(Icon.check, { s: 12 })}{m}h
          </span>
        ))}
      </div>
      <p className="prog-note">
        Hours measure whether the internship is being completed. They are deliberately excluded
        from the points ranking — someone can log 40 hours and barely participate, while another
        logs 20 and contributes standout research.
      </p>
    </LBCard>
  );
}

/* ---------- Score System 2: how points are earned ---------- */
function PointRules() {
  const [open, setOpen] = useState(false);
  return (
    <LBCard title="Score Guide" ic="bolt" accent="#ffcb45" span={12}
      hint="published rates · every intern, same scale">
      <button className="rule-toggle" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <span>{open ? "Hide" : "View"} all {POINT_RULES.length} scoring actions</span>
        <i className={"rule-chev" + (open ? " up" : "")}>{React.createElement(Icon.chevDown, { s: 15 })}</i>
      </button>
      {open && (
        <ul className="rule-list rule-list-cols">
          {POINT_RULES.map(r => (
            <li key={r.k} className="rule-row">
              <span className="rule-dot" style={{ background: r.c }} />
              <span className="rule-k">{r.k}</span>
              <b className="rule-v" style={{ color: r.c }}>+{r.v}</b>
            </li>
          ))}
        </ul>
      )}
    </LBCard>
  );
}

/* ---------- rankings (points only) ---------- */
function Podium({ rows }) {
  const order = [1, 0, 2];
  return (
    <div className="lb-podium">
      {order.map((idx) => {
        const p = rows[idx];
        const place = idx + 1;
        return (
          <div key={p.name} className={"pod pod-" + place}>
            <span className={"pod-rank rank-" + place}>{place}</span>
            <LBAvatar ini={p.ini} c={p.c} size={place === 1 ? 56 : 46} />
            <span className="pod-name">{p.name.split(" ")[0]}</span>
            <span className="pod-pts">{p.pts.toLocaleString()}</span>
            <div className="pod-bar" />
          </div>
        );
      })}
    </div>
  );
}

function Rankings() {
  const [mode, setMode] = useState("intern");
  return (
    <LBCard title="Engagement Contribution Rankings" ic="crown" accent="#ffcb45" span={7}
      hint="engagement points only">
      <div className="lb-seg">
        <button className={mode === "intern" ? "on" : ""} onClick={() => setMode("intern")}>Interns</button>
        <button className={mode === "team" ? "on" : ""} onClick={() => setMode("team")}>Teams</button>
      </div>

      {mode === "intern" ? (
        <React.Fragment>
          <Podium rows={PEOPLE_LB} />
          <div className="lb-rank-list">
            {PEOPLE_LB.slice(3).map((p, i) => (
              <div key={p.name} className={"lb-rrow" + (p.name === ME ? " is-me" : "")}>
                <span className="lb-rk">{i + 4}</span>
                <LBAvatar ini={p.ini} c={p.c} size={30} />
                <span className="lb-rname">{p.name}{p.name === ME && <em> · YOU</em>}</span>
                <span className="lb-rteam">{p.team}</span>
                <span className="lb-rwk">+{p.wk}</span>
                <span className="lb-rpts">{p.pts.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </React.Fragment>
      ) : (
        <div className="lb-rank-list lb-team-list">
          {TEAMS_LB.map((t, i) => (
            <div key={t.name} className="lb-rrow lb-teamrow">
              <span className="lb-rk">{i + 1}</span>
              <span className="lb-team-dot" style={{ background: t.c }} />
              <span className="lb-rname">{t.name}</span>
              <span className="lb-rteam">{t.members} interns</span>
              <span className="lb-rpts">{t.pts.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </LBCard>
  );
}

/* ---------- Score System 3 achievements now render as milestone badges in BadgeCoins ---------- */

/* ---------- Score System 4: challenges ---------- */
function Challenges() {
  return (
    <LBCard title="Upcoming Challenges" ic="flame" accent="#ff5f8d" span={12}
      hint="limited time · bonus on top of task points · hover a coin to flip">
      <div className="coin-row coin-row-wrap coin-row-3">
        {CHALLENGES.map((g, i) => {
          const pct = Math.round(g.now / g.max * 100);
          return (
            <div key={i} className={"coin-flip tier-" + g.tier + (pct >= 100 ? " earned" : " locked")}>
              <div className="coin-inner">
                <div className="coin-face coin-front">
                  <span className="coin-disc">
                    <span className="coin-ic">{React.createElement(Icon[g.ic], { s: 30 })}</span>
                  </span>
                  <span className="coin-name">{g.short}</span>
                  <span className="coin-pts-tag">{g.reward}</span>
                </div>
                <div className="coin-face coin-back">
                  <span className="coin-back-tier">ends {g.ends}</span>
                  <p className="coin-desc">{g.k}</p>
                  <div className="coin-near">
                    <span className="coin-near-lab">Progress</span>
                    <span className="coin-near-row"><span className="coin-near-who">{g.now} of {g.max}</span><b>{pct}%</b></span>
                    <span className="coin-prog"><i style={{ width: pct + "%", background: g.c }} /></span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </LBCard>
  );
}

/* ---------- learning: hours and points measured separately ---------- */
function Learning() {
  const tp = LEARNING.reduce((n, l) => n + l.pts, 0);
  return (
    <LBCard title="Learning" ic="openBook" accent="#21e6c1" span={7}
      hint="time watched counts as hours · output counts as points">
      <div className="learn-sum">
        <div className="learn-sum-hrs"><strong>{HRS_LOGGED}h</strong><span className="cap">TOWARD 500 HOURS</span></div>
        <div><strong>{tp}</strong><span className="cap">ENGAGEMENT POINTS</span></div>
        <div><strong>3<em> / 8</em></strong><span className="cap">MASTERCLASSES</span></div>
      </div>
      <div className="learn-list">
        {LEARNING.map(l => (
          <div key={l.k} className={"learn-row st-" + l.state}>
            <span className="learn-state" />
            <span className="learn-k"><b>{l.k}</b><em>{l.sub}</em></span>
            <span className="learn-hrs">{l.hrs ? l.hrs + "h" : "—"}</span>
            <span className="learn-pts">{l.pts ? "+" + l.pts : "—"}</span>
          </div>
        ))}
      </div>
    </LBCard>
  );
}

/* ---------- FloCash ---------- */
function FloCash() {
  return (
    <LBCard title="FloCash Rewards" ic="gift" accent="#2ee07a" hint="redeem for FloLabs merch" span={5}>
      <div className="flo-balance">
        <span className="flo-coin">ƒ</span>
        <div>
          <strong>1,240</strong>
          <span className="cap">AVAILABLE FLOCASH</span>
        </div>
      </div>
      <p className="lb-mini-h">How you earned it</p>
      <ul className="flo-earn">
        {FLO_EARN.map(e => (
          <li key={e.k}><span>{e.k}</span><b>ƒ{e.v}</b></li>
        ))}
      </ul>
      <p className="lb-mini-h">Redeem</p>
      <div className="flo-shop">
        {FLO_SHOP.map(s => (
          <button key={s.k} className="flo-item">
            {React.createElement(Icon[s.ic], { s: 18 })}
            <span>{s.k}</span>
            <b>ƒ{s.v}</b>
          </button>
        ))}
      </div>
    </LBCard>
  );
}

/* ---------- badges: milestone (achievements) ---------- */
function BadgeCoins() {
  const earnedCount = ACHIEVEMENTS.filter(a => a.done).length;
  return (
    <LBCard title="Badges" ic="medal" accent="#ffcb45" span={12}
      hint={earnedCount + " of " + ACHIEVEMENTS.length + " earned · hover a coin to flip"}>
      <div className="coin-group-lab">Milestone badges<em>one-time · earned once</em></div>
      <div className="coin-row coin-row-wrap">
        {ACHIEVEMENTS.map(a => (
          <div key={a.k} className={"coin-flip tier-" + a.tier + (a.done ? " earned" : " locked")}>
            <div className="coin-inner">
              <div className="coin-face coin-front">
                <span className="coin-disc">
                  <span className="coin-ic">{React.createElement(Icon[a.ic], { s: 30 })}</span>
                </span>
                <span className="coin-name">{a.k}</span>
                <span className="coin-pts-tag">+{a.pts}</span>
              </div>
              <div className="coin-face coin-back">
                <span className="coin-back-tier">{a.done ? "unlocked" : "locked"}</span>
                <p className="coin-desc">{a.sub}</p>
                {a.done
                  ? <span className="coin-earned-tag">{React.createElement(Icon.check, { s: 13 })} +{a.pts} points</span>
                  : <div className="coin-near">
                      <span className="coin-near-lab">Progress</span>
                      <span className="coin-near-row"><span className="coin-near-who">{a.now} of {a.max}</span><b>{Math.round(a.now / a.max * 100)}%</b></span>
                      <span className="coin-prog"><i style={{ width: (a.now / a.max * 100) + "%" }} /></span>
                    </div>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </LBCard>
  );
}

/* ---------- team milestones removed ---------- */

/* ---------- reviewed, not scored ---------- */
function NotScored() {
  return (
    <LBCard title="Reviewed, Not Scored" ic="shield" accent="#94a3b8" span={5}
      hint="judgement calls — handled in review, never points">
      <p className="ns-lead">
        These need human judgement and vary by role and experience level. Scoring them would
        penalise beginners and reward whoever happens to have the most visible work.
      </p>
      <div className="ns-chips">
        {SUBJECTIVE.map(s => <span key={s} className="ns-chip">{s}</span>)}
      </div>
      <p className="ns-foot">Surfaced in mentor feedback and performance reviews.</p>
    </LBCard>
  );
}

/* ---------- recognition wall ---------- */
function Recognition() {
  return (
    <LBCard title="Peer Recognition Wall" ic="medal" accent="#c08bff" hint="hover a card to flip" wide>
      <div className="recog-row">
        {RECOGNITION.map((r, i) => (
          <div key={i} className="recog-flip">
            <div className="recog-inner">
              <div className="recog recog-front">
                <div className="recog-h">
                  <LBAvatar ini={r.who.split(" ").map(w => w[0]).join("").slice(0, 2)} c={r.c} size={34} />
                  <div><strong>{r.who}</strong><span className="cap">{r.title}</span></div>
                </div>
                <p>{r.body}</p>
                <span className="recog-by">— nominated by {r.by}</span>
              </div>
              <div className="recog recog-back" style={{ "--rc": r.c }}>
                <span className="recog-back-ic">{React.createElement(Icon.medal, { s: 30 })}</span>
                <strong>{r.who}</strong>
                <p className="recog-back-quote">“{r.title}”</p>
                <span className="recog-by">recognised by {r.by}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </LBCard>
  );
}

/* ---------- feed removed; its category tags now legend the rankings card ---------- */

/* ---------- nomination form ---------- */
function NominationForm() {
  const [sent, setSent] = useState(false);
  const [open, setOpen] = useState(false);
  const areas = [
    ["Team impact", "How did they move the team forward?"],
    ["Guidance & support provided", "Did they mentor or unblock others?"],
    ["Motivation & inspiration", "How did they lift the crew's energy?"],
    ["Availability & helpfulness", "Were they there when it counted?"],
    ["Additional comments", "Anything else worth recognising…"],
  ];
  return (
    <LBCard title="Peer Nomination" ic="userAdd" accent="#2ee07a" hint="recognise a teammate" wide className="lb-nom">
      {sent ? (
        <div className="nom-sent">
          {React.createElement(Icon.medal, { s: 40 })}
          <strong>Nomination sent</strong>
          <span>Your teammate will feel the love on the Peer Recognition Wall.</span>
          <button className="lb-btn" onClick={() => { setSent(false); setOpen(false); }}>Nominate someone else</button>
        </div>
      ) : (
        <div className={"nom-drop" + (open ? " open" : "")}>
          <button type="button" className={"nom-trigger" + (open ? " on" : "")} onClick={() => setOpen(o => !o)}>
            <span className="nom-trigger-l">
              <span className="nom-trigger-ic">{React.createElement(Icon.userAdd, { s: 18 })}</span>
              <span>
                <b>Nominate a Teammate</b>
                <em>Recognise someone who went above and beyond</em>
              </span>
            </span>
            <span className="nom-chev">{React.createElement(Icon.chevDown, { s: 18 })}</span>
          </button>

          {open && (
            <form className="nom-form nom-reveal" onSubmit={e => { e.preventDefault(); setSent(true); }}>
              <div className="nom-grid2">
                <label className="nom-f">
                  <span>Nominee name</span>
                  <input placeholder="Who deserves a shout-out?" />
                </label>
                <label className="nom-f">
                  <span>Team</span>
                  <div className="nom-select">
                    <select defaultValue="">
                      <option value="" disabled>Select a team…</option>
                      {TEAMS_LB.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                    </select>
                    <span className="nom-select-chev">{React.createElement(Icon.chevDown, { s: 15 })}</span>
                  </div>
                </label>
              </div>
              {areas.map(([l, ph]) => (
                <label key={l} className="nom-f">
                  <span>{l}</span>
                  <textarea rows={2} placeholder={ph} />
                </label>
              ))}
              <div className="nom-foot">
                <span className="nom-bonus">{React.createElement(Icon.gift, { s: 15 })} Submitting earns <b>ƒ50</b> + counts toward your weekly challenge</span>
                <button type="submit" className="lb-btn lb-btn-primary">Submit Nomination</button>
              </div>
            </form>
          )}
        </div>
      )}
    </LBCard>
  );
}

/* ---------- FloLabs Commissions (placeholder) ---------- */
const COMMISSIONS = [
  { name: "Mohamed Salah", ini: "MS", c: "#2DD4BF" },
  { name: "Claudia Lopez", ini: "CL", c: "#FF628D" },
  { name: "Amara Okafor",  ini: "AO", c: "#FF9442" },
  { name: "Liam Torres",   ini: "LT", c: "#8478FF" },
  { name: "Priya Nair",    ini: "PN", c: "#0ACF83" },
];

function Commissions() {
  return (
    <LBCard title="FloLabs Commissions" ic="chart" accent="#0acf83" span={12}
      hint="referral leads, closed sales and commission earned">
      <div className="comm-soon">
        <span className="comm-soon-tag">Coming Soon</span>
        <p>Commission tracking is not live yet. Once enabled, referral leads and closed sales will be attributed here automatically.</p>
      </div>
      <div className="comm-table" aria-hidden="true">
        <div className="comm-head">
          <span>Rank</span><span>Name</span><span>Leads</span><span>Sales</span><span>Commission Earned</span>
        </div>
        {COMMISSIONS.map((p, i) => (
          <div key={p.name} className="comm-row">
            <span className="comm-rk">{i + 1}</span>
            <span className="comm-name"><LBAvatar ini={p.ini} c={p.c} size={26} />{p.name}</span>
            <span className="comm-v">—</span>
            <span className="comm-v">—</span>
            <span className="comm-v comm-earn">—</span>
          </div>
        ))}
      </div>
    </LBCard>
  );
}

/* ---------- root ---------- */
function Leaderboard() {
  return (
    <div className="lb scroll fade-up">
      <LBHero />

      <div className="lb-groups">
        {GROUPS.map(g => (
          <div key={g.k} className="lb-group" style={{ "--gc": g.c }}>
            <header className="lb-group-h">
              <span className="lb-group-ic">{React.createElement(Icon[g.ic], { s: 15 })}</span>
              <h4>{g.k}</h4>
              <span className="lb-group-note">{g.note}</span>
            </header>
            <ul className="lb-group-rows">
              {g.rows.map(([k, v]) => (
                <li key={k}><span>{k}</span><b>{v}</b></li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="lb-grid">
        <InternProgress />
        <Learning />
        <Rankings />
        <NotScored />
        <Challenges />
        <PointRules />
        <BadgeCoins />
        <FloCash />
        <Recognition />
        <NominationForm />
        <Commissions />
      </div>
    </div>
  );
}

window.Leaderboard = Leaderboard;
