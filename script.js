// ---------- 1. Profile picture fallback ----------
// If profile.jpg is missing, show a generated avatar with your initials.
const avatar = document.getElementById("avatar");
avatar.addEventListener("error", () => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#7c5cff"/><stop offset="1" stop-color="#19d3c5"/></linearGradient></defs>
    <rect width="400" height="400" fill="url(#g)"/>
    <text x="50%" y="54%" font-family="Arial" font-size="150" font-weight="700"
      fill="#fff" text-anchor="middle" dominant-baseline="middle">YN</text></svg>`;
  avatar.src = "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}, { once: true });

// ---------- 2. Typing effect ----------
const roles = ["IT Student", "Web Developer", "Database Enthusiast", "Problem Solver"];
const typing = document.getElementById("typing");
let r = 0, c = 0, deleting = false;

function type() {
  const word = roles[r];
  typing.textContent = word.slice(0, c);
  if (!deleting && c < word.length) c++;
  else if (!deleting) { deleting = true; return setTimeout(type, 1400); }
  else if (c > 0) c--;
  else { deleting = false; r = (r + 1) % roles.length; }
  setTimeout(type, deleting ? 45 : 90);
}
type();

// ---------- 3. Animated network background ----------
const canvas = document.getElementById("network");
const ctx = canvas.getContext("2d");
let w, h, dots = [];
const mouse = { x: null, y: null };

function resize() {
  w = canvas.width = innerWidth;
  h = canvas.height = innerHeight;
  const count = Math.min(90, Math.floor((w * h) / 18000));
  dots = Array.from({ length: count }, () => ({
    x: Math.random() * w, y: Math.random() * h,
    vx: (Math.random() - .5) * .5, vy: (Math.random() - .5) * .5
  }));
}
addEventListener("resize", resize);
addEventListener("mousemove", e => { mouse.x = e.clientX; mouse.y = e.clientY; });
resize();

function draw() {
  ctx.clearRect(0, 0, w, h);
  for (const d of dots) {
    d.x += d.vx; d.y += d.vy;
    if (d.x < 0 || d.x > w) d.vx *= -1;
    if (d.y < 0 || d.y > h) d.vy *= -1;
    ctx.beginPath();
    ctx.arc(d.x, d.y, 1.8, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,.7)";
    ctx.fill();
  }
  for (let i = 0; i < dots.length; i++) {
    for (let j = i + 1; j < dots.length; j++) {
      const dist = Math.hypot(dots[i].x - dots[j].x, dots[i].y - dots[j].y);
      if (dist < 120) link(dots[i], dots[j], 1 - dist / 120);
    }
    if (mouse.x !== null) {
      const dm = Math.hypot(dots[i].x - mouse.x, dots[i].y - mouse.y);
      if (dm < 160) link(dots[i], mouse, 1 - dm / 160);
    }
  }
  requestAnimationFrame(draw);
}
function link(a, b, alpha) {
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.strokeStyle = `rgba(25, 211, 197, ${alpha * .45})`;
  ctx.stroke();
}
if (!matchMedia("(prefers-reduced-motion: reduce)").matches) draw();

// ---------- 4. Skill bars fill when visible ----------
const bars = document.querySelectorAll(".bar");
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.firstElementChild.style.width = entry.target.dataset.level + "%";
      observer.unobserve(entry.target);
    }
  });
}, { threshold: .4 });
bars.forEach(b => observer.observe(b));

// ---------- 5. Highlight current menu link ----------
const links = document.querySelectorAll(".nav nav a");
const sections = document.querySelectorAll("main section");
addEventListener("scroll", () => {
  let current = "home";
  sections.forEach(s => { if (scrollY >= s.offsetTop - 140) current = s.id; });
  links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + current));
});

// ---------- 6. Contact message (opens the visitor's email app) ----------
document.getElementById("send").addEventListener("click", () => {
  const name = document.getElementById("name").value.trim();
  const text = document.getElementById("text").value.trim();
  const status = document.getElementById("status");
  if (!name || !text) { status.textContent = "Please enter your name and a message."; return; }
  const subject = encodeURIComponent("Portfolio message from " + name);
  location.href = `mailto:you@example.com?subject=${subject}&body=${encodeURIComponent(text)}`;
  status.textContent = "Opening your email app…";
});

// ---------- 7. Footer year ----------
document.getElementById("year").textContent = new Date().getFullYear();
