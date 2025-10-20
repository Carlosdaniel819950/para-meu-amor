const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const SITE_PASSWORDS = (process.env.SITE_PASSWORDS || '13/09/2025,14/09/2025,13092025,14092025').split(',').map(s => s.trim()).filter(Boolean);

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Middleware de proteção
app.use((req, res, next) => {
  // Permitir arquivos estáticos
  if (req.path.startsWith('/assets/') || req.path.endsWith('.css') || req.path.endsWith('.js')) {
    return next();
  }
  
  // Permitir login
  if (req.path === '/login') {
    return next();
  }
  
  // Verificar autenticação
  if (req.cookies && req.cookies.auth === '1') {
    return next();
  }
  
  // Redirecionar para login
  return res.redirect('/login');
});

// Página de login
app.get('/login', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Para meu amor</title>
  <style>
    body { margin:0; font-family:system-ui,Segoe UI,Arial; background:#000; color:#fff; display:grid; place-items:center; min-height:100svh }
    .card { background:#111a; border:1px solid #fff2; border-radius:14px; padding:18px 16px; backdrop-filter:blur(6px); width:min(92vw,380px) }
    input,button { width:100%; padding:10px 12px; border-radius:10px; border:1px solid #fff3; background:#fff1; color:#fff; font-family:inherit }
    button { margin-top:10px; background:#ff4d6d; border-color:#ff4d6d; cursor:pointer }
    button:hover { background:#ff6b8a }
    p { opacity:.9; margin:0 0 12px }
    h1 { margin:0 0 6px }
  </style>
</head>
<body>
  <form class="card" method="post" action="/login">
    <h1>Para meu amor</h1>
    <p>A senha é o dia que a gente se conheceu.</p>
    <input name="password" type="password" placeholder="dd/mm/aaaa" autofocus required>
    <button type="submit">Entrar</button>
  </form>
</body>
</html>`);
});

// Processar login
app.post('/login', (req, res) => {
  const pwd = String(req.body.password || '').trim();
  const normalize = (v) => v.replace(/[\-.]/g, '/').replace(/\s+/g, '').replace(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, (m, d, mo, y) => `${d.padStart(2,'0')}/${mo.padStart(2,'0')}/${y}`);
  const value = normalize(pwd);
  
  if (SITE_PASSWORDS.includes(value)) {
    res.cookie('auth', '1', { httpOnly: true, sameSite: 'lax' });
    res.redirect('/');
  } else {
    res.redirect('/login');
  }
});

// Logout
app.get('/logout', (req, res) => {
  res.clearCookie('auth');
  res.redirect('/login');
});

// Página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.private.html'));
});

// Arquivos estáticos
app.use(express.static(path.join(__dirname)));

app.listen(PORT, () => {
  console.log(`Servidor no ar em http://localhost:${PORT}`);
});