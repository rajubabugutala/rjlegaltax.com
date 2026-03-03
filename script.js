// ========== 3D ANIMATED BACKGROUND ==========
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H, nodes = [], animFrame;

function resizeCanvas() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

function createNodes() {
  nodes = [];
  const count = Math.floor((W * H) / 12000);
  for (let i = 0; i < count; i++) {
    nodes.push({
      x: Math.random() * W,
      y: Math.random() * H,
      z: Math.random() * 3 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 1.5 + 0.5,
      pulse: Math.random() * Math.PI * 2,
      type: Math.random() > 0.7 ? 'gold' : 'blue'
    });
  }
}

function drawBackground() {
  ctx.clearRect(0, 0, W, H);
  
  // Gradient BG
  const grad = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, W * 0.8);
  grad.addColorStop(0, 'rgba(25,40,80,0.3)');
  grad.addColorStop(1, 'rgba(5,8,15,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  const t = Date.now() * 0.0005;

  nodes.forEach(n => {
    n.pulse += 0.01;
    n.x += n.vx;
    n.y += n.vy;
    if (n.x < 0 || n.x > W) n.vx *= -1;
    if (n.y < 0 || n.y > H) n.vy *= -1;

    const alpha = (Math.sin(n.pulse) * 0.3 + 0.5) * (n.z / 3);
    const size = n.size * n.z * 0.7;

    if (n.type === 'gold') {
      ctx.fillStyle = `rgba(201,168,76,${alpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(201,168,76,0.5)';
    } else {
      ctx.fillStyle = `rgba(74,158,255,${alpha * 0.4})`;
      ctx.shadowBlur = 4;
      ctx.shadowColor = 'rgba(74,158,255,0.3)';
    }

    ctx.beginPath();
    ctx.arc(n.x, n.y, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  });

  // Draw connections
  nodes.forEach((a, i) => {
    nodes.slice(i + 1).forEach(b => {
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (dist < 160) {
        const alpha = (1 - dist / 160) * 0.12;
        ctx.strokeStyle = `rgba(201,168,76,${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    });
  });

  // Floating geometric lines
  ctx.save();
  ctx.translate(W * 0.8, H * 0.3);
  ctx.rotate(t * 0.2);
  ctx.strokeStyle = 'rgba(201,168,76,0.04)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 8; i++) {
    ctx.rotate(Math.PI / 4);
    ctx.beginPath();
    ctx.moveTo(0, 60);
    ctx.lineTo(0, 200);
    ctx.stroke();
  }
  ctx.restore();

  animFrame = requestAnimationFrame(drawBackground);
}

resizeCanvas();
createNodes();
drawBackground();
window.addEventListener('resize', () => { resizeCanvas(); createNodes(); });

// ========== CUSTOM CURSOR ==========
const cursor = document.getElementById('cursor');
const trail = document.getElementById('cursorTrail');
let cx = 0, cy = 0, tx = 0, ty = 0;

document.addEventListener('mousemove', e => {
  cx = e.clientX; cy = e.clientY;
  cursor.style.left = cx + 'px';
  cursor.style.top = cy + 'px';
});

function animCursor() {
  tx += (cx - tx) * 0.12;
  ty += (cy - ty) * 0.12;
  trail.style.left = tx + 'px';
  trail.style.top = ty + 'px';
  requestAnimationFrame(animCursor);
}
animCursor();

document.querySelectorAll('a,button,.service-card,.inv-card,.emp-card,.compliance-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '20px';
    cursor.style.height = '20px';
    trail.style.width = '60px';
    trail.style.height = '60px';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '12px';
    cursor.style.height = '12px';
    trail.style.width = '36px';
    trail.style.height = '36px';
  });
});

// ========== PARTICLES ==========
const pc = document.getElementById('particles-container');
for (let i = 0; i < 20; i++) {
  const p = document.createElement('div');
  p.className = 'particle';
  p.style.left = Math.random() * 100 + 'vw';
  p.style.animationDuration = (8 + Math.random() * 15) + 's';
  p.style.animationDelay = (Math.random() * 15) + 's';
  p.style.width = p.style.height = (1 + Math.random() * 2) + 'px';
  pc.appendChild(p);
}

// ========== SCROLL REVEAL ==========
const revealEls = document.querySelectorAll('.reveal, .step');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.1 });
revealEls.forEach(el => observer.observe(el));

// ========== COUNTER ANIMATION ==========
const counters = document.querySelectorAll('.stat-num[data-target]');
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target.dataset.done) {
      e.target.dataset.done = '1';
      const target = +e.target.dataset.target;
      const suffix = target === 98 ? '%' : target === 1200 ? '+' : '+';
      let current = 0;
      const step = target / 60;
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        e.target.textContent = Math.floor(current) + (current >= target ? suffix : '');
        if (current >= target) clearInterval(timer);
      }, 25);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObs.observe(c));

// ========== TABS ==========
function showTab(id) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + id).classList.add('active');
  event.target.classList.add('active');
  // re-trigger reveals
  document.querySelectorAll('#tab-' + id + ' .reveal').forEach(el => {
    el.classList.remove('visible');
    setTimeout(() => el.classList.add('visible'), 100);
  });
}

// ========== TILT EFFECT on service cards ==========
document.querySelectorAll('.service-card, .inv-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-8px) perspective(600px) rotateY(${x * 12}deg) rotateX(${-y * 8}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ========== WEALTH METERS ANIMATE ==========
const meterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.meter-fill').forEach(fill => {
        const w = fill.style.width;
        fill.style.width = '0%';
        setTimeout(() => fill.style.width = w, 200);
      });
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.emp-card').forEach(c => meterObs.observe(c));

// Init visible steps
setTimeout(() => {
  document.querySelectorAll('.step').forEach((s, i) => {
    setTimeout(() => s.classList.add('visible'), i * 200);
  });
}, 500);