import './style.css';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════
   Smooth Scroll (Lenis)
   ═══════════════════════════════════════════ */
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Connect Lenis to ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

/* ═══════════════════════════════════════════
   Three.js — Floating Geometry
   ═══════════════════════════════════════════ */
const canvas = document.getElementById('bg-canvas');
if (canvas) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    // Wireframe Icosahedron
    const icoGeometry = new THREE.IcosahedronGeometry(1.5, 1);
    const icoMaterial = new THREE.MeshBasicMaterial({
        color: 0x64d2ff,
        wireframe: true,
        transparent: true,
        opacity: 0.12,
    });
    const icosahedron = new THREE.Mesh(icoGeometry, icoMaterial);
    icosahedron.position.set(2.5, 0, 0);
    scene.add(icosahedron);

    // Wireframe Torus
    const torusGeometry = new THREE.TorusGeometry(1, 0.35, 16, 60);
    const torusMaterial = new THREE.MeshBasicMaterial({
        color: 0xa078ff,
        wireframe: true,
        transparent: true,
        opacity: 0.08,
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.position.set(-2, -1.5, -1);
    scene.add(torus);

    // Wireframe Octahedron
    const octGeometry = new THREE.OctahedronGeometry(0.8, 0);
    const octMaterial = new THREE.MeshBasicMaterial({
        color: 0x64d2ff,
        wireframe: true,
        transparent: true,
        opacity: 0.06,
    });
    const octahedron = new THREE.Mesh(octGeometry, octMaterial);
    octahedron.position.set(-3, 2, -2);
    scene.add(octahedron);

    // Mouse parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    document.addEventListener('mousemove', (e) => {
        targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Scroll offset
    let scrollProgress = 0;

    ScrollTrigger.create({
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
            scrollProgress = self.progress;
        },
    });

    // Animate
    function animate() {
        requestAnimationFrame(animate);

        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;

        // Rotate on time + scroll
        const time = performance.now() * 0.001;

        icosahedron.rotation.x = time * 0.15 + scrollProgress * Math.PI;
        icosahedron.rotation.y = time * 0.1 + scrollProgress * Math.PI * 0.5;
        icosahedron.position.x = 2.5 + mouseX * 0.3;
        icosahedron.position.y = mouseY * -0.2;

        torus.rotation.x = time * 0.08 + scrollProgress * Math.PI * 0.8;
        torus.rotation.z = time * 0.12;
        torus.position.x = -2 + mouseX * 0.15;
        torus.position.y = -1.5 + mouseY * -0.1;

        octahedron.rotation.y = time * 0.2 + scrollProgress * Math.PI * 1.2;
        octahedron.rotation.z = time * 0.1;

        // Camera subtle tilt
        camera.position.x = mouseX * 0.15;
        camera.position.y = mouseY * -0.1;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
    }
    animate();

    // Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

/* ═══════════════════════════════════════════
   Hero Entrance Animation
   ═══════════════════════════════════════════ */
function animateHero() {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

    // Animate each word
    tl.to('.hero__heading .word-inner', {
        y: 0,
        duration: 1.4,
        stagger: 0.08,
        delay: 0.3,
    });

    tl.to('.hero__label', {
        opacity: 1,
        y: 0,
        duration: 0.8,
    }, '-=1');

    tl.to('.hero__description', {
        opacity: 1,
        y: 0,
        duration: 0.8,
    }, '-=0.6');
}

// Run hero animation on load
window.addEventListener('load', animateHero);

/* ═══════════════════════════════════════════
   Scroll-Triggered Reveals
   ═══════════════════════════════════════════ */
function initScrollReveals() {
    const reveals = document.querySelectorAll('.reveal, .reveal--left, .reveal--right, .reveal--scale');

    reveals.forEach((el) => {
        gsap.to(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: 1,
            ease: 'expo.out',
        });
    });
}

/* ═══════════════════════════════════════════
   Philosophy Word-by-Word Reveal
   ═══════════════════════════════════════════ */
function initPhilosophyReveal() {
    const statement = document.querySelector('.philosophy__statement');
    if (!statement) return;

    const words = statement.querySelectorAll('.phil-word');

    ScrollTrigger.create({
        trigger: statement,
        start: 'top 80%',
        end: 'bottom 40%',
        onUpdate: (self) => {
            const progress = self.progress;
            words.forEach((w, i) => {
                const wordProgress = i / words.length;
                if (progress > wordProgress) {
                    w.classList.add('is-visible');
                }
            });
        },
    });
}

/* ═══════════════════════════════════════════
   Project Card 3D Tilt
   ═══════════════════════════════════════════ */
function initProjectTilt() {
    const cards = document.querySelectorAll('.project-card');

    cards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -8;
            const rotateY = (x - centerX) / centerX * 8;

            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
}

/* ═══════════════════════════════════════════
   Navigation
   ═══════════════════════════════════════════ */
function initNav() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    let lastScroll = 0;

    ScrollTrigger.create({
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
            const scrollTop = self.scroll();

            // Show/hide on scroll direction
            if (scrollTop > 100) {
                nav.classList.add('nav--scrolled');
                if (scrollTop > lastScroll && scrollTop > 200) {
                    nav.classList.add('nav--hidden');
                } else {
                    nav.classList.remove('nav--hidden');
                }
            } else {
                nav.classList.remove('nav--scrolled');
                nav.classList.remove('nav--hidden');
            }

            lastScroll = scrollTop;
        },
    });

    // Mobile toggle
    const toggle = document.querySelector('.nav__toggle');
    const overlay = document.querySelector('.nav__overlay');
    const closeBtn = document.querySelector('.nav__close');

    if (toggle && overlay) {
        toggle.addEventListener('click', () => {
            overlay.classList.add('is-open');
            document.body.style.overflow = 'hidden';
        });

        const closeNav = () => {
            overlay.classList.remove('is-open');
            document.body.style.overflow = '';
        };

        if (closeBtn) closeBtn.addEventListener('click', closeNav);

        overlay.querySelectorAll('a').forEach((a) => {
            a.addEventListener('click', closeNav);
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                lenis.scrollTo(target, { offset: -80 });
            }
        });
    });
}

/* ═══════════════════════════════════════════
   Init
   ═══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
    initScrollReveals();
    initPhilosophyReveal();
    initProjectTilt();
    initNav();
});
