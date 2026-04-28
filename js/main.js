// ========================================
// SCOPE ANAESTHESIA SERVICES - MAIN SCRIPT
// ========================================

// ========================================
// Mobile Navigation Toggle
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Check if it's a dropdown link
            if (this.parentElement.classList.contains('dropdown')) {
                e.preventDefault();
            }
            if (navMenu.classList.contains('active') && !this.parentElement.classList.contains('dropdown')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });

    // Handle dropdown on mobile
    const dropdownItems = document.querySelectorAll('.dropdown');
    dropdownItems.forEach(item => {
        const link = item.querySelector('.nav-link');
        if (link) {
            link.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    item.classList.toggle('active');
                }
            });
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.navbar')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
});

// ========================================
// Animate Stats Counter
// ========================================

function animateCounter() {
    const stats = document.querySelectorAll('.stat-number');
    let hasAnimated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                stats.forEach(stat => {
                    const target = stat.getAttribute('data-target');
                    const isText = isNaN(target);

                    if (isText) {
                        // For text values like "24/7"
                        stat.textContent = target;
                    } else {
                        // For numeric values
                        animateValue(stat, 0, parseInt(target), 2000);
                    }
                });
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        observer.observe(statsSection);
    }
}

function animateValue(element, start, end, duration) {
    let current = start;
    const increment = (end - start) / (duration / 16);

    function update() {
        current += increment;
        if (current >= end) {
            element.textContent = end + '+';
        } else {
            element.textContent = Math.floor(current);
            requestAnimationFrame(update);
        }
    }

    update();
}

// Call animation when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', animateCounter);
} else {
    animateCounter();
}

// ========================================
// Smooth Scrolling for Anchor Links
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========================================
// Navbar Background Change on Scroll
// ========================================

window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// ========================================
// Active Navigation Link on Scroll
// ========================================

window.addEventListener('scroll', function() {
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current ||
            (current === '' && link.getAttribute('href') === 'index.html')) {
            link.classList.add('active');
        }
    });
});

// ========================================
// Add animation to elements on scroll
// ========================================

function observeElements() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const elementsToObserve = document.querySelectorAll(
        '.care-card, .service-card, .highlight-item, .featured-item'
    );

    elementsToObserve.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeElements);
} else {
    observeElements();
}

// ========================================
// Responsive Navigation
// ========================================

window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        const navMenu = document.querySelector('.nav-menu');
        const hamburger = document.querySelector('.hamburger');
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// ========================================
// Console message for branding
// ========================================

console.log('%cScope Anaesthesia Services', 'color: #1B3A5C; font-size: 20px; font-weight: bold;');
console.log('%cExcellence in Anaesthesia, Critical Care & Pain Management', 'color: #5BBCD5; font-size: 14px;');
