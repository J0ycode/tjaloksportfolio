/* ==========================================================================
   T J ALOK PORTFOLIO — Premium JavaScript
   ========================================================================== */

(function () {
    'use strict';

    /* -----------------------------------------------------------------------
       FOOTER YEAR
    ----------------------------------------------------------------------- */
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* -----------------------------------------------------------------------
       CUSTOM CURSOR (Apple/Stripe Style)
    ----------------------------------------------------------------------- */
    const cursorDot = document.getElementById('cursor-dot');

    // Fallback if not injected or on mobile
    if (cursorDot && window.matchMedia("(pointer: fine)").matches) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let dotX = mouseX;
        let dotY = mouseY;

        const heroName = document.querySelector('.hero-name');
        let animatedX = 150;
        let animatedY = 50;

        // Track Mouse
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Smoothly trail the dot & handle organic name animation
        const animatePhysics = () => {
            // 1. Custom Cursor Physics
            dotX += (mouseX - dotX) * 0.15;
            dotY += (mouseY - dotY) * 0.15;
            cursorDot.style.transform = `translate3d(calc(${dotX}px - 50%), calc(${dotY}px - 50%), 0)`;

            // 2. Name Glow Logic (Ambient Roam vs. Proximity Tracking)
            if (heroName) {
                const rect = heroName.getBoundingClientRect();

                // Calculate distance from mouse to the text bounding box center
                const textCenterX = rect.left + rect.width / 2;
                const textCenterY = rect.top + rect.height / 2;
                const distanceX = mouseX - textCenterX;
                const distanceY = mouseY - textCenterY;
                const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

                // If mouse is within ~300px of the center of the text, track mouse tightly
                if (distance < 300) {
                    const targetX = mouseX - rect.left;
                    const targetY = mouseY - rect.top;
                    // Fast lerp to mouse
                    animatedX += (targetX - animatedX) * 0.1;
                    animatedY += (targetY - animatedY) * 0.1;
                } else {
                    // Organic roaming animation when mouse is far away
                    const time = Date.now() * 0.001; // Scale time
                    // Roam between roughly -20% to 120% of the text width/height
                    const targetX = (Math.sin(time) * 0.4 + 0.5) * rect.width;
                    const targetY = (Math.cos(time * 0.7) * 0.3 + 0.5) * rect.height;

                    // Slow, buttery lerp to organic path
                    animatedX += (targetX - animatedX) * 0.02;
                    animatedY += (targetY - animatedY) * 0.02;
                }

                heroName.style.setProperty('--mouse-x', `${animatedX}px`);
                heroName.style.setProperty('--mouse-y', `${animatedY}px`);
            }

            requestAnimationFrame(animatePhysics);
        };
        requestAnimationFrame(animatePhysics);

        // Hover effect over text and interactive elements using event delegation
        window.addEventListener('mouseover', (e) => {
            if (e.target.closest('h1, h2, h3, h4, h5, h6, p, a, span, button, li, input, textarea, .info-card, .bento-card')) {
                document.body.classList.add('cursor-hover');
            } else {
                document.body.classList.remove('cursor-hover');
            }
        });
    }

    /* -----------------------------------------------------------------------
       SCROLL PROGRESS INDICATOR
    ----------------------------------------------------------------------- */
    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = (scrollTop / scrollHeight) * 100;
            scrollProgress.style.width = scrollPercent + '%';
        }, { passive: true });
    }


    /* -----------------------------------------------------------------------
       NAVIGATION — Scroll Spy & Mobile Toggle
    ----------------------------------------------------------------------- */
    const header = document.getElementById('header');
    const navMenu = document.getElementById('nav-menu');
    const mobileBtn = document.getElementById('mobile-toggle');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Mobile toggle
    mobileBtn.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('active');
        mobileBtn.classList.toggle('open', isOpen);
        mobileBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileBtn.classList.remove('open');
            mobileBtn.setAttribute('aria-expanded', 'false');
        });
    });

    // Scroll events
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const sy = window.scrollY;

        // Header scroll class
        header.classList.toggle('scrolled', sy > 60);

        // Active link
        let current = '';
        sections.forEach(sec => {
            if (sy >= sec.offsetTop - 140) current = sec.getAttribute('id');
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });

        lastScroll = sy;
    }, { passive: true });




    /* -----------------------------------------------------------------------
       BACK TO TOP
    ----------------------------------------------------------------------- */
    const backBtn = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        backBtn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));


    /* -----------------------------------------------------------------------
       PARTICLE CANVAS — Elegant floating dots
    ----------------------------------------------------------------------- */
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const PARTICLE_COUNT = 55;

        function resize() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }

        class Particle {
            constructor() { this.reset(true); }
            reset(init) {
                this.x = Math.random() * canvas.width;
                this.y = init ? Math.random() * canvas.height : canvas.height + 10;
                this.r = Math.random() * 2.5 + 0.5;
                this.vx = (Math.random() - 0.5) * 0.35;
                this.vy = -(Math.random() * 0.6 + 0.15);
                this.alpha = Math.random() * 0.45 + 0.1;
                this.color = Math.random() > 0.5 ? '76,175,80' : '93,64,55';
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
                ctx.fill();
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.y < -10) this.reset(false);
            }
        }

        function initParticles() {
            particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
        }

        function drawConnections() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(76,175,80,${0.06 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.7;
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawConnections();
            particles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animateParticles);
        }

        resize();
        initParticles();
        animateParticles();

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => { resize(); initParticles(); }, 200);
        });
    }


    /* -----------------------------------------------------------------------
       TYPING ANIMATION
    ----------------------------------------------------------------------- */
    const typedEl = document.querySelector('.typed-text');
    if (typedEl) {
        const phrases = [
            'Assistant Professor',
            'Lawyer',
            'International Trade Law Expert',
            'Young ICCA Member',
            'Legal Researcher'
        ];
        let pi = 0, ci = 0, deleting = false, delay = 110;

        function type() {
            const phrase = phrases[pi];
            if (deleting) {
                typedEl.textContent = phrase.substring(0, ci - 1);
                ci--;
                delay = 55;
            } else {
                typedEl.textContent = phrase.substring(0, ci + 1);
                ci++;
                delay = 110;
            }

            if (!deleting && ci === phrase.length) {
                delay = 1800;
                deleting = true;
            } else if (deleting && ci === 0) {
                deleting = false;
                pi = (pi + 1) % phrases.length;
                delay = 400;
            }
            setTimeout(type, delay);
        }
        setTimeout(type, 1000);
    }


    /* -----------------------------------------------------------------------
       SCROLL REVEAL — IntersectionObserver
    ----------------------------------------------------------------------- */
    const revealEls = document.querySelectorAll('.reveal');
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(({ target, isIntersecting }) => {
            if (isIntersecting) {
                target.classList.add('active');
                revealObs.unobserve(target);
            }
        });
    }, { threshold: 0.1 });
    revealEls.forEach(el => revealObs.observe(el));

    // Staggered children
    const staggerParents = document.querySelectorAll('.about-cards, .exp-cards, .edu-grid, .services-grid, .skills-wrapper');
    const staggerObs = new IntersectionObserver((entries) => {
        entries.forEach(({ target, isIntersecting }) => {
            if (isIntersecting) {
                const children = target.querySelectorAll('.stagger-child');
                children.forEach((child, i) => {
                    setTimeout(() => child.classList.add('active'), i * 120);
                });
                staggerObs.unobserve(target);
            }
        });
    }, { threshold: 0.08 });
    staggerParents.forEach(p => staggerObs.observe(p));




    /* -----------------------------------------------------------------------
       ANIMATED COUNTERS (hero stats)
    ----------------------------------------------------------------------- */
    const counters = document.querySelectorAll('.counter');
    if (counters.length) {
        const cObs = new IntersectionObserver((entries) => {
            entries.forEach(({ target, isIntersecting }) => {
                if (!isIntersecting) return;
                const end = parseFloat(target.dataset.target);
                const decimals = parseInt(target.dataset.decimals) || 0;
                const duration = 1600;
                const start = performance.now();

                function tick(now) {
                    const elapsed = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - elapsed, 3); // cubic ease-out
                    const current = eased * end;
                    target.textContent = decimals > 0
                        ? current.toFixed(decimals)
                        : Math.floor(current).toString();
                    if (elapsed < 1) requestAnimationFrame(tick);
                    else target.textContent = end.toFixed(decimals);
                }
                requestAnimationFrame(tick);
                cObs.unobserve(target);
            });
        }, { threshold: 0.5 });
        counters.forEach(c => cObs.observe(c));
    }


    /* -----------------------------------------------------------------------
       CONTACT FORM VALIDATION
    ----------------------------------------------------------------------- */
    const form = document.getElementById('contact-form');
    if (form) {
        const fields = {
            name: { el: form.querySelector('#name'), err: form.querySelector('#name-error'), validate: v => v.trim().length >= 2 },
            email: { el: form.querySelector('#email'), err: form.querySelector('#email-error'), validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) },
            message: { el: form.querySelector('#message'), err: form.querySelector('#message-error'), validate: v => v.trim().length >= 10 }
        };

        // Inline validation
        Object.values(fields).forEach(({ el, err, validate }) => {
            if (!el) return;
            el.addEventListener('input', () => {
                const ok = validate(el.value);
                el.parentElement.classList.toggle('error', !ok && el.value.length > 0);
            });
        });

        form.addEventListener('submit', e => {
            e.preventDefault();
            let valid = true;

            Object.values(fields).forEach(({ el, err, validate }) => {
                if (!el) return;
                const ok = validate(el.value);
                el.parentElement.classList.toggle('error', !ok);
                if (!ok) valid = false;
            });

            if (!valid) return;

            const submitBtn = form.querySelector('button[type="submit"]');
            const successEl = document.getElementById('form-success');
            const original = submitBtn.innerHTML;

            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.innerHTML = original;
                submitBtn.disabled = false;
                successEl.classList.add('show');
                form.reset();
                Object.values(fields).forEach(({ el }) => el && el.parentElement.classList.remove('error'));
                setTimeout(() => successEl.classList.remove('show'), 6000);
            }, 1600);
        });
    }

})();
