/**
 * TACTTUS Landing Page
 * Interactive features and animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all features
    initScrollAnimations();
    initSmoothScroll();
    initNavbarBehavior();
    initMobileMenu();
    initCompanyTabs();
});

/**
 * Company tabs - switch content based on selected company
 */
function initCompanyTabs() {
    const tabs = document.querySelectorAll('.logo-tab');
    const contents = document.querySelectorAll('.company-content');
    
    if (!tabs.length) return;
    
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const company = tab.dataset.company;
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update active content
            contents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `content-${company}`) {
                    content.classList.add('active');
                }
            });
        });
    });
}

/**
 * Scroll-triggered animations using Intersection Observer
 */
function initScrollAnimations() {
    // Add animation class to elements
    const animatableSelectors = [
        '.problem-card',
        '.service-card',
        '.work-card',
        '.about-image',
        '.about-content',
        '.cta-content'
    ];

    animatableSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add('animate-on-scroll');
        });
    });

    // Create observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optionally unobserve after animation
                // observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all animatable elements
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                document.body.classList.remove('menu-open');
            }
        });
    });
}

/**
 * Navbar behavior - adds background on scroll
 */
function initNavbarBehavior() {
    const nav = document.querySelector('.nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        // Add/remove scrolled class
        if (currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Hide/show on scroll direction (optional - commented out)
        // if (currentScroll > lastScroll && currentScroll > 200) {
        //     nav.style.transform = 'translateY(-100%)';
        // } else {
        //     nav.style.transform = 'translateY(0)';
        // }
        
        lastScroll = currentScroll;
    });
}

/**
 * Mobile menu toggle
 * Note: The click handler is now inline on the button element
 * This function only handles closing when clicking outside
 */
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    
    if (!mobileMenuBtn) return;

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav') && !e.target.closest('.mobile-menu') && document.body.classList.contains('menu-open')) {
            document.body.classList.remove('menu-open');
            mobileMenuBtn.classList.remove('active');
        }
    });
    
    // Close menu when clicking a nav link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            document.body.classList.remove('menu-open');
            mobileMenuBtn.classList.remove('active');
        });
    });
}

/**
 * Optional: Typing effect for hero title
 * Uncomment to enable
 */
/*
function initTypingEffect() {
    const words = ['Infrastructure', 'Workflows', 'Processes', 'Systems'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const pauseTime = 2000;

    const element = document.querySelector('.title-line.accent');
    if (!element) return;

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            element.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            element.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? deletingSpeed : typingSpeed;

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = pauseTime;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
        }

        setTimeout(type, typeSpeed);
    }

    // Start after initial animation
    setTimeout(type, 2000);
}
*/

/**
 * Optional: Parallax effect for hero orbs
 */
document.addEventListener('mousemove', (e) => {
    const orbs = document.querySelectorAll('.gradient-orb');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    orbs.forEach((orb, index) => {
        const speed = (index + 1) * 20;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;
        
        orb.style.transform = `translate(${x}px, ${y}px)`;
    });
});

/**
 * Console easter egg
 */
console.log(`
╔═══════════════════════════════════════════════╗
║                                               ║
║   🚀 TACTTUS                                  ║
║   AI Infrastructure for Growth Teams          ║
║                                               ║
║   Built with 💙 by Matias Honorato            ║
║                                               ║
╚═══════════════════════════════════════════════╝
`);

