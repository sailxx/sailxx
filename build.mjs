// SVG-карточки профиля в стиле Okto Calc: чёрный фон, свечения, Golos Text + JetBrains Mono (урезаются под текст).
// Шрифты (OFL-1.1) положить в .fontsrc/: golos.ttf (Golos Text) и jbmono.ttf (JetBrains Mono).
// Запуск: npm install && node build.mjs [--out папка]
import fs from "node:fs";
import path from "node:path";
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
  fitter: (s) => `<g transform="scale(${s / 36})"><rect width="36" height="36" rx="10" fill="#30D158"/><g transform="translate(6 6)" fill="none" stroke="#03210C" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8V6.5a3 3 0 0 1 3-3H8"/><path d="M16 3.5h1.5a3 3 0 0 1 3 3V8"/><path d="M20.5 16v1.5a3 3 0 0 1-3 3H16"/><path d="M8 20.5H6.5a3 3 0 0 1-3-3V16"/><path d="M12 9.3c-1.2-.9-3.9-1.1-4.4 1.9-.4 2.4 1.2 5.4 2.9 5.4.6 0 1-.3 1.5-.3s.9.3 1.5.3c1.7 0 3.3-3 2.9-5.4-.5-3-3.2-2.8-4.4-1.9z"/><path d="M12 9.3c0-1.3.6-2.2 1.7-2.6"/></g></g>`,
  traymixer: (s) => {
    let g = `<rect width="36" height="36" rx="10" fill="#0E0E0E" stroke="#3a3a3a"/>`;
    [[9, 0.72], [18, 0.3], [27, 0.55]].forEach(([y, lv]) => {
      const kx = 8 + 20 * lv;
      g += `<rect x="6" y="${y - 1.2}" width="24" height="2.4" rx="1.2" fill="#fff" fill-opacity=".35"/><rect x="6" y="${y - 1.2}" width="${kx - 6}" height="2.4" rx="1.2" fill="#4CC2FF"/><circle cx="${kx}" cy="${y}" r="3.6" fill="#fff"/><circle cx="${kx}" cy="${y}" r="1.6" fill="#4CC2FF"/>`;
    });
    return `<g transform="scale(${s / 36})">${g}</g>`;
  },
  budila: (s) => `<g transform="scale(${s / 108})"><rect width="108" height="108" rx="30" fill="#000" stroke="#3a3a3a" stroke-width="3"/><g transform="translate(54 54) scale(1.25) translate(-54 -56)" fill="none" stroke-width="3.6" stroke-linecap="round"><path d="M54,41L54,35M61.5,43.01L64.5,37.81M66.99,48.5L72.19,45.5M69,56L75,56M66.99,63.5L72.19,66.5M61.5,68.99L64.5,74.19M54,71L54,77M46.5,68.99L43.5,74.19" stroke="#FF6A00"/><path d="M41.01,63.5L35.81,66.5M39,56L33,56M41.01,48.5L35.81,45.5M46.5,43.01L43.5,37.81" stroke="#3A3A3A"/><path d="M54,56L54,45.5M54,56L50,62.9" stroke="#fff"/></g><circle cx="54" cy="54" r="3.2" fill="#fff"/></g>`,
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
  ["Role", "founder & creator"], ["Age", "16 y/o"], ["Based", "Russia"], ["Fuel", "coffee, then code"],
  ["#", "Stack"],
  ["Web", "Svelte 5, TypeScript, Cloudflare Workers"], ["Android", "Kotlin, Jetpack Compose"], ["Windows", "C#, WinForms"], ["AI", "Gemini"],
  ["#", "Projects"],
  ["Now", "FITTER 3.0"], ["Also", "Okto, Okto Notes, TrayMixer, Budila, Flipt, Ember"], ["Rules", "free, offline-first, no ads"],
  ["#", "Contact"],
  ["Telegram", "@arkhitkovv", true], ["GitHub", "github.com/sailxx"],
];
function heroNeo() {
  const K = kit("#F2B84B");
  const { width, fitText, delay, svg } = K;
  const H = 476, X0 = 296, X1 = 840, SZ = 13, STEP = 21, PX = 8;
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
const jobs = [["hero.svg", () => heroNeo(), "#F2B84B"], ...P.map((p) => [`${p.id}.svg`, () => cardE(p, CARD), p.color]), ["footer.svg", () => footer("#F2B84B"), "#F2B84B"]];
for (const [name, render, color] of jobs) await kit(color).build(OUT, { [name]: () => ({ [name]: render() }) });
console.log(`логотипов: ${buildLogos(OUT + "/logos", LOGOS)}`);
console.log(`${jobs.length} файлов → ${OUT}`);
