// Кликабельные логотипы проектов: assets/logos/<id>.svg (64×64, скруглённые). Источники — в logos-src/ и в LOGOS из build.mjs.
// Запуск через build.mjs.
import fs from "node:fs";

export const PROJECTS = [
  ["okto", "Okto", "Okto"], ["oktonotes", "Okto Notes", "Okto-Notes"], ["fitter", "FITTER", "FITTER-AI"],
  ["traymixer", "TrayMixer", "TrayMixer"], ["budila", "Budila", "Budila"], ["flipt", "Flipt", "Flipt"],
  ["ember", "Ember", "Ember"], ["calc", "Okto Calculator", "Okto-Calculator"], ["lifekalendar", "LifeKalendar", "LifeKalendar"],
  ["marks", "Marks", "Marks"],
  ["arhitector", "Arhitector AI", "Arhitector-AI"]
];

const dots = (n, on) => { let s = ""; for (let j = 0; j < 3; j++) for (let i = 0; i < 5; i++) { const k = j * 5 + i; s += `<circle cx="${33 + i * 9 + 3}" cy="${40.5 + j * 9}" r="3" fill="${on(k)}"/>`; } return s; };
const EXTRA = {
  calc: `<rect width="108" height="108" fill="#0E0E0E"/><path fill="#2A2A2A" d="M33,43a10,10 0,1 1,20,0a10,10 0,1 1,-20,0zM55,43a10,10 0,1 1,20,0a10,10 0,1 1,-20,0zM33,65a10,10 0,1 1,20,0a10,10 0,1 1,-20,0z"/><path fill="#FF7A1A" d="M55,65a10,10 0,1 1,20,0a10,10 0,1 1,-20,0z"/><path fill="none" stroke="#F2F2F2" stroke-width="2.6" stroke-linecap="round" d="M38.5,43h9M43,38.5v9M60.5,43h9M39.8,61.8l6.4,6.4M46.2,61.8l-6.4,6.4"/><path fill="#140A00" d="M61.7,61.1h6.6a1.2,1.2 0,0 1,0 2.4h-6.6a1.2,1.2 0,0 1,0 -2.4zM61.7,66.5h6.6a1.2,1.2 0,0 1,0 2.4h-6.6a1.2,1.2 0,0 1,0 -2.4z"/>`,
  lifekalendar: `<rect width="108" height="108" fill="#1C1C1E"/>` + dots(0, (k) => (k === 8 ? "#FF5A1F" : k < 8 ? "#F2F2F2" : "#FFFFFF4D")),
};
EXTRA.marks = `<rect width="108" height="108" fill="#0E0E0E"/><path d="M36 26h36a3 3 0 0 1 3 3v53L54 68 33 82V29a3 3 0 0 1 3-3z" fill="#fff"/>`;
const RASTER = { traymixer: "traymixer.png", flipt: "flipt.png" };
const SVGS = { okto: "okto.svg", vscode: "vscode.svg", arhitector: "arh.svg" };

export function buildLogos(out, LOGOS) {
  fs.mkdirSync(out, { recursive: true });
  const wrap = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 64 64" width="64" height="64"><clipPath id="c"><rect width="64" height="64" rx="15"/></clipPath><g clip-path="url(#c)">${inner}</g></svg>`;
  for (const [id] of PROJECTS) {
    let inner;
    if (RASTER[id]) inner = `<image width="64" height="64" href="data:image/png;base64,${fs.readFileSync(`logos-src/${RASTER[id]}`).toString("base64")}"/>`;
    else if (SVGS[id]) { const t = fs.readFileSync(`logos-src/${SVGS[id]}`, "utf8"); const vb = t.match(/viewBox="([^"]+)"/)[1]; inner = t.replace(/<svg[^>]*>/, `<svg x="0" y="0" width="64" height="64" viewBox="${vb}" preserveAspectRatio="none">`); }
    else if (EXTRA[id]) inner = `<svg width="64" height="64" viewBox="0 0 108 108">${EXTRA[id]}</svg>`;
    else if (id !== "ember" && LOGOS[id === "site" ? "apps" : id]) inner = LOGOS[id === "site" ? "apps" : id](64);
    else if (id === "ember") inner = `<svg width="64" height="64" viewBox="0 0 108 108"><defs><radialGradient id="lgw" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FF6A1F" stop-opacity=".75"/><stop offset="1" stop-color="#FF6A1F" stop-opacity="0"/></radialGradient><radialGradient id="lgc" cx=".5" cy=".42" r=".6"><stop offset="0" stop-color="#FFF2D6"/><stop offset=".35" stop-color="#FFB23E"/><stop offset="1" stop-color="#FF6A1F"/></radialGradient></defs><rect width="108" height="108" fill="#000"/><circle cx="54" cy="54" r="46" fill="url(#lgw)"/><circle cx="54" cy="54" r="21" fill="url(#lgc)"/></svg>`;
    fs.writeFileSync(`${out}/${id}.svg`, wrap(inner));
  }
  return PROJECTS.length;
}
