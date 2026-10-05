// Собирает SVG-карточки профиля: подставляет JetBrains Mono (woff2, base64) вместо {{FONT}}.
// Шрифт: https://github.com/JetBrains/JetBrainsMono (OFL-1.1) → .fontsrc/JetBrainsMono-Var.woff2
// Запуск: node build.mjs
import fs from "node:fs";
const font = fs.readFileSync(".fontsrc/JetBrainsMono-Var.woff2").toString("base64");
const face = `@font-face{font-family:"JBM";src:url(data:font/woff2;base64,${font}) format("woff2");font-weight:100 800}`;
for (const f of fs.readdirSync("src").filter((x) => x.endsWith(".svg"))) {
  fs.writeFileSync("assets/" + f, fs.readFileSync("src/" + f, "utf8").replace("{{FONT}}", face));
  console.log("assets/" + f);
}
