import React, { useEffect } from "react";

/** Use the same base-folder approach as Home */
const ASSET_BASE = process.env.REACT_APP_ASSET_BASE || "/assets";
const asset = (p) => `${ASSET_BASE}/${p}`;

export default function Marketing() {
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
      --bg:#0a0b0d;
      --bg-soft:#0f1116;
      --text:#e9edf1;
      --muted:#a6b0c0;
      --card:#10131a;
      --stroke:#1b2230;
      --accent:#1dde6a; /* matches the home vibe without 8-bit font */
      --accent-ink:#052a15;
      --shadow: 0 20px 60px rgba(0,0,0,.35);
      --radius: 16px;
      --radius-sm: 12px;
      --grid: min(1200px, 92vw);
    }

    *{ box-sizing:border-box }
    html,body,#root{ height:100% }
    body{ margin:0; background: radial-gradient(1200px 800px at 50% -120px, #0c0e13, var(--bg)); color: var(--text) }

    .mk-wrap{ min-height:100vh; display:flex; flex-direction:column; }
    .mk-nav{
      width:100%; display:flex; justify-content:center; backdrop-filter: blur(6px);
      position:sticky; top:0; z-index:20; background: rgba(12,14,19,.6); border-bottom:1px solid var(--stroke);
    }
    .mk-nav-inner{
      width:var(--grid); display:flex; align-items:center; gap:16px; padding:14px 2px;
    }
    .mk-logo{
      width:42px; height:42px; border-radius:10px; background:#0e1511; border:1px solid #1a2a20;
      display:grid; place-items:center; color:var(--accent); font-family:"Space Grotesk", system-ui; font-weight:700;
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

    /* HERO */
    .mk-hero{
      display:grid; place-items:center; padding:72px 0 24px;
    }
    .mk-hero-inner{
      width:var(--grid); display:grid; gap:22px; text-align:center;
    }
    .mk-eyebrow{ color: var(--accent); font: 700 14px/1 Inter; letter-spacing:.12em; text-transform:uppercase }
    .mk-h1{
      font: 800 clamp(32px,6vw,60px)/1.05 "Space Grotesk", Inter, system-ui;
      letter-spacing:-.02em; margin:0;
      background: linear-gradient(180deg, #ffffff, #d8e3d9);
      color: transparent; background-clip:text;
    }
    .mk-sub{
      color: var(--muted);
      font: 500 clamp(16px,2.3vw,20px)/1.6 Inter, system-ui;
      margin:0 auto; max-width: 800px;
    }
    .mk-ctaRow{ display:flex; gap:12px; justify-content:center; flex-wrap:wrap; padding-top:8px }
    .mk-btn{
      background: var(--accent); color: var(--accent-ink); border:1px solid #1dd86a;
      padding:14px 18px; border-radius:12px; font: 700 15px/1 Inter; text-decoration:none;
    }
    .mk-btn.secondary{
      background: transparent; color: var(--text); border:1px solid var(--stroke);
    }
    .mk-proof{
      width:var(--grid); margin: 26px auto 0; padding:16px 0 4px; border-top:1px solid var(--stroke);
      color: var(--muted); font: 500 13px/1 Inter; text-align:center;
    }
    .mk-logos{
      display:grid; grid-template-columns: repeat(6, 1fr); gap:18px; align-items:center; justify-items:center;
      opacity:.9; padding-top:10px;
    }
    .mk-logos img{ height:28px; opacity:.8; filter: grayscale(1) contrast(1.2); }

    /* SERVICES */
    .mk-section{ width:var(--grid); margin: 56px auto 0; padding: 0 0 8px; }
    .mk-h2{ font: 800 clamp(22px,3.2vw,34px)/1.15 "Space Grotesk", Inter; letter-spacing:-.01em; margin:0 0 6px }
    .mk-grid{ display:grid; gap:16px; grid-template-columns: repeat(auto-fit, minmax(240px,1fr)); margin-top:16px }
    .mk-card{
      background: linear-gradient(180deg, #0e1218, #0b0e14); border:1px solid var(--stroke);
      border-radius: var(--radius); padding:18px; box-shadow: var(--shadow);
    }
    .mk-card h3{ font: 700 16px/1.3 Inter; margin:0 0 8px }
    .mk-card p{ font: 500 14px/1.6 Inter; color: var(--muted); margin:0 }

    /* CASES */
    .mk-cases{ display:grid; gap:16px; grid-template-columns: repeat(auto-fit, minmax(280px,1fr)); margin-top:16px }
    .mk-case{
      border:1px solid var(--stroke); border-radius: var(--radius); overflow:hidden; background:#0b0f14;
      display:grid; grid-template-rows: 160px auto;
    }
    .mk-case img{ width:100%; height:100%; object-fit:cover }
    .mk-case .meta{ padding:14px 16px }
    .kpi{ display:flex; gap:10px; flex-wrap:wrap; margin-top:8px }
    .kpi .pill{
      background:#0e1511; border:1px solid #1a2a20; color: var(--accent);
      padding:6px 10px; border-radius:999px; font: 700 12px/1 Inter;
    }

    /* PROCESS */
    .mk-process{ display:grid; gap:10px; grid-template-columns: repeat(auto-fit, minmax(220px,1fr)); margin-top:16px }
    .step{
      background:#0c1016; border:1px solid var(--stroke); border-radius: var(--radius-sm); padding:14px;
    }
    .step .num{
      width:28px; height:28px; border-radius:8px; display:grid; place-items:center; 
      background: var(--accent); color: var(--accent-ink); font: 700 14px/1 Inter; margin-bottom:8px;
    }
    .step h4{ font: 700 15px/1.3 Inter; margin: 4px 0 }
    .step p{ font: 500 13px/1.6 Inter; color: var(--muted); margin: 6px 0 0 }

    /* PRICING */
    .mk-pricing{ display:grid; gap:16px; grid-template-columns: repeat(auto-fit, minmax(260px,1fr)); margin-top:18px }
    .tier{
      background: linear-gradient(180deg, #0f131a, #0a0d12); border:1px solid var(--stroke);
      border-radius: var(--radius); padding:18px; position:relative; box-shadow: var(--shadow);
    }
    .tier.popular{ outline: 1.5px solid rgba(29,222,106,.6); }
    .badge{
      position:absolute; top:12px; right:12px; background: var(--accent); color: var(--accent-ink);
      border-radius:999px; padding:6px 10px; font: 800 11px/1 Inter; letter-spacing:.06em;
    }
    .price{ font: 800 28px/1 "Space Grotesk", Inter; margin: 8px 0 2px }
    .tiny{ color: var(--muted); font: 500 12px/1.5 Inter }
    .tier ul{ margin:12px 0 14px; padding-left:18px; color: var(--muted); font: 500 13px/1.6 Inter }
    .tier li{ margin:6px 0 }
    .tier .btn{
      display:inline-block; background: var(--accent); color: var(--accent-ink); border:1px solid #1dd86a;
      padding:12px 14px; border-radius:10px; font: 800 14px/1 Inter; text-decoration:none;
    }

    /* FAQ */
    .faq{ display:grid; gap:10px; margin-top:16px }
    .faq .q{
      background:#0c1016; border:1px solid var(--stroke); border-radius: var(--radius-sm); padding:14px;
    }
    .faq .q h4{ margin:0 0 6px; font: 700 15px/1.3 Inter }
    .faq .q p{ margin:0; color: var(--muted); font: 500 14px/1.65 Inter }

    /* FOOTER CTA */
    .mk-ctaFoot{
      width:var(--grid); margin: 56px auto; padding: 18px; border:1px solid var(--stroke); border-radius: var(--radius);
      background: linear-gradient(180deg, #10151d, #0b0e14); display:grid; place-items:center; text-align:center; gap:10px;
    }
  `;

  return (
    <>
      <style>{css}</style>

      <div className="mk-wrap">
        {/* Top nav */}
        <div className="mk-nav">
          <div className="mk-nav-inner">
            <div className="mk-logo">GX</div>
            <div className="mk-spacer" />
            <a className="mk-link" href="/">Home</a>
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
              {/* drop your own logo svgs/pngs into assets/brands/ */}
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
                <a className="btn" href="mailto:youremail@example.com?subject=GX%20Marketing%20—%20{t.name}">
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
