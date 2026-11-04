// Screenshots der lokalen Vorschau mit echten Klicks und Hover (Chrome über das DevTools-Protokoll).
// node scripts/shot.mjs <ordner> <breite> <höhe> name=<js> [name=<js> …]   (Vorschau muss laufen: npx astro preview --port 4321 --host 127.0.0.1)
// Im JS stehen d (document), w (window), y(selektor) und hover(selektor) bereit; "return hover(…)" bewegt die Maus dorthin.
// Beispiel: node scripts/shot.mjs .shots 1440 900 equal='w.scrollTo(0,y(".areas"))' open='w.scrollTo(0,y(".areas"));d.getElementById("dev-toggle").click()'
import { spawn } from 'node:child_process';
import { writeFileSync, mkdtempSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const [outDir, W, H, ...shots] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });
const URL = process.env.URL ?? 'http://127.0.0.1:4321/';
const port = 9300 + Math.floor(Math.random() * 500);
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${port}`,
  `--user-data-dir=${mkdtempSync(path.join(tmpdir(), 'cdp-'))}`, `--window-size=${W},${H}`, 'about:blank',
], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let ws;
for (let i = 0; i < 50 && !ws; i++) {
  try {
    const list = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
    const page = list.find((t) => t.type === 'page');
    if (page) ws = new WebSocket(page.webSocketDebuggerUrl);
  } catch { await sleep(200); }
}
await new Promise((r) => ws.addEventListener('open', r));
let id = 0; const pending = new Map();
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } });
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });

await send('Emulation.setDeviceMetricsOverride', { width: +W, height: +H, deviceScaleFactor: 1, mobile: +W < 600 });
await send('Page.enable');
for (const shot of shots) {
  const eq = shot.indexOf('=');
  const name = shot.slice(0, eq), js = shot.slice(eq + 1);
  await send('Page.navigate', { url: URL });
  await sleep(1500);
  if (js) {
    const r = await send('Runtime.evaluate', { expression: `(async()=>{const d=document,w=window;d.documentElement.style.scrollBehavior='auto';const y=s=>d.querySelector(s).getBoundingClientRect().top+w.scrollY;const hover=(s)=>{const b=d.querySelector(s).getBoundingClientRect();return JSON.stringify({x:b.left+b.width/2,y:b.top+b.height/2})};${js}})()`, awaitPromise: true, returnByValue: true });
    const v = r.result?.result?.value;
    if (typeof v === 'string' && v.startsWith('{')) { const { x, y } = JSON.parse(v); await sleep(300); await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y }); }
  }
  await sleep(1800);
  const { result } = await send('Page.captureScreenshot', { format: 'png' });
  const file = path.join(outDir, `${name}.png`);
  writeFileSync(file, Buffer.from(result.data, 'base64'));
  console.log(file);
}
ws.close(); chrome.kill();
