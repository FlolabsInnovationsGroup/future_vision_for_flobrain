# FloBrain V2 — Executive View (front end)

> Part of the **FloBrain V2** package. See `../README.md` for the full-stack overview and `../backend/API.md` for the endpoint map.

**Executive role only.** The intern and leadership dashboards have been removed from this build — `home.jsx` and `leadership.jsx` are gone, the login screen no longer offers a role selector, and `app.jsx` mounts `ExecutiveDash` directly with no role branching. Some now-unused `.home-*` and `.launch-*` rules remain in `screens.css`; they are inert and safe to strip.

## Overview
FloBrain Portal is the internal workspace for **FloLabs Innovations Group**. One sign-in screen routes to three role dashboards — **Intern**, **Leadership**, and **Executive**. This package documents the **Executive view**: a dark, three-column command surface for an executive overseeing teams, projects, interns, and AI agents.

The executive experience is:
- A **top nav** switching the center column between AI Chat, Room Chat, Tasks, Leaderboard, Docs, Calendar, and Leadership.
- A persistent **left column** of meetings and recordings.
- A persistent **right column** of **Buddies** — eight domain AI agents that route the center column.
- A **Leadership sub-app** (its own sub-nav: Dashboard, Interns, Teams, Projects, Calendar, Reports) for org-wide oversight.

## About the Design Files
Unlike a single-file prototype, this is already a **modular front-end**: separate JSX modules per screen area and separate stylesheets per domain. It runs by opening `index.html` in a browser — no build step, because React and Babel load from CDN and JSX is transpiled in-browser.

**That in-browser Babel setup is prototype scaffolding, not a shipping strategy.** Recreate this in the target codebase's real environment (Vite/Next/CRA + a bundler, TypeScript if that's the house style). The component boundaries, state shape, and CSS architecture are all sound and worth carrying over; the loading mechanism is not.

Global-scope pattern to be aware of: each `<script type="text/babel">` file defines components and attaches them to `window` (e.g. `window.Vault = Vault`). In a real build these become normal ES module imports/exports.

## Fidelity
**High-fidelity.** Colors, type, spacing, radii, copy, and interaction behavior are final. Both **light and dark themes** are fully specified — the Executive role opens in dark by default (`js/app.jsx`, on login).

Design width: **1440–1920px desktop**. The three-column grid has a documented narrow-viewport breakpoint at 1400px. This view is not designed for mobile.

---

## Screens / Views

### Sign-in (`js/login.jsx`)
Cosmic dark sign-in — email, password, **Sign In**. No role selector: this build is executive-only, so `onLogin("executive")` fires directly and the theme initializes to dark.

### Executive shell (`ExecutiveDash` in `js/executive.jsx`)
- **Top nav** (`.exec-topnav`) — AI Chat, Room Chat, Tasks, Leaderboard, Docs, Calendar, Leadership. Active link underlined/filled. FloBrain hand mark pinned right.
- **Three columns** (`.exec-cols`, `grid-template-columns: 268px minmax(0, 1fr) 178px`, 14px gap; right column widens to 210px when collapsed; at ≤1400px the tracks tighten to `196px / 1fr / 158px`).
  - **Left** — `ExecMeetings`: collapsible Upcoming and Recordings groups.
  - **Center** — swaps by nav selection (see below).
  - **Right** — `ExecBuddies`, collapsible to a stub.

### Center column states
| Nav | Component | Notes |
|---|---|---|
| AI Chat | `ExecAIChat` / `DesignBuddy` | Design Buddy gets its own richer panel |
| Room Chat | `Chat` (`js/chat.jsx`) | Embedded; heavy CSS overrides for the narrow column |
| Tasks | `ExecTasks` | Wraps `MTaskTable` / `MTaskDetail` from `member.jsx` |
| Leaderboard | `Leaderboard` (`js/leaderboard.jsx`) | Grid collapses to full-width modules in the narrow column |
| Docs | `MyPersonalSpace` | Labeled **My Docs** in the UI; `noBrainwriting` variant. Component/route/CSS names still say `personal`/`ps-*` internally |
| Calendar | `MyCalendar` | From `member.jsx` |
| Leadership | `ExecLeadership` | Full sub-app, below |
| *(Vault Buddy selected)* | `Vault` (`js/vault.jsx`) | Opens in-column with a ← Back control |

### Buddies panel (`ExecBuddies`)
Eight agents, each with name, domain, accent color, and an online dot:

| Buddy | Domain | Accent |
|---|---|---|
| Health Buddy | Wellness & vitals | `#FF5247` |
| Space Buddy | Missions & research | `#2DD4BF` |
| Data Buddy | Analytics & insights | `#FF628D` |
| Legal Buddy | Compliance & ethics | `#FF9442` |
| Finance Buddy | Budgets & payments | `#0ACF83` |
| Travel Buddy | Trips & itineraries | `#8478FF` |
| Vault Buddy | Files & versions | `#349CFF` |
| Design Buddy | UI, brand & assets | `#F471B5` |

Selecting a buddy routes the center column. Most open `ExecAIChat` with buddy-specific suggested prompts (`EXEC_SUGGESTED`) and sample conversations (`EXEC_CONVO`). Three are special-cased:
- **Vault Buddy** opens **FloVault** in the center column — the vault is reached through its buddy, not a toolbar icon.
- **Design Buddy** opens the `DesignBuddy` panel.
- **Health Buddy** opens the **FloHealth dashboard** (`HealthDash`) full-width — see below.

Collapsing the panel (`.is-collapsed`) reduces buddies to icons with tooltips.

### Design.ai Buddy (`DesignBuddy`) ⭐
A ChatGPT-style assistant, positioned as an **intelligence layer over FloBrain's existing resources** — it does not author design assets, it reads what already lives in the vault (design system, brand standards, project docs, research) and applies it.

- **Landing** — pink pen mark, "Hello Intern", and the positioning line: *"I'm here to help with UX/UI design decisions using FloBrain project knowledge, design standards, and team resources."*
- **Six quick actions** in a 2-up grid, each with a hint line: Review Design, Analyze UX Flow, Check Brand Consistency, Generate Design Brief, Developer Handoff Notes, Find Design References.
- **Responses are structured, not prose** — a lead sentence, then findings carrying a severity dot (`high` `#FF5247`, `med` `#FF9442`, `low` `#349CFF`, `info` `#0ACF83`), then a **"Referenced from FloBrain"** row citing the source records. That citation row is the core idea made visible: the assistant is applying stored standards, not inventing them.
- **Input** — file upload (`image/*,.pdf,.fig`), a "link a Figma file" affordance, a dismissible attachment chip, and free text that keyword-routes to the right analysis (`/brand|logo/`, `/flow|journey/`, `/brief|client/`, `/handoff|developer|spec/`, `/find|reference|version/`, `/review|check|critique/`).
- Once a thread starts, quick actions collapse to a chip bar and a **New chat** button appears.

Content lives in `DB_ACTIONS`, `DB_REPLIES`, `DB_DEFAULT`. Example canned finding, which shows the intended tone: *"Button spacing — Primary actions use 12px gaps; the design system specifies 16px between stacked actions."*

### FloHealth dashboard via Health Buddy (`HealthDash` in `js/health.jsx`)
Selecting **Health Buddy** replaces the three-column layout with the health dashboard at full width (`.exec-health-full`); a ← Back control appears inline in the exec top nav. Two things matter for anyone re-implementing this:

- **It renders full-width, not in the center column.** The center column is ~434px; the health dash needs its 190px left nav plus a multi-column card grid. Squeezing it into the column is not viable.
- **The palette is force-pinned to light.** The exec shell runs dark by default, which would otherwise swap the health dash to its dark-teal variant. `[data-theme="dark"] .exec-health-inner .health` in `css/screens.css` re-declares the full light mint token set (`--h-*`, `--t-50`…`--t-900`). If you port this, keep the health dash's palette independent of the host shell's theme.

Its own left nav: **My Health Dashboard · Insights · Planner · Library · Connections · Community · BuddyChat · Settings**. `.h-nav-list` is `overflow-y: auto; min-height: 0` — required, because the embedded host is shorter than the standalone one and the list would otherwise clip with no scroll affordance.

**Community** (`CommunityView`) — two tabs, **Community Events** (6) and **Trials & Research** (4). Events filter by six category chips (All, Wellness, Nutrition, Activity, Sleep, Chronic Care), show a registration count banner, and render cards with a category badge, title, date/time/location/host, spots remaining, and Details / Join — Join toggles to a Registered state with an accent ring. Data in `H_COM_CATS`, `H_COM_EVENTS`, `H_COM_TRIALS` (`js/health-data.jsx`).

### FloVault (`js/vault.jsx`)
Tag/keyword/description-driven document store, reached via **Vault Buddy**.
- **Search** — free text plus faceted filters: File Type, Teams, Project, Version, Status. Results appear only after a search is run.
- **File rows** (`FileRow`) — type badge, name, project · team · size, status (WIP / Approved), favorite star, expand chevron.
- **Detail panel** — type, size, owner, uploaded-by, date, version, stage, tags, keywords, description; actions **Download · Version history · Preview**.
- **Download works.** `downloadFile()` builds a Blob and triggers a genuine browser save, then the button flips to a green "Saved to your device" for ~2.2s. **Known gap:** there is no binary store, so the saved payload is a `.txt` record of the file's metadata. Swap the Blob for a fetch of the real stored file — the surrounding flow is already correct.
- **Upload form** (`UploadForm`) — captures name, project, team, tags, keywords, description, with duplicate detection (`findSimilar`, token overlap ignoring a stopword list) and auto version bumping (`bumpVersion`).

### Leadership sub-app (`ExecLeadership`)
Own sub-nav: **Dashboard · Interns · Teams · Projects · Calendar · Reports**.
- **Dashboard** — summary cards (Total Interns, Active Projects, Tasks Completed This Week, Projects Needing Attention), team overview table (Team / Lead / Status / Progress), team leads, org activity feed, meetings.
- **Interns** — cards showing name, team, role, project, status (On Track / At Risk / Blocked), hours, **specialty and school**.
- **Teams** — department cards (Design, Marketing, Development, Research); opening one shows task progress and assigned interns.
- **Projects** — progress, owner, due date, status.
- **Calendar** — month grid, events color-coded by team (Team 1–4).
- **Reports** — org-wide metrics.
- **Modals** — Create Team (organization, name, department, description, assign lead/co-lead, searchable member checkboxes, status, visibility), Assign Team Lead, Create Project, Create Task.

### Shared chrome (`js/chrome.jsx`)
- **Left rail** — in executive chrome (`execChrome`) it carries only app shortcuts (Figma, Canva, GitHub, Sketch, Marvel) and the theme toggle. The FloVault lock icon was deliberately removed; the vault belongs to Vault Buddy.
- **Theme toggle** — flips `data-theme` on `<html>`.

---

## Interactions & Behavior
- **No role routing** — `js/app.jsx` holds `authed` only; `role` is a fixed `"executive"` constant and the theme initializes to dark.
- **Center column routing** — `navActive` string state in `ExecutiveDash`, plus `activeBuddy` for the special-cased buddies and `vaultOpen` lifted to `App`.
- **Center column routing** — `navActive` string state in `ExecutiveDash`, plus `activeBuddy` for the two special-cased buddies and `vaultOpen` lifted to `App`.
- **Collapsible right column** — `rightCollapsed` swaps the panel for `.exec-buddies-stub`.
- **Transitions** — 150–220ms on color, background, border, filter. No bounces or springs.
- **Hover** — cards shift border to the accent; buttons lift one shade; links step brighter with no new underline.
- **Typing indicator** — three dots, `dbudBlink` 1.2s staggered 180ms.

## State Management
All local React `useState`, lifted only as far as needed. In production most belongs in a store or on the server.

`App` (`js/app.jsx`): `authed`, `tab`, `theme`, `running`/`elapsed` (timer), and open-flags for vault, chat, timer, member, leaderboard, health.
`ExecutiveDash`: `navActive`, `activeBuddy`, `rightCollapsed`.
`DesignBuddy`: `msgs`, `val`, `attached`, `thinking`.
`HealthDash`: `nav`; `CommunityView`: `tab`, `cat`, `joined`.
`Vault`: `files`, `q`, facet filters, `favorites`, per-row `open` / `saved`.
`ExecLeadership`: `sub`, `selTeam`, modal flags.

**No persistence.** Nothing is written to localStorage or a server; a refresh resets to the sign-in screen.

## Design Tokens
Defined in `css/glass.css` under `:root` (light) and `[data-theme="dark"]`.

### Dark theme (executive default)
| Token | Value |
|---|---|
| `--bg-0` | `#34345a` |
| `--bg-1` | `#3d3d68` |
| `--bg-2` | `#2c2c4d` |
| `--ink` | `#f4f7ff` |
| `--ink-soft` | `#cfd2ec` |
| `--ink-faint` | `#b6b8e6` |
| `--glass` | `rgba(255,255,255,.10)` |
| `--glass-strong` | `rgba(255,255,255,.16)` |
| `--glass-quiet` | `rgba(255,255,255,.06)` |
| `--glass-border` | `rgba(255,255,255,.18)` |
| `--glass-hair` | `rgba(255,255,255,.13)` |
| `--field-bg` | `rgba(255,255,255,.08)` |
| `--field-border` | `rgba(255,255,255,.20)` |
| `--ws-solid` | `#3d3e6b` |
| `--ws-solid-2` | `#494b7a` |
| `--ws-solid-border` | `#5a5d8a` |
| `--elev` | `0 22px 50px -24px rgba(0,0,0,.55)` |
| `--elev-sm` | `0 10px 26px -18px rgba(0,0,0,.45)` |

Accent glows: `--bg-glow-a` violet `rgba(132,120,255,.40)`, `--bg-glow-b` blue `rgba(52,156,255,.34)`, `--bg-glow-c` teal `rgba(45,212,191,.26)`.

Brand accents: violet `#4F4AB3` / `#8478FF`, blue `#349CFF`, deep navy `#1e2a6e` (Room Chat accent), green `#0ACF83`, orange `#FF9442`, red `#FF5247`, pink `#FF628D` / `#F471B5`.

Radii: `--r-xs` 8px, `--r-sm` 12px, `--r-md` 14px, `--r` 16px, `--r-lg` 22px, `--r-pill` 999px — see `css/glass.css`. Typography via `--t-h2`, `--t-card`, `--t-sm`, `--font`.

## Files
```
index.html                  entry — loads CSS, React/Babel CDN, then every JSX module in order
css/
  glass.css                 design tokens, light + dark themes, glass surfaces
  app.css                   app shell, left rail, top bar
  screens.css               executive layout, Design Buddy, chat  ← most exec CSS
  vault.css                 FloVault
  meetings.css              meetings & recordings
  leaderboard.css           leaderboard
  health.css                FloHealth dashboard (Health Buddy)
js/
  app.jsx                   root: auth gate, theme, timer — mounts ExecutiveDash directly
  login.jsx                 sign-in (no role selector)
  executive.jsx             ← the executive view (shell, buddies, AI chat, Design Buddy, Leadership)
  chrome.jsx                app shell, left rail, top bar
  vault.jsx                 FloVault
  chat.jsx                  Room Chat (embedded in exec center column)
  member.jsx                task table/detail, personal space, calendar — reused by exec
  meetings.jsx              meetings screens
  icons.jsx                 inline SVG icon set + HandLogo
  leaderboard.jsx           scoring dashboard (Leaderboard tab)
  health.jsx                FloHealth dashboard, incl. CommunityView
  health-data.jsx           health nav + community/trials data
  health-mvp.jsx            mobile MVP variant (not reachable from the exec view)
  timer.jsx                 timer screen
assets/flobrain-hand.png    brand hand mark (white artwork)
FloBrain Portal (standalone preview).html
                            single-file build — open to click through with no server
```

**Where to start reading:** `js/executive.jsx` is the view. Search for `ExecutiveDash` (shell), `ExecBuddies`, `DesignBuddy`, `ExecLeadership`. Executive CSS is in `css/screens.css` — the `.exec-*` and `.dbud-*` blocks.

**Running it:** open `index.html` from a local server (`npx serve .`). Opening from `file://` may block the JSX fetches. The standalone preview file works with a plain double-click.

## Implementation notes & known gaps
1. **No backend, no auth.** Any email/password signs in. Role selection is a client-side radio.
2. **No AI.** Every buddy response is a static fixture or keyword match. Design Buddy's findings and source citations are authored content, not analysis — this is the single biggest gap between prototype and product.
3. **Vault downloads carry metadata, not file bytes** (see FloVault above).
4. **No persistence** — refresh resets everything.
5. **Uploads are not stored.** The upload form validates and simulates, but files don't survive.
6. **The executive view is not independently extractable** — it reuses `Chat`, `Vault`, and four `member.jsx` components. Plan to port those together or stub them.
7. **Desktop only.** No mobile or tablet layouts for this view.
8. **`.chat-panel` is a 3-column grid** (subnav / channels / main) whose subnav is hidden in the exec column. If you change the exec grid tracks, account for the hidden child or columns will overlap — this has bitten twice.
9. **Fonts** load from Google Fonts — bundle locally for production.
10. **The hand-mark PNG is white artwork** used as a CSS mask (tintable via `HandLogo`'s `color` prop). Request a vector version.
