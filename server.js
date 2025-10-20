const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const fs = require('fs');

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

// Página principal com fotos dinâmicas
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Para meu amor</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="hearts-container" aria-hidden="true"></div>

    <main id="main-content" class="content" aria-label="Área principal">
        <header class="topbar" aria-label="Barra superior">
            <h2 class="page-heading">Nossas lembranças</h2>
            <a href="/logout" class="logout-button" title="Sair">Sair</a>
        </header>
        <section class="gallery" aria-label="Galeria de fotos">
            <img src="https://i.imgur.com/1awT3mv.jpg" alt="Foto 1" loading="lazy">
            <img src="https://i.imgur.com/2tjfKHe.jpg" alt="Foto 2" loading="lazy">
            <img src="https://i.imgur.com/2tjfKHe.jpg" alt="Foto 3" loading="lazy">
        </section>
        <section class="message" aria-label="Mensagem">
            <div class="message-card">
                <p>Nossas primeiras fotos juntos são uma lembrança que vou guardar com muito carinho.  Elas representam um sentimento puro, um amor e um cuidado que temos um pelo outro.  Espero que, com o tempo, a gente tire muitas outras — que cada uma delas traga boas memórias, risadas e momentos que realmente valham a pena lembrar.</p>
                <p>Olhar pra essas fotos me faz perceber o quanto você é especial pra mim.  Elas me lembram que é você o meu motivo pra querer melhorar, pra buscar o meu melhor, mesmo que eu ainda sinta que não cheguei na minha melhor versão.</p>
                <p>Eu te amo por um motivo que nem sei explicar.  Mesmo com pouco tempo juntos, esse sentimento é real, é sincero, e pra mim é isso que importa.  Às vezes o amor simplesmente acontece — e aconteceu com você.</p>
            </div>
        </section>
    </main>

    <script src="script.js"></script>
</body>
</html>`);
});

// Arquivos estáticos
app.use(express.static(path.join(__dirname)));

app.listen(PORT, () => {
  console.log(`Servidor no ar em http://localhost:${PORT}`);
});