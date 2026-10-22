// SVG-карточки профиля в стиле Okto Calc: чёрный фон, свечения, Golos Text + JetBrains Mono (урезаются под текст).
// Шрифты (OFL-1.1) положить в .fontsrc/: golos.ttf (Golos Text) и jbmono.ttf (JetBrains Mono).
// Запуск: npm install && node build.mjs [--out папка]
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { createKit } from "./kit.mjs";
import { buildLogos } from "./logos.mjs";

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const OUT = arg("--out", "assets");
const FONTS = { golos: ".fontsrc/golos.ttf", mono: ".fontsrc/jbmono.ttf" };

// ---------- цвета ----------
const mix = (hex, to, k) => "#" + [1, 3, 5].map((i) => Math.round(parseInt(hex.slice(i, i + 2), 16) * (1 - k) + parseInt(to.slice(i, i + 2), 16) * k).toString(16).padStart(2, "0")).join("");
const WHITE = { hi: "#FFFFFF", grad: ["#FFFFFF", "#8D8D8D"], on: "#000000", glow: "#FFFFFF", glowOpacity: 0.16, glow2: "#9AA4B8", btn: ["#FFFFFF", "#D9D9D9"] };
const accentOf = (c) => (c === "#FFFFFF" ? WHITE : { hi: c, grad: [mix(c, "#FFFFFF", 0.45), c], on: mix(c, "#000000", 0.85), glow: c, glowOpacity: 0.22, glow2: "#9AA4B8", btn: [mix(c, "#FFFFFF", 0.2), mix(c, "#000000", 0.08)] });
const kits = new Map();
const kit = (c) => { if (!kits.has(c)) kits.set(c, createKit({ ...FONTS, accent: accentOf(c) })); return kits.get(c); };

// ---------- логотипы проектов (те же рисунки, что в их README) ----------
const LOGOS = {
  okto: (s) => `<g transform="scale(${s / 512})"><rect width="512" height="512" rx="112" fill="#17181b" stroke="#3a3a3a" stroke-width="10"/><path d="M182.08,253.36Q160.96,349.72 104.2,356.32M220.36,274.48Q212.44,366.88 187.36,415.72M291.64,274.48Q299.56,366.88 324.64,415.72M329.92,253.36Q351.04,349.72 407.8,356.32" fill="none" stroke="#fafafa" stroke-width="34.32" stroke-linecap="round"/><path d="M150.4,184.72a105.6,105.6 0 1,1 211.2,0a105.6,105.6 0 1,1 -211.2,0zM201.88,175.48a18.48,18.48 0 1,1 36.96,0a18.48,18.48 0 1,1 -36.96,0zM273.16,175.48a18.48,18.48 0 1,1 36.96,0a18.48,18.48 0 1,1 -36.96,0z" fill="#fafafa" fill-rule="evenodd" stroke="#17181b" stroke-width="10.56" paint-order="stroke"/></g>`,
  oktonotes: (s) => `<g transform="scale(${s / 104})"><rect width="104" height="104" rx="24" fill="#FFD60A"/><path d="M14 80h76M14 90h76" stroke="#000" stroke-opacity=".1" stroke-width="2"/><g transform="translate(2 4)"><path d="M38,52q-6,12 -14,14M46,56q-2,14 -8,20M54,56q2,14 8,20" fill="none" stroke="#161616" stroke-width="6" stroke-linecap="round"/><g transform="translate(58 48) rotate(45)"><path d="M3,-4h27v8h-27z" fill="#fff"/><path d="M30,-4L38,0L30,4z" fill="#F5D0A9"/></g><circle cx="50" cy="38" r="18" fill="#161616"/><circle cx="44" cy="36" r="3.2" fill="#FFD60A"/><circle cx="56" cy="36" r="3.2" fill="#FFD60A"/></g></g>`,
  fitter: (s) => `<image width="${s}" height="${s}" href="data:image/png;base64,${fs.readFileSync("logos-src/fitter.png").toString("base64")}"/>`,
  traymixer: (s) => {
    let g = `<rect width="36" height="36" rx="10" fill="#0E0E0E" stroke="#3a3a3a"/>`;
    [[9, 0.72], [18, 0.3], [27, 0.55]].forEach(([y, lv]) => {
      const kx = 8 + 20 * lv;
      g += `<rect x="6" y="${y - 1.2}" width="24" height="2.4" rx="1.2" fill="#fff" fill-opacity=".35"/><rect x="6" y="${y - 1.2}" width="${kx - 6}" height="2.4" rx="1.2" fill="#4CC2FF"/><circle cx="${kx}" cy="${y}" r="3.6" fill="#fff"/><circle cx="${kx}" cy="${y}" r="1.6" fill="#4CC2FF"/>`;
    });
    return `<g transform="scale(${s / 36})">${g}</g>`;
  },
  budila: (s) => { const D = JSON.parse(fs.readFileSync("logos-src/budila-dots.json", "utf8")); return `<g transform="scale(${s / 108})"><rect width="108" height="108" rx="30" fill="#000" stroke="#3a3a3a" stroke-width="3"/><g transform="translate(54 54) scale(1.7) translate(-56.5 -55)"><path fill="#262626" d="${D.off}"/><path fill="#FF6A00" d="${D.lit}"/></g></g>`; },
  flipt: (s) => `<g transform="scale(${s / 36})"><rect width="36" height="36" rx="8.6" fill="#1E1E22" stroke="#3a3a3a"/>${[[1,1,1],[1,1,0],[1,0,0]].map((row, j) => row.map((on, i) => `<circle cx="${18 + (i - 1) * 8.1}" cy="${18 + (j - 1) * 8.1}" r="2.7" fill="#fff"${on ? "" : ' fill-opacity=".28"'}/>`).join("")).join("")}</g>`,
  ember: (s) => `<g transform="scale(${s / 108})"><rect width="108" height="108" rx="26" fill="#000" stroke="#2a2018" stroke-width="2"/><circle cx="54" cy="54" r="46" fill="url(#lgw)"/><circle cx="54" cy="54" r="21" fill="url(#lgc)"/></g>`,
  apps: (s) => `<g transform="scale(${s / 36})"><rect width="36" height="36" rx="10" fill="#0E0E0E" stroke="#3a3a3a"/>${[[8, 8, "#FFFFFF"], [20, 8, "#FFD60A"], [8, 20, "#30D158"], [20, 20, "#FF7A1A"]].map(([x, y, c]) => `<rect x="${x}" y="${y}" width="8" height="8" rx="2.5" fill="${c}"/>`).join("")}</g>`,
};
const logoAt = (id, x, y, s) => `<g transform="translate(${x} ${y})">${LOGOS[id](s)}</g>`;

// ---------- проекты ----------
const P = [
  { id: "fitter", name: "FITTER", color: "#30D158", tag: "Telegram bot · AI", desc: "Snap a meal — AI counts calories and macros.", bullets: ["photo · text · barcode", "Mini App diary · AI assistant", "10 languages · Workers · Gemini"], link: "t.me/FitterFoodBot", ver: "3.0", lcd: ["1240", "KCAL"], chips: ["Telegram", "AI", "Free"] },
  { id: "okto", name: "Okto", color: "#FFFFFF", tag: "Planner · web + Android", desc: "Tasks, calendar, pomodoro and a home-screen widget.", bullets: ["free · no ads · 10 languages", "PWA · Android app + widget", "Svelte 5 · TypeScript · Firebase"], link: "sailxx.github.io/Okto", ver: "3.6.0", lcd: ["25:00", "FOCUS"], chips: ["Web", "Android", "Widget"] },
  { id: "oktonotes", name: "Okto Notes", color: "#FFD60A", tag: "Android · notes", desc: "Notes and a daily journal with mood and streaks.", bullets: ["offline · no ads · no account", "mood · daily streaks · photos", "Kotlin · Compose · 4 themes"], link: "github.com/sailxx/Okto-Notes", ver: "1.8", lcd: ["12", "DAY STREAK"], chips: ["Android", "Offline", "Journal"] },
  { id: "traymixer", name: "TrayMixer", color: "#4CC2FF", tag: "Windows 11 · tray", desc: "Every device and app volume in one Mica window.", bullets: ["per-app volume · brightness · mute", "no install · no admin · no network", "C# · ~2 MB RAM · 165 KB exe"], link: "github.com/sailxx/TrayMixer", ver: "2.1", lcd: ["72", "% VOLUME"], chips: ["Windows 11", "C#", "165 KB"] },
  { id: "apps", name: "All apps", color: "#BF5AF2", tag: "Home · all apps", desc: "Everything I ship, in one place.", bullets: ["Okto · Notes · Budila", "FITTER · TrayMixer", "web · Android · Windows 11"], link: "sailxx.github.io", ver: "", lcd: ["05", "APPS"], chips: ["Web", "Android", "Windows"] },
  { id: "budila", name: "Budila", color: "#FF7A1A", tag: "Android · alarm", desc: "Wake up on time. Get up gently.", bullets: ["no ads · offline · 1.6 MB", "gentle wake-up · tags · 17 themes", "Kotlin · Compose · 10 languages"], link: "github.com/sailxx/Budila", ver: "2.10", lcd: ["07:30", "NEXT ALARM"], chips: ["Android", "Offline", "Alarm"] },
];
const ME = { who: "Vlad · 16 y/o founder · Russia", title: "I build *useful products.*", sub: "AI bots, Android apps and minimal tools — idea → release.", tg: "@arkhitkovv" };

const LINK_ICON = '<path d="M7 17 17 7M9 7h8v8"/>';
const RED = "#EF5A5F";

// ---------- мини-экраны проектов (в их настоящих цветах) ----------
function mock(p, K, x, y, w, h) {
  const { T } = K;
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="#0A0A0A" stroke="#1F1F1F"/>`;
  const cx = x + w / 2, cy = y + h / 2;
  if (p.id === "fitter") {
    s += `<g transform="translate(${cx} ${cy})"><circle r="36" fill="none" stroke="#1d1d1d" stroke-width="9"/><g transform="rotate(-90)"><circle class="arc" r="36" fill="none" stroke="${p.color}" stroke-width="9" stroke-linecap="round" stroke-dasharray="226" stroke-dashoffset="70"/></g>
<text class="m" y="3" text-anchor="middle" font-size="15" font-weight="700">${T("1240")}</text><text class="m" y="17" text-anchor="middle" font-size="8" font-weight="600" letter-spacing="1" fill="#6E6E6E">${T("KCAL")}</text></g>`;
  } else if (p.id === "okto" || p.id === "budila") {
    const c = p.id === "okto" ? RED : p.color, [a, b] = p.id === "okto" ? ["25", "00"] : ["07", "30"];
    s += `<text class="m" x="${cx}" y="${cy + 14}" text-anchor="middle" font-size="40" font-weight="700" letter-spacing="-1.5" fill="#fff" fill-opacity=".05">${T("88:88")}</text>
<text class="m" x="${cx}" y="${cy + 14}" text-anchor="middle" font-size="40" font-weight="700" letter-spacing="-1.5" fill="${c}">${T(a)}<tspan class="blink">${T(":")}</tspan>${T(b)}</text>
${Array.from({ length: 10 }, (_, i) => `<rect x="${x + 14 + i * ((w - 28) / 10)}" y="${y + h - 20}" width="${(w - 28) / 10 - 3}" height="4" rx="1" fill="${i < 4 ? c : "#fff"}" fill-opacity="${i < 4 ? 1 : 0.12}"/>`).join("")}`;
  } else if (p.id === "oktonotes") {
    s += `<text class="m" x="${x + 14}" y="${y + 50}" font-size="34" font-weight="700" letter-spacing="-1" fill="${p.color}">${T("12")}</text><text class="m" x="${x + 64}" y="${y + 48}" font-size="9" font-weight="600" letter-spacing="1" fill="#8A8A8A">${T("DAYS")}</text>`;
    const q = Math.min((w - 28) / 7 - 4, 18);
    [0.35, 0.6, 1, 0.8, 1, 0.5, 1].forEach((m, i) => { s += `<rect x="${x + 14 + i * (q + 4)}" y="${y + h - 14 - q}" width="${q}" height="${q}" rx="4" fill="${p.color}" fill-opacity="${m}"/>`; });
  } else if (p.id === "traymixer") {
    [0.72, 0.45, 0.85].forEach((lv, i) => {
      const ry = y + 26 + i * ((h - 36) / 3), sx = x + 16, sw = w - 32, kx = sx + sw * lv;
      s += `<rect x="${sx}" y="${ry}" width="${sw}" height="4" rx="2" fill="#fff" fill-opacity=".2"/><rect x="${sx}" y="${ry}" width="${kx - sx}" height="4" rx="2" fill="${p.color}"/><circle cx="${kx}" cy="${ry + 2}" r="7" fill="#454545"/><circle cx="${kx}" cy="${ry + 2}" r="4" fill="${p.color}"/>`;
    });
  } else if (p.id === "apps") {
    const ids = ["okto", "oktonotes", "fitter", "traymixer", "budila", "okto"].slice(0, 5);
    const sz = 30, gap = 10, tw = 3 * sz + 2 * gap;
    ids.forEach((id, i) => { s += logoAt(id, x + (w - tw) / 2 + (i % 3) * (sz + gap) + (i >= 3 ? (sz + gap) / 2 : 0), y + (h - 2 * sz - gap) / 2 + Math.floor(i / 3) * (sz + gap), sz); });
  }
  return s;
}
const ARC = "<style>.arc{animation:arc 1.6s cubic-bezier(.2,.8,.2,1) .3s backwards}@keyframes arc{from{stroke-dashoffset:226}}@media (prefers-reduced-motion:reduce){.arc{animation:none}}</style>";

// Кнопка-ссылка внутри карточки
function linkPill(K, x, y, text, primary = true) {
  const w = Math.round(K.width(text, 12, 600, { mono: true }) + 52);
  const A = K.A;
  return { w, s: `<rect x="${x}" y="${y}" width="${w}" height="32" rx="10" fill="${primary ? A.hi : "#161616"}" stroke="${primary ? A.hi : "#333"}"/>
<g transform="translate(${x + 10} ${y + 6}) scale(.84)" fill="none" stroke="${primary ? A.on : "#fff"}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${LINK_ICON}</g>
<text class="m" x="${x + 36}" y="${y + 21}" font-size="12" font-weight="600" fill="${primary ? A.on : "#fff"}">${K.T(text)}</text>` };
}

// Карточка проекта: мини-экран, три пункта, кнопка-ссылка и версия.
// o: glow — свечение цвета проекта; pill — "accent" | "white" | "dark"; chev — цвет «›»; tint — тонированный фон и рамка;
//    line — цветная полоса сверху; mockTop — мини-экран во всю ширину сверху; name — имя цветом проекта.
function cardE(p, o) {
  const c = p.color;
  const K = kit(c);
  const { T, fitText, wrap, lines, delay, svg, chip } = K;
  const W = 430, H = o.mockTop ? 340 : 212;
  const chev = o.chev ? c : K.A.hi;
  let defs = `<linearGradient id="pl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${c}" stop-opacity="0"/><stop offset=".5" stop-color="${c}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></linearGradient>` +
    `<linearGradient id="nm" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${mix(c, "#FFFFFF", 0.45)}"/><stop offset="1" stop-color="${c}"/></linearGradient>`;
  let b = "";
  if (o.tint) b += `<rect width="${W}" height="${H}" rx="24" fill="${c}" fill-opacity=".06"/><rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="24" fill="none" stroke="${c}" stroke-opacity=".28"/>`;
  if (o.line) b += `<rect x="40" y="0" width="${W - 80}" height="2" fill="url(#pl)"/>`;
  let y0 = 24;
  if (o.mockTop) { b += `<g class="r">${mock(p, K, 24, 24, 382, 96)}</g>`; y0 = 140; }
  const nameFill = o.name ? "url(#nm)" : "#FFFFFF";
  b += `<g class="r" ${delay(1)}>${logoAt(p.id, 24, y0, 34)}<text x="68" y="${y0 + 23}" font-size="20" font-weight="800" letter-spacing="-.4" fill="${nameFill}">${T(p.name)}</text>
${fitText(68, y0 + 40, p.tag.toUpperCase(), 160, { size: 9.5, weight: 600, mono: true, spacing: 1.2, fill: "#6E6E6E" })}</g>`;
  if (o.mockTop) {
    b += `<g class="r" ${delay(2)}>${fitText(24, y0 + 72, p.desc, 382, { size: 15, weight: 700 })}</g>`;
    b += `<g class="r" ${delay(3)}>${p.bullets.slice(0, 2).map((t, i) => `<text class="m" x="24" y="${y0 + 100 + i * 21}" font-size="13" font-weight="700" fill="${chev}">›</text>` + fitText(40, y0 + 100 + i * 21, t, 366, { size: 13, weight: 500, fill: "#A3A3A3" })).join("")}</g>`;
  } else {
    b += `<g class="r" ${delay(2)}>${lines(24, 104, wrap(p.desc, 200, 15, 700), { size: 15, weight: 700, lh: 20 })}</g>`;
    b += `<g class="r" ${delay(1)}>${mock(p, K, 252, 24, 154, 112)}</g>`;
  }
  // кнопка-ссылка
  const py = H - 56;
  const text = p.link, w = Math.round(K.width(text, 12, 600, { mono: true }) + 52);
  const [bg, fg, st] = o.pill === "white" ? ["#FFFFFF", "#000", "#FFFFFF"] : o.pill === "dark" ? ["#161616", "#FFFFFF", "#333"] : [c, mix(c, "#000000", 0.85), c];
  const arrow = o.pill === "dark" ? c : fg;
  b += `<g class="r" ${delay(4)}><rect x="24" y="${py}" width="${w}" height="32" rx="10" fill="${bg}" stroke="${st}"/>
<g transform="translate(34 ${py + 6}) scale(.84)" fill="none" stroke="${arrow}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${LINK_ICON}</g>
<text class="m" x="60" y="${py + 21}" font-size="12" font-weight="600" fill="${fg}">${T(text)}</text>
${p.ver ? chip(406 - K.width("V" + p.ver, 12, 600, { mono: true, ls: 1 }) - 28, py + 1, "v" + p.ver).s : ""}</g>`;
  return svg(W, H, `${p.name}: ${p.desc}`, b + ARC, defs);
}

// Шапка в стиле neofetch: пиксельный персонаж с кофе слева, строки «ключ ..... значение» справа
const PIX = { H: "#2a1a12", h: "#4d3224", S: "#f1c6a0", s: "#d9a47c", p: "#e99a8a", E: "#161616", W: "#463d38", w: "#2c2622", M: "#f2f4ef", m: "#c4c9bd", C: "#6b3f22", J: "#3d5a8a", j: "#2d4468", B: "#e8ebe4", b: "#a3aa9c" };
function character(x0, y0, px) {
  let out = "";
  fs.readFileSync("hero-char.txt", "utf8").trimEnd().split(/\r?\n/).forEach((row, y) => {
    for (let x = 0; x < row.length; ) {
      const c = row[x];
      let n = 1;
      while (row[x + n] === c) n++;
      if (c !== ".") out += `<rect${c === "E" ? ' class="eye"' : ""} x="${x0 + x * px}" y="${y0 + y * px}" width="${n * px}" height="${px}" fill="${PIX[c]}"/>`;
      x += n;
    }
  });
  return out;
}
const INFO = [
  ["#", "vlad@sailxx"],
  ["OS", "Windows 11, Fedora Linux"], ["Uptime", "16 years"], ["Host", "Founder @ sailxx"], ["IDE", "VS Code, Android Studio"], ["Fuel", "coffee, then code"],
  ["-"],
  ["Languages.Programming", "JavaScript, TypeScript, Kotlin, C#"], ["Languages.Computer", "HTML, CSS, JSON, SVG"], ["Languages.Real", "Russian, English, Italian"],
  ["-"],
  ["Hobbies.Software", "UI design, games"], ["Hobbies.Hardware", "PC building"],
  ["#", "Projects"],
  ["Now", "FITTER 3.0"], ["Also", "Okto, Okto Notes, TrayMixer, Budila, Flipt, Ember"],
  ["#", "Contact"],
  ["Telegram", "@arkhitkovv", true], ["GitHub", "github.com/sailxx"], ["LeetCode", "u/qXESYLd6R6"],
  ["#", "GitHub Stats"],
  ["Repos", "17"], ["Stars", "15"], ["Commits", "607"],
];
function heroNeo() {
  const K = kit("#F2B84B");
  const { width, fitText, delay, svg } = K;
  const H = 64 + INFO.reduce((n, r) => n + (r[0] === "-" ? 12 : r[0] === "#" ? 33 : 21), 0) - 9 + 36, X0 = 296, X1 = 840, SZ = 13, STEP = 21, PX = 8;
  const hi = K.A.hi, sub = mix(hi, "#FFFFFF", 0.35);
  let b = `<style>.eye{transform-box:fill-box;transform-origin:center;animation:eyeb 5s infinite}.st{fill:#cfd4c8;opacity:0;animation:steam 3.2s ease-out infinite}.s2{animation-delay:1s}.s3{animation-delay:2s}.bob{animation:bob 3.2s ease-in-out infinite}
@keyframes eyeb{0%,94%,100%{transform:scaleY(1)}97%{transform:scaleY(.1)}}@keyframes steam{0%{opacity:0;transform:translate(0,0)}20%{opacity:.8}100%{opacity:0;transform:translate(6px,-44px)}}@keyframes bob{50%{transform:translateY(3px)}}
@media (prefers-reduced-motion:reduce){.eye,.st,.bob{animation:none}.st{opacity:.5}}</style>`;
  const cx = 40, cy = 84; // персонаж 24×36 клеток
  b += `<ellipse cx="${cx + 12 * PX}" cy="${cy + 36 * PX + 8}" rx="${10 * PX}" ry="9" fill="#000" fill-opacity=".55"/>`;
  b += `<g shape-rendering="crispEdges" class="r"><g class="bob">${character(cx, cy, PX)}</g>`;
  const mx = cx + 16 * PX, my = cy + 10 * PX; // кружка: колонки 16–21, ряд 10
  b += [[mx + 24, my - 12, ""], [mx + 40, my - 20, "s2"], [mx + 32, my - 8, "s3"]].map(([x, y, c]) => `<rect class="st ${c}" x="${x}" y="${y}" width="${PX}" height="${PX}"/>`).join("") + `</g>`;
  b += `<rect x="268" y="40" width="1" height="${H - 80}" fill="#fff" fill-opacity=".09"/>`;
  let y = 64, i = 0;
  for (const [k, v, em] of INFO) {
    if (k === "-") { y += 12; continue; }
    const d = delay(2 + i++ * 0.5);
    if (k === "#") {
      if (y > 64) y += 12;
      const w = width(v, SZ, 800, { mono: true });
      b += `<g class="r" ${d}>${fitText(X0, y, v, 400, { size: SZ, weight: 800, mono: true, fill: hi })}<line x1="${(X0 + w + 12).toFixed(1)}" y1="${y - 4}" x2="${X1}" y2="${y - 4}" stroke="${hi}" stroke-opacity=".28"/></g>`;
    } else {
      const kw = width(k, SZ, 600, { mono: true }), vw = width(v, SZ, 500, { mono: true });
      b += `<g class="r" ${d}>${fitText(X0, y, k, 200, { size: SZ, weight: 600, mono: true, fill: sub })}${fitText(X1, y, v, 400, { size: SZ, weight: em ? 700 : 500, mono: true, fill: em ? hi : "#FFFFFF", anchor: "end" })}<line x1="${(X0 + kw + 10).toFixed(1)}" y1="${y - 3}" x2="${(X1 - vw - 10).toFixed(1)}" y2="${y - 3}" stroke="#4a4a4a" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="0.1 5"/></g>`;
    }
    y += STEP;
  }
  const tint = `<rect width="880" height="${H}" rx="24" fill="${hi}" fill-opacity=".05"/><rect x=".5" y=".5" width="879" height="${H - 1}" rx="24" fill="none" stroke="${hi}" stroke-opacity=".25"/>`;
  return svg(880, H, "vlad@sailxx: Vlad, 16 y/o founder from Russia. AI bots, Android apps and minimal tools. Runs on coffee.", tint + b);
}

// Изометрическая сетка: weeks — колонки по 7 дней {weekday, contributionCount}; shade — 5 цветов от пустого к максимуму
function isoCells(weeks, shade) {
  const max = Math.max(...weeks.flat().map((d) => d.contributionCount), 1);
  const W = [14.2, 5.9], D = [5, -2.8], OX = 36, OY = 112, MAXH = 62;
  const lvl = (n) => (n === 0 ? 0 : Math.min(4, Math.ceil(Math.sqrt(n / max) * 4)));
  const pt = (i, j, h = 0) => [OX + i * W[0] + j * D[0], OY + i * W[1] + j * D[1] - h];
  const poly = (pts, fill, stroke) => `<polygon points="${pts.map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" ")}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width=".6"` : ""}/>`;
  let cells = "";
  weeks.forEach((wk, i) => {
    [...wk].reverse().forEach((d) => {
      const j = d.weekday, n = d.contributionCount, h = n ? 5 + Math.sqrt(n / max) * MAXH : 0;
      const a = pt(i, j), b = pt(i + 0.88, j), c = pt(i + 0.88, j + 0.88), dd = pt(i, j + 0.88);
      if (!n) { cells += poly([a, b, c, dd], "#262626", "#3a3a3a"); return; }
      const col = shade[lvl(n)], at = pt(i, j, h), bt = pt(i + 0.88, j, h), ct = pt(i + 0.88, j + 0.88, h), dt = pt(i, j + 0.88, h);
      cells += poly([a, b, bt, at], mix(col, "#000000", 0.35)) + poly([b, c, ct, bt], mix(col, "#000000", 0.55)) + poly([at, bt, ct, dt], col);
    });
  });
  return cells;
}
const lite = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="#FBF6EA" stroke="#E6D9B8"/>`;

// LeetCode: решённые задачи и календарь отправок (публичный GraphQL, без входа)
async function leetData(user) {
  const q = "query($u:String!){allQuestionsCount{difficulty count} matchedUser(username:$u){submitStats{acSubmissionNum{difficulty count submissions}} userCalendar{totalActiveDays submissionCalendar}}}";
  const r = await fetch("https://leetcode.com/graphql", { method: "POST", headers: { "content-type": "application/json", referer: "https://leetcode.com" }, body: JSON.stringify({ query: q, variables: { u: user } }) });
  const d = (await r.json()).data;
  const by = (arr, k) => Object.fromEntries(arr.map((x) => [x.difficulty, x[k]]));
  const cal = JSON.parse(d.matchedUser.userCalendar.submissionCalendar || "{}");
  const today = new Date(); today.setUTCHours(0, 0, 0, 0);
  const start = new Date(today); start.setUTCDate(start.getUTCDate() - 364 - today.getUTCDay());
  const weeks = [];
  for (let w = 0, t = new Date(start); t <= today; w++) {
    const wk = [];
    for (let j = 0; j < 7 && t <= today; j++, t.setUTCDate(t.getUTCDate() + 1)) wk.push({ weekday: j, date: t.toISOString().slice(0, 10), contributionCount: Object.entries(cal).filter(([ts]) => new Date(ts * 1000).toISOString().slice(0, 10) === t.toISOString().slice(0, 10)).reduce((s, [, c]) => s + c, 0) });
    weeks.push(wk);
  }
  const days = weeks.flat();
  let run = 0, maxRun = 0;
  days.forEach((x) => { run = x.contributionCount ? run + 1 : 0; maxRun = Math.max(maxRun, run); });
  const solved = by(d.matchedUser.submitStats.acSubmissionNum, "count"), subs = by(d.matchedUser.submitStats.acSubmissionNum, "submissions"), all = by(d.allQuestionsCount, "count");
  return { weeks, solved, all, active: d.matchedUser.userCalendar.totalActiveDays, maxRun, submissions: days.reduce((s, x) => s + x.contributionCount, 0), subs };
}
function leetSvg(L, user) {
  const K = kit("#FFA116");
  const { T, fitText, delay, svg } = K;
  const hi = K.A.hi, sub = mix(hi, "#FFFFFF", 0.35), dark = "#B45F06";
  const H = 460;
  const big = (x, y, v, lab, sm, w = 110) => `<text x="${x}" y="${y}" font-size="24" font-weight="800" fill="${dark}">${T(String(v))}</text>${fitText(x, y + 17, lab, w, { size: 11, weight: 700, fill: "#16130D" })}${fitText(x, y + 32, sm, w + 20, { size: 10, fill: "#8A8372" })}`;
  const R = 44, C = 2 * Math.PI * R, frac = L.solved.All / (L.all.All || 1);
  const row = (y, name, color) => `<text x="708" y="${y}" font-size="11" font-weight="700" fill="${color}">${T(name)}</text><text x="708" y="${y + 17}" font-size="16" font-weight="800" fill="#16130D">${T(String(L.solved[name]))}<tspan font-size="11" font-weight="500" fill="#8A8372"> / ${T(String(L.all[name]))}</tspan></text>`;
  let b = `<g class="r">${isoCells(L.weeks, ["#262626", "#6b3a10", "#a85a14", "#e07a1a", hi])}</g>`;
  b += `<g class="r">${fitText(40, 52, "› leetcode submissions --visualize", 440, { size: 14, weight: 600, mono: true, fill: sub })}</g>`;
  b += `<g class="r" ${delay(2)}>${fitText(556, 40, "Problems Solved", 200, { size: 13, weight: 700 })}${lite(556, 52, 288, 144)}
<g transform="translate(626 124)"><circle r="${R}" fill="none" stroke="#EFE3CC" stroke-width="8"/>${frac ? `<circle r="${R}" fill="none" stroke="${dark}" stroke-width="8" stroke-linecap="round" stroke-dasharray="${(C * frac).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90)"/>` : ""}
<text y="4" text-anchor="middle" font-size="26" font-weight="800" fill="${dark}">${T(String(L.solved.All))}</text>${fitText(0, 20, "Solved", 60, { size: 11, weight: 700, fill: "#16130D", anchor: "middle" })}</g>
${row(84, "Easy", "#1C8C8C")}${row(120, "Medium", dark)}${row(156, "Hard", "#C0392B")}
${fitText(844, 216, `${L.submissions} submissions in 365 days`, 260, { size: 11, fill: "#6E6E6E", anchor: "end" })}</g>`;
  b += `<g class="r" ${delay(3)}>${fitText(30, H - 100, "Activity", 120, { size: 13, weight: 700 })}${lite(30, H - 90, 262, 78)}${big(48, H - 58, L.active, "Active Days", "Last 365 days")}${big(166, H - 58, L.maxRun, "Max Streak", "Consecutive days")}</g>`;
  b += fitText(846, H - 14, `@${user}`, 160, { size: 10, fill: "#4a4a4a", anchor: "end" });
  const tint = `<rect width="880" height="${H}" rx="24" fill="${hi}" fill-opacity=".04"/><rect x=".5" y=".5" width="879" height="${H - 1}" rx="24" fill="none" stroke="${hi}" stroke-opacity=".22"/>`;
  return svg(880, H, `leetcode: ${L.solved.All} of ${L.all.All} problems solved`, tint + b);
}

// Изометрические «башни» вкладов за год (данные — gh api graphql, нужен вход в gh)
function contribData() {
  const q = 'query{user(login:"sailxx"){contributionsCollection{contributionCalendar{totalContributions weeks{contributionDays{date contributionCount weekday}}}}}}';
  const cal = JSON.parse(execFileSync("gh", ["api", "graphql", "-f", `query=${q}`], { encoding: "utf8" })).data.user.contributionsCollection.contributionCalendar;
  return { weeks: cal.weeks.map((w) => w.contributionDays), total: cal.totalContributions };
}
const fmtD = (d) => new Date(d + "T00:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
function contribSvg() {
  const K = kit("#F2B84B");
  const { T, fitText, delay, svg, card, width } = K;
  const { weeks, total } = contribData();
  const days = weeks.flat();
  const hi = K.A.hi, sub = mix(hi, "#FFFFFF", 0.35);
  const max = Math.max(...days.map((d) => d.contributionCount), 1); // для Best day
  const best = days.reduce((a, d) => (d.contributionCount > a.contributionCount ? d : a), days[0]);
  const last7 = days.slice(-7).reduce((s, d) => s + d.contributionCount, 0);
  let longest = [0, 0, 0], run = 0;
  days.forEach((d, i) => { run = d.contributionCount ? run + 1 : 0; if (run > longest[0]) longest = [run, i - run + 1, i]; });
  let e = days.length - 1;
  if (!days[e].contributionCount) e--;
  let s0 = e;
  while (s0 >= 0 && days[s0].contributionCount) s0--;
  const cur = e - s0;
  const shade = ["#1b1b1b", "#5e4513", "#93701d", "#c9952b", hi];
  const cells = isoCells(weeks, shade);
  const H = 460;
  let b = `<g class="r" shape-rendering="geometricPrecision">${cells}</g>`;
  b += `<g class="r">${fitText(40, 52, "› git contributions --visualize", 400, { size: 14, weight: 600, mono: true, fill: sub })}</g>`;
  const stat = (x, y, big, lab, sm) => `<text x="${x}" y="${y}" font-size="24" font-weight="800" fill="#B7770A">${T(String(big))}</text>${fitText(x, y + 17, lab, 110, { size: 11, weight: 700, fill: "#16130D" })}${fitText(x, y + 32, sm, 130, { size: 10, fill: "#8A8372" })}`;
  const rng = `${fmtD(days[0].date)} → ${fmtD(days[days.length - 1].date)}`;
  b += `<g class="r" ${delay(2)}>${fitText(556, 40, "Contributions", 200, { size: 13, weight: 700 })}${lite(556, 52, 288, 78)}${stat(574, 84, total, "Total", rng)}${stat(676, 84, last7, "This week", "last 7 days")}${stat(768, 84, best.contributionCount, "Best day", fmtD(best.date))}${fitText(844, 148, `Average: ${(total / days.length).toFixed(2)} / day`, 220, { size: 11, fill: "#6E6E6E", anchor: "end" })}</g>`;
  b += `<g class="r" ${delay(3)}>${fitText(30, H - 100, "Streaks", 120, { size: 13, weight: 700 })}${lite(30, H - 90, 262, 78)}${stat(48, H - 58, `${longest[0]} days`, "Longest", `${fmtD(days[longest[1]].date)} → ${fmtD(days[longest[2]].date)}`)}${stat(166, H - 58, `${cur} days`, "Current", cur ? `${fmtD(days[s0 + 1].date)} → ${fmtD(days[e].date)}` : "-")}</g>`;
  b += fitText(846, H - 14, "@sailxx", 100, { size: 10, fill: "#4a4a4a", anchor: "end" });
  const tint = `<rect width="880" height="${H}" rx="24" fill="${hi}" fill-opacity=".04"/><rect x=".5" y=".5" width="879" height="${H - 1}" rx="24" fill="none" stroke="${hi}" stroke-opacity=".22"/>`;
  return svg(880, H, `git contributions: ${total} contributions in the last year`, tint + b);
}

function footer(color, mode) {
  const K = kit(color);
  const { T, fitText, delay, svg, chip, lines, wrap } = K;
  const c = chip(40, 27, "say hi", { check: true });
  let b = `<g class="r">${c.s}</g>`;
  b += `<g class="r" ${delay(1)}>${lines(40 + c.w + 20, 51, wrap("*" + ME.tg + "*", 500, 28, 800), { size: 28, weight: 800, lh: 32, spacing: "-.8" })}</g>`;
  const pill = linkPill(K, 0, 26, "t.me/arkhitkovv", mode !== "dark");
  b += `<g class="r" ${delay(2)}><g transform="translate(${840 - pill.w} 0)">${pill.s}</g></g>`;
  return svg(880, 84, "Say hi on Telegram: @arkhitkovv", b);
}


// ---------- сборка: цвет проекта в свечении, фоне, рамке, имени и кнопке ----------
const CARD = { pill: "accent", chev: true, tint: true, name: true };
const HERO = { glow: true, tint: true, rainbow: true };
fs.mkdirSync(OUT, { recursive: true });
const LEET_USER = "qXESYLd6R6";
const LEET = await leetData(LEET_USER);
const jobs = [["hero.svg", () => heroNeo(), "#F2B84B"], ...P.map((p) => [`${p.id}.svg`, () => cardE(p, CARD), p.color]), ["contrib.svg", () => contribSvg(), "#F2B84B"], ["leetcode.svg", () => leetSvg(LEET, LEET_USER), "#FFA116"], ["footer.svg", () => footer("#F2B84B"), "#F2B84B"]];
for (const [name, render, color] of jobs) await kit(color).build(OUT, { [name]: () => ({ [name]: render() }) });
console.log(`логотипов: ${buildLogos(OUT + "/logos", LOGOS)}`);
console.log(`${jobs.length} файлов → ${OUT}`);
