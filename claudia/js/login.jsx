/* ============================================================
   login.jsx — FloBrain Portal (cosmic sign-in)
   ============================================================ */

function GoogleG({ s = 18 }) {
  return (
    <svg width={s} height={s} viewBox="0 0 48 48">
      <path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h11.8c-.5 2.8-2 5.1-4.4 6.7v5.6h7.1c4.2-3.8 6.6-9.5 6.6-16.3z"/>
      <path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.6-5.3l-7.1-5.6c-2 1.3-4.5 2.1-7.5 2.1-5.8 0-10.6-3.9-12.4-9.1H4.3v5.7C8 41.6 15.4 46 24 46z"/>
      <path fill="#FBBC05" d="M11.6 28.1c-.5-1.4-.7-2.8-.7-4.1s.3-2.8.7-4.1v-5.7H4.3C2.8 17.1 2 20.4 2 24s.8 6.9 2.3 9.8l7.3-5.7z"/>
      <path fill="#EA4335" d="M24 10.8c3.2 0 6.1 1.1 8.4 3.3l6.3-6.3C34.9 4.1 29.9 2 24 2 15.4 2 8 6.4 4.3 14.2l7.3 5.7c1.8-5.2 6.6-9.1 12.4-9.1z"/>
    </svg>
  );
}

function Login({ onLogin }) {
  const [leaving, setLeaving] = React.useState(false);
  const go = () => {
    if (leaving) return;
    setLeaving(true);
    setTimeout(() => onLogin("executive"), 720);
  };

  // build "FloBrain Portal" as per-letter spans with a running index for staggered entrance
  const words = [
    { t: "Flo", accent: false },
    { t: "Brain", accent: true },
    { t: " Portal", accent: false },
  ];
  let idx = 0;

  return (
    <div className={"login" + (leaving ? " is-leaving" : "")}>
      <div className="login-sky" />
      <div className="login-ring" />
      <div className="login-stars" />
      <div className="login-dunes" />

      <div className="login-content fade-up">
        <h1 className="login-logo" aria-label="FloBrain Portal">
          {words.map((w, wi) => (
            <span key={wi} className={"ll-word" + (w.accent ? " ll-accent" : "")}>
              {w.t.split("").map((ch, ci) => (
                <span key={ci} className="ll-ch" style={{ "--i": idx++ }}>
                  {ch === " " ? "\u00A0" : ch}
                </span>
              ))}
            </span>
          ))}
        </h1>
        <div className="login-form">
          <button className="lg-field">
            {React.createElement(Icon.mail, { s: 16 })}
            <span>ENTER EMAIL</span>
          </button>
          <button className="lg-field">
            {React.createElement(Icon.lock, { s: 16 })}
            <span>PASSWORD</span>
          </button>
          <button className="lg-signin" onClick={go}>SIGN IN</button>
          <button className="lg-google" onClick={go}>
            <GoogleG s={18} /> <span>Continue with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}

window.Login = Login;
