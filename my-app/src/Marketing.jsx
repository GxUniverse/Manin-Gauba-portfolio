// src/App.js
import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate, Link, Navigate } from "react-router-dom";

/** ---------- ASSET BASE ----------
 * Put your files in /public/assets (recommended), or set REACT_APP_ASSET_BASE in .env,
 * or make /public/assets a symlink to a folder on your Desktop.
 */
const ASSET_BASE = process.env.REACT_APP_ASSET_BASE || "/assets";
const asset = (p) => `${ASSET_BASE}/${p}`;

/* ===========================================
   CRT LAYOUT (monitor + bezel + screen wrapper)
   =========================================== */
function CRTLayout({
  children,
  showPower = false,      // if true: show glitch video + POWER ON first
  videoSrc = null,        // e.g., asset('glitch.mp4')
  mode = "center",        // 'center' (centered content) or 'scroll' (scrollable page)
  titleBrand = "GAUBA • CRT",
}) {
  const [powered, setPowered] = useState(!showPower);
  const videoRef = useRef(null);

  const handlePowerOn = () => {
    try {
      videoRef.current?.pause();
      videoRef.current?.blur();
    } catch {}
    setPowered(true);
  };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

    :root{
      --bezel1:#e8e2d6;
      --bezel2:#d7d0c4;
      --bezel3:#c9c1b5;
      --glass:#07140a;
      --phosphor:#b5f8c1;
      --accent:#1dde6a;
      --room1:#0a0b0d;
      --room2:#08090b;
    }

    *{ box-sizing:border-box }
    html,body,#root{ height:100% }
    body{
      margin:0;
      background:
        radial-gradient(1600px 900px at 50% -200px, var(--room1) 0%, var(--room2) 65%, #050607 100%);
      color:#e9e9ee;
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
    }

    .room{ min-height:100vh; display:grid; place-items:center; padding:0; }

    /* Monitor */
    .monitor{
      width:min(1920px, 99.2vw);
      margin:0 auto;
      border-radius:18px;
      background: linear-gradient(180deg, var(--bezel1) 0%, var(--bezel2) 100%);
      box-shadow: 0 60px 140px rgba(0,0,0,.6),
                  inset 0 7px 0 rgba(255,255,255,.6),
                  inset 0 -12px 22px rgba(0,0,0,.12);
      padding:clamp(6px, 0.8vw, 12px);
      position:relative;
    }

    .bezel{
      border-radius:14px;
      padding:clamp(6px, 0.9vw, 14px);
      background: linear-gradient(180deg, var(--bezel2), var(--bezel3));
      box-shadow: inset 0 0 0 2px rgba(255,255,255,.5),
                  inset 0 0 0 4px rgba(0,0,0,.08);
      position:relative;
    }

    .screw{
      position:absolute; width:12px; height:12px; border-radius:50%;
      background: radial-gradient(circle at 30% 30%, #9f978a, #6e675d 60%, #564f46 100%);
      box-shadow: inset 0 1px 0 rgba(255,255,255,.6), inset 0 -1px 0 rgba(0,0,0,.4);
    }
    .screw.tl{ top:10px; left:10px } .screw.tr{ top:10px; right:10px }
    .screw.bl{ bottom:10px; left:10px } .screw.br{ bottom:10px; right:10px }

    .brand{
      position:absolute; left:50%; transform:translateX(-50%); bottom:-24px;
      padding:6px 12px; border-radius:6px;
      background: linear-gradient(180deg, var(--bezel1), var(--bezel2));
      border:1px solid rgba(0,0,0,.15); color:#3a352d; font-weight:800; letter-spacing:.06em;
      box-shadow: 0 2px 4px rgba(0,0,0,.25);
    }
    .led{
      position:absolute; right:18px; bottom:-16px; width:12px; height:12px; border-radius:50%;
      background: radial-gradient(circle at 40% 40%, #f66, #d11 60%, #700 100%);
      box-shadow: 0 0 8px rgba(209,17,17,.7);
      transition: all .25s ease;
    }
    .led.on{
      background: radial-gradient(circle at 40% 40%, #7bff7b, #12c912 60%, #087808 100%);
      box-shadow: 0 0 10px rgba(18,201,18,.7);
    }

    .stand{
      width: clamp(200px, 24vw, 360px);
      height: 28px;
      margin: 8px auto 0;
      border-radius: 18px / 12px;
      background: linear-gradient(180deg, var(--bezel2), #bfb7aa);
      box-shadow: inset 0 2px 0 rgba(255,255,255,.5),
                  inset 0 -3px 0 rgba(0,0,0,.22),
                  0 20px 60px rgba(0,0,0,.5);
    }

    /* Screen */
    .screen{
      width:100%;
      height: min(88vh, 100vh - 110px);
      border-radius:12px;
      overflow:hidden;
      border:clamp(4px, 0.8vw, 10px) solid #0d5d30;
      background: var(--glass);
      box-shadow: inset 0 0 90px rgba(29, 242, 142, .11),
                  inset 0 0 18px rgba(18, 160, 86, .22);
      position:relative;
      margin:0 auto;
    }

    .scan{
      pointer-events:none; position:absolute; inset:0;
      background:
        linear-gradient(rgba(200,255,220,.05), rgba(200,255,220,0) 2px),
        repeating-linear-gradient(transparent 0 2px, rgba(180,255,210,.04) 3px, transparent 4px);
      mix-blend-mode:screen; opacity:.28;
    }

    /* Pre-power: slot for your video */
    .glitchVideoWrap{ position:absolute; inset:0; display:grid; place-items:center; overflow:hidden; }
    .glitchVideo{ width:100%; height:100%; object-fit:cover; filter: saturate(115%) contrast(108%) brightness(104%); }

    /* Powered modes */
    .screen-center{
      width:100%; height:100%;
      display:grid; place-items:center;
      font-family: 'VT323', ui-monospace, Menlo, Consolas, monospace;
      color: var(--phosphor);
      text-shadow: 0 0 6px rgba(166,247,179,.22);
      text-align:center;
      padding: clamp(16px, 3vw, 40px);
    }

    .screen-scroll{
      width:100%; height:100%;
      overflow:auto;           /* PAGE SCROLLS inside the CRT */
      -webkit-overflow-scrolling: touch;
      padding: 0;              /* child can handle its own inner padding */
    }

    /* Home-specific */
    .welcome{ font-size: clamp(36px, 7vw, 72px); letter-spacing:1px; }
    .cursor{ display:inline-block; width:.6ch; color:#7dffb2; animation: blink 1s steps(2,end) infinite; }
    @keyframes blink{ 0%,49%{opacity:1} 50%,100%{opacity:0} }

    .nav{ display:flex; gap:14px; flex-wrap:wrap; justify-content:center; margin-top:12px; }
    .nav button{
      font-family:'VT323', ui-monospace, monospace; font-size: clamp(18px, 2.4vw, 28px);
      letter-spacing:.5px; text-transform: capitalize;
      background: transparent; color: var(--phosphor);
      border:3px solid var(--phosphor); border-radius:10px; padding:10px 16px; cursor:pointer;
      transition: transform .12s ease, filter .12s ease, background .12s ease, color .12s ease;
    }
    .nav button.active{ background: var(--phosphor); color: var(--glass); }
    .nav button:hover{ transform: translateY(-1px); filter:brightness(1.05) }

    .logo-box{
      margin-top:10px; width:min(900px, 90%); aspect-ratio: 16/6;
      border:2px dashed rgba(166,247,179,.45); border-radius:12px;
      display:grid; place-items:center; color:rgba(166,247,179,.9); font-size: clamp(16px, 2vw, 24px);
      box-shadow: inset 0 0 30px rgba(29,242,142,.08);
    }

    .powerOn{
      font-family:'VT323', ui-monospace, monospace; font-size: clamp(22px, 3vw, 30px);
      letter-spacing:1px;
      color: var(--glass); background: var(--accent);
      border:4px solid var(--accent); border-radius:999px; padding:16px 28px; cursor:pointer;
      box-shadow: 0 0 22px rgba(29,222,106,.35);
      transition: transform .12s ease, filter .12s ease;
      position:absolute; left:50%; top:50%; transform:translate(-50%, -50%);
      z-index:2;
    }
    .powerOn:hover{ transform: translate(-50%, calc(-50% - 1px)); filter:brightness(1.05) }
  `;

  return (
    <>
      <style>{css}</style>
      <div className="room">
        <div className="monitor">
          <div className="bezel">
            <span className="screw tl" />
            <span className="screw tr" />
            <span className="screw bl" />
            <span className="screw br" />

            <div className="screen">
              {!powered && showPower ? (
                <>
                  <div className="glitchVideoWrap">
                    <video
                      ref={videoRef}
                      className="glitchVideo"
                      autoPlay
                      muted
                      loop
                      playsInline
                      src={videoSrc || ""}
                    />
                  </div>
                  <button className="powerOn" onClick={handlePowerOn} aria-label="Power On">
                    POWER&nbsp;ON
                  </button>
                </>
              ) : (
                <>
                  {/* scanline overlay */}
                  <div className="scan" />
                  {/* mode: center or scroll */}
                  {mode === "center" ? (
                    <div className="screen-center">{children}</div>
                  ) : (
                    <div className="screen-scroll">{children}</div>
                  )}
                </>
              )}
            </div>

            <div className="brand">{titleBrand}</div>
            <div className={`led ${powered ? "on" : ""}`} />
          </div>

          <div className="stand" />
        </div>
      </div>
    </>
  );
}

/* =========================
   HOME CONTENT (inside CRT)
   ========================= */
function HomeContent() {
  const [typed, setTyped] = useState("");
  const [showNav, setShowNav] = useState(false);
  const [activeNav, setActiveNav] = useState("home");
  const navigate = useNavigate();

  const navItems = ["home", "marketing", "animation", "podcasts", "music", "social media"];
  const welcomeText = "Welcome to The Gx Universe";

  useEffect(() => {
    setTyped("");
    setShowNav(false);
    let i = 0;
    const tick = () => {
      i += 1;
      setTyped(welcomeText.slice(0, i));
      if (i < welcomeText.length) {
        setTimeout(tick, 45);
      } else {
        setTimeout(() => setShowNav(true), 250);
      }
    };
    const id = setTimeout(tick, 220);
    return () => clearTimeout(id);
  }, []);

  const onNavClick = (n) => {
    setActiveNav(n);
    if (n === "home") navigate("/");
    if (n === "marketing") navigate("/marketing");
    // others can route to future pages later
  };

  return (
    <>
      <div className="welcome" aria-live="polite">
        {typed}
        <span className="cursor">|</span>
      </div>

      {showNav && (
        <>
          <div className="nav">
            {navItems.map((n) => (
              <button
                key={n}
                className={activeNav === n ? "active" : ""}
                onClick={(e) => { e.preventDefault(); onNavClick(n); }}
                aria-current={activeNav === n ? "page" : undefined}
                title={n === "marketing" ? `${n} (opens page)` : `${n} (coming soon)`}
              >
                {n}
              </button>
            ))}
          </div>

          <div className="logo-box">
            {/* Example: <img src={asset("logo.gif")} alt="GX Logo" style={{maxWidth:"100%", maxHeight:"100%"}} /> */}
            LOGO ANIMATION HERE
          </div>
        </>
      )}
    </>
  );
}

/* ============================
   MARKETING CONTENT (in-screen)
   ============================ */
function MarketingContent() {
  useEffect(() => {
    document.title = "Marketing — GX Universe";
  }, []);

  const tiers = [
    {
      name: "Starter",
      price: "$999",
      cadence: "per project",
      highlight: "Launch ready in 2 weeks",
      features: [
        "Landing page (copy + design)",
        "Basic funnel (lead form + thank you)",
        "3-email welcome sequence",
        "Analytics & pixel setup",
        "1 round of revisions",
      ],
      cta: "Book Starter",
    },
    {
      name: "Growth",
      badge: "Most Popular",
      price: "$2,499",
      cadence: "per month",
      highlight: "Test & scale with CRO",
      features: [
        "2 landing pages + A/B testing",
        "Ongoing copy + creative",
        "Email flows (welcome, abandon, winback)",
        "Monthly analytics & reporting",
        "Ad ops support (Meta/TikTok/Google)",
      ],
      cta: "Start Growth Plan",
      popular: true,
    },
    {
      name: "Elite",
      price: "$4,999",
      cadence: "per month",
      highlight: "Full-stack marketing ops",
      features: [
        "End-to-end funnel + content engine",
        "Offer strategy & positioning",
        "Multi-channel ads + UGC",
        "Weekly experiments & CRO roadmap",
        "Executive dashboard + strategy calls",
      ],
      cta: "Request Elite",
    },
  ];

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap');

    :root{
      --text:#e9edf1;
      --muted:#a6b0c0;
      --card:#10131a;
      --stroke:#1b2230;
      --accent:#1dde6a;
      --accent-ink:#052a15;
      --shadow: 0 20px 60px rgba(0,0,0,.35);
      --radius: 16px;
      --radius-sm: 12px;
      --grid: min(1200px, 92%);
    }

    /* All styles scoped to .mk-wrap so they don't leak */
    .mk-wrap{ min-height:100%; display:flex; flex-direction:column; font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial; color: var(--text) }

    /* Sticky nav sticks inside the CRT scroll area */
    .mk-nav{
      width:100%; display:flex; justify-content:center; backdrop-filter: blur(6px);
      position:sticky; top:0; z-index:20; background: rgba(6,16,10,.65); border-bottom:1px solid var(--stroke);
    }
    .mk-nav-inner{
      width:var(--grid); display:flex; align-items:center; gap:16px; padding:12px 2px;
    }
    .mk-logo{
      width:42px; height:42px; border-radius:10px; background:#0e1511; border:1px solid #1a2a20;
      display:grid; place-items:center; color:var(--accent); font-family:"Space Grotesk", system-ui; font-weight:700; text-decoration:none;
    }
    .mk-spacer{ flex:1 }
    .mk-link{
      color: var(--muted); text-decoration:none; padding:8px 10px; border-radius:8px; font: 500 14px/1.2 Inter, system-ui;
    }
    .mk-link:hover{ color: var(--text); }
    .mk-cta{
      background: var(--accent); color: var(--accent-ink);
      border:1px solid #1dd86a; border-radius: 999px; padding:10px 16px; font: 700 14px/1 Inter;
      box-shadow: 0 8px 30px rgba(29,222,106,.25);
      text-decoration:none;
    }

    .mk-hero{ display:grid; place-items:center; padding:42px 0 18px; }
    .mk-hero-inner{ width:var(--grid); display:grid; gap:18px; text-align:center; }
    .mk-eyebrow{ color: var(--accent); font: 700 13px/1 Inter; letter-spacing:.12em; text-transform:uppercase }
    .mk-h1{
      font: 800 clamp(28px,5.5vw,56px)/1.05 "Space Grotesk", Inter, system-ui;
      letter-spacing:-.02em; margin:0;
      background: linear-gradient(180deg, #ffffff, #d8e3d9);
      color: transparent; background-clip:text;
    }
    .mk-sub{ color: var(--muted); font: 500 clamp(15px,2.2vw,19px)/1.6 Inter, system-ui; margin:0 auto; max-width: 800px; }
    .mk-ctaRow{ display:flex; gap:12px; justify-content:center; flex-wrap:wrap; padding-top:8px }
    .mk-btn{ background: var(--accent); color: var(--accent-ink); border:1px solid #1dd86a; padding:12px 16px; border-radius:12px; font: 700 14px/1 Inter; text-decoration:none; }
    .mk-btn.secondary{ background: transparent; color: var(--text); border:1px solid var(--stroke); }

    .mk-proof{ width:var(--grid); margin: 18px auto 0; padding:12px 0 2px; border-top:1px solid var(--stroke); color: var(--muted); font: 500 12px/1 Inter; text-align:center; }
    .mk-logos{ display:grid; grid-template-columns: repeat(6, 1fr); gap:16px; align-items:center; justify-items:center; opacity:.9; padding-top:10px; }
    .mk-logos img{ height:24px; opacity:.8; filter: grayscale(1) contrast(1.2); }

    .mk-section{ width:var(--grid); margin: 40px auto 0; padding-bottom:6px; }
    .mk-h2{ font: 800 clamp(20px,3vw,32px)/1.15 "Space Grotesk", Inter; letter-spacing:-.01em; margin:0 0 6px }
    .mk-grid{ display:grid; gap:14px; grid-template-columns: repeat(auto-fit, minmax(240px,1fr)); margin-top:14px }
    .mk-card{ background: linear-gradient(180deg, #0e1218, #0b0e14); border:1px solid var(--stroke); border-radius: 16px; padding:16px; box-shadow: var(--shadow); }
    .mk-card h3{ font: 700 16px/1.3 Inter; margin:0 0 6px }
    .mk-card p{ font: 500 13.5px/1.6 Inter; color: var(--muted); margin:0 }

    .mk-cases{ display:grid; gap:14px; grid-template-columns: repeat(auto-fit, minmax(280px,1fr)); margin-top:14px }
    .mk-case{ border:1px solid var(--stroke); border-radius: 16px; overflow:hidden; background:#0b0f14; display:grid; grid-template-rows: 160px auto; }
    .mk-case img{ width:100%; height:100%; object-fit:cover }
    .mk-case .meta{ padding:12px 14px }
    .kpi{ display:flex; gap:8px; flex-wrap:wrap; margin-top:8px }
    .kpi .pill{ background:#0e1511; border:1px solid #1a2a20; color: var(--accent); padding:6px 10px; border-radius:999px; font: 700 12px/1 Inter; }

    .mk-process{ display:grid; gap:10px; grid-template-columns: repeat(auto-fit, minmax(220px,1fr)); margin-top:14px }
    .step{ background:#0c1016; border:1px solid var(--stroke); border-radius: 12px; padding:14px; }
    .step .num{ width:28px; height:28px; border-radius:8px; display:grid; place-items:center; background: var(--accent); color: var(--accent-ink); font: 700 14px/1 Inter; margin-bottom:8px; }
    .step h4{ font: 700 15px/1.3 Inter; margin: 4px 0 }
    .step p{ font: 500 13px/1.6 Inter; color: var(--muted); margin: 6px 0 0 }

    .mk-pricing{ display:grid; gap:16px; grid-template-columns: repeat(auto-fit, minmax(260px,1fr)); margin-top:16px }
    .tier{ background: linear-gradient(180deg, #0f131a, #0a0d12); border:1px solid var(--stroke); border-radius: 16px; padding:16px; position:relative; box-shadow: var(--shadow); }
    .tier.popular{ outline: 1.5px solid rgba(29,222,106,.6); }
    .badge{ position:absolute; top:12px; right:12px; background: var(--accent); color: var(--accent-ink); border-radius:999px; padding:6px 10px; font: 800 11px/1 Inter; letter-spacing:.06em; }
    .price{ font: 800 26px/1 "Space Grotesk", Inter; margin: 8px 0 2px }
    .tiny{ color: var(--muted); font: 500 12px/1.5 Inter }
    .tier ul{ margin:12px 0 14px; padding-left:18px; color: var(--muted); font: 500 13px/1.6 Inter }
    .tier li{ margin:6px 0 }
    .tier .btn{ display:inline-block; background: var(--accent); color: var(--accent-ink); border:1px solid #1dd86a; padding:12px 14px; border-radius:10px; font: 800 14px/1 Inter; text-decoration:none; }

    .faq{ display:grid; gap:10px; margin-top:14px }
    .faq .q{ background:#0c1016; border:1px solid var(--stroke); border-radius: 12px; padding:14px; }
    .faq .q h4{ margin:0 0 6px; font: 700 15px/1.3 Inter }
    .faq .q p{ margin:0; color: var(--muted); font: 500 14px/1.65 Inter }

    .mk-ctaFoot{ width:var(--grid); margin: 40px auto; padding: 16px; border:1px solid var(--stroke); border-radius: 16px;
      background: linear-gradient(180deg, #10151d, #0b0e14); display:grid; place-items:center; text-align:center; gap:10px; }
  `;

  return (
    <>
      <style>{css}</style>

      <div className="mk-wrap">
        {/* Top nav (sticky within screen) */}
        <div className="mk-nav">
          <div className="mk-nav-inner">
            <Link className="mk-logo" to="/">GX</Link>
            <div className="mk-spacer" />
            <a className="mk-link" href="#services">Services</a>
            <a className="mk-link" href="#work">Work</a>
            <a className="mk-link" href="#pricing">Pricing</a>
            <a className="mk-link" href="#faq">FAQ</a>
            <a className="mk-cta" href="mailto:youremail@example.com">Book strategy call</a>
          </div>
        </div>

        {/* Hero */}
        <section className="mk-hero">
          <div className="mk-hero-inner">
            <div className="mk-eyebrow">MARKETING THAT MOVES THE NEEDLE</div>
            <h1 className="mk-h1">Turn attention into revenue with high-velocity creative and funnels.</h1>
            <p className="mk-sub">
              We ship landing pages, ads, emails and experiments that compound. Research-driven messaging,
              delightful creative, and ruthless iteration — so you can grow faster with less guesswork.
            </p>
            <div className="mk-ctaRow">
              <a className="mk-btn" href="mailto:youremail@example.com">Book strategy call</a>
              <a className="mk-btn secondary" href="#pricing">See packages</a>
            </div>
          </div>

          {/* proof bar */}
          <div className="mk-proof">
            Trusted by founders & teams at:
            <div className="mk-logos">
              {["acme.svg","orbit.svg","zenlabs.svg","globo.svg","stellar.svg","nova.svg"].map((f) => (
                <img key={f} src={asset(`brands/${f}`)} alt="" />
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="mk-section">
          <h2 className="mk-h2">What we do</h2>
          <div className="mk-grid">
            <div className="mk-card">
              <h3>Positioning & Offers</h3>
              <p>Research your audience, craft irresistible offers, and write the narrative that converts.</p>
            </div>
            <div className="mk-card">
              <h3>Landing Pages & CRO</h3>
              <p>Design-first pages with speed, clarity, and iterative testing to lift conversion rates.</p>
            </div>
            <div className="mk-card">
              <h3>Paid Social & UGC</h3>
              <p>Thumb-stopping creative and campaigns across Meta, TikTok, and YouTube.</p>
            </div>
            <div className="mk-card">
              <h3>Email & Automation</h3>
              <p>Lifecycle flows and campaigns (Klaviyo/HubSpot) that monetize your pipeline.</p>
            </div>
          </div>
        </section>

        {/* Case studies */}
        <section id="work" className="mk-section">
          <h2 className="mk-h2">Selected work & outcomes</h2>
          <div className="mk-cases">
            {[
              {
                img: "cases/funnel-revamp.jpg",
                title: "DTC funnel revamp",
                text: "New positioning, offer, and CRO testing.",
                kpis: ["+28% checkout", "+41% AOV", "4.7 ROAS"],
              },
              {
                img: "cases/b2b-ads.jpg",
                title: "B2B paid social engine",
                text: "Creative lab + UGC → pipeline growth.",
                kpis: ["-38% CPL", "+62% SQLs", "3x demo rate"],
              },
              {
                img: "cases/email-lifecycle.jpg",
                title: "Lifecycle email overhaul",
                text: "Welcome, abandon, winback, and promos.",
                kpis: ["+24% revenue", "28% list growth", "42% open rate"],
              },
            ].map((c) => (
              <div key={c.title} className="mk-case">
                <img src={asset(c.img)} alt={c.title} />
                <div className="meta">
                  <h3 style={{margin:"0 0 4px", font:"700 16px/1.3 Inter"}}>{c.title}</h3>
                  <p style={{margin:0, color:"var(--muted)", font:"500 14px/1.6 Inter"}}>{c.text}</p>
                  <div className="kpi">
                    {c.kpis.map((k) => (
                      <span key={k} className="pill">{k}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Process */}
        <section className="mk-section">
          <h2 className="mk-h2">How we work</h2>
          <div className="mk-process">
            {[
              ["Discover","Qualitative & quant research, analytics, and competitive scan."],
              ["Strategy","Offer, messaging, and test plan aligned to business goals."],
              ["Create","Pages, ads, and emails produced in fast cycles."],
              ["Launch","Ship, track, and QA across channels."],
              ["Optimize","Weekly experiments; double-down on winners."],
            ].map(([title, desc], i) => (
              <div key={title} className="step">
                <div className="num">{i+1}</div>
                <h4>{title}</h4>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="mk-section">
          <h2 className="mk-h2">Packages</h2>
          <div className="mk-pricing">
            {tiers.map((t) => (
              <div key={t.name} className={`tier ${t.popular ? "popular" : ""}`}>
                {t.badge && <div className="badge">{t.badge}</div>}
                <h3 style={{margin:"0 0 2px", font:"800 18px/1 Inter"}}>{t.name}</h3>
                <div className="price">{t.price}</div>
                <div className="tiny">{t.cadence}</div>
                <div className="tiny" style={{marginTop:6, color:"var(--text)"}}>{t.highlight}</div>
                <ul>
                  {t.features.map((f) => <li key={f}>{f}</li>)}
                </ul>
                <a className="btn" href={`mailto:youremail@example.com?subject=GX%20Marketing%20—%20${encodeURIComponent(t.name)}`}>
                  {t.cta}
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mk-section">
          <h2 className="mk-h2">FAQs</h2>
          <div className="faq">
            <div className="q">
              <h4>How fast can we launch?</h4>
              <p>Starter projects ship in ~2 weeks. Growth/Elite start with a kick-off and ship weekly thereafter.</p>
            </div>
            <div className="q">
              <h4>Do you work with existing teams?</h4>
              <p>Yes. We plug into product, sales, or in-house marketing — focusing on speed and measurable outcomes.</p>
            </div>
            <div className="q">
              <h4>What tools do you support?</h4>
              <p>Webflow/Next.js for pages, Meta/TikTok/Google for ads, Klaviyo/HubSpot for lifecycle, GA4/Looker for analytics.</p>
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="mk-ctaFoot">
          <h3 style={{margin:0, font:"800 24px/1.2 'Space Grotesk', Inter"}}>Ready to accelerate growth?</h3>
          <p style={{margin:"6px 0 10px", color:"var(--muted)", font:"500 15px/1.6 Inter"}}>
            Book a free strategy call — we’ll map your highest-leverage experiments for the next 30 days.
          </p>
          <a className="mk-btn" href="mailto:youremail@example.com">Book strategy call</a>
        </section>
      </div>
    </>
  );
}

/* =========================
   ROUTE PAGES USING CRT
   ========================= */
function HomePage() {
  return (
    <CRTLayout showPower videoSrc={asset("glitch.mp4")} mode="center">
      <HomeContent />
    </CRTLayout>
  );
}

function MarketingPage() {
  return (
    <CRTLayout mode="scroll">
      <MarketingContent />
    </CRTLayout>
  );
}

/* ===============
   APP + ROUTES
   =============== */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/marketing" element={<MarketingPage />} />
        {/* Fallback: send unknown routes to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
