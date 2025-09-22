// Altamash Faraz Portfolio - Interactive Features

document.addEventListener('DOMContentLoaded', function() {
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    function handleNavbarScroll() {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (currentScrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    }
    
    // Add scroll listener with throttling
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                handleNavbarScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Smooth scroll fallback function for older browsers
    function smoothScrollTo(targetY, duration = 800) {
        const startY = window.pageYOffset;
        const difference = targetY - startY;
        const startTime = performance.now();
        
        function step(currentTime) {
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            // Easing function (ease-in-out-cubic)
            const ease = progress < 0.5 
                ? 4 * progress * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            window.scrollTo(0, startY + (difference * ease));
            
            if (timeElapsed < duration) {
                requestAnimationFrame(step);
            }
        }
        
        requestAnimationFrame(step);
    }
    
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

    // Simple and reliable navigation solution
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const href = this.getAttribute('href');
            if (!href || !href.startsWith('#')) return;
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            console.log(`Clicking nav link for: ${targetId}`);
            
            if (targetElement) {
                // Remove active class from all links
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                // Add active class to current link
                this.classList.add('active');
                
                // Get navbar height
                const navbar = document.querySelector('.navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 80;
                
                // Calculate target position
                const elementPosition = targetElement.offsetTop;
                const offsetPosition = elementPosition - navbarHeight - 20;
                
                console.log(`Scrolling to ${targetId} at position: ${offsetPosition}`);
                
                // Simple scroll
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Fallback for older browsers
                setTimeout(() => {
                    if (Math.abs(window.pageYOffset - offsetPosition) > 50) {
                        console.log('Fallback scroll triggered');
                        window.scrollTo(0, offsetPosition);
                    }
                }, 1000);
            } else {
                console.error(`Element not found: ${targetId}`);
            }
        });
    });

    // Direct navigation function for testing
    window.testNavigation = function(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            const navbar = document.querySelector('.navbar');
            const navbarHeight = navbar ? navbar.offsetHeight : 80;
            const position = element.offsetTop - navbarHeight - 20;
            
            console.log(`Testing navigation to ${sectionId}:`);
            console.log(`Element found:`, element);
            console.log(`Element offsetTop:`, element.offsetTop);
            console.log(`Navbar height:`, navbarHeight);
            console.log(`Final position:`, position);
            
            window.scrollTo({
                top: position,
                behavior: 'smooth'
            });
            
            return true;
        } else {
            console.error(`Element ${sectionId} not found`);
            return false;
        }
    };
    
    // Test the specific problematic sections
    console.log('Available sections:');
    ['education', 'certificates', 'contact'].forEach(id => {
        const element = document.getElementById(id);
        console.log(`${id}: ${element ? 'FOUND' : 'NOT FOUND'}`);
        if (element) {
            console.log(`  Position: ${element.offsetTop}px`);
        }
    });
    
    // Add keyboard shortcuts for testing
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey) {
            switch(e.key) {
                case '1':
                    e.preventDefault();
                    testNavigation('education');
                    break;
                case '2':
                    e.preventDefault();
                    testNavigation('certificates');
                    break;
                case '3':
                    e.preventDefault();
                    testNavigation('contact');
                    break;
            }
        }
    });

    // Enhanced smooth scrolling for hero buttons (with improved reliability)
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    heroButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only apply smooth scrolling to internal anchor links
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    console.log(`Hero button navigating to section: ${targetId}`);
                    
                    // Calculate offset with navbar height
                    const navbarHeight = document.querySelector('.navbar').offsetHeight;
                    const offsetTop = targetSection.offsetTop - navbarHeight - 10;
                    
                    try {
                        if ('scrollBehavior' in document.documentElement.style) {
                            window.scrollTo({
                                top: Math.max(0, offsetTop),
                                behavior: 'smooth'
                            });
                        } else {
                            smoothScrollTo(Math.max(0, offsetTop), 800);
                        }
                    } catch (error) {
                        console.warn('Smooth scrolling failed, using instant scroll:', error);
                        window.scrollTo(0, Math.max(0, offsetTop));
                    }
                } else {
                    console.error(`Section not found: ${targetId}`);
                }
            }
        });
    });

    // Enhanced Active Navigation Link Highlighting
    const sections = document.querySelectorAll('section');
    const navBar = document.querySelector('.navbar');

    function highlightActiveNavLink() {
        let current = '';
        const scrollPos = window.pageYOffset + 100; // Account for navbar height
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = sectionId;
            }
        });

        // If we're at the very top, highlight home
        if (window.pageYOffset < 100) {
            current = 'home';
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            if (linkHref === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // Enhanced Back to Top Button
    const backToTopBtn = document.getElementById('backToTop');

    function toggleBackToTopButton() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            try {
                if ('scrollBehavior' in document.documentElement.style) {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                } else {
                    smoothScrollTo(0, 800);
                }
            } catch (error) {
                window.scrollTo(0, 0);
            }
            
            // Reset active nav link to home
            navLinks.forEach(link => link.classList.remove('active'));
            const homeLink = document.querySelector('.nav-link[href="#home"]');
            if (homeLink) homeLink.classList.add('active');
        });
    }

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

    // Fallback function to show manual download instructions
    function showDownloadInstructions() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10001;
            font-family: var(--font-family-base);
        `;
        
        modal.innerHTML = `
            <div style="
                background: var(--color-surface);
                border-radius: var(--radius-lg);
                padding: var(--space-24);
                max-width: 500px;
                margin: var(--space-20);
                text-align: center;
                color: var(--color-text);
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            ">
                <h3 style="margin-bottom: var(--space-16); color: var(--color-primary);">
                    <i class="fas fa-download"></i> Manual Download Required
                </h3>
                <p style="margin-bottom: var(--space-20); line-height: 1.6;">
                    Automatic download failed. Please follow these steps:
                </p>
                <div style="text-align: left; margin-bottom: var(--space-20);">
                    <p><strong>1.</strong> Click the "View Resume" button</p>
                    <p><strong>2.</strong> In the Google Drive viewer, click the download icon (⬇)</p>
                    <p><strong>3.</strong> Or right-click and select "Save As..."</p>
                </div>
                <div style="display: flex; gap: var(--space-12); justify-content: center;">
                    <button id="openResumeBtn" style="
                        background: var(--color-primary);
                        color: var(--color-btn-primary-text);
                        border: none;
                        padding: var(--space-12) var(--space-20);
                        border-radius: var(--radius-md);
                        cursor: pointer;
                        font-weight: 500;
                    ">
                        Open Resume
                    </button>
                    <button id="closeModalBtn" style="
                        background: var(--color-secondary);
                        color: var(--color-text);
                        border: none;
                        padding: var(--space-12) var(--space-20);
                        border-radius: var(--radius-md);
                        cursor: pointer;
                        font-weight: 500;
                    ">
                        Close
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        const openResumeBtn = modal.querySelector('#openResumeBtn');
        const closeModalBtn = modal.querySelector('#closeModalBtn');
        
        openResumeBtn.addEventListener('click', () => {
            window.open('https://drive.google.com/file/d/11tuThjdCpe5aDvRnwL2U-z_9GlD_jRKj/view?usp=drive_link', '_blank');
            document.body.removeChild(modal);
        });
        
        closeModalBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

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

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove any existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        
        const icon = type === 'success' ? 'fas fa-check-circle' : 'fas fa-info-circle';
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="${icon}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.classList.add('notification--show');
        }, 100);

        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('notification--show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }

    // Resume functionality
    function setupResumeFeatures() {
        console.log('Setting up resume features...');
        
        const resumeViewBtn = document.getElementById('resume-view-btn');
        const resumeDownloadBtn = document.getElementById('resume-download-btn');
        
        console.log('Resume view button found:', resumeViewBtn);
        console.log('Resume download button found:', resumeDownloadBtn);
        
        // Resume URLs - Updated to specific resume file
        const resumeViewUrl = 'https://drive.google.com/file/d/11tuThjdCpe5aDvRnwL2U-z_9GlD_jRKj/view?usp=drive_link';
        const resumeDownloadUrl = 'https://drive.google.com/uc?export=download&id=11tuThjdCpe5aDvRnwL2U-z_9GlD_jRKj';
        
        if (resumeViewBtn) {
            resumeViewBtn.href = resumeViewUrl;
            resumeViewBtn.addEventListener('click', function(e) {
                console.log('Resume view clicked');
                
                // Add click animation
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
                
                // Show notification
                showNotification('Opening resume...', 'info');
            });
        } else {
            console.error('Resume view button not found!');
        }
        
        if (resumeDownloadBtn) {
            // Remove href attribute to handle download manually
            resumeDownloadBtn.removeAttribute('href');
            resumeDownloadBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Resume download clicked');
                
                // Add click animation
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
                
                // Start download process
                downloadResume();
            });
        } else {
            console.error('Resume download button not found!');
        }
    }
    
    // Enhanced resume download function with multiple fallbacks
    function downloadResume() {
        console.log('Starting resume download...');
        showNotification('Opening resume for download...', 'info');
        
        const fileId = '1R1XGazRsPXy48cFLzTPF53ofiIa_KxjD';
        const fileName = 'Altamash_Faraz_Resume.pdf';
        
        try {
            // Method 1: Try direct download link
            const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
            
            // Create a temporary link and click it
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = fileName;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            
            // Add to DOM temporarily
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            console.log('Resume download method 1 triggered');
            
            // Show success message
            setTimeout(() => {
                showNotification('Download started! If download doesn\'t begin automatically, try the alternative link.', 'success');
            }, 1000);
            
        } catch (error) {
            console.error('Resume download failed:', error);
            
            // Fallback: Open in new tab
            try {
                const viewUrl = `https://drive.google.com/file/d/${fileId}/view`;
                window.open(viewUrl, '_blank', 'noopener,noreferrer');
                showNotification('Resume opened in new tab. Use the download button in Google Drive.', 'warning');
            } catch (fallbackError) {
                console.error('Fallback method also failed:', fallbackError);
                showNotification('Unable to download resume. Please contact me directly.', 'error');
            }
        }
    }
    
    // Initialize resume features
    setupResumeFeatures();
    
    // Initialize enhanced animations
    initializeEnhancedAnimations();

});

// Enhanced Animation System
function initializeEnhancedAnimations() {
    console.log('Initializing enhanced animations...');
    
    // Intersection Observer for scroll-triggered animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-visible');
                // Optional: unobserve after animation to improve performance
                // animationObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Add animation classes to elements that should animate on scroll
    const animateElements = document.querySelectorAll('.card, .project-card, .experience-item, .skill-category, .section-title, .section-subtitle');
    
    animateElements.forEach((element, index) => {
        element.classList.add('animate-on-scroll');
        
        // Add staggered delay for multiple elements
        if (element.parentElement?.children.length > 1) {
            const delay = (index % 4) + 1; // Cycles through delay-1 to delay-4
            element.classList.add(`animate-delay-${delay}`);
        }
        
        animationObserver.observe(element);
    });
    
    // Enhanced button interactions
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        // Add hover lift effect
        button.classList.add('hover-lift');
        
        // Add ripple effect on click
        button.addEventListener('click', function(e) {
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
    });
    
    // Add floating animation to hero elements
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    
    if (heroTitle) heroTitle.classList.add('animate-float');
    if (heroSubtitle) heroSubtitle.classList.add('animate-fade-in-up', 'animate-delay-2');
    
    // Enhanced card hover effects
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.classList.add('hover-lift', 'hover-glow');
        
        // Add subtle tilt effect on hover
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // Smooth parallax effect for sections
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
    
    console.log('Enhanced animations initialized successfully!');
}

// CSS for ripple effect (injected dynamically)
function injectRippleStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .btn {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            pointer-events: none;
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            z-index: 1;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        .parallax {
            will-change: transform;
        }
    `;
    document.head.appendChild(style);
}

// Initialize ripple styles when DOM is ready
document.addEventListener('DOMContentLoaded', injectRippleStyles);

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