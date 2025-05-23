document.addEventListener('DOMContentLoaded', function () {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('header nav a, .footer-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 70,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });


    // Responsive navigation menu for mobile (simple toggle)
    const navToggle = document.createElement('button');
    navToggle.className = 'nav-toggle';
    navToggle.innerHTML = '<i class="fas fa-bars"></i>';

    const header = document.querySelector('header .container');
    const nav = document.querySelector('header nav');

    if (window.innerWidth < 768) {
        // Only add the toggle button on mobile view
        header.insertBefore(navToggle, nav);
        nav.style.display = 'none';

        navToggle.addEventListener('click', function () {
            if (nav.style.display === 'none') {
                nav.style.display = 'block';
                this.innerHTML = '<i class="fas fa-times"></i>';
            } else {
                nav.style.display = 'none';
                this.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }

    // Ajouter des effets de particules pour la couleur principale (#8deeb2)
    const createParticleEffect = function () {
        const heroSection = document.querySelector('.hero');
        if (!heroSection) return;

        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            // Position aléatoire
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const size = Math.random() * 10 + 5;
            const duration = Math.random() * 10 + 10;
            const delay = Math.random() * 5;

            particle.style.cssText = `
                position: absolute;
                top: ${posY}%;
                left: ${posX}%;
                width: ${size}px;
                height: ${size}px;
                background-color: rgba(141, 238, 178, 0.2);
                border-radius: 50%;
                pointer-events: none;
                opacity: 0;
                animation: float ${duration}s ease-in-out ${delay}s infinite;
            `;

            heroSection.appendChild(particle);
        }
    };

    // Créer l'effet de particules
    createParticleEffect();

    // Add animation when scrolling to sections
    const animateOnScroll = function () {
        const sections = document.querySelectorAll('section');

        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (sectionTop < windowHeight * 0.75) {
                section.classList.add('animated');
            }
        });
    };

    // Initial check and then on scroll
    document.querySelector('.hero').classList.add('animated');
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
});
