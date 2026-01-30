// src/App.js

import React, { useEffect, useRef, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Link,
  Navigate,
} from "react-router-dom";

const ASSET_BASE = process.env.REACT_APP_ASSET_BASE || "/assets";
const CALENDLY_URL =
  process.env.REACT_APP_CALENDLY_URL ||
  "https://calendly.com/YOUR_HANDLE/strategy-call";

const asset = (p) =>
  `${ASSET_BASE}/${p.split("/").map(encodeURIComponent).join("/")}`;

const HOME_LOGO_VIDEO = asset("logo TM repeat.m4v");
const HOME_HERO_VIDEO = asset("home-boot.mp4");
const MARKETING_LOGO_REEL = asset("logo TM repeat.m4v");
// ^ change this path/filename to whatever your actual logo video file is

/* =========================
   GLOBAL NAV CONFIG
   ========================= */
const NAV_BUTTONS = [
  { key: "home", label: "Home", path: "/home" },
  { key: "marketing", label: "Portfolio", path: "/marketing" }, // label only
  { key: "Gallery", label: "Gallery", path: "/Gallery" },
  { key: "social-media", label: "Social Media", path: "/social-media" },
];

function getActiveIndex(pathname) {
  const p = pathname || "/";
  return NAV_BUTTONS.findIndex((b) => {
    if (b.path === "/home") return p === "/" || p.startsWith("/home");
    return p.startsWith(b.path);
  });
}

/* ===========================================
   CRT LAYOUT (monitor + bezel + side buttons)
   + GLOBAL CHANNEL KNOB
   =========================================== */
function CRTLayout({
  children,
  showPower = false,
  bootSrc = null,
  mode = "scroll",
}) {
  const [powered, setPowered] = useState(!showPower);
  const navigate = useNavigate();
  const location = useLocation();

  const leftButtons = NAV_BUTTONS.slice(0, 3);
  const rightButtons = NAV_BUTTONS.slice(3);

  const isActive = (btnPath) => {
    const p = location.pathname || "/";
    if (btnPath === "/home") return p === "/" || p.startsWith("/home");
    return p.startsWith(btnPath);
  };

  const go = (btnPath) => {
    if (!powered) return;
    navigate(btnPath);
  };

  const handlePowerOn = () => setPowered(true);

  // ===== GLOBAL KNOB STATE (all pages) =====
  const [knobDocked, setKnobDocked] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  // transparent vs solid tape: only "over video" at very top of home
  const isHomeRoute =
    location.pathname === "/" || location.pathname.startsWith("/home");
  const [overVideo, setOverVideo] = useState(isHomeRoute);

  // On route change, reset knob to visible & "top of page" behavior
  useEffect(() => {
    setHasScrolled(false);
    setKnobDocked(false);
    setOverVideo(
      location.pathname === "/" || location.pathname.startsWith("/home"),
    );
  }, [location.pathname]);

  // Track scroll on the CRT scroll container for ALL pages using scroll mode
  useEffect(() => {
    const host = document.querySelector(".screen-scroll");
    if (!host) {
      // For center-mode pages: no scroll, knob just stays visible.
      setOverVideo(false);
      return;
    }

    const handleScroll = () => {
      const y = host.scrollTop || 0;

      if (isHomeRoute) {
        setOverVideo(y <= 120);
      } else {
        setOverVideo(false);
      }

      if (y > 2) {
        setHasScrolled(true);
        setKnobDocked(true);
      } else {
        // At the very top, before user ever scrolls, keep the knob visible
        setKnobDocked((prev) => (hasScrolled ? prev : false));
      }
    };

    handleScroll();
    host.addEventListener("scroll", handleScroll);
    return () => host.removeEventListener("scroll", handleScroll);
  }, [isHomeRoute, hasScrolled]);

  // ===== KNOB ROTATION (DO NOT SPLIT) =====
  const angleMap = {
    home: -90,
    marketing: 7,
    Gallery: 115,
    "social-media": 199,
  };

  const activeIndex = getActiveIndex(location.pathname);
  const knobAngleStep = 360 / NAV_BUTTONS.length;

  const activeKey =
    activeIndex >= 0 ? NAV_BUTTONS[activeIndex].key : NAV_BUTTONS[0].key;

  const targetAngle =
    angleMap[activeKey] ??
    (activeIndex >= 0 ? activeIndex * knobAngleStep - 90 : -90);

  const knobRotation = targetAngle + 90;

  // Your offsets so SOCIAL MEDIA etc. sit correctly
  const labelOffsets = {
    "social-media": { shiftX: "-112px", shiftY: "0px" },
  };

  const handleKnobClick = () => {
    if (!powered) return;
    const idx = activeIndex >= 0 ? activeIndex : 0;
    const nextIdx = (idx + 1) % NAV_BUTTONS.length;
    navigate(NAV_BUTTONS[nextIdx].path);
  };

  const handleKnobMouseLeave = () => {
    // After the user has scrolled at least once, moving off the knob hides it again
    if (hasScrolled) {
      setKnobDocked(true);
    }
  };

  const handleDockHover = () => {
    // Hovering the bottom tab brings the knob back up
    setKnobDocked(false);
  };

  const css = `
  /* ===== COMIC HEADLINE SYSTEM ===== */

  @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Space+Grotesk:wght@600;700&display=swap');

    :root{
      --bezel1:#e8e2d6; --bezel2:#d7d0c4; --bezel3:#c9c1b5;
      --glass:#07140a; --phosphor:#b5f8c1; --accent:#1dde6a;

      --roomSolid:#000000;
      --ink:#e9edf1; --muted:#b9c5bb; --stroke:#17241a;

      --blk1-bg:#000000;
      --blk2-bg:#000000;
      --blk3-bg:#000000;

      --chromeH: 90px;
    }

    *{ box-sizing:border-box }
    html,body,#root{ height:100%; overflow:hidden; overscroll-behavior:none; }
    body{
      margin:0;
      background: var(--roomSolid);
      color:var(--ink);
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
    }

    /* ============== ARCADE GLOW SYSTEM ============== */
    @keyframes glowHue {
      0%   { --g1:#b58cff; --g2:#7e5cff; --ring:rgba(181,140,255,.65); }
      25%  { --g1:#ff6c6c; --g2:#ff2e2e; --ring:rgba(255,46,46,.65); }
      50%  { --g1:#7dffb2; --g2:#1dde6a; --ring:rgba(29,222,106,.65); }
      75%  { --g1:#88c8ff; --g2:#2e91ff; --ring:rgba(46,145,255,.65); }
      100% { --g1:#b58cff; --g2:#7e5cff; --ring:rgba(181,140,255,.65); }
    }

    .glow-cycle{
      animation: glowHue 6s linear infinite;
      background: linear-gradient(180deg, var(--g1), var(--g2));
      -webkit-background-clip:text;
      background-clip:text;
      color: transparent;
      text-shadow:
        0 0 10px var(--ring),
        0 0 22px color-mix(in oklab, var(--g2) 65%, black),
        0 0 36px color-mix(in oklab, var(--g2) 45%, black);
      filter: saturate(1.15) brightness(1.02);
    }

    .glow-cycle-sub{
      animation: glowHue 6s linear infinite;
      color: color-mix(in oklab, var(--g1) 85%, white);
      text-shadow:
        0 0 6px var(--ring),
        0 0 14px color-mix(in oklab, var(--g2) 55%, black);
      letter-spacing:.01em;
    }

    .arcade-card{
      position:relative;
      background:#000;
      border-radius:16px;
      border:1px solid #111;
      overflow:clip;
      isolation:isolate;
    }
    .arcade-card::before{
      content:"";
      position:absolute; inset:-2px;
      border-radius:inherit;
      background:
        conic-gradient(from 0deg,
          #b58cff,
          #ff2e2e,
          #1dde6a,
          #2e91ff,
          #b58cff);
      filter: blur(14px);
      opacity:.65;
      z-index:-1;
      animation: spinRing 8s linear infinite;
    }
    .arcade-card::after{
      content:"";
      position:absolute; inset:0;
      border-radius:inherit;
      padding:1px;
      background:
        conic-gradient(from 0deg,
          #b58cff,
          #ff2e2e,
          #1dde6a,
          #2e91ff,
          #b58cff);
      -webkit-mask:
        linear-gradient(#000 0 0) content-box,
        linear-gradient(#000 0 0);
      -webkit-mask-composite: xor;
              mask-composite: exclude;
      animation: spinRing 8s linear infinite reverse;
      opacity:.9;
    }
    @keyframes spinRing{
      to{ transform: rotate(360deg) }
    }

    .arcade-card .inner{
      background: radial-gradient(120% 150% at 50% -20%,
        color-mix(in oklab, var(--g2, #1dde6a) 12%, transparent) 0%,
        transparent 42%);
      border-radius:inherit;
    }

    /* ========= BASE LAYOUT ========= */
    .room{ height:100vh; display:flex; align-items:flex-start; justify-content:center; padding: 6px 0 0; }
    .rig{ width:min(1920px, 99.2vw); margin:0 auto; }

    .monitor{
      width:100%; border-radius:18px;
      background: linear-gradient(180deg, var(--bezel1) 0%, var(--bezel2) 100%);
      box-shadow: 0 60px 140px rgba(0,0,0,.9),
                  inset 0 7px 0 rgba(255,255,255,.6),
                  inset 0 -12px 22px rgba(0,0,0,.12);
      padding:clamp(4px, .6vw, 10px); position:relative;
    }
    .bezel{
      border-radius:14px; padding:clamp(4px, .7vw, 10px);
      background: linear-gradient(180deg, var(--bezel2), var(--bezel3));
      box-shadow: inset 0 0 0 2px rgba(255,255,255,.5),
                  inset 0 0 0 4px rgba(0,0,0,.08);
      position:relative;
    }
    .screw{ position:absolute; width:12px; height:12px; border-radius:50%;
      background: radial-gradient(circle at 30% 30%, #9f978a, #6e675d 60%, #564f46 100%);
      box-shadow: inset 0 1px 0 rgba(255,255,255,.6), inset 0 -1px 0 rgba(0,0,0,.4);
    }
    .screw.tl{ top:10px; left:10px } .screw.tr{ top:10px; right:10px }
    .screw.bl{ bottom:10px; left:10px } .screw.br{ bottom:10px; right:10px }

    .led{ position:absolute; right:18px; bottom:-16px; width:12px; height:12px; border-radius:50%;
      background: radial-gradient(circle at 40% 40%, #f66, #d11 60%, #700 100%); box-shadow: 0 0 8px rgba(209,17,17,.7);
      transition: all .25s ease;
    }
    .led.on{ background: radial-gradient(circle at 40% 40%, #7bff7b, #12c912 60%, #087808 100%);
      box-shadow: 0 0 10px rgba(18,201,18,.7); }

    .stand{
      width: clamp(220px, 24vw, 360px);
      height: 10px;
      margin: 2px auto 0;
      border-radius: 18px / 10px;
      background: linear-gradient(180deg, var(--bezel2), #bfb7aa);
      box-shadow: inset 0 2px 0 rgba(255,255,255,.5), inset 0 -3px 0 rgba(0,0,0,.22), 0 12px 36px rgba(0,0,0,.55);
    }

    .screen{
      position:relative;
      width:100%;
      height: calc(100svh - var(--chromeH));
      min-height: 560px;
      overflow: hidden;
      border-radius: 10px;
      z-index:0;
      background:#000;
    }
    .scan{
      pointer-events:none; position:absolute; inset:0;
      background:
        linear-gradient(rgba(200,255,220,.04), rgba(200,255,220,0) 2px),
        repeating-linear-gradient(transparent 0 2px, rgba(180,255,210,.035) 3px, transparent 4px);
      mix-blend-mode:screen; opacity:.14;
      z-index:1;
    }

    .prepower{ position:absolute; inset:0; z-index:0; }
    .videoFill{
      position:absolute; inset:0;
      width:100%; height:100%;
      object-fit: cover; object-position: center center;
      background:#000; display:block;
    }
    .powerOn{
      font-family:'VT323', ui-monospace, monospace; font-size: clamp(22px, 3vw, 32px); letter-spacing:1px;
      color: var(--glass); background: var(--accent); border:4px solid var(--accent); border-radius:999px;
      padding:16px 28px; cursor:pointer; box-shadow: 0 0 28px rgba(29,222,106,.42);
      transition: transform .12s ease, filter .12s ease, box-shadow .12s ease; position:absolute; left:50%; top:50%;
      transform:translate(-50%, -50%); z-index:3;
    }
    .powerOn:hover{ transform: translateY(-3px) translateX(-50%) scale(1.05); filter: brightness(1.05);
      box-shadow: 0 0 42px rgba(29,222,106,.55); }

    .screen-center{
      width:100%; height:100%; display:grid; place-items:center; padding: clamp(16px, 3vw, 40px);
      font-family: 'VT323', ui-monospace, Menlo, Consolas, monospace; color: var(--phosphor);
      text-align:center;
      position:relative; z-index:2;
    }
    .screen-scroll{
      width:100%; height:100%; overflow:auto; -webkit-overflow-scrolling: touch;
      position:relative; z-index:2;
    }

    .sideDock{ position:absolute; top:50%; transform: translateY(-50%);
      display:flex; flex-direction:column; gap:10px; z-index:5; pointer-events:auto; }
    .sideDock.left{ left: 0; } .sideDock.right{ right: 0; }
    .ctrlBtn{
      display:flex; align-items:center; gap:10px;
      background: linear-gradient(180deg, #bdb6ac, #a89f90);
      border: 2px solid #5b554c; border-radius: 12px;
      padding: 8px 10px; min-width: 170px; cursor: pointer;
      box-shadow: inset 0 2px 0 rgba(255,255,255,.4), inset 0 -3px 6px rgba(0,0,0,.18), 0 6px 18px rgba(0,0,0,.35);
      transition: transform .20s ease, filter .12s ease, box-shadow .12s ease, opacity .2s ease;
      user-select:none; opacity: 0.95;
    }
    .sideDock.left  .ctrlBtn{ transform: translateX(calc(-100% + 28px)); border-top-left-radius: 0; border-bottom-left-radius: 0; }
    .sideDock.right .ctrlBtn{ transform: translateX(calc(100% - 28px)); border-top-right-radius: 0; border-bottom-right-radius: 0; }
    .sideDock .ctrlBtn:hover,
    .sideDock .ctrlBtn:focus,
    .sideDock .ctrlBtn:focus-visible,
    .sideDock .ctrlBtn:focus-within{
      transform: translateX(0);
      opacity: 1;
    }
    .ctrlBtn[aria-disabled="true"]{ filter: grayscale(0.6) brightness(0.85); cursor:not-allowed; pointer-events:none; }
    .ctrlBtn:active{ transform: translateY(2px) }
    .lamp{
      width: 14px; height:14px; border-radius:50%;
      background: radial-gradient(circle at 40% 40%, #6c6f63, #333029 70%, #1a1713 100%);
      box-shadow: inset 0 1px 1px rgba(255,255,255,.25), inset 0 -2px 2px rgba(0,0,0,.4);
      flex:none;
    }
    .ctrlBtn.active .lamp{
      background: radial-gradient(circle at 40% 40%, #9affb8, #17cc68 60%, #0d7a3a 100%);
      box-shadow: 0 0 10px rgba(29,222,106,.65), 0 0 26px rgba(29,222,106,.35),
                  inset 0 1px 1px rgba(255,255,255,.35), inset 0 -2px 2px rgba(0,0,0,.35);
    }
    .ctrlText{
      font: 700 14px/1.2 ui-sans-serif, system-ui, Segoe UI, Inter, Arial;
      color: #2e2a23;
      text-transform: uppercase;
      letter-spacing: .06em;
    }

    @media (max-width: 980px){
      .ctrlBtn{ min-width: 150px; padding: 7px 9px; }
      .sideDock.left .ctrlBtn{ transform: translateX(calc(-100% + 24px)); }
      .sideDock.right .ctrlBtn{ transform: translateX(calc(100% - 24px)); }
    }
    @media (max-width: 720px){
      .ctrlBtn{ min-width: 132px; padding: 6px 8px; }
      .sideDock.left .ctrlBtn{ transform: translateX(calc(-100% + 22px)); }
      .sideDock.right .ctrlBtn{ transform: translateX(calc(100% - 22px)); }
    }

    /* ===== HERO / HOME ===== */
    .h_wrap{ min-height:100%; font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial; color:#e8efe9; }
    .h_hero{
      position: relative; width: 100%; min-height: calc(100svh - var(--chromeH));
      display: grid; place-items: center; overflow: hidden; z-index:2; background:#000;
    }
    .h_bgVideo{
      position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center 60%;
      background:#000; display:block; z-index:0; pointer-events:none;
    }
    .h_overlay{ position:relative; z-index:2; text-align:center; padding: 0 4vw; }
    .h_welcome{
      font-family: 'VT323', ui-monospace, monospace; font-size: clamp(42px, 8vw, 84px);
      letter-spacing:.5px; color:#b5f8c1;
      text-shadow: 0 0 10px rgba(166,247,179,.35), 0 0 22px rgba(29,222,106,.25);
      transition: opacity 1.6s ease;
    }
    .h_welcome.fade{ opacity:0; }
    .h_cursor{ display:inline-block; width:.6ch; color:#7dffb2; animation: h_blink 1s steps(2,end) infinite; }
    @keyframes h_blink{ 0%,49%{opacity:1} 50%,100%{opacity:0} }

    .h_scroll{
      position:absolute; top:50%; transform: translateY(-50%);
      display:flex; flex-direction:column; align-items:center; gap:8px;
      filter: drop-shadow(0 6px 16px rgba(0,0,0,.45));
      pointer-events:auto; cursor:pointer; user-select:none; z-index:2;
    }
    .h_scroll.left{ left: clamp(10px, 1.8vw, 18px); }
    .h_scroll.right{ right: clamp(10px, 1.8vw, 18px); }
    .h_plate{
      background: linear-gradient(180deg, #2a2c27, #191c18);
      border:1px solid rgba(0,0,0,.6);
      border-radius:10px; padding:6px 10px;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.06), 0 6px 16px rgba(0,0,0,.35);
    }
    .h_sign{
      position:relative;
      font: 900 clamp(12px, 1.7vw, 16px)/1.1 "Space Grotesk", Inter;
      letter-spacing:.18em; color: #9affb8; text-transform: uppercase;
      text-shadow: 0 0 6px rgba(154,255,184,.85), 0 0 14px rgba(29,222,106,.65), 0 0 26px rgba(29,222,106,.35);
      animation: neonFlicker 3.8s infinite;
    }
    @keyframes neonFlicker{
      0%, 6%{ opacity:.92; filter: brightness(1) }
      7%{ opacity:.45; filter: brightness(.7) }
      8%,11%{ opacity:.95; filter: brightness(1.05) }
      12%{ opacity:.6; filter: brightness(.8) }
      13%,100%{ opacity:.98; filter: brightness(1.05) }
    }
    .h_arrow{
      width:20px; height:20px;
      border-right:3px solid #9affb8; border-bottom:3px solid #9affb8;
      transform: rotate(45deg); opacity:.9;
      box-shadow: 0 0 8px rgba(154,255,184,.6), 0 0 18px rgba(29,222,106,.35);
    }
    .h_arrow.a1{ animation: h_bounce 1.2s ease-in-out infinite .0s; }
    .h_arrow.a2{ animation: h_bounce 1.2s ease-in-out infinite .15s; }
    .h_arrow.a3{ animation: h_bounce 1.2s ease-in-out infinite .3s; }
    @keyframes h_bounce{
      0%,100%{ transform: translateY(0) rotate(45deg); opacity:.7 }
      50%{ transform: translateY(8px) rotate(45deg); opacity:1 }
    }
      /* ===== COMIC HEADLINE (SAFE ADDITION) ===== */
.comicHead{
  display:inline-block;
  font-family: "VT323", ui-monospace, monospace;
  text-transform: uppercase;
  letter-spacing: .08em;

  padding: .35em .55em .3em;
  background: #ffd84d;
  color: #111;

  border-radius: 12px;
  border: 3px solid #050505;

  box-shadow:
    0 4px 0 #050505,
    0 10px 26px rgba(0,0,0,.45);

 transform: none;

}


    .h_audioWrap{
      position:absolute; right: clamp(10px, 1.6vw, 18px); bottom: clamp(10px, 1.6vw, 18px);
      display:flex; align-items:center; gap:10px; z-index:2; background: rgba(0,0,0,.55); backdrop-filter: blur(6px);
      border: 1px solid rgba(255,255,255,.15); border-radius: 12px; padding: 8px 10px;
    }
    .h_audioBtn{
      appearance:none; border:none;
      background: linear-gradient(180deg, #2a2f2a, #141714);
      color:#cfead7; font-size: 16px; line-height: 1;
      padding: 8px 10px; border-radius: 10px; cursor: pointer;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.06);
    }
    .h_audioBtn:hover{ filter: brightness(1.05); }
    .h_audioSlider{ width: 120px; accent-color: #1dde6a; }
    @media (max-width: 640px){ .h_audioSlider{ width: 90px; } }

    .h_outer{ width:min(1600px, 92%); margin: 22px auto 22px; }
    .h_block{
      border:1px solid var(--stroke); border-radius: 16px;
      padding: clamp(14px, 2.4vw, 22px);
      box-shadow: 0 18px 50px rgba(0,0,0,.7);
    }
    .h_block + .h_block{ margin-top: 14px; }
    .h_block--mint{ background: var(--blk1-bg); }
    .h_block--slate{ background: var(--blk2-bg); }
    .h_block--ink { background: var(--blk3-bg); }

    .h_titleXL{
      font: 900 clamp(22px, 3.4vw, 34px)/1.2 "Space Grotesk", Inter;
      letter-spacing:.01em; margin:0; color:#e9f6ed; text-align:center;
    }
    .h_titleSub{
      margin:6px 0 0;
      font: 800 clamp(16px, 2.2vw, 22px)/1.25 "Space Grotesk", Inter;
      color:#bfe8c7; text-align:center;
    }

    .h_titleMain{
      font: 900 clamp(24px, 3.6vw, 38px)/1.15 "Space Grotesk", Inter;
      margin:0; color:#ecf1ff; text-align:center;
    }
    .h_titleTag{
      margin:6px 0 0;
      font: 800 clamp(16px, 2.2vw, 22px)/1.25 "Space Grotesk", Inter;
      color:#c9d7ff; text-align:center;
    }

    /* Shared image card base */
    .h_imgCard{
      position:relative;
      border-radius:14px;
      overflow:hidden;
      border:none;
      background:#000;
      height: clamp(220px, 40vh, 420px);
      box-shadow: 0 16px 38px rgba(0,0,0,.6);
    }
    .h_imgCard img{
      width:100%;
      height:100%;
      object-fit:contain;
      background:#000;
      display:block;
    }

    .h_centerNote{
      border:1px dashed rgba(255,255,255,.16);
      background: radial-gradient(circle at top, rgba(29,222,106,.16), rgba(0,0,0,.9));
      border-radius: 16px;
      padding: clamp(18px, 2.8vw, 26px);
      color:#d9e5db;
      text-align:center;
      display:grid; place-items:center;
      box-shadow: inset 0 0 0 1px rgba(0,0,0,.35), 0 14px 30px rgba(0,0,0,.7);
    }
    .h_centerNote strong{
      display:block;
      font: 900 clamp(18px, 2.4vw, 22px)/1.3 "Space Grotesk", Inter;
      letter-spacing:.04em;
      margin-bottom: 6px;
      text-transform: uppercase;
      color:#b5f8c1;
    }
    .h_centerNote p{
      margin:0;
      max-width: 68ch;
      font: 600 clamp(13px, 1.6vw, 15px)/1.7 Inter;
      color:#cfe0d4;
    }

    /* ===== HOME CAROUSEL ===== */
    .h_carouselWrap{
      margin-top: 16px;
      display:flex;
      flex-direction:column;
      align-items:center;
      gap: 14px;
    }

    .h_carousel{
      width:100%;
      display:flex;
      align-items:center;
      justify-content:center;
      gap:10px;
    }
    .h_carFrame{
      position:relative;
      display:flex;
      flex-direction:column;
      justify-content:center;
    }
    .h_carFrame--center{
      flex:0 0 50%;
      max-width: 840px;
      z-index:2;
    }
    .h_carFrame--side{
      flex:0 0 20%;
      max-width: 260px;
      opacity:.4;
      transform: scale(.9);
      filter: blur(0.2px);
      transition: opacity .2s ease, transform .2s ease;
    }
    .h_imgCard--carousel{
      display:flex;
      flex-direction:column;
      justify-content:center;
    }
    .h_imgCard--side img{
      object-fit:cover;
    }

    .h_carCaption{
      margin-top:6px;
      font: 600 13px/1.5 Inter;
      color:#cfe0d4;
      text-align:center;
      opacity:.9;
    }
    .h_carCaption span{
      color:#b5f8c1;
      font-weight:700;
      text-transform:uppercase;
      letter-spacing:.09em;
      font-size:11px;
      display:block;
      margin-bottom:4px;
    }

    .h_carBtn{
      appearance:none;
      border:none;
      border-radius:999px;
      padding:10px 12px;
      cursor:pointer;
      background: radial-gradient(circle at 30% 20%, #f7fff9, #1dde6a);
      color:#02140a;
      font-size:18px;
      display:flex;
      align-items:center;
      justify-content:center;
      box-shadow:
        0 0 12px rgba(29,222,106,.7),
        0 0 32px rgba(29,222,106,.35);
      transition: transform .12s ease, box-shadow .12s ease, filter .12s ease;
    }
    .h_carBtn:hover{
      transform: translateY(-1px) scale(1.04);
      filter: brightness(1.05);
      box-shadow:
        0 0 16px rgba(29,222,106,.9),
        0 0 40px rgba(29,222,106,.5);
    }
    .h_carBtn:active{
      transform: translateY(1px) scale(0.97);
      box-shadow:
        0 0 10px rgba(29,222,106,.6),
        0 0 26px rgba(29,222,106,.3);
    }

    .h_carDots{
      display:flex;
      gap:6px;
      justify-content:center;
      align-items:center;
      margin-top:2px;
    }
    .h_carDot{
      width:9px; height:9px;
      border-radius:50%;
      background: #1b2a21;
      border:1px solid #1dde6a;
      opacity:.4;
      cursor:pointer;
      box-shadow: 0 0 0 rgba(0,0,0,0);
      transition: opacity .15s ease, transform .15s ease, box-shadow .15s ease, background .15s ease;
    }
    .h_carDot.active{
      opacity:1;
      background:#1dde6a;
      transform: scale(1.15);
      box-shadow: 0 0 10px rgba(29,222,106,.9);
    }

    @media (max-width: 880px){
      .h_carFrame--side{
        display:none;
      }
      .h_carFrame--center{
        flex:1 1 auto;
        max-width: 100%;
      }
    }

    /* ===== HERO KNOB OVERLAY ===== */
    .heroKnobCluster{
      position:fixed;
      bottom: clamp(-50px, -50vh, -50px);
      left:50%;
      transform: translateX(-50%);
      width: clamp(260px, 40vw, 420px);
      height: clamp(260px, 40vw, 420px);
      pointer-events:auto;
      z-index:999;
      transition: transform .35s ease, opacity .35s ease;
    }
    .heroKnobCluster--docked{
      transform: translateX(-50%) translateY(70%);
      opacity:0;
      pointer-events:none;
    }

    .heroKnobLabels{
      position:absolute;
      inset:0;
      display:block;
      pointer-events:none;
    }

    /* DUCT-TAPE LOOK (solid by default, translucent over hero video) */
    .heroKnobTapeLabel{
      position:absolute;
      top:50%; left:50%;
      transform-origin: center center;
      pointer-events:auto;

      background-color: #d6d7cd;
      background-image:
        linear-gradient(135deg, rgba(255,255,255,0.18), rgba(0,0,0,0.18)),
        repeating-linear-gradient(
          -45deg,
          rgba(0,0,0,0.28) 0 1px,
          rgba(0,0,0,0.00) 1px 3px
        );

      border-radius: 10px;
      padding: 4px 12px;
      border: 1px solid rgba(0,0,0,.8);
      box-shadow:
        0 2px 6px rgba(0,0,0,.9),
        inset 0 0 0 1px rgba(255,255,255,.08);

      font-family: "VT323", ui-monospace, monospace;
      font-size: 14px;
      letter-spacing:.08em;
      text-transform: uppercase;
      color:#121312;
      opacity: 1;
      cursor:pointer;

      transform:
        rotate(var(--angle))
        translateY(-48%)
        translateX(-50%)
        translateY(-48%)
        translateX(clamp(100px, 17vw, 155px))
        rotate(calc(var(--angle) * -1))
        translateX(var(--shiftX, 0px))
        translateY(var(--shiftY, 0px));

      transition: transform .2s ease,
                  opacity .2s ease,
                  box-shadow .2s ease,
                  background .2s ease,
                  color .2s ease;
    }

    /* Over hero video: make the tape more translucent and glassy */
    .heroKnobCluster[data-over-video="1"] .heroKnobTapeLabel{
      background-color: rgba(214,215,205,0.26);
      color:#f6f6f2;
      backdrop-filter: blur(2px);
      box-shadow:
        0 2px 6px rgba(0,0,0,0.7),
        inset 0 0 0 1px rgba(255,255,255,.04);
    }

    .heroKnobTapeLabel span{
      display:block;
      transform: rotate(0deg);
      white-space:nowrap;
    }

    .heroKnobTapeLabel:hover{
      opacity:1;
      box-shadow:
        0 0 16px rgba(0,0,0,.95),
        0 0 32px rgba(0,0,0,.9);
    }

    .heroKnobTapeLabel.active{
      box-shadow:
        0 0 18px rgba(29,222,106,.9),
        0 0 40px rgba(29,222,106,.6);
      border-color: rgba(29,222,106,.9);
    }

    .heroKnobDial{
      position:absolute;
      top:50%; left:50%;
      transform: translate(-50%, -50%);
      width: clamp(120px, 20vw, 180px);
      height: clamp(120px, 20vw, 180px);
      border-radius:50%;
      border:none;
      padding:0;
      cursor:pointer;
      background:
        radial-gradient(circle at 30% 20%, rgba(255,255,255,.15), rgba(0,0,0,.9)),
        radial-gradient(circle at center, #111 40%, #050505 100%);
      box-shadow:
        0 0 0 4px rgba(0,0,0,.8),
        0 20px 40px rgba(0,0,0,.9),
        inset 0 2px 4px rgba(255,255,255,.08),
        inset 0 -4px 10px rgba(0,0,0,.9);
      position:relative;
      outline:none;
      transition: transform .18s ease, box-shadow .18s ease;
    }

    .heroKnobDial::before{
      content:"";
      position:absolute;
      inset:16%;
      border-radius:50%;
      border:1px solid rgba(0,0,0,.8);
      box-shadow:
        inset 0 0 0 1px rgba(255,255,255,.06),
        0 0 0 2px rgba(0,0,0,.9);
      background:
        repeating-radial-gradient(circle at center,
          rgba(0,0,0,.0) 0 2px,
          rgba(0,0,0,.85) 2px 3px);
      opacity:.9;
    }

   /* Old pointer was here, but it can't rotate because it's on the dial */
.heroKnobDial::after{
  display:none;
}

.heroKnobDialInner{
  position:absolute;
  inset:0;
  border-radius:50%;
  pointer-events:none;
  transform: rotate(var(--rotation, 0deg));
  transition: transform .22s cubic-bezier(.28,.78,.18,.99);
}

/* New pointer INSIDE the rotating layer */
.heroKnobPointer{
  position:absolute;
  top: 8%;
  left:50%;
  width:8px;
  height:28%;
  transform: translateX(-50%);
  background: linear-gradient(180deg, #f8f8f4, #333);
  border-radius:999px;
  box-shadow:
    0 0 4px rgba(0,0,0,.9),
    inset 0 1px 2px rgba(255,255,255,.5);
}


    .heroKnobDial:hover{
      box-shadow:
        0 0 0 4px rgba(29,222,106,.3),
        0 26px 60px rgba(0,0,0,1),
        inset 0 2px 4px rgba(255,255,255,.12),
        inset 0 -4px 10px rgba(0,0,0,.95);
    }
    .heroKnobDial:active{
      transform: translate(-50%, -49%);
      box-shadow:
        0 0 0 4px rgba(29,222,106,.2),
        0 16px 40px rgba(0,0,0,1),
        inset 0 2px 6px rgba(255,255,255,.1),
        inset 0 -6px 12px rgba(0,0,0,1);
    }

    .heroKnobDialLabel{
      position:absolute;
      bottom: -18px;
      left:50%;
      transform: translateX(-50%);
      font-family:"VT323", ui-monospace, monospace;
      font-size: 14px;
      letter-spacing:.08em;
      text-transform:uppercase;
      color:#e9f6ed;
      text-shadow: 0 0 6px rgba(0,0,0,.9);
      opacity:.9;
      pointer-events:none;
    }

    /* Bigger, more noticeable bottom dock tab */
    .heroKnobDockZone{
      position:fixed;
      bottom:0;
      left:50%;
      transform: translateX(-50%);
      padding: 8px 18px;
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
      border:1px solid rgba(29,222,106,.7);
      border-bottom:none;
      background:
        radial-gradient(circle at 10% 0%, rgba(29,222,106,.25), rgba(0,0,0,.95));
      font-family:"VT323", ui-monospace, monospace;
      font-size: 13px;
      letter-spacing:.16em;
      text-transform:uppercase;
      color:#e6f8eb;
      display:flex;
      align-items:center;
      gap:8px;
      opacity:.9;
      z-index:1000;
      cursor:pointer;
      box-shadow:
        0 -6px 30px rgba(0,0,0,.9),
        0 0 22px rgba(29,222,106,.5);
      transition: opacity .2s ease, transform .2s ease, box-shadow .2s ease;
    }
    .heroKnobDockZone span:first-child{
      font-size: 14px;
    }
    .heroKnobDockZone:hover{
      opacity:1;
      transform: translateX(-50%) translateY(-3px);
      box-shadow:
        0 -10px 40px rgba(0,0,0,1),
        0 0 32px rgba(29,222,106,.75);
    }

    @media (max-width: 640px){
      .heroKnobCluster{
        width: 260px;
        height: 260px;
        bottom: 20px;
      }
      .heroKnobDialLabel{
        font-size: 12px;
      }
      .heroKnobDockZone{
        font-size: 11px;
        padding: 6px 14px;
      }
    }
 /* ===== Gallery PAGE ===== */
.cg-wrap{
  min-height:100%;
  display:flex;
  flex-direction:column;
  font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial;
  color: var(--text);
}

.cg-hero{
  display:grid;
  place-items:center;
  padding: 34px 0 10px;
  text-align:center;
}
.cg-hero-inner{
  width:var(--grid);
  display:grid;
  gap:10px;
  margin-inline:auto;
}
.cg-h1{
  font: 800 clamp(32px,5.8vw,60px)/1.1 "Space Grotesk", Inter;
  letter-spacing:-.02em;
  margin:0;
  background: linear-gradient(180deg, #ffffff, #d8e3d9);
  color: transparent;
  background-clip:text;
}
.cg-sub{
  margin:0;
  max-width: 78ch;
  margin-inline:auto;
  color: var(--muted);
  font: 500 15px/1.7 Inter;
}

.cg-shell{
  width:var(--grid);
  margin: 18px auto 30px;
}

.cg-controls{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:10px;
  flex-wrap:wrap;
  margin-bottom:12px;
}
.cg-pillRow{
  display:flex;
  flex-wrap:wrap;
  gap:8px;
}
.cg-pill{
  appearance:none;
  border:1px solid var(--mk-stroke);
  background: rgba(0,0,0,.65);
  color: var(--text);
  border-radius: 999px;
  padding: 9px 12px;
  font: 800 12px/1 Inter;
  letter-spacing:.08em;
  text-transform:uppercase;
  cursor:pointer;
  transition: transform .12s ease, filter .12s ease, border-color .12s ease, box-shadow .12s ease, opacity .12s ease;
  opacity:.88;
}
.cg-pill:hover{ transform: translateY(-1px); filter: brightness(1.05); opacity:1; }
.cg-pill.active{
  border-color: rgba(29,222,106,.9);
  box-shadow: 0 0 16px rgba(29,222,106,.22);
  opacity:1;
}

.cg-count{
  color: var(--muted);
  font: 700 13px/1.2 Inter;
}

.cg-grid{
  display:grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 12px;
}

.cg-card{
  position:relative;
  border-radius: 16px;
  overflow:hidden;
  border:1px solid #111722;
  background:#000;
  box-shadow: 0 18px 55px rgba(0,0,0,.7);
  cursor:pointer;
  min-height: 160px;
  transition: transform .16s ease, box-shadow .16s ease, border-color .16s ease;
}
.cg-card:hover{
  transform: translateY(-3px);
  border-color: rgba(255,255,255,.22);
  box-shadow: 0 28px 80px rgba(0,0,0,.85);
}

.cg-media{
  width:100%;
  height:100%;
  object-fit:cover;
  display:block;
}

.cg-overlay{
  position:absolute;
  inset:auto 10px 10px 10px;
  background: rgba(0,0,0,.62);
  border: 1px solid rgba(255,255,255,.12);
  border-radius: 12px;
  padding: 10px 10px 9px;
  backdrop-filter: blur(6px);
}
.cg-tag{
  margin:0 0 4px;
  font: 900 11px/1.2 Inter;
  letter-spacing:.14em;
  text-transform:uppercase;
  color:#b5f8c1;
}
.cg-title{
  margin:0;
  font: 700 13px/1.4 Inter;
  color:#dfe7e0;
}

/* Responsive panel sizes */
.cg-span-3{ grid-column: span 3; }
.cg-span-4{ grid-column: span 4; }
.cg-span-5{ grid-column: span 5; }
.cg-span-6{ grid-column: span 6; }
.cg-span-7{ grid-column: span 7; }
.cg-span-8{ grid-column: span 8; }
.cg-span-12{ grid-column: span 12; }

@media (max-width: 1100px){
  .cg-grid{ grid-template-columns: repeat(8, minmax(0, 1fr)); }
  .cg-span-7, .cg-span-8{ grid-column: span 8; }
  .cg-span-6{ grid-column: span 8; }
  .cg-span-5{ grid-column: span 4; }
  .cg-span-4{ grid-column: span 4; }
  .cg-span-3{ grid-column: span 4; }
}
@media (max-width: 720px){
  .cg-grid{ grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .cg-span-12, .cg-span-8, .cg-span-7, .cg-span-6, .cg-span-5, .cg-span-4, .cg-span-3{ grid-column: span 4; }
  .cg-card{ min-height: 220px; }
}

/* Lightbox */
.cg-lightbox{
  position:fixed;
  inset:0;
  z-index:2000;
  background: rgba(0,0,0,.82);
  display:grid;
  place-items:center;
  padding: 18px;
}
.cg-lightboxInner{
  width:min(1200px, 96vw);
  border-radius: 18px;
  overflow:hidden;
  border:1px solid rgba(255,255,255,.14);
  background:#000;
  box-shadow: 0 30px 120px rgba(0,0,0,.95);
}
.cg-lightboxTop{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:10px;
  padding: 12px 14px;
  border-bottom:1px solid rgba(255,255,255,.10);
  background: rgba(0,0,0,.6);
}
.cg-lightboxTopLeft{
  display:grid;
  gap:2px;
}
.cg-lightboxKicker{
  margin:0;
  font: 900 11px/1.2 Inter;
  letter-spacing:.14em;
  text-transform:uppercase;
  color:#b5f8c1;
}
.cg-lightboxTitle{
  margin:0;
  font: 800 14px/1.2 Inter;
  color:#e9edf1;
}
.cg-close{
  appearance:none;
  border:1px solid rgba(255,255,255,.18);
  background: rgba(0,0,0,.55);
  color:#e9edf1;
  border-radius: 12px;
  padding: 10px 12px;
  font: 900 12px/1 Inter;
  letter-spacing:.12em;
  text-transform:uppercase;
  cursor:pointer;
}
.cg-close:hover{ filter: brightness(1.08); }

.cg-lightboxMedia{
  width:100%;
  height: min(70vh, 720px);
  background:#000;
  display:block;
}
.cg-lightboxMedia img,
.cg-lightboxMedia video{
  width:100%;
  height:100%;
  object-fit:contain;
  display:block;
}

    /* ===== SOCIAL MEDIA PAGE (NEW) ===== */
    .sm-wrap{
      min-height:100%;
      display:flex;
      flex-direction:column;
      font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial;
      color: var(--text);
    }
    .sm-hero{
      display:grid;
      place-items:center;
      padding: 32px 0 10px;
      text-align:center;
    }
    .sm-hero-inner{
      width:var(--grid);
      display:grid;
      gap:12px;
      margin-inline:auto;
    }
    .sm-h1{
      font: 800 clamp(32px,5.8vw,60px)/1.1 "Space Grotesk", Inter;
      letter-spacing:-.02em;
      margin:0;
      background: linear-gradient(180deg, #ffffff, #d8e3d9);
      color: transparent;
      background-clip:text;
      text-align:center;
    }
    .sm-sub{
      margin:0;
      max-width: 72ch;
      margin-inline:auto;
      color: var(--muted);
      font: 500 15px/1.7 Inter;
      text-align:center;
    }

    .sm-section{
      width:var(--grid);
      margin: 26px auto 0;
      padding-bottom:6px;
    }

    .sm-carouselShell{
      background:#000;
      border:1.5px solid var(--mk-stroke);
      border-radius: 18px;
      box-shadow: 0 22px 70px rgba(0,0,0,.75);
      overflow:hidden;
    }
    .sm-carouselTop{
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:12px;
      padding: 14px 14px 0;
    }
    .sm-carouselTitle{
      margin:0;
      font: 800 18px/1.2 Inter;
      color: var(--text);
      text-align:left;
    }
    .sm-carouselHint{
      margin:0;
      font: 600 12px/1.2 Inter;
      color: var(--muted);
      text-align:right;
    }

    .sm-carousel{
      position:relative;
      padding: 12px 14px 14px;
    }
    .sm-carouselRow{
      display:grid;
      grid-auto-flow: column;
      grid-auto-columns: minmax(220px, 1fr);
      gap: 12px;
      overflow:auto;
      scroll-snap-type: x mandatory;
      -webkit-overflow-scrolling: touch;
      padding-bottom: 6px;
    }
    .sm-tile{
      scroll-snap-align: start;
      border-radius: 14px;
      overflow:hidden;
      border: 1px solid #111722;
      background:#060708;
      position:relative;
      cursor:pointer;
      transition: transform .16s ease, box-shadow .16s ease, border-color .16s ease, opacity .16s ease;
      min-height: 220px;
      display:flex;
      align-items:center;
      justify-content:center;
      text-decoration:none;
      color: inherit;
    }
    .sm-tile:hover{
      transform: translateY(-3px);
      border-color: rgba(255,255,255,.25);
      box-shadow: 0 18px 50px rgba(0,0,0,.85);
    }
    .sm-tile img{
      width:100%;
      height:100%;
      object-fit:cover;
      display:block;
    }
    .sm-tileOverlay{
      position:absolute;
      inset:auto 10px 10px 10px;
      background: rgba(0,0,0,.62);
      border: 1px solid rgba(255,255,255,.12);
      border-radius: 12px;
      padding: 10px 10px 9px;
      backdrop-filter: blur(6px);
    }
    .sm-tileTag{
      font: 800 11px/1.2 Inter;
      letter-spacing:.12em;
      text-transform: uppercase;
      color: #b5f8c1;
      margin:0 0 4px;
    }
    .sm-tileCap{
      margin:0;
      color:#dfe7e0;
      font: 600 13px/1.45 Inter;
    }

    .sm-actions{
      display:flex;
      gap:10px;
      justify-content:flex-end;
      padding: 0 14px 14px;
    }
    .sm-btn{
      appearance:none;
      border:1px solid #1a2a20;
      background:#0e1511;
      color: var(--text);
      border-radius: 12px;
      padding: 10px 12px;
      font: 800 13px/1 Inter;
      cursor:pointer;
      transition: transform .12s ease, filter .12s ease, box-shadow .12s ease;
    }
    .sm-btn:hover{
      transform: translateY(-1px);
      filter: brightness(1.06);
      box-shadow: 0 0 16px rgba(29,222,106,.15);
    }
    .sm-btnPrimary{
      background: var(--accent);
      color: var(--accent-ink);
      border-color:#1dd86a;
      box-shadow: 0 10px 26px rgba(29,222,106,.18);
    }

    .sm-cards{
      display:grid;
      gap: 18px;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      margin-top: 18px;
    }
    .sm-card{
      background:#000;
      border:1px solid var(--mk-stroke);
      border-radius: 16px;
      padding: 18px 18px 20px;
      box-shadow: 0 16px 44px rgba(0,0,0,.65);
      text-align:left;
    }
    .sm-cardKicker{
      margin:0 0 8px;
      font: 900 12px/1.2 Inter;
      letter-spacing:.14em;
      text-transform:uppercase;
      color: #b5f8c1;
    }
    .sm-cardTitle{
      margin:0 0 8px;
      font: 800 18px/1.25 Inter;
      color: var(--text);
    }
    .sm-cardBody{
      margin:0;
      color: var(--muted);
      font: 500 14px/1.7 Inter;
    }

    @media (max-width: 980px){
      .sm-cards{ grid-template-columns: 1fr; }
      .sm-carouselRow{ grid-auto-columns: minmax(240px, 1fr); }
    }

    .sm-footer{
      width:var(--grid);
      margin: 28px auto 30px;
      display:flex;
      align-items:center;
      justify-content:center;
      gap: 10px;
      flex-wrap:wrap;
      text-align:center;
    }
    .sm-pill{
      display:inline-flex;
      align-items:center;
      gap:10px;
      padding: 12px 14px;
      border-radius: 999px;
      border:1px solid var(--mk-stroke);
      background: rgba(0,0,0,.7);
      color: var(--text);
      text-decoration:none;
      font: 800 13px/1 Inter;
      box-shadow: 0 12px 34px rgba(0,0,0,.55);
      transition: transform .12s ease, filter .12s ease, box-shadow .12s ease, border-color .12s ease;
    }
    .sm-pill:hover{
      transform: translateY(-2px);
      filter: brightness(1.06);
      border-color: rgba(255,255,255,.25);
      box-shadow: 0 18px 48px rgba(0,0,0,.8);
    }
    .sm-pillDot{
      width:9px; height:9px;
      border-radius:50%;
      background: var(--accent);
      box-shadow: 0 0 10px rgba(29,222,106,.55);
    }

    .mk-hero{ display:grid; place-items:center; padding: 32px 0 8px; text-align:center; }
    .mk-hero-inner{ width:var(--grid); display:grid; gap:14px; text-align:center; margin-inline:auto; }
    .mk-h1{ font: 800 clamp(32px,5.8vw,60px)/1.1 "Space Grotesk", Inter; letter-spacing:-.02em; margin:0; background: linear-gradient(180deg, #ffffff, #d8e3d9); color: yellow; background-clip:text; }
    .mk-bullets{ width:var(--grid); display:grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px 18px; list-style:none; padding:0; margin: 12px auto 0; text-align:left; }
    .mk-bullets li{ display:flex; align-items:flex-start; gap:10px; font: 700 clamp(16px, 1.8vw, 18px)/1.5 Inter; color: var(--text); }
    .dot{ width:9px; height:9px; border-radius:50%; margin-top:8px; flex:none; background: var(--accent); box-shadow: 0 0 10px rgba(29,222,106,.6), 0 0 2px rgba(29,222,106,.9) inset; }
    @media (max-width: 980px){ .mk-bullets{ grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    @media (max-width: 640px){ .mk-bullets{ grid-template-columns: 1fr; } }
    /* ===== MARKETING ===== */
    :root{ --text:#e9edf1; --muted:#a6b0c0; --mk-stroke:#1b2230; --accent-ink:#052a15; --grid: min(1400px, 94%); --block-gap: 48px; }
    .mk-wrap{ min-height:100%; display:flex; flex-direction:column; font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial; color: var(--text) }
    .mk-nav{ width:100%; display:flex; justify-content:center; backdrop-filter: blur(6px); position:sticky; top:0; z-index:1; background: rgba(0,0,0,.65); border-bottom:1px solid var(--mk-stroke); }
    .mk-nav-inner{ width:var(--grid); display:flex; align-items:center; gap:16px; padding:12px 2px; }
    .mk-home{ color: var(--accent); text-decoration:none; padding:8px 12px; border-radius:10px; border:1px solid #1a2a20; background:#0e1511; font: 700 14px/1 Inter; }
    .mk-spacer{ flex:1 }
    .mk-link{ color: var(--muted); text-decoration:none; padding:8px 10px; border-radius:8px; font: 500 14px/1.2 Inter; }
    .mk-link:hover{ color: var(--text); }
    .mk-cta{ background: var(--accent); color: var(--accent-ink); border:1px solid #1dd86a; border-radius: 999px; padding:10px 16px; font: 700 14px/1 Inter; box-shadow: 0 8px 30px rgba(29,222,106,.25); text-decoration:none; }

   

    /* ===== CENTERED LOGO VIDEO IN BRAND CAROUSEL ===== */
   /* ===== FULL-WIDTH LOGO REEL HERO (matches brand carousel width) ===== */
.mk-logoReelWrap{
  margin-top: 18px;
  width: var(--grid);
  margin-left: auto;
  margin-right: auto;
}

.mk-logoReelFrame{
  position: relative;
  width: 100%;
  height: clamp(220px, 34vh, 420px);   /* feels like a hero, not tiny */
  border-radius: 18px;
  overflow: hidden;
  background:#000;
  border:1.5px solid var(--mk-stroke);
  box-shadow:
    0 22px 70px rgba(0,0,0,.85),
    0 0 22px rgba(0,0,0,.75);
}

.mk-logoReelFrame video{
  position:absolute;
  inset:0;
  width:100%;
  height:100%;
  object-fit: cover;                  /* fill the hero area cleanly */
  display:block;
}

/* soft dark gradient so text is readable */
.mk-logoReelFrame::after{
  content:"";
  position:absolute;
  inset:0;
  background:
    radial-gradient(80% 80% at 50% 40%, rgba(0,0,0,.10), rgba(0,0,0,.75)),
    linear-gradient(180deg, rgba(0,0,0,.55), rgba(0,0,0,.25) 45%, rgba(0,0,0,.70));
  z-index:1;
}

/* overlay content */
.mk-logoOverlay{
  position:absolute;
  inset:0;
  z-index:2;
  display:grid;
  place-items:center;
  text-align:center;
  padding: 18px 16px;
}

.mk-logoOverlayInner{
  width:min(920px, 92%);
}

.mk-logoOverlayH2{
  margin:0;
  font: 800 clamp(24px, 3.2vw, 38px)/1.15 "Space Grotesk", Inter;
  letter-spacing:-.01em;
  color: var(--text);
  text-shadow: 0 10px 34px rgba(0,0,0,.65);
}

.mk-logoOverlayP{
  margin: 10px auto 0;
  max-width: 72ch;
  color: color-mix(in oklab, var(--muted) 82%, white);
  font: 500 15px/1.7 Inter;
  text-shadow: 0 10px 30px rgba(0,0,0,.65);
}


    .mk-ctaRow{ display:flex; gap:12px; justify-content:center; flex-wrap:wrap; margin: var(--block-gap) auto; }
    .mk-btn{ background: var(--accent); color: var(--accent-ink); border:1px solid #1dd86a; padding:12px 16px; border-radius:12px; font: 700 14px/1 Inter; text-decoration:none; }

    .mk-section{ width:var(--grid); margin: var(--block-gap) auto 0; padding-bottom:6px; text-align:center; }
    .mk-h2{ font: 800 clamp(22px,3vw,34px)/1.15 "Space Grotesk", Inter; letter-spacing:-.01em; margin:0 0 6px }

    .mk-pricing{ display:grid; gap:24px; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); margin-top:24px; align-items:stretch; }
    .tier{ background:#000; border:1.5px solid var(--mk-stroke); border-radius: 20px; padding: 24px 24px 22px; position:relative; box-shadow: 0 28px 80px rgba(0,0,0,.6); text-align:left; }
    .tier h3{ margin:0 0 8px; font: 800 clamp(20px, 2.2vw, 26px)/1 Inter; }
    .price{ font: 800 clamp(32px, 4.6vw, 44px)/1 "Space Grotesk", Inter; margin: 6px 0 4px; }
    .tiny{ color: var(--muted); font: 600 clamp(13px, 1.4vw, 16px)/1.5 Inter; }
    .tier ul{ margin:16px 0 18px; padding-left:22px; color: var(--muted); font: 500 clamp(15px, 1.6vw, 18px)/1.7 Inter; }
    .tier li{ margin:10px 0; }
    .tier .btn{ display:inline-block; background: var(--accent); color: var(--accent-ink); border:1px solid #1dd86a; padding:14px 16px; border-radius:12px; font: 800 clamp(14px, 1.6vw, 16px)/1 Inter; text-decoration:none; }
/* ===== PORTFOLIO HERO BULLET SPACING ===== */
.mk-hero .mk-bullets{
  margin-top: 56px; /* default felt tight — this adds breathing room */
}
/* ===== PORTFOLIO HERO CTA SPACING ===== */
.mk-hero .mk-ctaRow{
  margin-top: 60px;   /* pushes CTAs lower without affecting bullets */
}

    /* ===== PORTFOLIO HERO POSITIONING ===== */
.mk-hero{
  padding-top: 80px;     /* was visually too high */
  padding-bottom: 12px;  /* tighten space before logo reel */
}

    .mk-section{
  width:var(--grid);
  margin: var(--block-gap) auto 0;
  padding-bottom:6px;
  text-align:center;
}
.mk-logoReelWrap{
  margin-top: -50px;
  width: var(--grid);
  margin-left: auto;
  margin-right: auto;
}

/* ===== PORTFOLIO SECTION BREATHING ROOM ONLY ===== */
.mk-wrap .mk-section{
  margin-top: calc(var(--block-gap) * 1.1);
  margin-bottom: calc(var(--block-gap) * 1.1);
}

.mk-wrap .mk-section:first-of-type{
  margin-top: calc(var(--block-gap) * 1.1);
}

    .faq{ display:grid; gap:10px; margin-top:16px; text-align:left; }
    .faq .q{ background:#000; border:1px solid var(--mk-stroke); border-radius: 12px; padding:14px; }
    .faq .q h4{ margin:0 0 6px; font: 700 15px/1.3 Inter }
    .faq .q p{ margin:0; color: var(--muted); font: 500 14px/1.65 Inter }

    .mk-ctaFoot{ width:var(--grid); margin: var(--block-gap) auto; padding: 16px; border:1px solid var(--mk-stroke); border-radius: 16px; background:#000; display:grid; place-items:center; text-align:center; gap:10px; }

    /* Centered content constraints */
    #pricing .mk-pricing,
    #faq .faq{
      max-width: var(--grid);
      margin-left:auto;
      margin-right:auto;
    }

    /* ===== NEW OVERVIEW SECTION STYLES ===== */
    .mk-steps {
      display: grid;
      gap: 26px;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      margin-top: 26px;
      max-width: 1080px;
      margin-left: auto;
      margin-right: auto;
      text-align:left;
    }

    .mk-step {
      background: #000;
      border: 1px solid var(--mk-stroke);
      border-radius: 16px;
      padding: 18px 20px 22px;
      box-shadow: 0 12px 36px rgba(0,0,0,.55);
    }

    .mk-stepLabel {
      font: 900 32px/1 "Space Grotesk", Inter;
      color: var(--accent);
      text-shadow: 0 0 14px rgba(29,222,106,.45);
      margin-bottom: 6px;
    }

    .mk-stepTitle {
      margin: 0;
      font: 800 20px/1.3 Inter;
      color: var(--text);
    }

    .mk-stepBody {
      margin: 8px 0 0;
      font: 500 15px/1.65 Inter;
      color: var(--muted);
    }

    /* ===== BRAND CAROUSEL SECTION ===== */
    .mk-brandsSection{
      margin-top: var(--block-gap);
    }
    .mk-brandsRow{
      display:flex;
      flex-wrap:wrap;
      gap:18px;
      justify-content:center;
      align-items:stretch;
      margin-top:20px;
    }
    .mk-brandCard{
      background:#000;
      border:1px solid var(--mk-stroke);
      border-radius:16px;
      padding:14px 16px 18px;
      box-shadow:0 18px 50px rgba(0,0,0,.7);
      cursor:pointer;
      display:flex;
      flex-direction:column;
      align-items:center;
      gap:10px;
      width: clamp(220px, 24vw, 320px);
      transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
    }
    .mk-brandCard:hover{
      transform: translateY(-3px);
      box-shadow:0 24px 60px rgba(0,0,0,.9);
      border-color: rgba(255,255,255,.35);
    }
    .mk-brandCard--active{
      border-color:#1dd86a;
      box-shadow:
        0 0 18px rgba(29,222,106,.8),
        0 26px 70px rgba(0,0,0,.9);
      transform: translateY(-4px);
    }
    .mk-brandLogoFrame{
      width:100%;
      height: clamp(220px, 40vh, 420px); /* similar scale to home photo section */
      border-radius:12px;
      overflow:hidden;
      background:#050607;
      display:flex;
      align-items:center;
      justify-content:center;
    }
    .mk-brandLogoFrame img{
      max-width:100%;
      max-height:100%;
      object-fit:contain;
      display:block;
    }
    .mk-brandName{
      font:700 16px/1.3 Inter;
      color:var(--text);
    }

    .mk-brandDetailShell{
      margin-top:18px;
      max-width:var(--grid);
      margin-left:auto;
      margin-right:auto;
    }
    .mk-brandDetail{
      overflow:hidden;
      border-radius:16px;
      border:1px solid var(--mk-stroke);
      background:#020406;
      box-shadow:0 22px 60px rgba(0,0,0,.75);
      max-height:0;
      opacity:0;
      transform: translateY(-6px);
      transition:
        max-height .45s cubic-bezier(.23,.82,.25,1),
        opacity .35s ease-out,
        transform .35s ease-out;
    }
    .mk-brandDetail--open{
      max-height:900px;
      opacity:1;
      transform: translateY(0);
    }
    .mk-brandDetailInner{
      padding:20px 20px 22px;
      display:grid;
      gap:16px;
    }
    .mk-brandDetailTitle{
      font:800 18px/1.3 Inter;
      margin:0;
      text-align:left;
    }
    .mk-brandDetailIntro{
      margin:4px 0 10px;
      font:500 14px/1.7 Inter;
      color:var(--muted);
      text-align:left;
      max-width:640px;
    }
    .mk-brandMediaRow{
      display:flex;
      flex-wrap:wrap;
      gap:12px;
      justify-content:flex-start;
    }
    .mk-brandMedia{
      flex:1 1 clamp(220px, 26%, 320px);
      border-radius:12px;
      overflow:hidden;
      border:1px solid #111722;
      background:#000;
      height:200px;
      display:flex;
      align-items:center;
      justify-content:center;
    }
    .mk-brandMedia img,
    .mk-brandMedia video{
      width:100%;
      height:100%;
      object-fit:cover;
      display:block;
    }
      /* ===== COMIC HEADLINE FINAL (override + animation) ===== */
@keyframes comicWobble{
  0%,100% { transform: rotate(-1.2deg) translateY(0); }
  50%     { transform: rotate( 1.2deg) translateY(2px); }
}

.comicHead{
  display:inline-block;
  font-family: "VT323", ui-monospace, monospace;
  text-transform: uppercase;
  letter-spacing: .08em;

  padding: .35em .55em .3em;
  background: #ffd84d;
  color: #111;

  border-radius: 12px;
  border: 3px solid #050505;

  box-shadow:
    0 4px 0 #050505,
    0 10px 26px rgba(0,0,0,.45);

  /* IMPORTANT: animation goes here */
  animation: comicWobble 2.2s ease-in-out infinite;
  transform-origin: center;
}

/* Respect reduced-motion */
@media (prefers-reduced-motion: reduce){
  .comicHead{ animation: none; }
}
  /* ===== PORTFOLIO PURPLE MODE ===== */
.mk-wrap[data-page="portfolio"]{
  --accent: #7f4ced;          /* purple */
  --ring: rgba(117, 67, 223, 0.7);
  --g1: #783de7;
  --g2: #5d39df;
}
  .mk-wrap[data-page="portfolio"]{
  --accent: #eed113;
  --ring: rgba(109,60,255,.65);
  --g1: #8a63ff;
  --g2: #4f2bcf;
}
/* ===== PORTFOLIO ICON OUTLINE → YELLOW ===== */
.mk-wrap[data-page="portfolio"]{
  --outline-yellow: #ffd84d;
}
/* Side dock buttons & icon outlines */
.mk-wrap[data-page="portfolio"] .ctrlBtn,
.mk-wrap[data-page="portfolio"] .mk-home,
.mk-wrap[data-page="portfolio"] .sm-pill,
.mk-wrap[data-page="portfolio"] .mk-btn{
  border-color: var(--outline-yellow);
}

/* Lamps / dots / rings that still glow green */
.mk-wrap[data-page="portfolio"] .lamp,
.mk-wrap[data-page="portfolio"] .dot,
.mk-wrap[data-page="portfolio"] .sm-pillDot{
  background: var(--outline-yellow);
  box-shadow:
    0 0 10px rgba(255,216,77,.75),
    0 0 22px rgba(255,216,77,.45);
}

  /* Smooth the swap */
.mk-wrap{
  transition: filter .25s ease;
}



  `;

  return (
    <>
      <style>{css}</style>
      <div className="room">
        <div className="rig">
          {/* ===== Monitor ===== */}
          <div className="monitor">
            <div className="bezel">
              <span className="screw tl" />
              <span className="screw tr" />
              <span className="screw bl" />
              <span className="screw br" />

              <div className="screen">
                {!powered && showPower ? (
                  <div className="prepower">
                    {bootSrc && (
                      <video
                        className="videoFill"
                        autoPlay
                        muted
                        loop
                        playsInline
                      >
                        <source src={bootSrc} type="video/mp4" />
                      </video>
                    )}
                    <button
                      className="powerOn"
                      onClick={handlePowerOn}
                      aria-label="Power On"
                    >
                      POWER&nbsp;ON
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Side buttons */}
                    <nav
                      className="sideDock left"
                      aria-label="Left monitor buttons"
                    >
                      {leftButtons.map((b) => (
                        <button
                          key={b.key}
                          className={`ctrlBtn ${
                            isActive(b.path) ? "active" : ""
                          }`}
                          onClick={() => go(b.path)}
                          aria-disabled={!powered}
                          title={b.label}
                        >
                          <span className="lamp" aria-hidden="true" />
                          <span className="ctrlText">{b.label}</span>
                        </button>
                      ))}
                    </nav>
                    <nav
                      className="sideDock right"
                      aria-label="Right monitor buttons"
                    >
                      {rightButtons.map((b) => (
                        <button
                          key={b.key}
                          className={`ctrlBtn ${
                            isActive(b.path) ? "active" : ""
                          }`}
                          onClick={() => go(b.path)}
                          aria-disabled={!powered}
                          title={b.label}
                        >
                          <span className="lamp" aria-hidden="true" />
                          <span className="ctrlText">{b.label}</span>
                        </button>
                      ))}
                    </nav>

                    <div className="scan" />
                    {mode === "center" ? (
                      <div className="screen-center">{children}</div>
                    ) : (
                      <div className="screen-scroll">{children}</div>
                    )}
                  </>
                )}
              </div>

              <div className={`led ${powered ? "on" : ""}`} />
            </div>

            <div className="stand" />
          </div>
        </div>
      </div>

      {/* ===== GLOBAL CHANNEL KNOB (all pages) ===== */}
      {powered && (
        <>
          <div
            className={`heroKnobCluster ${
              knobDocked ? "heroKnobCluster--docked" : ""
            }`}
            aria-label="Navigate GX Universe"
            data-over-video={overVideo ? "1" : "0"}
            onMouseLeave={handleKnobMouseLeave}
          >
            <div className="heroKnobLabels">
              {NAV_BUTTONS.map((b, i) => {
                const angle = angleMap[b.key] ?? i * knobAngleStep - 90;
                const isActiveLabel = getActiveIndex(location.pathname) === i;
                const offsets = labelOffsets[b.key] || {};
                return (
                  <button
                    key={b.key}
                    type="button"
                    className={`heroKnobTapeLabel ${
                      isActiveLabel ? "active" : ""
                    }`}
                    style={{
                      "--angle": `${angle}deg`,
                      "--shiftX": offsets.shiftX || "0px",
                      "--shiftY": offsets.shiftY || "0px",
                    }}
                    onClick={() => go(b.path)}
                  >
                    <span>{b.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              className="heroKnobDial"
              onClick={handleKnobClick}
              aria-label="Rotate to next page"
              title="Turn knob to cycle pages"
            >
              <div
                className="heroKnobDialInner"
                style={{ "--rotation": `${knobRotation}deg` }}
              >
                <span className="heroKnobPointer" aria-hidden="true" />
              </div>

              <div className="heroKnobDialLabel"></div>
            </button>
          </div>

          {/* Bottom dock tab – appears after first scroll */}
          {hasScrolled && knobDocked && (
            <div className="heroKnobDockZone" onMouseEnter={handleDockHover}>
              <span>▲</span>
              <span>CHANNEL KNOB</span>
            </div>
          )}
        </>
      )}
    </>
  );
}

/* =========================
   HOME CONTENT
   ========================= */
function HomeContent() {
  const [typed, setTyped] = useState("");
  const [fadeWelcome, setFadeWelcome] = useState(false);
  const welcomeText = "Welcome to The Gx Universe";
  const aboutRef = useRef(null);
  const heroVideoRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [vol, setVol] = useState(0.6);

  const navigate = useNavigate();

  // carousel state
  const photoSlides = [
    {
      src: asset("poster 1.jpg"),
      alt: "GX Poster artwork",
      tag: "ANIMATED SERIES POSTER",
      caption: "Branding the universe before it even launches.",
    },
    {
      src: asset("IMG_4010.jpg"),
      alt: "Recording studio session",
      tag: "GALACTIC STUDIO SESSION: MIAMI",
      caption: "Late–night mix sessions chasing the perfect take.",
    },
    {
      src: asset("green screen studio.jpg"),
      alt: "Green screen studio",
      tag: "FILM STUDIO",
      caption: "Turning a few green walls into whole universes.",
    },
    {
      src: asset("bday studio session.jpg"),
      alt: "Birthday studio session",
      tag: "GALACTIC STUDIO SESSION: NEW JERSEY",
      caption: "Birthday candles, hard drives, and one more take.",
    },
    {
      src: asset("sxsw.jpg"),
      alt: "SXSW moment",
      tag: "LIVE",
      caption: "From tiny rooms to SXSW energy and real-world stages.",
    },
    {
      src: asset("SPACE MAN.jpg"),
      alt: "Space Man artwork",
      tag: "ON SET BTS",
      caption: "Concept art that turned into a whole storyline.",
    },
  ];

  const [slide, setSlide] = useState(0);

  const nextSlide = () => setSlide((s) => (s + 1) % photoSlides.length);
  const prevSlide = () =>
    setSlide((s) => (s - 1 + photoSlides.length) % photoSlides.length);
  const goToSlide = (i) => setSlide(i);

  // typed welcome
  useEffect(() => {
    setTyped("");
    setFadeWelcome(false);
    let i = 0;
    const TYPING_MS = 90;
    const FADE_DELAY = 900;
    const tick = () => {
      i += 1;
      setTyped(welcomeText.slice(0, i));
      if (i < welcomeText.length) {
        setTimeout(tick, TYPING_MS);
      } else {
        setTimeout(() => setFadeWelcome(true), FADE_DELAY);
      }
    };
    const id = setTimeout(tick, 220);
    return () => clearTimeout(id);
  }, []);

  const scrollToAbout = () => {
    if (aboutRef.current) {
      aboutRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  const keyScroll = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      scrollToAbout();
    }
  };

  const toggleMute = async () => {
    const v = heroVideoRef.current;
    if (!v) return;
    const next = !muted;
    setMuted(next);
    v.muted = next;
    if (!next) {
      try {
        await v.play();
      } catch {
        // ignore autoplay issues
      }
    }
  };
  const handleVol = async (e) => {
    const v = heroVideoRef.current;
    if (!v) return;
    const value = Number(e.target.value);
    setVol(value);
    v.volume = value;
    if (value > 0 && muted) {
      setMuted(false);
      v.muted = false;
      try {
        await v.play();
      } catch {
        // ignore
      }
    }
  };

  const prevIndex = (slide - 1 + photoSlides.length) % photoSlides.length;
  const nextIndex = (slide + 1) % photoSlides.length;

  return (
    <>
      <div className="h_wrap">
        {/* ===== HERO ===== */}
        <section className="h_hero">
          <video
            ref={heroVideoRef}
            className="h_bgVideo"
            autoPlay
            loop
            playsInline
            muted={muted}
            onLoadedMetadata={() => {
              if (heroVideoRef.current) heroVideoRef.current.volume = vol;
            }}
          >
            <source src={HOME_HERO_VIDEO} type="video/mp4" />
          </video>

          {/* Scroll signs */}
          <div
            className="h_scroll left"
            onClick={scrollToAbout}
            onKeyDown={keyScroll}
            role="button"
            tabIndex={0}
            aria-label="Scroll down"
          >
            <div className="h_plate">
              <div className="h_sign">SCROLL</div>
            </div>
            <div className="h_arrow a1" />
            <div className="h_arrow a2" />
            <div className="h_arrow a3" />
          </div>
          <div
            className="h_scroll right"
            onClick={scrollToAbout}
            onKeyDown={keyScroll}
            role="button"
            tabIndex={0}
            aria-label="Scroll down"
          >
            <div className="h_plate">
              <div className="h_sign">SCROLL</div>
            </div>
            <div className="h_arrow a1" />
            <div className="h_arrow a2" />
            <div className="h_arrow a3" />
          </div>

          <div className="h_overlay">
            <div
              className={`h_welcome ${fadeWelcome ? "fade" : ""}`}
              aria-live="polite"
            >
              {typed}
              <span className="h_cursor">|</span>
            </div>
          </div>

          {/* Audio controls */}
          <div className="h_audioWrap">
            <button
              className="h_audioBtn"
              type="button"
              onClick={toggleMute}
              aria-label={muted ? "Unmute video" : "Mute video"}
              title={muted ? "Unmute" : "Mute"}
            >
              {muted ? "🔇" : "🔊"}
            </button>
            <input
              className="h_audioSlider"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={vol}
              onChange={handleVol}
              aria-label="Video volume"
              title="Volume"
            />
          </div>
        </section>

        {/* ===== CONTENT BELOW HERO ===== */}
        <div ref={aboutRef} className="h_outer">
          {/* Tagline with ARCADE container + glow cycle */}
          <section className="arcade-card" aria-label="Studio one-liner">
            <div
              className="inner h_block"
              style={{ border: "none", background: "transparent" }}
            >
              <h2 className="h_titleXL glow-cycle">
                The One-Stop Creative Studio
              </h2>
              <div className="h_titleSub">
                Marketing, Music, Animation and Social Campaigns
              </div>
            </div>
          </section>

          {/* Note + Carousel */}
          <section
            className="h_block h_block--ink"
            aria-label="Scenes from the Gx Universe"
            style={{ marginTop: 14 }}
          >
            {/* Center note ABOVE carousel */}
            <div className="h_centerNote">
              <strong>Scenes from the Gx Universe</strong>
              <p>
                I started in tiny rooms: a green studio where we stitched worlds
                together, a recording booth where we chased the perfect take,
                and late nights rigging lights with a cameraman to make
                something <em>feel</em> alive. Those sessions taught me how
                attention really works — and how to turn it into revenue.
                <br />
                <br />
                <strong>
                  Scroll through a few checkpoints from the journey so far.
                </strong>
              </p>
            </div>

            {/* Carousel with side previews */}
            <div className="h_carouselWrap">
              <div className="h_carousel">
                <button
                  type="button"
                  className="h_carBtn"
                  onClick={prevSlide}
                  aria-label="Previous scene"
                >
                  ◀
                </button>

                {/* Previous preview */}
                <div className="h_carFrame h_carFrame--side" aria-hidden="true">
                  <figure className="h_imgCard h_imgCard--carousel h_imgCard--side">
                    <img src={photoSlides[prevIndex].src} alt="" />
                  </figure>
                </div>

                {/* Main slide */}
                <div className="h_carFrame h_carFrame--center">
                  <figure className="h_imgCard h_imgCard--carousel">
                    <img
                      src={photoSlides[slide].src}
                      alt={photoSlides[slide].alt}
                    />
                    <figcaption className="h_carCaption">
                      <span>{photoSlides[slide].tag}</span>
                      {photoSlides[slide].caption}
                    </figcaption>
                  </figure>
                </div>

                {/* Next preview */}
                <div className="h_carFrame h_carFrame--side" aria-hidden="true">
                  <figure className="h_imgCard h_imgCard--carousel h_imgCard--side">
                    <img src={photoSlides[nextIndex].src} alt="" />
                  </figure>
                </div>

                <button
                  type="button"
                  className="h_carBtn"
                  onClick={nextSlide}
                  aria-label="Next scene"
                >
                  ▶
                </button>
              </div>

              <div className="h_carDots" aria-label="Carousel slide indicators">
                {photoSlides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`h_carDot ${i === slide ? "active" : ""}`}
                    onClick={() => goToSlide(i)}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Center note BELOW carousel */}
          <div className="h_centerNote" style={{ marginTop: 16 }}>
            <strong>From content to conversion.</strong>
            <p>
              From creating art to branding as an artist: landing pages that
              load fast, Google Ads that scale, and social media branding that
              keeps people coming back. I produce campaigns end-to-end — the
              trailer, the page, the ads, the automation — so the creative{" "}
              <em>and</em> the numbers line up. This is where the ideas get
              stress-tested before they become campaigns, records, or full-blown
              worlds.
            </p>
          </div>

          {/* GX Universe with ARCADE container + glow cycle */}
          <section
            className="arcade-card"
            aria-label="GX Universe headline"
            style={{ marginTop: 14 }}
          >
            <div
              className="inner h_block"
              style={{
                border: "none",
                background: "transparent",
                textAlign: "center",
              }}
            >
              <h2 className="h_titleMain glow-cycle">The Gx Universe</h2>
              <div className="h_titleTag glow-cycle-sub">
                Where Ideas Become Reality.
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

/* =========================
   SOCIAL MEDIA (PAGE)
   ========================= */
function SocialMediaContent() {
  useEffect(() => {
    document.title = "Social Media — GX Universe";
  }, []);

  // Thumbnails live in: public/assets/
  // Example files:
  // public/assets/T20 Cover.jpg
  // public/assets/UVR.jpg
  // public/assets/AR Filters - Space Gliders.jpg
  // etc.
  const IG_POSTS = [
    {
      thumb: "T20 Cover.png",
      url: "https://www.instagram.com/p/C85wWG3Nzoq/",
      tag: "Graphic Design",
      caption: "Hook + cutdowns that keep the drop alive after day one.",
    },
    {
      thumb: "UVR.png",
      url: "https://www.instagram.com/reel/C124tqQOUbp/",
      tag: "Large Scale Event Hosting - UVR Miami",
      caption: "Consistent visual system across posts, covers, and typography.",
    },
    {
      thumb: "AR Filters - Space Gliders.png",
      url: "https://www.instagram.com/reel/Chpwzu4AZZu/",
      tag: "AR / FILTERS",
      caption: "Interactive moments that turn viewers into participants.",
    },
    {
      thumb: "animation.png",
      url: "https://www.instagram.com/p/CNSeKKHnPA8/",
      tag: "Animation",
      caption: "Format-native cuts for Reels + feed + stories.",
    },
    {
      thumb: "desert Gx.png",
      url: "https://www.instagram.com/reel/CwAe_eLgC9t/",
      tag: "Marketing / Promotional",
      caption: "Ship, learn, refine — fast feedback loops.",
    },
    {
      thumb: "Recording Studio.png",
      url: "https://www.instagram.com/p/CvKlUXvru1w/",
      tag: "Professional Vocal Recording",
      caption: "Turn one shoot into a month of assets.",
    },
    {
      thumb: "sxsw.jpg",
      url: "https://www.instagram.com/p/CqOR9paPLfu/",
      tag: "Film Festival Entry",
      caption: "Narratives that make people stick around.",
    },
  ];

  const rowRef = useRef(null);

  const scrollByCards = (dir) => {
    const el = rowRef.current;
    if (!el) return;
    const firstCard = el.querySelector(".sm-tile");
    const cardW = firstCard ? firstCard.getBoundingClientRect().width : 260;
    el.scrollBy({ left: dir * (cardW + 12) * 2, behavior: "smooth" });
  };

  const IG_PROFILE_URL = "https://www.instagram.com/thegxuniverse/";
  const X_PROFILE_URL = "https://x.com/thegxuniverse";

  return (
    <div className="sm-wrap">
      <section className="sm-hero">
        <div className="sm-hero-inner">
          <h1 className="sm-h1">Social Media</h1>
          <p className="sm-sub">
            Social Media is the distribution layer — supporting launches,
            extending campaigns, and feeding real-world feedback back into
            creative decisions. It’s where we test hooks, find new audiences,
            and keep momentum going after the drop.
          </p>
        </div>
      </section>

      <section className="sm-section" aria-label="Instagram carousel">
        <div className="sm-carouselShell">
          <div className="sm-carouselTop">
            <h2 className="sm-carouselTitle">Instagram Carousel</h2>
            <p className="sm-carouselHint">
              Tap a tile to open it on Instagram.
            </p>
          </div>

          <div className="sm-carousel">
            <div ref={rowRef} className="sm-carouselRow" role="list">
              {IG_POSTS.map((p, idx) => (
                <a
                  key={idx}
                  className="sm-tile"
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  role="listitem"
                  aria-label={`Open Instagram post ${idx + 1}`}
                  title="Open on Instagram"
                >
                  {/* IMPORTANT: use asset() so it matches how your other pages load */}
                  <img src={asset(p.thumb)} alt={p.tag} loading="lazy" />

                  <div className="sm-tileOverlay">
                    <div className="sm-tileTag">{p.tag}</div>
                    <p className="sm-tileCap">{p.caption}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="sm-actions">
            <button className="sm-btn" onClick={() => scrollByCards(-1)}>
              ◀ Prev
            </button>
            <button
              className="sm-btn sm-btnPrimary"
              onClick={() => scrollByCards(1)}
            >
              Next ▶
            </button>
          </div>
        </div>
      </section>

      <section className="sm-section" aria-label="What social does">
        <div style={{ textAlign: "center" }}>
          <h2 className="mk-h2" style={{ marginBottom: 6 }}>
            How It Fits Into The Pipeline
          </h2>
          <p
            style={{
              margin: "6px auto 0",
              maxWidth: "720px",
              color: "var(--muted)",
              font: "500 15px/1.7 Inter",
              textAlign: "center",
            }}
          >
            Social Media supports launches, activates interactive experiences,
            and keeps the brand’s visual language consistent across every post.
          </p>
        </div>

        <div className="sm-cards">
          <div className="sm-card">
            <div className="sm-cardKicker">01</div>
            <h3 className="sm-cardTitle">Support Launches</h3>
            <p className="sm-cardBody">
              Pre launch planning including clear goals and deadlines to meet
              with content that extends the campaign lifespan and keep momentum
              moving after the drop.
            </p>
          </div>

          <div className="sm-card">
            <div className="sm-cardKicker">02</div>
            <h3 className="sm-cardTitle">Interactive Filters / AR</h3>
            <p className="sm-cardBody">
              Filters, AR, and other interactive experiences turn launches into
              memorable moments. We specialize in turning attention into
              participation — boosting shares, saves, and community engagement.
            </p>
          </div>

          <div className="sm-card">
            <div className="sm-cardKicker">03</div>
            <h3 className="sm-cardTitle">Brand Identity Alignment</h3>
            <p className="sm-cardBody">
              A consistent system for typography, color, pacing, and voice — so
              every post feels like it belongs in the same universe.
            </p>
          </div>
        </div>
      </section>

      <div className="sm-footer" aria-label="Social links">
        <a
          className="sm-pill"
          href={IG_PROFILE_URL}
          target="_blank"
          rel="noreferrer"
        >
          <span className="sm-pillDot" aria-hidden="true" />
          Instagram
        </a>
        <a
          className="sm-pill"
          href={X_PROFILE_URL}
          target="_blank"
          rel="noreferrer"
        >
          <span className="sm-pillDot" aria-hidden="true" />
          Twitter / X
        </a>
      </div>
    </div>
  );
}

/* =========================
   MARKETING (PORTFOLIO COPY)
   ========================= */
function MarketingContent() {
  useEffect(() => {
    document.title = "Portfolio — GX Universe";
  }, []);

  // Brand carousel data (replace asset paths with your actual logos/projects)
  const brands = [
    {
      id: "eddie-bauer",
      name: "Eddie Bauer Kids",
      logo: asset("eddie bauer kids logo.png"),
      blurb:
        "Supported e-commerce and seasonal creative for kids outerwear—coordinating assets, assisting on-set workflow, and ensuring content delivered on schedule.",
      projects: [
        {
          type: "image",
          src: asset("black friday 2025 v1.jpg"),
          alt: "Eddie Bauer kids outerwear layout",
        },
        {
          type: "image",
          src: asset("black friday 2025 v3.jpg"),
          alt: "Eddie Bauer kids outerwear layout",
        },
        {
          type: "image",
          src: asset("cyber Monday v1.jpg"),
          alt: "Eddie Bauer kids outerwear layout",
        },
        {
          type: "image",
          src: asset("eb 1.jpg"),
          alt: "Eddie Bauer kids outerwear layout",
        },
        {
          type: "image",
          src: asset("eb 2.jpg"),
          alt: "Eddie Bauer kids lifestyle photography",
        },
        {
          type: "image",
          src: asset("eb 3.jpg"),
          alt: "Eddie Bauer kids lifestyle photography",
        },
        {
          type: "image",
          src: asset("eb 4.jpg"),
          alt: "Eddie Bauer kids lifestyle photography",
        },
        {
          type: "image",
          src: asset("eb 5.jpg"),
          alt: "Eddie Bauer kids lifestyle photography",
        },
        {
          type: "image",
          src: asset("eb 6.jpg"),
          alt: "Eddie Bauer kids lifestyle photography",
        },
      ],
    },
    {
      id: "champion-kids",
      name: "Champion Kids",
      logo: asset("champion logo.png"),
      blurb:
        "Contributed to lookbooks and e-commerce imagery—helping maintain organized styling flow, consistent presentation, and clean handoff to post-production.",
      projects: [
        {
          type: "image",
          src: asset("champs 1.jpg"),
          alt: "Champions Kids",
        },
        {
          type: "image",
          src: asset("champs 2.jpg"),
          alt: "Champion Kids",
        },
        {
          type: "image",
          src: asset("champs 3.jpg"),
          alt: "Champion Kids",
        },
      ],
    },
    {
      id: "lands-end",
      name: "Lands' End",
      logo: asset("lands end logo.jpeg"),
      blurb:
        "Produced and organized digital assets for lifestyle apparel—focused on accuracy, consistency across PDPs, and fast turnaround for weekly needs.",
      projects: [
        {
          type: "image",
          src: asset("lands end email ad v2.jpg"),
          alt: "Champion kids product grid",
        },
        {
          type: "image",
          src: asset("lands end email ad v3.jpg"),
          alt: "Champion kids lifestyle photo",
        },
        {
          type: "image",
          src: asset("lands end email ad.jpg"),
          alt: "Champion kids lifestyle photo",
        },
        {
          type: "image",
          src: asset("LE shoot 1.jpg"),
          alt: "Champion kids lifestyle photo",
        },
        {
          type: "image",
          src: asset("LE shoot 2.jpg"),
          alt: "Champion kids lifestyle photo",
        },
      ],
    },
  ];

  const [activeBrand, setActiveBrand] = useState(
    brands.length ? brands[0].id : null,
  );

  // Repurposed "tiers" into portfolio skill cards (no layout changes)
  const tiers = [
    {
      name: "Creative Production",
      price: "E-commerce + Campaigns",
      cadence: "What I do",
      features: [
        "On-set support + styling workflow coordination",
        "Visual consistency across PDPs, grids, and lifestyle",
        "Asset prep, QA, and clean handoff to post",
        "Fast turnaround mindset in high-volume environments",
      ],
      cta: "Contact",
    },
    {
      name: "Project Coordination",
      price: "Cross-Team Execution",
      cadence: "How I work",
      features: [
        "Keeps product moving from prep → set → post",
        "Clear communication across studio, styling, and creative",
        "Organized file structures, naming, and delivery readiness",
        "Deadline-focused with calm, reliable follow-through",
      ],
      cta: "Email Me",
    },
    {
      name: "Performance Mindset",
      price: "Speed + Quality",
      cadence: "What I optimize",
      features: [
        "Builds repeatable workflows that reduce rework",
        "Balances brand guidelines with practical constraints",
        "Improves consistency across drops and seasonal updates",
        "Outcome-driven: ship clean work, learn, iterate",
      ],
      cta: "Download Resume",
    },
  ];

  const toggleBrand = (id) => {
    setActiveBrand((prev) => (prev === id ? null : id));
  };

  const currentBrand = brands.find((b) => b.id === activeBrand) || null;

  return (
    <>
      <div className="mk-wrap" data-page="portfolio">
        <div className="mk-nav">
          <div className="mk-nav-inner">
            <Link className="mk-home" to="/home">
              Home
            </Link>
            <div className="mk-spacer" />
            <a className="mk-link" href="#brands">
              Experience
            </a>
            <a className="mk-link" href="#overview">
              How I Work
            </a>
            <a className="mk-link" href="#pricing">
              Core Strengths
            </a>
            <a className="mk-link" href="#faq">
              FAQ
            </a>
            <a className="mk-cta" href="mailto:ManinDGauba@gmail.com">
              Contact
            </a>
          </div>
        </div>

        {/* HERO */}
        <section className="mk-hero">
          <div className="mk-hero-inner">
            <h1 className="mk-h1 comicHead">
              Creative Operations + Content That Ships.
            </h1>

            <ul className="mk-bullets" aria-label="What I bring">
              {[
                "E-commerce Production & On-Set Support",
                "Asset Management & Delivery Pipelines",
                "Creative Direction & Visual Merch",
                "Launch Support (seasonal drops, weekly updates)",
                "Cross-Team Coordination (studio, styling, retouch, marketing)",
                "Performance Mindset (speed, quality, consistency)",
              ].map((b) => (
                <li key={b}>
                  <span className="dot" aria-hidden="true"></span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="mk-ctaRow">
              <a className="mk-btn" href="mailto:ManinDGauba@gmail.com">
                Contact
              </a>
              <a
                className="mk-btn"
                href={asset("ManinDGauba_Resume.pdf")}
                target="_blank"
                rel="noreferrer"
              >
                Download Resume
              </a>
            </div>
          </div>
        </section>

        {/* 🔹 BRAND CAROUSEL SECTION */}
        <section id="brands" className="mk-section mk-brandsSection">
          {/* Hero logo reel with overlay */}
          <div className="mk-logoReelWrap">
            <div className="mk-logoReelFrame">
              <video
                src={MARKETING_LOGO_REEL}
                autoPlay
                loop
                muted
                playsInline
              />

              <div className="mk-logoOverlay">
                <div className="mk-logoOverlayInner">
                  <h2 className="mk-logoOverlayH2">
                    Selected Brand Experience
                  </h2>
                  <p className="mk-logoOverlayP">
                    A snapshot of teams and product categories I’ve supported
                    across e-commerce and brand creative. Tap a logo to see
                    sample visuals and the kind of work I contributed to
                    (workflow, coordination, and content output).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Brand carousel underneath */}
          <div className="mk-brandsRow">
            {brands.map((b) => (
              <button
                key={b.id}
                type="button"
                className={`mk-brandCard ${
                  activeBrand === b.id ? "mk-brandCard--active" : ""
                }`}
                onClick={() => toggleBrand(b.id)}
              >
                <div className="mk-brandLogoFrame">
                  <img src={b.logo} alt={b.name} />
                </div>
                <div className="mk-brandName">{b.name}</div>
              </button>
            ))}
          </div>

          <div className="mk-brandDetailShell">
            <div
              className={`mk-brandDetail ${currentBrand ? "mk-brandDetail--open" : ""}`}
            >
              {currentBrand && (
                <div className="mk-brandDetailInner">
                  <div style={{ textAlign: "left" }}>
                    <h3 className="mk-brandDetailTitle">{currentBrand.name}</h3>
                    <p className="mk-brandDetailIntro">{currentBrand.blurb}</p>
                  </div>
                  <div className="mk-brandMediaRow">
                    {currentBrand.projects.map((p, idx) => (
                      <div key={idx} className="mk-brandMedia">
                        {p.type === "video" ? (
                          <video src={p.src} autoPlay loop muted playsInline />
                        ) : (
                          <img src={p.src} alt={p.alt} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 🔹 OVERVIEW SECTION */}
        <section id="overview" className="mk-section">
          <h2 className="mk-h2 comicHead">How I Work</h2>
          <p
            style={{
              margin: "6px 0 18px",
              maxWidth: "720px",
              marginInline: "auto",
              color: "var(--muted)",
              font: "500 15px/1.7 Inter",
            }}
          >
            I’m a process-minded, goal oriented creative: I help teams move
            faster without losing quality. My focus is keeping product flowing
            smoothly from prep → launch → post, with clear communication and
            reliable deliverables.
          </p>

          <div className="mk-steps">
            <div className="mk-step">
              <div className="mk-stepLabel">01</div>
              <h3 className="mk-stepTitle">Goal-Driven Execution</h3>
              <p className="mk-stepBody">
                Clarify deliverables and timelines while maintaining clear
                communication across marketing, merchandising, creative teams,
                and vendors.
              </p>
            </div>

            <div className="mk-step">
              <div className="mk-stepLabel">02</div>
              <h3 className="mk-stepTitle">Launch-Ready Execution</h3>
              <p className="mk-stepBody">
                Coordinate product and assets, support on-set needs, and keep
                shoots on schedule for timely launches.
              </p>
            </div>

            <div className="mk-step">
              <div className="mk-stepLabel">03</div>
              <h3 className="mk-stepTitle">Post-Launch Delivery</h3>
              <p className="mk-stepBody">
                Ensure final assets are clean, organized, and usable across
                platforms once campaigns go live.
              </p>
            </div>
          </div>
        </section>

        {/* PRICING (CORE STRENGTHS) */}
        <section id="pricing" className="mk-section">
          <h2 className="mk-h2 comicHead">Core Strengths</h2>
          <div className="mk-pricing">
            {tiers.map((t) => (
              <div key={t.name} className="tier">
                <h3>{t.name}</h3>
                <div className="price">{t.price}</div>
                <div className="tiny">{t.cadence}</div>
                <ul>
                  {t.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>

                {t.cta === "Download Resume" ? (
                  <a
                    className="btn"
                    href={asset("ManinDGauba_Resume.pdf")}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t.cta}
                  </a>
                ) : (
                  <a className="btn" href="mailto:ManinDGauba@gmail.com">
                    {t.cta}
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mk-section">
          <h2 className="mk-h2">FAQs</h2>
          <div className="faq">
            <div className="q">
              <h4>What roles are you targeting?</h4>
              <p>
                Creative Operations, E-commerce Production/Coordinator roles,
                Asset Management, and adjacent marketing/production roles.
              </p>
            </div>
            <div className="q">
              <h4>What environments do you thrive in?</h4>
              <p>
                High-volume, fast-moving teams with clear deadlines—where
                organization, communication, and quality control matter.
              </p>
            </div>
            <div className="q">
              <h4>What tools do you work with?</h4>
              <p>
                Adobe (Photoshop), content pipelines, and web tooling (React).
                Comfortable learning new DAM/PM systems quickly.
              </p>
            </div>
          </div>
        </section>

        {/* CTA FOOTER */}
        <section className="mk-ctaFoot">
          <h3
            style={{
              margin: 0,
              font: "800 24px/1.2 'Space Grotesk', Inter",
            }}
          >
            Want a quick walkthrough?
          </h3>
          <p
            style={{
              margin: "6px 0 10px",
              color: "#a6b0c0",
              font: "500 15px/1.6 Inter",
            }}
          >
            I can share context on the workflows, responsibilities, and outcomes
            behind these examples—happy to connect.
          </p>
          <a className="mk-btn" href="mailto:ManinDGauba@gmail.com">
            Contact
          </a>
        </section>
      </div>
    </>
  );
}
/* =========================
   Gallery (PAGE)
   ========================= */
function GalleryContent() {
  useEffect(() => {
    document.title = "Gallery — GX Universe";
  }, []);

  // Everything used so far (videos + images).
  // Tip: if you add new media later, just drop it into this list.
  const MEDIA = [
    // Videos used in the site
    {
      id: "home-boot",
      type: "video",
      src: HOME_LOGO_VIDEO,
      tag: "BOOT",
      title: "Home Boot Logo",
      span: "cg-span-6",
    },
    {
      id: "home-hero",
      type: "video",
      src: HOME_HERO_VIDEO,
      tag: "HERO",
      title: "Home Hero Video",
      span: "cg-span-6",
    },
    {
      id: "logo-reel",
      type: "video",
      src: MARKETING_LOGO_REEL,
      tag: "REEL",
      title: "Portfolio Logo Reel",
      span: "cg-span-12",
    },

    // Home carousel images
    {
      id: "poster-1",
      type: "image",
      src: asset("poster 1.jpg"),
      tag: "HOME",
      title: "Poster 1",
      span: "cg-span-4",
    },
    {
      id: "img-4010",
      type: "image",
      src: asset("IMG_4010.jpg"),
      tag: "HOME",
      title: "Studio Session",
      span: "cg-span-4",
    },
    {
      id: "green-screen",
      type: "image",
      src: asset("green screen studio.jpg"),
      tag: "HOME",
      title: "Green Screen Studio",
      span: "cg-span-4",
    },
    {
      id: "bday-session",
      type: "image",
      src: asset("bday studio session.jpg"),
      tag: "HOME",
      title: "Birthday Session",
      span: "cg-span-6",
    },
    {
      id: "sxsw",
      type: "image",
      src: asset("sxsw.jpg"),
      tag: "HOME",
      title: "SXSW",
      span: "cg-span-3",
    },
    {
      id: "space-man",
      type: "image",
      src: asset("SPACE MAN.jpg"),
      tag: "HOME",
      title: "Space Man",
      span: "cg-span-3",
    },

    // Brand logos used in portfolio
    {
      id: "logo-eb",
      type: "image",
      src: asset("eddie bauer kids logo.png"),
      tag: "BRAND",
      title: "Eddie Bauer Kids Logo",
      span: "cg-span-4",
    },
    {
      id: "logo-champ",
      type: "image",
      src: asset("champion logo.png"),
      tag: "BRAND",
      title: "Champion Logo",
      span: "cg-span-4",
    },
    {
      id: "logo-le",
      type: "image",
      src: asset("lands end logo.jpeg"),
      tag: "BRAND",
      title: "Lands’ End Logo",
      span: "cg-span-4",
    },

    // Portfolio images already referenced
    {
      id: "eb-bf1",
      type: "image",
      src: asset("black friday 2025 v1.jpg"),
      tag: "PORTFOLIO",
      title: "Black Friday v1",
      span: "cg-span-6",
    },
    {
      id: "eb-bf3",
      type: "image",
      src: asset("black friday 2025 v3.jpg"),
      tag: "PORTFOLIO",
      title: "Black Friday v3",
      span: "cg-span-6",
    },
    {
      id: "eb-cm1",
      type: "image",
      src: asset("cyber Monday v1.jpg"),
      tag: "PORTFOLIO",
      title: "Cyber Monday v1",
      span: "cg-span-6",
    },

    {
      id: "eb-1",
      type: "image",
      src: asset("eb 1.jpg"),
      tag: "PORTFOLIO",
      title: "EB 1",
      span: "cg-span-3",
    },
    {
      id: "eb-2",
      type: "image",
      src: asset("eb 2.jpg"),
      tag: "PORTFOLIO",
      title: "EB 2",
      span: "cg-span-3",
    },
    {
      id: "eb-3",
      type: "image",
      src: asset("eb 3.jpg"),
      tag: "PORTFOLIO",
      title: "EB 3",
      span: "cg-span-3",
    },
    {
      id: "eb-4",
      type: "image",
      src: asset("eb 4.jpg"),
      tag: "PORTFOLIO",
      title: "EB 4",
      span: "cg-span-3",
    },
    {
      id: "eb-5",
      type: "image",
      src: asset("eb 5.jpg"),
      tag: "PORTFOLIO",
      title: "EB 5",
      span: "cg-span-3",
    },
    {
      id: "eb-6",
      type: "image",
      src: asset("eb 6.jpg"),
      tag: "PORTFOLIO",
      title: "EB 6",
      span: "cg-span-3",
    },

    {
      id: "ch-1",
      type: "image",
      src: asset("champs 1.jpg"),
      tag: "PORTFOLIO",
      title: "Champion 1",
      span: "cg-span-4",
    },
    {
      id: "ch-2",
      type: "image",
      src: asset("champs 2.jpg"),
      tag: "PORTFOLIO",
      title: "Champion 2",
      span: "cg-span-4",
    },
    {
      id: "ch-3",
      type: "image",
      src: asset("champs 3.jpg"),
      tag: "PORTFOLIO",
      title: "Champion 3",
      span: "cg-span-4",
    },

    {
      id: "le-email2",
      type: "image",
      src: asset("lands end email ad v2.jpg"),
      tag: "PORTFOLIO",
      title: "Lands’ End Email v2",
      span: "cg-span-6",
    },
    {
      id: "le-email3",
      type: "image",
      src: asset("lands end email ad v3.jpg"),
      tag: "PORTFOLIO",
      title: "Lands’ End Email v3",
      span: "cg-span-6",
    },
    {
      id: "le-email",
      type: "image",
      src: asset("lands end email ad.jpg"),
      tag: "PORTFOLIO",
      title: "Lands’ End Email",
      span: "cg-span-4",
    },
    {
      id: "le-shoot1",
      type: "image",
      src: asset("LE shoot 1.jpg"),
      tag: "PORTFOLIO",
      title: "LE Shoot 1",
      span: "cg-span-4",
    },
    {
      id: "le-shoot2",
      type: "image",
      src: asset("LE shoot 2.jpg"),
      tag: "PORTFOLIO",
      title: "LE Shoot 2",
      span: "cg-span-4",
    },

    // Social thumbnails you referenced (if they exist in /assets/social)
    {
      id: "ig-01",
      type: "image",
      src: asset("social/ig-01.jpg"),
      tag: "SOCIAL",
      title: "IG 01",
      span: "cg-span-3",
    },
    {
      id: "ig-02",
      type: "image",
      src: asset("social/ig-02.jpg"),
      tag: "SOCIAL",
      title: "IG 02",
      span: "cg-span-3",
    },
    {
      id: "ig-03",
      type: "image",
      src: asset("social/ig-03.jpg"),
      tag: "SOCIAL",
      title: "IG 03",
      span: "cg-span-3",
    },
    {
      id: "ig-04",
      type: "image",
      src: asset("social/ig-04.jpg"),
      tag: "SOCIAL",
      title: "IG 04",
      span: "cg-span-3",
    },
    {
      id: "ig-05",
      type: "image",
      src: asset("social/ig-05.jpg"),
      tag: "SOCIAL",
      title: "IG 05",
      span: "cg-span-3",
    },
    {
      id: "ig-06",
      type: "image",
      src: asset("social/ig-06.jpg"),
      tag: "SOCIAL",
      title: "IG 06",
      span: "cg-span-3",
    },
    {
      id: "ig-07",
      type: "image",
      src: asset("social/ig-07.jpg"),
      tag: "SOCIAL",
      title: "IG 07",
      span: "cg-span-3",
    },
    {
      id: "ig-08",
      type: "image",
      src: asset("social/ig-08.jpg"),
      tag: "SOCIAL",
      title: "IG 08",
      span: "cg-span-3",
    },
    {
      id: "ig-09",
      type: "image",
      src: asset("social/ig-09.jpg"),
      tag: "SOCIAL",
      title: "IG 09",
      span: "cg-span-3",
    },
    {
      id: "ig-10",
      type: "image",
      src: asset("social/ig-10.jpg"),
      tag: "SOCIAL",
      title: "IG 10",
      span: "cg-span-3",
    },
  ];

  const FILTERS = [
    "ALL",
    "HERO",
    "BOOT",
    "REEL",
    "HOME",
    "PORTFOLIO",
    "BRAND",
    "SOCIAL",
  ];
  const [filter, setFilter] = useState("ALL");
  const [active, setActive] = useState(null);

  const filtered = MEDIA.filter((m) => filter === "ALL" || m.tag === filter);

  const open = (m) => setActive(m);
  const close = () => setActive(null);

  // Escape closes lightbox
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="cg-wrap">
      <section className="cg-hero">
        <div className="cg-hero-inner">
          <h1 className="cg-h1">Gallery</h1>
          <p className="cg-sub">
            A single gallery of everything currently powering the site — hero
            videos, logo reels, portfolio visuals, and photoshoots for major
            kids apparel brands — arranged in a clean, paneled layout. Click
            anything to view it larger.
          </p>
        </div>
      </section>

      <div className="cg-shell">
        <div className="cg-controls">
          <div
            className="cg-pillRow"
            role="tablist"
            aria-label="Gallery filters"
          >
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                className={`cg-pill ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
                role="tab"
                aria-selected={filter === f}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="cg-count">
            Showing <strong>{filtered.length}</strong> item
            {filtered.length === 1 ? "" : "s"}
          </div>
        </div>

        <div className="cg-grid" aria-label="Gallery media grid">
          {filtered.map((m) => (
            <div
              key={m.id}
              className={`cg-card ${m.span || "cg-span-4"}`}
              onClick={() => open(m)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                e.key === "Enter" || e.key === " " ? open(m) : null
              }
              aria-label={`Open ${m.title}`}
              title="Click to view"
            >
              {m.type === "video" ? (
                <video
                  className="cg-media"
                  src={m.src}
                  muted
                  playsInline
                  autoPlay
                  loop
                />
              ) : (
                <img
                  className="cg-media"
                  src={m.src}
                  alt={m.title}
                  loading="lazy"
                />
              )}

              <div className="cg-overlay">
                <p className="cg-tag">{m.tag}</p>
                <p className="cg-title">{m.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {active && (
        <div
          className="cg-lightbox"
          role="dialog"
          aria-modal="true"
          onMouseDown={close}
        >
          <div
            className="cg-lightboxInner"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="cg-lightboxTop">
              <div className="cg-lightboxTopLeft">
                <p className="cg-lightboxKicker">{active.tag}</p>
                <p className="cg-lightboxTitle">{active.title}</p>
              </div>
              <button type="button" className="cg-close" onClick={close}>
                CLOSE
              </button>
            </div>

            <div className="cg-lightboxMedia">
              {active.type === "video" ? (
                <video src={active.src} controls autoPlay playsInline />
              ) : (
                <img src={active.src} alt={active.title} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================
   SIMPLE PLACEHOLDERS
   ========================= */
function ComingSoon({ title }) {
  useEffect(() => {
    document.title = `${title} — GX Universe`;
  }, [title]);
  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        height: "100%",
        color: "#b5f8c1",
        fontFamily: "VT323, monospace",
        background: "#000",
      }}
    >
      <div style={{ fontSize: "clamp(28px,5vw,56px)" }}>
        {title} — Coming Soon
      </div>
    </div>
  );
}

/* =========================
   ROUTES
   ========================= */
function HomePageBoot() {
  return (
    <CRTLayout showPower bootSrc={HOME_LOGO_VIDEO} mode="scroll">
      <HomeContent />
    </CRTLayout>
  );
}
function HomePageWarm() {
  return (
    <CRTLayout mode="scroll">
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

function SocialMediaPage() {
  return (
    <CRTLayout mode="scroll">
      <SocialMediaContent />
    </CRTLayout>
  );
}
function GalleryPage() {
  return (
    <CRTLayout mode="scroll">
      <GalleryContent />
    </CRTLayout>
  );
}

/* ===============
   APP
   =============== */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePageBoot />} />
        <Route path="/home" element={<HomePageWarm />} />
        <Route path="/marketing" element={<MarketingPage />} />
        <Route path="/Gallery" element={<GalleryPage />} />
        <Route path="/social-media" element={<SocialMediaPage />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
