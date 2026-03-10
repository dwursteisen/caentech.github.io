document.addEventListener('DOMContentLoaded', function () {
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            const id = this.getAttribute('href');
            if (id === '#') return;
            e.preventDefault();
            const el = document.querySelector(id);
            if (el) {
                window.scrollTo({ top: el.offsetTop - 60, behavior: 'smooth' });
                // Close mobile nav if open
                document.getElementById('main-nav').classList.remove('open');
            }
        });
    });

    // Mobile nav toggle
    document.getElementById('nav-toggle').addEventListener('click', function () {
        document.getElementById('main-nav').classList.toggle('open');
    });

    // Scroll reveal
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    reveals.forEach(el => observer.observe(el));

    // Slideshow
    const slides = document.querySelectorAll('.slide');
    let idx = 0;
    if (slides.length) {
        slides[0].classList.add('active');
        setInterval(() => {
            slides[idx].classList.remove('active');
            idx = (idx + 1) % slides.length;
            slides[idx].classList.add('active');
        }, 5000);
    }
});
