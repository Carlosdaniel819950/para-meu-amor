// Servidor Node/Express com proteção por senha via variável de ambiente.
// As imagens ficam fora do GitHub se você não as versionar; o servidor entrega somente após autenticação.

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const SITE_PASSWORDS = (process.env.SITE_PASSWORDS || '').split(',').map(s => s.trim()).filter(Boolean);
// Ex.: SITE_PASSWORDS="13/09/2025,14/09/2025,13092025,14092025,amor"

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Página de login simples no servidor (sem expor senha no front)
app.get('/login', (req, res) => {
  res.send(`<!DOCTYPE html>
  <html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Entrar</title>
  <style>body{margin:0;font-family:system-ui,Segoe UI,Arial;background:#000;color:#fff;display:grid;place-items:center;min-height:100svh}
  .card{background:#111a;border:1px solid #fff2;border-radius:14px;padding:18px 16px;backdrop-filter:blur(6px);width:min(92vw,380px)}
  input,button{width:100%;padding:10px 12px;border-radius:10px;border:1px solid #fff3;background:#fff1;color:#fff}
  button{margin-top:10px;background:#ff4d6d;border-color:#ff4d6d}
  p{opacity:.9}
  </style></head><body>
  <form class="card" method="post" action="/login">
    <h1 style="margin:0 0 6px">Para meu amor</h1>
    <p style="margin:0 0 12px">A senha é o dia que a gente se conheceu.</p>
    <input name="password" type="password" placeholder="dd/mm/aaaa" autofocus required>
    <button type="submit">Entrar</button>
  </form>
  </body></html>`);
});

// Recebe senha e grava cookie de sessão simples
app.post('/login', (req, res) => {
  const pwd = String(req.body.password || '').trim();
  const normalize = (v) => v.replace(/[\-.]/g, '/').replace(/\s+/g, '').replace(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, (m, d, mo, y) => `${d.padStart(2,'0')}/${mo.padStart(2,'0')}/${y}`);
  const value = normalize(pwd);
  const ok = SITE_PASSWORDS.includes(value);
  if (!ok) return res.redirect('/login');
  res.cookie('auth', '1', { httpOnly: true, sameSite: 'lax' });
  res.redirect('/');
});

// Middleware de proteção: exige cookie
app.use((req, res, next) => {
  if (req.path.startsWith('/public/')) return next();
  if (req.cookies && req.cookies.auth === '1') return next();
  if (req.path === '/login') return next();
  return res.redirect('/login');
});

// Arquivos estáticos do site (index.private.html renomeado para index.html nesta pasta privada)
// Estruture suas fotos em ./assets e NÃO versione essa pasta no Git.
app.use(express.static(path.join(__dirname)));

app.listen(PORT, () => {
  console.log(`Servidor no ar em http://localhost:${PORT}`);
});


