/* =============================================
   main.js — Portfolio Interactions
   ============================================= */

// Gate all scroll animations on JS being available
document.body.classList.add('js-animate');

// -- NAV: Scroll shadow + active link highlighting --
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // Shadow on scroll
  navbar.classList.toggle('scrolled', window.scrollY > 20);

  // Active nav link
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) {
      current = sec.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// -- HAMBURGER MENU --
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  // Animate spans
  const spans = hamburger.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

// Close menu on link click
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// -- SCROLL REVEAL --
const revealEls = document.querySelectorAll('[data-animate], .timeline-item, .project-card, .leadership-card, .skill-category');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings slightly
      const siblings = [...entry.target.parentElement.children];
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, idx * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// -- SMOOTH SCROLL for anchor links --
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68;
      window.scrollTo({
        top: target.offsetTop - offset,
        behavior: 'smooth'
      });
    }
  });
});

// -- STAT COUNTER ANIMATION --
function animateCounter(el, target, duration = 1200) {
  const isFloat = target % 1 !== 0;
  let start = null;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // cubic ease-out
    const value = isFloat ? (ease * target).toFixed(3) : Math.round(ease * target);
    el.textContent = isFloat ? value : value + (el.dataset.suffix || '');
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statNumbers = document.querySelectorAll('.stat-number');
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const rawText = el.textContent.trim();
      const num = parseFloat(rawText.replace(/[^0-9.]/g, ''));
      const suffix = rawText.replace(/[0-9.]/g, '');
      el.dataset.suffix = suffix;
      animateCounter(el, num);
      statObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(el => statObserver.observe(el));

// -- BADGE COUNTER ANIMATION for hero badges --
const badgeValues = document.querySelectorAll('.badge-value');
const badgeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const rawText = el.textContent.trim();
      const num = parseFloat(rawText.replace(/[^0-9.]/g, ''));
      if (!isNaN(num) && num > 1) {
        const suffix = rawText.replace(/[0-9.]/g, '').replace(/\s+/g, '');
        el.dataset.suffix = suffix;
        animateCounter(el, num, 1000);
      }
      badgeObserver.unobserve(el);
    }
  });
}, { threshold: 0.8 });

badgeValues.forEach(el => badgeObserver.observe(el));

// -- ACTIVE NAV STYLE --
const style = document.createElement('style');
style.textContent = `.nav-links a.active { color: var(--teal) !important; }`;
document.head.appendChild(style);
