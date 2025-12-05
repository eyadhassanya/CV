// ===========================
// Initialize on DOM Load
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
    initGSAPAnimations();
    initAnimeJSAnimations();
    initSmoothScrolling();
    initSkillBars();
});

// ===========================
// Three.js Particle Background
// ===========================

function initThreeJS() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.position.z = 5;

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 20;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Create material
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.03,
        color: 0xffffff,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    // Create mesh
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Mouse position
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // Animation loop
    let animationId;
    const animate = () => {
        animationId = requestAnimationFrame(animate);

        // Rotate particles
        particlesMesh.rotation.y += 0.0005;
        particlesMesh.rotation.x += 0.0002;

        // Mouse interaction
        camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
        camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.05;

        renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Clean up when scrolling away from hero
    let hasScrolledAway = false;
    window.addEventListener('scroll', () => {
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;

        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;

        if (window.scrollY > heroBottom && !hasScrolledAway) {
            hasScrolledAway = true;
            cancelAnimationFrame(animationId);
        } else if (window.scrollY <= heroBottom && hasScrolledAway) {
            hasScrolledAway = false;
            animate();
        }
    });
}

// ===========================
// GSAP Scroll Animations
// ===========================

function initGSAPAnimations() {
    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Hero animations
    const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

    heroTimeline
        .to('.hero-title', {
            opacity: 1,
            y: 0,
            duration: 1.2,
            delay: 0.3
        })
        .to('.hero-subtitle', {
            opacity: 1,
            y: 0,
            duration: 1,
        }, '-=0.8')
        .to('.cta-button', {
            opacity: 1,
            y: 0,
            duration: 1,
        }, '-=0.8');

    // Section title animations
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // Glass panel animation
    gsap.from('.glass-panel', {
        scrollTrigger: {
            trigger: '.glass-panel',
            start: 'top 75%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 60,
        duration: 1.2,
        ease: 'power3.out'
    });

    // Skill cards stagger animation
    gsap.from('.skill-card', {
        scrollTrigger: {
            trigger: '.skills-grid',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 80,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out'
    });

    // Project cards stagger animation
    gsap.from('.project-card', {
        scrollTrigger: {
            trigger: '.projects-grid',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        scale: 0.85,
        stagger: 0.2,
        duration: 0.9,
        ease: 'back.out(1.4)'
    });

    // Contact items animation
    gsap.from('.contact-item', {
        scrollTrigger: {
            trigger: '.contact-info',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        x: -30,
        stagger: 0.2,
        duration: 0.8,
        ease: 'power2.out'
    });

    // Footer animation
    gsap.from('.social-link', {
        scrollTrigger: {
            trigger: '.footer',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power2.out'
    });
}

// ===========================
// Anime.js Animations
// ===========================

function initAnimeJSAnimations() {
    // Animate hero title letters
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.innerHTML = heroTitle.textContent.split('').map(
            char => `<span class="char">${char}</span>`
        ).join('');

        anime({
            targets: '.hero-title .char',
            translateY: [40, 0],
            opacity: [0, 1],
            easing: 'easeOutExpo',
            duration: 1200,
            delay: (el, i) => 500 + 50 * i
        });
    }

    // CTA button pulse animation
    anime({
        targets: '.cta-button',
        scale: [1, 1.05, 1],
        duration: 2000,
        easing: 'easeInOutQuad',
        loop: true,
        delay: 3000
    });

    // Scroll indicator animation
    anime({
        targets: '.scroll-line',
        translateY: [
            { value: -10, duration: 1000 },
            { value: 10, duration: 1000 }
        ],
        opacity: [
            { value: 0.3, duration: 1000 },
            { value: 1, duration: 500 },
            { value: 0.3, duration: 500 }
        ],
        easing: 'easeInOutSine',
        loop: true
    });

    // Skill icons rotation on hover
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach(card => {
        const icon = card.querySelector('.skill-icon svg');

        card.addEventListener('mouseenter', () => {
            anime({
                targets: icon,
                rotate: '1turn',
                duration: 800,
                easing: 'easeInOutExpo'
            });
        });
    });

    // Project icons bounce on hover
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        const icon = card.querySelector('.project-icon svg');

        card.addEventListener('mouseenter', () => {
            anime({
                targets: icon,
                translateY: [
                    { value: -10, duration: 300 },
                    { value: 0, duration: 300 }
                ],
                easing: 'easeOutElastic(1, .6)'
            });
        });
    });
}

// ===========================
// Skill Bars Animation
// ===========================

function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const percentage = progressBar.getAttribute('data-progress');

                // Animate width
                setTimeout(() => {
                    progressBar.style.width = percentage + '%';
                }, 200);

                // Animate percentage number
                const card = progressBar.closest('.skill-card');
                const percentageElement = card.querySelector('.skill-percentage');

                anime({
                    targets: percentageElement,
                    innerHTML: [0, percentage],
                    duration: 1500,
                    round: 1,
                    easing: 'easeOutExpo',
                    delay: 200,
                    update: function () {
                        percentageElement.innerHTML = Math.round(percentageElement.innerHTML) + '%';
                    }
                });

                observer.unobserve(progressBar);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => observer.observe(bar));
}

// ===========================
// Smooth Scrolling
// ===========================

function initSmoothScrolling() {
    // CTA button smooth scroll
    const ctaButton = document.getElementById('cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', (e) => {
            e.preventDefault();
            const projectsSection = document.getElementById('projects');
            if (projectsSection) {
                projectsSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // Add ripple effect to CTA button
    ctaButton?.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });

    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===========================
// Performance Optimizations
// ===========================

// Reduce animations on mobile for performance
if (window.innerWidth < 768) {
    // Disable Three.js on mobile
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        canvas.style.display = 'none';
    }
}

// Pause animations when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause GSAP animations
        gsap.globalTimeline.pause();
    } else {
        // Resume GSAP animations
        gsap.globalTimeline.resume();
    }
});

// ===========================
// Console Easter Egg
// ===========================

console.log('%c👋 Hello there!', 'font-size: 24px; font-weight: bold; color: #0071e3;');
console.log('%cI see you\'re curious about code!', 'font-size: 16px; color: #667eea;');
console.log('%cFeel free to reach out: eyadhassan@gmail.com', 'font-size: 14px; color: #86868b;');
