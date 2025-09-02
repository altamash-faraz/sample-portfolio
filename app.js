// Altamash Faraz Portfolio - Interactive Features

document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.nav-hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });

    // Smooth Scrolling for Navigation Links (only internal links)
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only apply smooth scrolling to internal anchor links
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Smooth scrolling for hero buttons
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    heroButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only apply smooth scrolling to internal anchor links
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 70;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Active Navigation Link Highlighting
    const sections = document.querySelectorAll('section');
    const navBar = document.querySelector('.navbar');

    function highlightActiveNavLink() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // Back to Top Button
    const backToTopBtn = document.getElementById('backToTop');

    function toggleBackToTopButton() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }

    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Navbar Background on Scroll
    function updateNavbarBackground() {
        if (window.pageYOffset > 50) {
            navBar.classList.add('scrolled');
        } else {
            navBar.classList.remove('scrolled');
        }
    }

    // Ensure external links work properly
    function setupExternalLinks() {
        // Social media links
        const socialLinks = document.querySelectorAll('.social-link, .social-link-large');
        socialLinks.forEach(link => {
            // Ensure external links have proper attributes
            if (link.href.includes('github.com') || link.href.includes('linkedin.com') || link.href.includes('mailto:')) {
                link.setAttribute('target', '_blank');
                if (!link.href.includes('mailto:')) {
                    link.setAttribute('rel', 'noopener noreferrer');
                }
            }
            
            link.addEventListener('click', function(e) {
                // Add click animation
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
                
                // Analytics tracking (optional)
                const platform = this.href.includes('github') ? 'GitHub' : 
                               this.href.includes('linkedin') ? 'LinkedIn' : 
                               this.href.includes('mailto') ? 'Email' : 'Unknown';
                
                console.log(`Social link clicked: ${platform}`);
            });
        });

        // Project links with enhanced accessibility
        const projectLinks = document.querySelectorAll('.project-link');
        projectLinks.forEach(link => {
            // Ensure project links have proper attributes
            if (link.href.includes('github.com') || link.href.includes('streamlit.app') || link.href.includes('http')) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
                
                // Add descriptive aria-label if not present
                if (!link.getAttribute('aria-label')) {
                    const isGithub = link.href.includes('github.com');
                    const label = isGithub ? 'View GitHub Repository' : 'View Live Demo';
                    link.setAttribute('aria-label', label);
                }
            }
            
            link.addEventListener('click', function(e) {
                // Add click animation
                this.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
                
                // Analytics tracking
                const linkType = this.href.includes('github') ? 'GitHub' : 'Live Demo';
                console.log(`Project link clicked: ${linkType}`);
            });
        });

        // Contact links
        const contactLinks = document.querySelectorAll('.contact-item a');
        contactLinks.forEach(link => {
            if (link.href.includes('tel:') || link.href.includes('mailto:')) {
                // Phone and email links should work normally
                link.addEventListener('click', function() {
                    const type = this.href.includes('tel:') ? 'Phone' : 'Email';
                    console.log(`Contact ${type} clicked`);
                });
            }
        });
    }

    // Initialize external links
    setupExternalLinks();

    // Scroll Event Listeners
    window.addEventListener('scroll', function() {
        highlightActiveNavLink();
        toggleBackToTopButton();
        updateNavbarBackground();
        animateOnScroll();
    });

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animations
    const animateElements = document.querySelectorAll('.project-card, .education-card, .certification-card, .timeline-item, .skill-category, .contact-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Typing Animation for Hero Title
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }

    // Initialize typing animation
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 80);
        }, 1000);
    }

    // Animate skill tags on hover
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Animate tech tags on hover
    const techTags = document.querySelectorAll('.tech-tag');
    techTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.boxShadow = '0 4px 12px rgba(50, 184, 198, 0.3)';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
    });

    // Scroll Progress Indicator
    function updateScrollProgress() {
        const scrollProgress = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        
        // Create progress bar if it doesn't exist
        let progressBar = document.querySelector('.scroll-progress');
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.className = 'scroll-progress';
            progressBar.style.cssText = `
                position: fixed;
                top: 70px;
                left: 0;
                width: ${scrollProgress}%;
                height: 3px;
                background: var(--color-primary);
                z-index: 1001;
                transition: width 0.1s ease;
            `;
            document.body.appendChild(progressBar);
        } else {
            progressBar.style.width = `${scrollProgress}%`;
        }
    }

    window.addEventListener('scroll', updateScrollProgress);

    // Scroll Animation Function
    function animateOnScroll() {
        // Hero parallax effect
        const hero = document.querySelector('.hero');
        const scrolled = window.pageYOffset;
        if (hero && scrolled < window.innerHeight) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }

        // Timeline animation
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            const itemTop = item.offsetTop;
            const itemHeight = item.clientHeight;
            const windowHeight = window.innerHeight;
            const scrollTop = window.pageYOffset;

            if (scrollTop > itemTop - windowHeight + itemHeight / 3) {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }
        });
    }

    // Initialize timeline items for animation
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'all 0.6s ease';
    });

    // Project card interactions
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add subtle glow effect
            this.style.boxShadow = '0 20px 40px rgba(50, 184, 198, 0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
    });

    // Add loading animation
    function addLoadingAnimation() {
        const sections = document.querySelectorAll('section');
        sections.forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'all 0.8s ease';
            
            setTimeout(() => {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    // Initialize loading animation
    setTimeout(addLoadingAnimation, 100);

    // Contact form interaction
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(5deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });

    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // Press 'Escape' to close mobile menu
        if (e.key === 'Escape') {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
        
        // Press 'Home' key to scroll to top
        if (e.key === 'Home' && e.ctrlKey) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });

    // Initial function calls
    highlightActiveNavLink();
    toggleBackToTopButton();
    updateNavbarBackground();
    updateScrollProgress();

    // Console welcome message
    console.log(`
    🚀 Welcome to Altamash Faraz's Portfolio!
    
    📧 Email: aarij.altamash2003@gmail.com
    🔗 GitHub: https://github.com/altamash-faraz
    💼 LinkedIn: https://www.linkedin.com/in/altamashfaraz/
    
    Thanks for visiting! Feel free to explore the code.
    `);

    // Performance monitoring and optimization
    window.addEventListener('load', function() {
        const loadTime = performance.now();
        console.log(`Portfolio loaded in ${Math.round(loadTime)}ms`);
        
        // Lazy load images if any are added in the future
        if ('IntersectionObserver' in window) {
            const lazyImages = document.querySelectorAll('img[data-src]');
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(img => imageObserver.observe(img));
        }
        
        // Preload critical resources
        const criticalResources = [
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = resource;
            document.head.appendChild(link);
        });
    });

    // Enhanced accessibility features
    function enhanceAccessibility() {
        // Add focus indicators for keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', function() {
            document.body.classList.remove('keyboard-navigation');
        });

        // Skip to main content link
        const skipLink = document.createElement('a');
        skipLink.href = '#home';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--color-primary);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 10000;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', function() {
            this.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', function() {
            this.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);

        // Enhance form accessibility (if forms are added later)
        const formInputs = document.querySelectorAll('input, textarea, select');
        formInputs.forEach(input => {
            if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
                const label = input.previousElementSibling;
                if (label && label.tagName === 'LABEL') {
                    const id = input.id || `input-${Math.random().toString(36).substr(2, 9)}`;
                    input.id = id;
                    label.setAttribute('for', id);
                }
            }
        });

        // Add reduced motion support
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        function handleReducedMotion() {
            if (prefersReducedMotion.matches) {
                document.body.classList.add('reduced-motion');
                // Disable animations for users who prefer reduced motion
                const style = document.createElement('style');
                style.textContent = `
                    .reduced-motion * {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                    }
                `;
                document.head.appendChild(style);
            }
        }
        
        handleReducedMotion();
        prefersReducedMotion.addEventListener('change', handleReducedMotion);
    }

    // Initialize accessibility enhancements
    enhanceAccessibility();

    // Add intersection observer for stagger animations
    const staggerObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const children = entry.target.children;
                Array.from(children).forEach((child, index) => {
                    setTimeout(() => {
                        child.style.opacity = '1';
                        child.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        });
    }, { threshold: 0.1 });

    // Observe sections with multiple children for stagger effect
    const staggerSections = document.querySelectorAll('.projects-grid, .skills-grid, .education-grid, .certifications-grid');
    staggerSections.forEach(section => {
        const children = section.children;
        Array.from(children).forEach(child => {
            child.style.opacity = '0';
            child.style.transform = 'translateY(20px)';
            child.style.transition = 'all 0.6s ease';
        });
        staggerObserver.observe(section);
    });

    // Add custom cursor effect for project cards (optional enhancement)
    function addCustomCursor() {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: var(--color-primary);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
            opacity: 0;
        `;
        document.body.appendChild(cursor);

        document.addEventListener('mousemove', function(e) {
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
        });

        projectCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                cursor.style.opacity = '0.7';
                cursor.style.transform = 'scale(1.5)';
            });
            
            card.addEventListener('mouseleave', function() {
                cursor.style.opacity = '0';
                cursor.style.transform = 'scale(1)';
            });
        });
    }

    // Initialize custom cursor on desktop only
    if (window.innerWidth > 768) {
        addCustomCursor();
    }

    // Theme preference detection and handling
    function handleThemePreference() {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (!prefersDark) {
            console.log('Light theme preference detected, but portfolio is optimized for dark theme');
        }
    }

    handleThemePreference();
    
    // Listen for theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handleThemePreference);

});

// Utility function for smooth scrolling to any element
function scrollToElement(elementId, offset = 70) {
    const element = document.getElementById(elementId);
    if (element) {
        const elementPosition = element.offsetTop - offset;
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
}

// Export function for external use
window.portfolioUtils = {
    scrollToElement: scrollToElement
};