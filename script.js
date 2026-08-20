const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const loader = $("#loader");
window.addEventListener("load", () => {
  setTimeout(() => loader?.classList.add("hide"), 550);
});

const nav = $("#nav");
const ham = $("#ham");
const mob = $("#mob");

function setNavState() {
  nav?.classList.toggle("scrolled", window.scrollY > 16);
}

window.addEventListener("scroll", setNavState, { passive: true });
setNavState();

ham?.addEventListener("click", () => {
  const open = !mob?.classList.contains("open");
  ham.classList.toggle("active", open);
  ham.setAttribute("aria-expanded", String(open));
  mob?.classList.toggle("open", open);
  document.body.classList.toggle("no-scroll", open);
});

$$(".mob-menu a, .nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    ham?.classList.remove("active");
    ham?.setAttribute("aria-expanded", "false");
    mob?.classList.remove("open");
    document.body.classList.remove("no-scroll");
  });
});

const phrases = [
  "espejos LED elegantes",
  "canceles de cristal",
  "ventanales de aluminio",
  "domos y pérgolas",
  "soluciones personalizadas"
];
const twText = $("#twText");
let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  if (!twText) return;
  const current = phrases[phraseIndex];
  twText.textContent = current.slice(0, charIndex);

  if (!deleting && charIndex < current.length) {
    charIndex += 1;
    setTimeout(typeLoop, 54);
    return;
  }

  if (!deleting && charIndex === current.length) {
    deleting = true;
    setTimeout(typeLoop, 1200);
    return;
  }

  if (deleting && charIndex > 0) {
    charIndex -= 1;
    setTimeout(typeLoop, 28);
    return;
  }

  deleting = false;
  phraseIndex = (phraseIndex + 1) % phrases.length;
  setTimeout(typeLoop, 220);
}
typeLoop();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14, rootMargin: "0px 0px -40px 0px" });

$$(".rev").forEach((el) => revealObserver.observe(el));

function animateNumber(el) {
  const target = Number(el.dataset.count || el.dataset.heroCount || 0);
  if (!target || el.dataset.done) return;

  el.dataset.done = "true";
  const prefix = el.dataset.prefix || "";
  const suffix = el.dataset.suffix || "";
  const duration = 1100;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = `${prefix}${Math.round(target * eased)}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateNumber(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.35 });

$$("[data-count], [data-hero-count]").forEach((el) => counterObserver.observe(el));

function createParticles(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const particles = [];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    particles.length = 0;

    const count = Math.min(70, Math.max(24, Math.floor(rect.width / 22)));
    for (let i = 0; i < count; i += 1) {
      particles.push({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.5
      });
    }
  }

  function draw() {
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.fillStyle = "rgba(88, 199, 223, .48)";
    ctx.strokeStyle = "rgba(199, 161, 90, .12)";

    particles.forEach((p, index) => {
      if (!reduceMotion) {
        p.x += p.vx;
        p.y += p.vy;
      }
      if (p.x < 0 || p.x > rect.width) p.vx *= -1;
      if (p.y < 0 || p.y > rect.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();

      for (let j = index + 1; j < particles.length; j += 1) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 95) {
          ctx.globalAlpha = 1 - dist / 95;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    });

    requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener("resize", resize, { passive: true });
}

["#pcanvas", "#pcanvasWhy", "#pcanvasGaleria"].forEach((selector) => createParticles($(selector)));

const form = $("#cForm");
form?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const data = new FormData(form);
  const nombre = data.get("nombre") || "";
  const telefono = data.get("telefono") || "";
  const tipo = data.get("tipo") || "";
  const mensaje = data.get("mensaje") || "Sin detalles adicionales.";

  const text = [
    "Hola, quiero solicitar una cotización con INOVALUGLASS.",
    `Nombre: ${nombre}`,
    `Teléfono: ${telefono}`,
    `Proyecto: ${tipo}`,
    `Detalles: ${mensaje}`
  ].join("\n");

  window.open(`https://wa.me/525568696625?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  form.reset();
});
