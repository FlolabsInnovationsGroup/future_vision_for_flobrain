/* ============================================================
   icons.jsx — icon set reused from the FloBrain frames.
   Brand app chips (Figma, Grammarly, Brave, Marvel, Replit)
   + monoline tool/UI glyphs. All theme via currentColor.
   ============================================================ */

/* ---- Monoline UI glyphs (vuesax-ish, stroke 1.6) ---- */
function G({ children, s = 22, vb = 24, fill = "none", sw = 1.7 }) {
  return (
    <svg width={s} height={s} viewBox={`0 0 ${vb} ${vb}`} fill={fill}
      stroke={fill === "none" ? "currentColor" : "none"} strokeWidth={sw}
      strokeLinecap="round" strokeLinejoin="round">{children}</svg>
  );
}

const Icon = {
  home:   (p) => <G {...p}><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20h14V9.5"/><path d="M9.5 20v-5h5v5"/></G>,
  chat:   (p) => <G {...p}><path d="M4 5h16v11H9l-4 4v-4H4z"/><circle cx="9" cy="10.5" r="1" fill="currentColor" stroke="none"/><circle cx="12.5" cy="10.5" r="1" fill="currentColor" stroke="none"/><circle cx="16" cy="10.5" r="1" fill="currentColor" stroke="none"/></G>,
  clock:  (p) => <G {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></G>,
  lock:   (p) => <G {...p}><rect x="5" y="10.5" width="14" height="9.5" rx="2.4"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/><circle cx="12" cy="15" r="1.2" fill="currentColor" stroke="none"/></G>,
  book:   (p) => <G {...p}><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 5.5V20.5"/><path d="M20 18v3H6.5A2.5 2.5 0 0 1 4 18.5"/></G>,
  bookmark:(p) => <G {...p}><path d="M6 3.5h12a1 1 0 0 1 1 1V21l-7-3.6L5 21V4.5a1 1 0 0 1 1-1z"/></G>,
  star:   (p) => <G {...p}><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/></G>,
  refresh:(p) => <G {...p}><path d="M20 11a8 8 0 1 0-.5 4"/><path d="M20 4v5h-5"/></G>,
  calendar:(p) => <G {...p}><rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/><circle cx="12" cy="14.5" r="1.1" fill="currentColor" stroke="none"/></G>,
  search: (p) => <G {...p}><circle cx="11" cy="11" r="6.4"/><path d="m16 16 4 4"/></G>,
  user:   (p) => <G {...p}><rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="10" r="2.6"/><path d="M7.5 18a4.6 4.6 0 0 1 9 0"/></G>,
  users:  (p) => <G {...p}><circle cx="9" cy="9" r="3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><path d="M16 6.2a3 3 0 0 1 0 5.6"/><path d="M16.5 13.8A5.5 5.5 0 0 1 20.5 19"/></G>,
  userAdd:(p) => <G {...p}><circle cx="9" cy="8.5" r="3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><path d="M17.5 8v5M15 10.5h5"/></G>,
  printer:(p) => <G {...p}><path d="M7 9V4h10v5"/><rect x="4.5" y="9" width="15" height="7" rx="1.6"/><path d="M7 14h10v6H7z"/><circle cx="16.5" cy="11.6" r=".9" fill="currentColor" stroke="none"/></G>,
  pen:    (p) => <G {...p}><path d="M4 20h4L19.5 8.5a2.5 2.5 0 0 0-3.5-3.5L4.5 16.5z"/><path d="M14.5 6.5 18 10"/><path d="M4 20l.5-3.5"/></G>,
  pin:    (p) => <G {...p}><path d="M14.5 3.5 20.5 9.5M16 8l-7 2-5.5 5.5 2 2L11 12l2-7z" /><path d="m7 17-4 4"/></G>,
  bell:   (p) => <G {...p}><path d="M6 16V10a6 6 0 0 1 12 0v6l1.5 2.5h-15z"/><path d="M10 19a2 2 0 0 0 4 0"/></G>,
  dots:   (p) => <G {...p}><circle cx="12" cy="5.5" r="1.3" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="12" cy="18.5" r="1.3" fill="currentColor" stroke="none"/></G>,
  chevDown:(p) => <G {...p}><path d="m6 9 6 6 6-6"/></G>,
  upDown: (p) => <G {...p}><path d="M7 9l3-3 3 3"/><path d="M10 6.2v5.8"/><path d="M17 15l-3 3-3-3"/><path d="M14 18v-5.8"/></G>,
  chevRight:(p)=> <G {...p}><path d="m9 6 6 6-6 6"/></G>,
  plus:   (p) => <G {...p}><path d="M12 5v14M5 12h14"/></G>,
  close:  (p) => <G {...p}><path d="M6 6l12 12M18 6 6 18"/></G>,
  mail:   (p) => <G {...p}><rect x="3.5" y="5.5" width="17" height="13" rx="2.4"/><path d="m4.5 7 7.5 5.5L19.5 7"/></G>,
  play:   (p) => <G {...p} fill="currentColor" sw={0}><path d="M8 5.5v13l11-6.5z"/></G>,
  stop:   (p) => <G {...p} fill="currentColor" sw={0}><rect x="6.5" y="6.5" width="11" height="11" rx="2.2"/></G>,
  attach: (p) => <G {...p}><path d="M20 11.5 12 19.5a4.5 4.5 0 0 1-6.4-6.4l8-8a3 3 0 0 1 4.3 4.3l-8 8a1.5 1.5 0 0 1-2.2-2.2l7.3-7.3"/></G>,
  send:   (p) => <G {...p}><path d="M20 4 3.5 11l6.5 2 2 6.5z"/><path d="M20 4 10 13"/></G>,
  airplane:(p)=> <G {...p}><path d="M21 14.5 13.5 13 12 21l-2-1.5L9 16l-4 1-1-1.5 5-3 .5-3L3.5 7 4 5l6 2.5L15 4c1-.6 2.2-.4 2.8.3.6.7.4 1.8-.4 2.6L13.5 11l1 .5 5.5-1 1 1z"/></G>,
  dollar: (p) => <G {...p}><path d="M12 3v18"/><path d="M16 7.5c0-1.7-1.8-2.8-4-2.8s-4 1-4 2.9c0 4.5 8 2 8 6.6 0 1.9-1.8 2.9-4 2.9s-4-1.1-4-2.9"/></G>,
  scale:  (p) => <G {...p}><path d="M12 4v16M7 20h10"/><path d="M4 8h16M8 5.5l-4 9h8zM16 5.5l4 9h-8z"/><path d="M4.5 14.5a3.5 2.5 0 0 0 7 0M12.5 14.5a3.5 2.5 0 0 0 7 0" fill="none"/></G>,
  data:   (p) => <G {...p}><ellipse cx="12" cy="6" rx="7" ry="2.8"/><path d="M5 6v6c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8V6"/><path d="M5 12v6c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8v-6"/></G>,
  planet: (p) => <G {...p}><circle cx="11" cy="11" r="6.2"/><path d="M4.3 15.5C2 17 .7 18.6 1.4 19.8c.9 1.6 5.4.7 10.6-2.3s8.8-7 7.9-8.6c-.6-1.1-2.6-.9-5.2 0"/></G>,
  trophy: (p) => <G {...p}><path d="M7 4h10v4a5 5 0 0 1-10 0z"/><path d="M7 6H4.5v1.5A3.5 3.5 0 0 0 8 11M17 6h2.5v1.5A3.5 3.5 0 0 1 16 11"/><path d="M12 13v3M9 20h6M10 20l.5-4h3l.5 4"/></G>,
  medal:  (p) => <G {...p}><path d="M8 3 6 9M16 3l2 6"/><circle cx="12" cy="15" r="6"/><path d="M12 12.5l1 2 2 .2-1.5 1.4.4 2-1.9-1-1.9 1 .4-2L9 14.7l2-.2z" fill="currentColor" stroke="none"/></G>,
  flame:  (p) => <G {...p}><path d="M12 3c1 3-2 4-2 7a2 2 0 0 0 4 0c0-1 .5-1.5 1-2 1.5 2 2 3.5 2 5a5 5 0 0 1-10 0c0-3 2-4 2-6 0-2 1-3 3-4z"/></G>,
  spark:  (p) => <G {...p}><path d="M12 3v5M12 16v5M3 12h5M16 12h5M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3"/></G>,
  gift:   (p) => <G {...p}><rect x="4" y="9" width="16" height="11" rx="1.5"/><path d="M4 13h16M12 9v11"/><path d="M12 9S10.5 4 8 4a2 2 0 0 0 0 4zM12 9s1.5-5 4-5a2 2 0 0 1 0 4z"/></G>,
  target: (p) => <G {...p}><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/></G>,
  crown:  (p) => <G {...p}><path d="M4 8l3 8h10l3-8-4.5 3L12 5 8.5 11z"/><path d="M6 19h12"/></G>,
  bolt:   (p) => <G {...p} fill="currentColor" sw={0}><path d="M13 2 4 14h6l-1 8 9-12h-6z"/></G>,
  health: (p) => <G {...p}><path d="M12 20.5S3.5 15 3.5 8.9A4.4 4.4 0 0 1 12 6.6a4.4 4.4 0 0 1 8.5 2.3C20.5 15 12 20.5 12 20.5z"/><path d="M7.5 11.4h2l1-2 1.6 4 1.2-2h2.2"/></G>,
  openBook:(p) => <G {...p}><path d="M12 6.6C10.4 5.4 8.2 4.8 5 4.8v12.5c3.2 0 5.4.6 7 1.9 1.6-1.3 3.8-1.9 7-1.9V4.8c-3.2 0-5.4.6-7 1.8z"/><path d="M12 6.6v12.6"/></G>,
  help:   (p) => <G {...p}><circle cx="12" cy="12" r="9"/><path d="M9.3 9.4a2.8 2.8 0 0 1 5.4 1c0 1.9-2.7 2.2-2.7 4"/><circle cx="12" cy="17.2" r="1" fill="currentColor" stroke="none"/></G>,
  pulse:  (p) => <G {...p}><path d="M3 12h3.5l2-6 3.5 12 2.2-6H21"/></G>,
  heart:  (p) => <G {...p}><path d="M12 20.3S4.2 15 4.2 9.4A4.3 4.3 0 0 1 12 6.9a4.3 4.3 0 0 1 7.8 2.5C19.8 15 12 20.3 12 20.3z"/></G>,
  drop:   (p) => <G {...p}><path d="M12 3.4c3.6 4.3 6 7.1 6 10.1a6 6 0 0 1-12 0c0-3 2.4-5.8 6-10.1z"/></G>,
  lungs:  (p) => <G {...p}><path d="M12 4v7.5"/><path d="M12 8.5c-1 0-2 .8-2 2 0 1.7-.4 2.8-1.3 4.4C7.6 16.7 6.5 17.6 6.5 19.4A1.6 1.6 0 0 0 9.6 20c.6-2.2 1.4-4 1.4-6.6"/><path d="M12 8.5c1 0 2 .8 2 2 0 1.7.4 2.8 1.3 4.4 1.1 1.8 2.2 2.7 2.2 4.5A1.6 1.6 0 0 1 14.4 20c-.6-2.2-1.4-4-1.4-6.6"/></G>,
  thermo: (p) => <G {...p}><path d="M14 14.6V5.2a2 2 0 0 0-4 0v9.4a4 4 0 1 0 4 0z"/><path d="M12 9.2v6.4"/></G>,
  wind:   (p) => <G {...p}><path d="M3 8h9.5A2.5 2.5 0 1 0 10 5.5M3 12h13a3 3 0 1 1-3 3M3 16h7.5a2 2 0 1 1-2 2"/></G>,
  gauge:  (p) => <G {...p}><path d="M4 17a8 8 0 1 1 16 0"/><path d="M12 17l4-5"/><circle cx="12" cy="17" r="1.3" fill="currentColor" stroke="none"/></G>,
  pill:   (p) => <G {...p}><rect x="3" y="8.6" width="18" height="6.8" rx="3.4"/><path d="M12 8.7v6.6"/></G>,
  flask:  (p) => <G {...p}><path d="M9 3.5h6M10 3.5v5.5l-4.6 7.6A2 2 0 0 0 7.1 19.5h9.8a2 2 0 0 0 1.7-2.9L14 9V3.5"/><path d="M7.7 14h8.6"/></G>,
  stetho: (p) => <G {...p}><path d="M6 4v4a4 4 0 0 0 8 0V4"/><path d="M5 4h2M13 4h2"/><path d="M10 16v.5a4.5 4.5 0 0 0 9 0V14"/><circle cx="19" cy="12" r="2"/></G>,
  moon:   (p) => <G {...p}><path d="M20 14.5A8 8 0 1 1 9.5 4 6.5 6.5 0 0 0 20 14.5z"/></G>,
  smile:  (p) => <G {...p}><circle cx="12" cy="12" r="9"/><path d="M8.5 14.5a4.5 4.5 0 0 0 7 0"/><circle cx="9" cy="10" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="10" r="1" fill="currentColor" stroke="none"/></G>,
  watch:  (p) => <G {...p}><rect x="6.5" y="6.5" width="11" height="11" rx="3.2"/><path d="M9 6.5 9.6 3h4.8l.6 3.5M9 17.5 9.6 21h4.8l.6-3.5"/><path d="M12 9.5V12l1.8 1"/></G>,
  ring:   (p) => <G {...p}><circle cx="12" cy="13" r="6.5"/><circle cx="12" cy="13" r="3.2"/><path d="M9.5 6.7 10.2 3h3.6l.7 3.7"/></G>,
  battery:(p) => <G {...p}><rect x="3" y="8" width="15" height="9" rx="2.2"/><path d="M20.5 11v3"/><rect x="5" y="10" width="7" height="5" rx="1" fill="currentColor" stroke="none"/></G>,
  alertTri:(p)=> <G {...p}><path d="M12 4 21 19H3z"/><path d="M12 10v4"/><circle cx="12" cy="16.6" r="1" fill="currentColor" stroke="none"/></G>,
  check:  (p) => <G {...p}><path d="m5 12.5 4.5 4.5L19 7"/></G>,
  sliders:(p) => <G {...p}><path d="M4 8h10M18 8h2M4 16h2M10 16h10"/><circle cx="16" cy="8" r="2.2"/><circle cx="8" cy="16" r="2.2"/></G>,
  chart:  (p) => <G {...p}><path d="M4 4v16h16"/><rect x="7.5" y="12" width="2.6" height="5" rx=".6" fill="currentColor" stroke="none"/><rect x="12" y="9" width="2.6" height="8" rx=".6" fill="currentColor" stroke="none"/><rect x="16.5" y="6" width="2.6" height="11" rx=".6" fill="currentColor" stroke="none"/></G>,
  link:   (p) => <G {...p}><path d="M9.5 14.5 14.5 9.5"/><path d="M11 6.5 12.5 5a3.5 3.5 0 0 1 5 5l-2 2"/><path d="M13 17.5 11.5 19a3.5 3.5 0 0 1-5-5l2-2"/></G>,
  compass:(p) => <G {...p}><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5 13 13l-4.5 2.5L11 11z" fill="currentColor" stroke="none"/></G>,
  phone:  (p) => <G {...p}><path d="M6.5 4h3l1.5 4-2 1.5a10 10 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16 16 0 0 1 4.5 6.2 2 2 0 0 1 6.5 4z"/></G>,
  pin:    (p) => <G {...p}><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></G>,
  upload: (p) => <G {...p}><path d="M12 16V5"/><path d="M8 9l4-4 4 4"/><path d="M5 16v2.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V16"/></G>,
  shield: (p) => <G {...p}><path d="M12 3 5 6v5.5c0 4.3 3 7.4 7 9 4-1.6 7-4.7 7-9V6z"/><path d="M9.2 12l2 2 3.6-3.8"/></G>,
  file:   (p) => <G {...p}><path d="M6 3.5h7l5 5V20a.5.5 0 0 1-.5.5h-11A.5.5 0 0 1 6 20z"/><path d="M13 3.5V8.5h5"/></G>,
  tag:    (p) => <G {...p}><path d="M4 4h7l9 9-7 7-9-9z"/><circle cx="8.5" cy="8.5" r="1.4" fill="currentColor" stroke="none"/></G>,
  filter: (p) => <G {...p}><path d="M4 5h16l-6 7v6l-4 2v-8z"/></G>,
  download:(p)=> <G {...p}><path d="M12 4v11"/><path d="M8 11l4 4 4-4"/><path d="M5 19h14"/></G>,
  trash:  (p) => <G {...p}><path d="M5 7h14M9 7V5h6v2M7 7l1 13h8l1-13"/></G>,
  grid:   (p) => <G {...p}><rect x="4" y="4" width="7" height="7" rx="1.4"/><rect x="13" y="4" width="7" height="7" rx="1.4"/><rect x="4" y="13" width="7" height="7" rx="1.4"/><rect x="13" y="13" width="7" height="7" rx="1.4"/></G>,
  eye:    (p) => <G {...p}><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.6"/></G>,
  history:(p) => <G {...p}><path d="M4 12a8 8 0 1 0 2.5-5.8M4 4v3.5h3.5"/><path d="M12 8v4.5l3 1.8"/></G>,
  mic:    (p) => <G {...p}><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0"/><path d="M12 17.5V21M8.5 21h7"/></G>,
  micOff: (p) => <G {...p}><path d="M9 5a3 3 0 0 1 6 0v4M15 12.4a3 3 0 0 1-4.8 1.4"/><path d="M5.5 11a6.5 6.5 0 0 0 10 5.2M18.5 11a6.4 6.4 0 0 1-.4 2.2"/><path d="M12 17.5V21M8.5 21h7"/><path d="m4 3 16 16"/></G>,
  video:  (p) => <G {...p}><rect x="3" y="6" width="12" height="12" rx="2.5"/><path d="m15 10 6-3v10l-6-3z"/></G>,
  record: (p) => <G {...p}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4" fill="currentColor" stroke="none"/></G>,
};

/* ---- Monoline app shortcuts (match the tool line icons) ---- */
const AppLine = {
  figma:    (p) => <G {...p}><rect x="8.5" y="2.5" width="7" height="6" rx="3"/><rect x="8.5" y="9" width="7" height="6" rx="3"/><rect x="8.5" y="15.5" width="7" height="6" rx="3" /><path d="M8.5 5.5h-2a3 3 0 0 0 0 6h2M8.5 12h-2a3 3 0 0 0 0 6h2"/><circle cx="18.5" cy="12" r="3"/></G>,
  canva:    (p) => <G {...p}><circle cx="12" cy="12" r="9"/><path d="M15.2 9.6a3.6 3.6 0 1 0 .3 4.9"/></G>,
  github:   (p) => <G {...p} fill="currentColor" sw={0}><path d="M12 1.5A10.5 10.5 0 0 0 8.68 22c.53.1.72-.23.72-.5l-.01-1.78c-2.92.63-3.54-1.4-3.54-1.4-.48-1.21-1.17-1.54-1.17-1.54-.95-.65.07-.64.07-.64 1.06.08 1.61 1.09 1.61 1.09.94 1.6 2.46 1.14 3.06.87.1-.68.37-1.14.66-1.4-2.33-.27-4.78-1.17-4.78-5.18 0-1.15.41-2.08 1.08-2.82-.11-.27-.47-1.34.1-2.78 0 0 .88-.28 2.88 1.07a10 10 0 0 1 5.24 0c2-1.35 2.88-1.07 2.88-1.07.57 1.44.21 2.51.1 2.78.68.74 1.08 1.67 1.08 2.82 0 4.02-2.45 4.9-4.79 5.16.38.33.71.97.71 1.96l-.01 2.9c0 .28.19.61.72.5A10.5 10.5 0 0 0 12 1.5z"/></G>,
  sketch:   (p) => <G {...p}><path d="M7 3.5h10l4 6-9 11.5L3 9.5z"/><path d="M3 9.5h18"/><path d="M7 3.5 9.5 9.5 12 21 14.5 9.5 17 3.5"/><path d="M9.5 9.5h5"/></G>,
  marvel:   (p) => <G {...p}><path d="M4 19V7l4 6 4-9 4 9 4-6v12"/></G>,
};

/* White hand-mark logo (uses the uploaded PNG as a tintable mask) */
function HandLogo({ s = 28, color }) {
  const src = (window.__resources && window.__resources.handMask) || "assets/flobrain-hand.png";
  const mask = "url(" + src + ") center/contain no-repeat";
  return (
    <span className="hand-logo" aria-label="FloBrain" style={{
      display: "inline-block",
      width: s, height: Math.round(s * 1.13),
      background: color || "currentColor",
      WebkitMask: mask, mask: mask,
    }} />
  );
}

/* ---- Brand app chips for the left rail ---- */
function FigmaMark({ s = 20 }) {
  return (
    <svg width={s} height={s} viewBox="0 0 38 57">
      <path fill="#1abcfe" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z"/>
      <path fill="#0acf83" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z"/>
      <path fill="#ff7262" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19z"/>
      <path fill="#f24e1e" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z"/>
      <path fill="#a259ff" d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z"/>
    </svg>
  );
}

const AppChip = {
  figma:    () => <span className="appchip" style={{background:"#ffffff"}}><FigmaMark/></span>,
  grammarly:() => <span className="appchip" style={{background:"#15c39a"}}><b style={{color:"#fff",font:"800 13px Inter"}}>G</b></span>,
  brave:    () => <span className="appchip" style={{background:"#fb542b"}}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M12 2 6 4 4 7l1 9 7 6 7-6 1-9-2-3-6-2zm0 4 3 1 1 2-1.5 1.5L15 12l-1.5 3H10.5L9 12l.5-1.5L8 9l1-2 3-1z"/></svg>
    </span>,
  marvel:   () => <span className="appchip" style={{background:"#1a7fff"}}>
      <svg width="15" height="18" viewBox="0 0 6.101 7.8" fill="#fff"><path d="M2.442 2.566c.447.005-.339 2.311-.255 3.313.085 1.012 1.211.72 1.139.138-.121-.99.542-4.091 1.214-4.091.472 0 -.522 2.138-.327 3.507.13.906 1.305.592 1.185.055-.395-1.778.829-3.486.692-4.697C6.03.262 5.71.003 5.389 0 4.268-.009 3.401 2.279 3.401 2.279s.09-1.3-.781-1.348C1.285.858-.037 4.18.001 7.146c.012.946 1.196.785 1.134.031C1.019 5.774 1.806 2.559 2.442 2.566z"/></svg>
    </span>,
  replit:   () => <span className="appchip" style={{background:"#f26207"}}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5" opacity=".8"/><rect x="3" y="13" width="8" height="8" rx="1.5" opacity=".8"/></svg>
    </span>,
};

/* The FloBrain hand-mark logo (white, from the style guide) */
function FloLogo({ s = 30, color = "currentColor" }) {
  return (
    <svg width={s} height={s * 1.13} viewBox="0 0 44 50" fill={color} aria-label="FloBrain">
      <g>
        {[0,1,2,3,4].map(i => (
          <rect key={i} x={4 + i*7.6} y={4 + Math.abs(2-i)*3} width="4.4" height={42 - Math.abs(2-i)*6} rx="2.2"/>
        ))}
      </g>
    </svg>
  );
}

window.Icon = Icon;
window.AppChip = AppChip;
window.AppLine = AppLine;
window.HandLogo = HandLogo;
window.FloLogo = FloLogo;
window.FigmaMark = FigmaMark;
