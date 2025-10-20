// Animação de corações caindo
(function () {
  const heartsContainer = document.getElementById('hearts-container');
  
  // Configurações da animação
  const NUM_HEARTS_BURST = 240;
  const MIN_SIZE = 28;
  const MAX_SIZE = 60;
  const MIN_DURATION = 6000;
  const MAX_DURATION = 12000;

  function createHeartElement(sizePx) {
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', String(sizePx));
    svg.setAttribute('height', String(sizePx));
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.className = 'heart';

    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('fill', 'currentColor');
    path.setAttribute('stroke', 'rgba(255,255,255,0.95)');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('vector-effect', 'non-scaling-stroke');
    path.setAttribute('d', 'M12 21s-6.716-4.686-9.192-7.162C1.838 12.868 1 11.253 1 9.5 1 6.462 3.462 4 6.5 4c1.74 0 3.41.81 4.5 2.09C12.09 4.81 13.76 4 15.5 4 18.538 4 21 6.462 21 9.5c0 1.753-.838 3.368-1.808 4.338C18.716 16.314 12 21 12 21z');
    svg.appendChild(path);

    // Cor aleatória suave em tons de rosa/vermelho
    const hue = 340 + Math.random() * 20;
    const sat = 70 + Math.random() * 20;
    const light = 55 + Math.random() * 10;
    svg.style.color = `hsl(${hue} ${sat}% ${light}%)`;

    return svg;
  }

  function spawnHeart(startXOverride) {
    if (!heartsContainer) return;

    const containerWidth = window.innerWidth;
    const startX = typeof startXOverride === 'number' ? startXOverride : Math.random() * containerWidth;
    const size = MIN_SIZE + Math.random() * (MAX_SIZE - MIN_SIZE);
    const duration = MIN_DURATION + Math.random() * (MAX_DURATION - MIN_DURATION);
    const driftAmplitude = 20 + Math.random() * 40;
    const rotationSpeed = (Math.random() < 0.5 ? -1 : 1) * (0.25 + Math.random() * 0.55);

    const heart = createHeartElement(size);
    heart.style.left = `${startX}px`;
    heart.style.top = `-40px`;
    heartsContainer.appendChild(heart);

    const startTime = performance.now();
    const startY = -size;

    function animate(now) {
      const elapsed = now - startTime;
      const t = elapsed / duration;
      if (t >= 1) {
        heart.remove();
        return;
      }

      const y = startY + t * (window.innerHeight + size * 2);
      const xOffset = Math.sin((elapsed / 1000) * 2.6) * driftAmplitude;
      const rotateDeg = (elapsed / 1000) * (rotationSpeed * 180 / Math.PI);

      heart.style.transform = `translate(-50%, 0) translate(${xOffset}px, ${y}px) rotate(${rotateDeg}deg)`;
      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }

  function startHeartsBurst() {
    if (!heartsContainer) return;
    const width = window.innerWidth;
    for (let i = 0; i < NUM_HEARTS_BURST; i++) {
      const col = (i + Math.random() * 0.6) / NUM_HEARTS_BURST;
      const x = col * width;
      setTimeout(() => spawnHeart(x), Math.random() * 300);
    }
  }

  // Inicializar quando a página carregar
  window.addEventListener('DOMContentLoaded', () => {
    startHeartsBurst();
  });
})();