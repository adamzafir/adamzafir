import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const root = document.documentElement;
const header = document.querySelector('[data-site-header]');
const nav = document.querySelector('[data-site-nav]');
const navToggle = document.querySelector('[data-nav-toggle]');
const themeToggle = document.querySelector('[data-theme-toggle]');
const animatedItems = document.querySelectorAll('[data-animate]');
const yearSlot = document.querySelector('[data-current-year]');
const themeMeta = document.querySelector('meta[name="theme-color"]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
const desktopMotion = !reduceMotion && window.matchMedia('(min-width: 961px)').matches;
const themeStorageKey = 'adamzafir-theme';

let lenisInstance = null;

function readStoredTheme() {
  try {
    const theme = localStorage.getItem(themeStorageKey);
    return theme === 'light' || theme === 'dark' ? theme : null;
  } catch {
    return null;
  }
}

function writeStoredTheme(theme) {
  try {
    localStorage.setItem(themeStorageKey, theme);
  } catch {
    // Ignore storage failures and fall back to system preference.
  }
}

function syncThemeColor() {
  if (!themeMeta) return;

  const themeColor = getComputedStyle(root).getPropertyValue('--theme-chrome').trim();
  if (themeColor) {
    themeMeta.setAttribute('content', themeColor);
  }
}

function applyTheme(theme) {
  root.dataset.theme = theme;
  root.style.colorScheme = theme;

  if (themeToggle) {
    const nextLabel = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    themeToggle.setAttribute('aria-label', nextLabel);
    themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
  }

  syncThemeColor();
}

function setupTheme() {
  const storedTheme = readStoredTheme();
  const initialTheme = storedTheme ?? (systemThemeQuery.matches ? 'dark' : 'light');

  applyTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      writeStoredTheme(nextTheme);
      applyTheme(nextTheme);
    });
  }

  systemThemeQuery.addEventListener('change', (event) => {
    if (readStoredTheme()) return;
    applyTheme(event.matches ? 'dark' : 'light');
  });
}

function syncHeader() {
  if (!header) return;

  header.classList.toggle('site-header--solid', window.scrollY > 12);
}

function closeNav() {
  if (!nav || !navToggle) return;

  nav.classList.remove('site-nav--open');
  navToggle.setAttribute('aria-expanded', 'false');
}

function toggleNav() {
  if (!nav || !navToggle) return;

  const isOpen = nav.classList.toggle('site-nav--open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
}

function setupNav() {
  if (!navToggle || !nav) return;

  navToggle.addEventListener('click', toggleNav);

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeNav();
    }
  });
}

function setupAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      const target = href ? document.querySelector(href) : null;

      if (!target) return;

      event.preventDefault();

      if (lenisInstance) {
        lenisInstance.scrollTo(target, { offset: -24 });
        return;
      }

      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });
}

function setupReveals() {
  if (desktopMotion) return;

  if (reduceMotion || !animatedItems.length) {
    animatedItems.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.2 }
  );

  animatedItems.forEach((item) => observer.observe(item));
}

function setupDesktopMotion() {
  if (!desktopMotion) return;

  document.body.classList.add('desktop-scrollfx');

  lenisInstance = new Lenis({
    duration: 1.15,
    smoothWheel: true,
    syncTouch: false,
    easing: (value) => 1 - Math.pow(1 - value, 4),
  });

  lenisInstance.on('scroll', ScrollTrigger.update);

  function onAnimationFrame(time) {
    lenisInstance.raf(time);
    requestAnimationFrame(onAnimationFrame);
  }

  requestAnimationFrame(onAnimationFrame);

  gsap.set(animatedItems, { autoAlpha: 1, y: 0 });

  const introItems = gsap.utils.toArray('.intro__copy > *');
  if (introItems.length) {
    gsap.from(introItems, {
      y: 28,
      autoAlpha: 0,
      duration: 0.95,
      stagger: 0.12,
      ease: 'power3.out',
    });
  }

  gsap.to('.intro__copy', {
    yPercent: -10,
    ease: 'none',
    scrollTrigger: {
      trigger: '.intro',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.1,
    },
  });

  gsap.from('.strip__grid p', {
    y: 18,
    autoAlpha: 0,
    duration: 0.75,
    stagger: 0.1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.strip',
      start: 'top 82%',
    },
  });

  gsap.utils.toArray('.project').forEach((project, index) => {
    gsap.from(project, {
      y: 40,
      autoAlpha: 0,
      duration: 0.85,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: project,
        start: 'top 82%',
      },
    });

    gsap.from(project.querySelector('.project__meta'), {
      x: index % 2 === 0 ? -24 : 24,
      autoAlpha: 0,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: project,
        start: 'top 82%',
      },
    });

    gsap.to(project, {
      yPercent: -4,
      ease: 'none',
      scrollTrigger: {
        trigger: project,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2,
      },
    });
  });

  gsap.from('.contact__inner > *', {
    y: 36,
    autoAlpha: 0,
    duration: 0.85,
    stagger: 0.12,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.contact',
      start: 'top 78%',
    },
  });

  ScrollTrigger.refresh();
}

if (yearSlot) {
  yearSlot.textContent = `© ${new Date().getFullYear()}`;
}

setupTheme();
setupNav();
setupAnchors();
setupReveals();
setupDesktopMotion();
syncHeader();

window.addEventListener('scroll', syncHeader, { passive: true });
