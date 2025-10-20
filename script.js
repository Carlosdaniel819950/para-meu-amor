/*
  script.js
  - Gera corações caindo continuamente com variações de tamanho, velocidade e rotações.
  - Painel: permite escolher uma imagem para pré-visualização e escrever um texto.
  Observações importantes:
    * O uso de requestAnimationFrame garante animação suave e eficiente.
    * Limitamos a quantidade máxima de corações simultâneos para evitar consumo excessivo.
    * Liberamos nós antigos para não crescer memória indefinidamente.
*/

(function () {
  const heartsContainer = document.getElementById('hearts-container');
  // Gate de senha
  const gateSection = document.getElementById('gate');
  const gateForm = document.getElementById('gate-form');
  const gateInput = document.getElementById('gate-input');
  const gateError = document.getElementById('gate-error');
  const mainContent = document.getElementById('main-content');

  // Configurações da animação
  const NUM_HEARTS_BURST = 240;     // Quantidade na explosão única
  const MIN_SIZE = 28;              // maiores para melhor visibilidade
  const MAX_SIZE = 60;              // maiores
  const MIN_DURATION = 6000;        // ms
  const MAX_DURATION = 12000;       // ms

  /**
   * Cria um elemento SVG de coração para visual nítido em qualquer tamanho.
   */
  function createHeartElement(sizePx) {
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', String(sizePx));
    svg.setAttribute('height', String(sizePx));
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.className = 'heart';

    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('fill', 'currentColor');
    // Borda branca para melhor contraste
    path.setAttribute('stroke', 'rgba(255,255,255,0.95)');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('vector-effect', 'non-scaling-stroke');
    path.setAttribute('d', 'M12 21s-6.716-4.686-9.192-7.162C1.838 12.868 1 11.253 1 9.5 1 6.462 3.462 4 6.5 4c1.74 0 3.41.81 4.5 2.09C12.09 4.81 13.76 4 15.5 4 18.538 4 21 6.462 21 9.5c0 1.753-.838 3.368-1.808 4.338C18.716 16.314 12 21 12 21z');
    svg.appendChild(path);

    // Cor aleatória suave em tons de rosa/vermelho
    const hue = 340 + Math.random() * 20; // 340-360
    const sat = 70 + Math.random() * 20;  // 70-90%
    const light = 55 + Math.random() * 10;// 55-65%
    svg.style.color = `hsl(${hue} ${sat}% ${light}%)`;

    return svg;
  }

  /**
   * Spawna um coração e anima sua queda com pequenas oscilações horizontais.
   */
  function spawnHeart(startXOverride) {
    if (!heartsContainer) return;

    const containerWidth = window.innerWidth;
    const startX = typeof startXOverride === 'number' ? startXOverride : Math.random() * containerWidth;
    const size = MIN_SIZE + Math.random() * (MAX_SIZE - MIN_SIZE);
    const duration = MIN_DURATION + Math.random() * (MAX_DURATION - MIN_DURATION);
    const driftAmplitude = 20 + Math.random() * 40; // ligeiramente menor para corações maiores
    const rotationSpeed = (Math.random() < 0.5 ? -1 : 1) * (0.25 + Math.random() * 0.55); // rad/s aprox.

    const heart = createHeartElement(size);
    heart.style.left = `${startX}px`;
    heart.style.top = `-40px`;
    heartsContainer.appendChild(heart);

    const startTime = performance.now();
    const startY = -size;

    function animate(now) {
      const elapsed = now - startTime;
      const t = elapsed / duration; // 0..1
      if (t >= 1) {
        // Remove quando sai da tela / termina
        heart.remove();
        return;
      }

      // Movimento vertical: de startY até além da altura da janela
      const y = startY + t * (window.innerHeight + size * 2);
      // Oscilação horizontal suave (senoidal) baseada no tempo decorrido
      const xOffset = Math.sin((elapsed / 1000) * 2.6) * driftAmplitude;
      // Rotação contínua
      const rotateDeg = (elapsed / 1000) * (rotationSpeed * 180 / Math.PI);

      heart.style.transform = `translate(-50%, 0) translate(${xOffset}px, ${y}px) rotate(${rotateDeg}deg)`;
      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }

  /**
   * Cria uma explosão única de corações preenchendo a tela de uma vez.
   */
  function startHeartsBurst() {
    if (!heartsContainer) return;
    const width = window.innerWidth;
    for (let i = 0; i < NUM_HEARTS_BURST; i++) {
      const col = (i + Math.random() * 0.6) / NUM_HEARTS_BURST; // espalha no eixo X
      const x = col * width;
      // Usa setTimeout pequeno para distribuir custo da criação e dar sensação de explosão
      setTimeout(() => spawnHeart(x), Math.random() * 300);
    }
  }

  // Lógica do gate de senha (apenas em login.html)
  function setupPasswordGate() {
    if (!gateSection || !gateForm || !gateInput) return;

    const STORAGE_KEY = 'site_desbloqueado';
    const VALID_PASSWORDS = [
      '13/09/2025',
      '14/09/2025',
      // Formatos alternativos sem barras para tolerância de digitação
      '13092025',
      '14092025'
    ];

    function normalize(input) {
      const cleaned = input.trim().replace(/\s+/g, '').replace(/[-.]/g, '/');
      const m = cleaned.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (m) {
        const d = m[1].padStart(2, '0');
        const mo = m[2].padStart(2, '0');
        const y = m[3];
        return `${d}/${mo}/${y}`;
      }
      return cleaned;
    }

    function tryUnlock(raw) {
      const value = normalize(raw);
      if (VALID_PASSWORDS.includes(value)) {
        gateError.hidden = true;
        try { localStorage.setItem(STORAGE_KEY, '1'); } catch (_) {}
        window.location.href = 'index.html';
        return true;
      }
      return false;
    }

    // Se já desbloqueou antes, redireciona para index
    try {
      if (localStorage.getItem(STORAGE_KEY) === '1') {
        window.location.href = 'index.html';
        return;
      }
    } catch (_) {}

    gateInput.addEventListener('input', () => {
      const ok = tryUnlock(gateInput.value);
      if (!ok) gateError.hidden = true;
    });

    gateForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!tryUnlock(gateInput.value)) {
        gateError.hidden = false;
        gateInput.select();
      }
    });
  }

  // Guard na página principal (index.html)
  function setupIndexGuard() {
    const root = document.getElementById('main-content');
    if (!root) return;
    const STORAGE_KEY = 'site_desbloqueado';
    try {
      if (localStorage.getItem(STORAGE_KEY) !== '1') {
        window.location.href = 'login.html';
        return;
      }
    } catch (_) {
      window.location.href = 'login.html';
      return;
    }

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
      logoutButton.addEventListener('click', () => {
        try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
        window.location.href = 'login.html';
      });
    }
  }

  /**
   * Lê um arquivo de imagem do input e aplica como plano de fundo da pré-visualização.
   * Tratamos possíveis erros como arquivo inválido ou falha de leitura.
   */
  // Removido upload: agora as imagens são fixas na galeria do HTML

  // Removido: não precisamos mais persistir texto

  // Inicialização
  window.addEventListener('DOMContentLoaded', () => {
    setupPasswordGate();
    setupIndexGuard();
    startHeartsBurst();
  });
})();


