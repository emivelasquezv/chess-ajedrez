const header = document.getElementById('header');
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');

/* TYPING ANIMATION — titular del hero */
const typingHeadline = document.getElementById('typingHeadline');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (typingHeadline) {
  const fullText = typingHeadline.dataset.text;
  if (prefersReducedMotion) {
    typingHeadline.textContent = fullText;
  } else {
    let i = 0;
    (function typeStep() {
      typingHeadline.textContent = fullText.slice(0, i);
      i++;
      if (i <= fullText.length) setTimeout(typeStep, 40);
    })();
  }
}

/* NUMBER TICKER — cuenta ascendente en la franja de confianza */
const numberTickers = document.querySelectorAll('.number-ticker');

function animateNumberTicker(el) {
  const target = parseInt(el.dataset.target, 10);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';

  if (prefersReducedMotion) {
    el.textContent = `${prefix}${target}${suffix}`;
    return;
  }

  const duration = 1200;
  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(eased * target);
    el.textContent = `${prefix}${value}${suffix}`;
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

if (numberTickers.length) {
  const tickerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateNumberTicker(entry.target);
          tickerObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  numberTickers.forEach((el) => tickerObserver.observe(el));
}

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
});

navToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('nav--open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('nav--open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

const themeToggle = document.getElementById('themeToggle');

themeToggle.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const next = isDark ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  try {
    localStorage.setItem('theme', next);
  } catch (e) {}
});

const form = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
const WHATSAPP_NUMBER = '34603603181';

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const nombre = data.get('nombre') || '';
  const email = data.get('email') || '';
  const edad = data.get('edad') || '';
  const mensaje = data.get('mensaje') || '';

  const lines = [
    `Hola, soy ${nombre}.`,
    email && `Mi email: ${email}.`,
    edad && `Edad del alumno/a: ${edad}.`,
    mensaje && `Mensaje: ${mensaje}`,
  ].filter(Boolean);

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join(' '))}`;
  window.open(whatsappUrl, '_blank', 'noopener');

  formNote.hidden = false;
  form.reset();
});

const board = document.getElementById('board');
const piece = document.getElementById('boardPiece');
const BOARD_SIZE = 8;
let piecePos = { row: 4, col: 4 };

function placePiece(row, col) {
  const cell = board.clientWidth / BOARD_SIZE;
  piece.style.left = `${col * cell}px`;
  piece.style.top = `${row * cell}px`;
}

function movePieceRandomly() {
  let row, col;
  do {
    row = Math.floor(Math.random() * BOARD_SIZE);
    col = Math.floor(Math.random() * BOARD_SIZE);
  } while (row === piecePos.row && col === piecePos.col);
  piecePos = { row, col };
  placePiece(row, col);
  piece.classList.remove('jump');
  void piece.offsetWidth;
  piece.classList.add('jump');
}

board.addEventListener('click', movePieceRandomly);
board.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    movePieceRandomly();
  }
});
window.addEventListener('resize', () => placePiece(piecePos.row, piecePos.col));
placePiece(piecePos.row, piecePos.col);

document.querySelectorAll('[data-pricing-card]').forEach((card) => {
  const amount = card.querySelector('.price__amount');
  const unit = card.querySelector('.price__unit');
  const select = card.querySelector('.duration-select');
  const planLink = card.querySelector('[data-plan-link]');
  if (select) {
    select.addEventListener('change', () => {
      const option = select.options[select.selectedIndex];
      amount.textContent = `${option.dataset.price}€`;
      unit.textContent = `/ clase (${option.dataset.duration})`;
      if (planLink && option.dataset.link) {
        planLink.href = option.dataset.link;
      }
    });
  }
});

/* SCROLL PROGRESS */
const scrollProgress = document.getElementById('scrollProgress');

function updateScrollProgress() {
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
  scrollProgress.style.width = `${pct}%`;
}

window.addEventListener('scroll', updateScrollProgress, { passive: true });
window.addEventListener('resize', updateScrollProgress);
updateScrollProgress();

/* COOL MODE — piezas saliendo al hacer click en el tablero */
const COOL_MODE_PIECES = ['♟', '♞', '♝', '♜', '♛', '♚'];

function spawnCoolModeParticles(e) {
  const originX = e.clientX;
  const originY = e.clientY;
  const count = 8;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('span');
    particle.className = 'cool-particle';
    particle.textContent = COOL_MODE_PIECES[Math.floor(Math.random() * COOL_MODE_PIECES.length)];
    document.body.appendChild(particle);

    const angle = Math.random() * Math.PI * 2;
    const distance = 60 + Math.random() * 90;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;
    const rotate = (Math.random() - 0.5) * 720;

    const animation = particle.animate(
      [
        { transform: `translate(${originX}px, ${originY}px) translate(-50%, -50%) rotate(0deg) scale(1)`, opacity: 1 },
        { transform: `translate(${originX + dx}px, ${originY + dy + 120}px) translate(-50%, -50%) rotate(${rotate}deg) scale(0.5)`, opacity: 0 },
      ],
      { duration: 700 + Math.random() * 400, easing: 'cubic-bezier(.2,.8,.2,1)' }
    );
    animation.onfinish = () => particle.remove();
  }
}

board.addEventListener('click', spawnCoolModeParticles);

/* ANIMATED LIST — entrada escalonada de las tarjetas bento/carousel */
const bentoGrids = document.querySelectorAll('.cards--bento, .carousel');

function animateBentoGrid(grid) {
  const items = grid.querySelectorAll('.card');
  items.forEach((item, i) => {
    if (prefersReducedMotion) {
      item.classList.add('is-visible');
    } else {
      setTimeout(() => item.classList.add('is-visible'), i * 120);
    }
  });
}

if (bentoGrids.length) {
  const bentoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateBentoGrid(entry.target);
          bentoObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  bentoGrids.forEach((grid) => bentoObserver.observe(grid));
}

/* CAROUSEL — logros de Sobre mí */
const achievementsCarousel = document.getElementById('achievementsCarousel');
if (achievementsCarousel) {
  const carouselWrap = achievementsCarousel.closest('.carousel-wrap');
  const prevBtn = carouselWrap.querySelector('.carousel-nav--prev');
  const nextBtn = carouselWrap.querySelector('.carousel-nav--next');

  function carouselStep() {
    const firstCard = achievementsCarousel.querySelector('.card');
    return firstCard ? firstCard.getBoundingClientRect().width + 20 : 260;
  }

  prevBtn.addEventListener('click', () => {
    achievementsCarousel.scrollBy({ left: -carouselStep(), behavior: 'smooth' });
  });
  nextBtn.addEventListener('click', () => {
    achievementsCarousel.scrollBy({ left: carouselStep(), behavior: 'smooth' });
  });
}

/* SMOOTH CURSOR */
const supportsSmoothCursor = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (supportsSmoothCursor) {
  document.body.classList.add('has-smooth-cursor');

  const smoothCursor = document.createElement('div');
  smoothCursor.className = 'smooth-cursor';
  document.body.appendChild(smoothCursor);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    smoothCursor.classList.add('is-active');
  });

  document.addEventListener('mouseleave', () => smoothCursor.classList.remove('is-active'));

  function renderSmoothCursor() {
    const ease = prefersReducedMotion ? 1 : 0.18;
    cursorX += (mouseX - cursorX) * ease;
    cursorY += (mouseY - cursorY) * ease;
    smoothCursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
    requestAnimationFrame(renderSmoothCursor);
  }
  requestAnimationFrame(renderSmoothCursor);

  const hoverSelector = 'a, button, .duration-btn, .card, .board, input, textarea';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverSelector)) smoothCursor.classList.add('is-hovering');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverSelector)) smoothCursor.classList.remove('is-hovering');
  });
}
