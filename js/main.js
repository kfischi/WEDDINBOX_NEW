/**
 * WEDDINBOX MAIN JAVASCRIPT
 * Advanced Interactive Features for Luxury Wedding Events
 */

'use strict';

// Global Configuration
const WeddinboxConfig = {
    animations: {
        duration: {
            fast: 300,
            normal: 600,
            slow: 1000
        },
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    },
    breakpoints: {
        mobile: 768,
        tablet: 1024,
        desktop: 1200
    },
    colors: {
        primaryGold: '#D4AF37',
        darkGold: '#B8941F',
        lightGold: '#F4E4BC'
    }
};

// Utility Functions
const Utils = {
    // Debounce function for performance optimization
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for scroll events
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Check if element is in viewport
    isInViewport(element, offset = 0) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= -offset &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Get device type
    getDeviceType() {
        const width = window.innerWidth;
        if (width < WeddinboxConfig.breakpoints.mobile) return 'mobile';
        if (width < WeddinboxConfig.breakpoints.tablet) return 'tablet';
        return 'desktop';
    },

    // Animate element with CSS classes
    animateElement(element, animationClass, duration = 1000) {
        return new Promise((resolve) => {
            element.classList.add(animationClass);
            setTimeout(() => {
                element.classList.remove(animationClass);
                resolve();
            }, duration);
        });
    },

    // Smooth scroll to element
    smoothScrollTo(target, offset = 0) {
        const element = typeof target === 'string' ? document.querySelector(target) : target;
        if (element) {
            const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
};

// Navigation Controller
const NavigationController = {
    init() {
        this.setupMobileMenu();
        this.setupSmoothScroll();
        this.setupActiveNavigation();
        this.setupFloatingNav();
    },

    setupMobileMenu() {
        const mobileMenuButton = document.querySelector('[data-mobile-menu-button]');
        const mobileMenu = document.querySelector('[data-mobile-menu]');
        
        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', () => {
                const isOpen = mobileMenu.classList.contains('active');
                
                if (isOpen) {
                    this.closeMobileMenu();
                } else {
                    this.openMobileMenu();
                }
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileMenuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });

            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeMobileMenu();
                }
            });
        }
    },

    openMobileMenu() {
        const mobileMenu = document.querySelector('[data-mobile-menu]');
        const mobileMenuButton = document.querySelector('[data-mobile-menu-button]');
        
        if (mobileMenu) {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            if (mobileMenuButton) {
                mobileMenuButton.setAttribute('aria-expanded', 'true');
            }
        }
    },

    closeMobileMenu() {
        const mobileMenu = document.querySelector('[data-mobile-menu]');
        const mobileMenuButton = document.querySelector('[data-mobile-menu-button]');
        
        if (mobileMenu) {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
            
            if (mobileMenuButton) {
                mobileMenuButton.setAttribute('aria-expanded', 'false');
            }
        }
    },

    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    const navHeight = document.querySelector('.nav-floating')?.offsetHeight || 80;
                    Utils.smoothScrollTo(target, navHeight + 20);
                    this.closeMobileMenu();
                }
            });
        });
    },

    setupActiveNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section[id]');
        
        if (sections.length === 0) return;

        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const targetId = entry.target.id;
                    navLinks.forEach(link => {
                        const href = link.getAttribute('href');
                        link.classList.toggle('active', href === `#${targetId}`);
                    });
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, {
            threshold: 0.3,
            rootMargin: '-100px 0px -100px 0px'
        });

        sections.forEach(section => observer.observe(section));
    },

    setupFloatingNav() {
        const nav = document.querySelector('.nav-floating');
        if (!nav) return;

        let lastScrollY = window.scrollY;
        let isNavVisible = true;

        const handleScroll = Utils.throttle(() => {
            const currentScrollY = window.scrollY;
            const scrollingDown = currentScrollY > lastScrollY;
            const shouldHideNav = scrollingDown && currentScrollY > 100;

            if (shouldHideNav && isNavVisible) {
                nav.style.transform = 'translateX(-50%) translateY(-100%)';
                nav.style.opacity = '0';
                isNavVisible = false;
            } else if (!shouldHideNav && !isNavVisible) {
                nav.style.transform = 'translateX(-50%) translateY(0)';
                nav.style.opacity = '1';
                isNavVisible = true;
            }

            // Add blur effect based on scroll
            const blurAmount = Math.min(currentScrollY / 10, 20);
            nav.style.backdropFilter = `blur(${blurAmount}px)`;

            lastScrollY = currentScrollY;
        }, 16);

        window.addEventListener('scroll', handleScroll);
    }
};

// Animations Controller
const AnimationsController = {
    init() {
        this.setupScrollReveal();
        this.setupParallaxElements();
        this.setupHoverEffects();
        this.setupCounterAnimations();
        this.setupTextAnimations();
    },

    setupScrollReveal() {
        const revealElements = document.querySelectorAll('[data-reveal]');
        
        if (revealElements.length === 0) return;

        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const animationType = element.dataset.reveal || 'fade-up';
                    const delay = parseInt(element.dataset.revealDelay) || 0;

                    setTimeout(() => {
                        element.classList.add('revealed');
                        element.classList.add(`animate-${animationType}`);
                    }, delay);

                    // Stop observing this element
                    this.observer.unobserve(element);
                }
            });
        };

        this.observer = new IntersectionObserver(observerCallback, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(element => {
            element.classList.add('scroll-reveal');
            this.observer.observe(element);
        });
    },

    setupParallaxElements() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        if (parallaxElements.length === 0) return;

        const handleParallax = Utils.throttle(() => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = parseFloat(element.dataset.parallax) || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        }, 16);

        window.addEventListener('scroll', handleParallax);
    },

    setupHoverEffects() {
        // Magnetic effect for buttons
        const magneticElements = document.querySelectorAll('.magnetic');
        
        magneticElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                element.style.setProperty('--mouse-x', `${x * 0.2}px`);
                element.style.setProperty('--mouse-y', `${y * 0.2}px`);
            });

            element.addEventListener('mouseleave', () => {
                element.style.setProperty('--mouse-x', '0px');
                element.style.setProperty('--mouse-y', '0px');
            });
        });

        // Tilt effect for cards
        const tiltElements = document.querySelectorAll('.tilt');
        
        tiltElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const rotateX = (y - rect.height / 2) / rect.height * 10;
                const rotateY = (rect.width / 2 - x) / rect.width * 10;
                
                element.style.setProperty('--tilt-x', `${rotateX}deg`);
                element.style.setProperty('--tilt-y', `${rotateY}deg`);
            });

            element.addEventListener('mouseleave', () => {
                element.style.setProperty('--tilt-x', '0deg');
                element.style.setProperty('--tilt-y', '0deg');
            });
        });
    },

    setupCounterAnimations() {
        const counters = document.querySelectorAll('[data-counter]');
        
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.counter);
            const duration = parseInt(counter.dataset.counterDuration) || 2000;
            
            const observerCallback = (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounter(counter, target, duration);
                        counterObserver.unobserve(counter);
                    }
                });
            };

            const counterObserver = new IntersectionObserver(observerCallback, {
                threshold: 0.5
            });

            counterObserver.observe(counter);
        });
    },

    animateCounter(element, target, duration) {
        let start = 0;
        const increment = target / (duration / 16);
        
        const updateCounter = () => {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };
        
        requestAnimationFrame(updateCounter);
    },

    setupTextAnimations() {
        // Typewriter effect
        const typewriterElements = document.querySelectorAll('[data-typewriter]');
        
        typewriterElements.forEach(element => {
            const text = element.dataset.typewriter || element.textContent;
            const speed = parseInt(element.dataset.typewriterSpeed) || 100;
            
            element.textContent = '';
            
            const observerCallback = (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.typeWriter(element, text, speed);
                        typewriterObserver.unobserve(element);
                    }
                });
            };

            const typewriterObserver = new IntersectionObserver(observerCallback, {
                threshold: 0.5
            });

            typewriterObserver.observe(element);
        });
    },

    typeWriter(element, text, speed) {
        let i = 0;
        const typing = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typing, speed);
            }
        };
        typing();
    }
};

// Forms Controller
const FormsController = {
    init() {
        this.setupContactForm();
        this.setupFormValidation();
        this.setupFormAnimations();
    },

    setupContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (!contactForm) return;

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Show loading state
            this.showFormLoading(contactForm);
            
            try {
                // Simulate form submission (replace with actual API call)
                await this.simulateFormSubmission(data);
                this.showFormSuccess(contactForm);
            } catch (error) {
                this.showFormError(contactForm, error.message);
            }
        });
    },

    setupFormValidation() {
        const inputs = document.querySelectorAll('input[required], textarea[required], select[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    },

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let errorMessage = '';

        // Remove existing error state
        this.clearFieldError(field);

        // Check if field is empty
        if (!value && field.hasAttribute('required')) {
            errorMessage = 'שדה זה הוא חובה';
        }
        // Email validation
        else if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage = 'כתובת אימייל לא תקינה';
            }
        }
        // Phone validation
        else if (field.type === 'tel' && value) {
            const phoneRegex = /^[\d\-\+\(\)\s]+$/;
            if (!phoneRegex.test(value)) {
                errorMessage = 'מספר טלפון לא תקין';
            }
        }
        // Number validation
        else if (field.type === 'number' && value) {
            if (isNaN(value) || parseInt(value) < 0) {
                errorMessage = 'יש להזין מספר חיובי';
            }
        }

        if (errorMessage) {
            this.showFieldError(field, errorMessage);
            return false;
        }

        this.showFieldSuccess(field);
        return true;
    },

    showFieldError(field, message) {
        field.classList.add('error');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Add error message
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message text-red-400 text-sm mt-1';
        errorElement.textContent = message;
        field.parentNode.appendChild(errorElement);
    },

    showFieldSuccess(field) {
        field.classList.remove('error');
        field.classList.add('success');
    },

    clearFieldError(field) {
        field.classList.remove('error', 'success');
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    },

    setupFormAnimations() {
        const formInputs = document.querySelectorAll('input, textarea, select');
        
        formInputs.forEach(input => {
            // Floating label effect
            input.addEventListener('focus', () => {
                input.parentNode.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentNode.classList.remove('focused');
                }
            });

            // Check if input has value on load
            if (input.value) {
                input.parentNode.classList.add('focused');
            }
        });
    },

    showFormLoading(form) {
        const submitButton = form.querySelector('[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="loading-spinner"></span> שולח...';
        }
    },

    showFormSuccess(form) {
        const successMessage = document.getElementById('form-success');
        if (successMessage) {
            form.style.display = 'none';
            successMessage.classList.remove('hidden');
            
            // Scroll to success message
            Utils.smoothScrollTo(successMessage);
        }
    },

    showFormError(form, message) {
        const submitButton = form.querySelector('[type="submit"]');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = 'שלח ונתאם פגישה';
        }

        // Show error message
        alert(`שגיאה: ${message}`);
    },

    async simulateFormSubmission(data) {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success (replace with actual API call)
                if (Math.random() > 0.1) {
                    resolve({ success: true });
                } else {
                    reject(new Error('שגיאה בשליחת הטופס. אנא נסו שנית.'));
                }
            }, 2000);
        });
    }
};

// Gallery Controller
const GalleryController = {
    init() {
        this.setupLightbox();
        this.setupGalleryFilter();
        this.setupInfiniteScroll();
        this.setupImageLazyLoading();
    },

    setupLightbox() {
        const galleryImages = document.querySelectorAll('[data-gallery]');
        
        galleryImages.forEach((img, index) => {
            img.addEventListener('click', (e) => {
                e.preventDefault();
                this.openLightbox(galleryImages, index);
            });
        });
    },

    openLightbox(images, startIndex) {
        const lightbox = this.createLightbox();
        let currentIndex = startIndex;
        
        const showImage = (index) => {
            const img = images[index];
            const lightboxImg = lightbox.querySelector('.lightbox-image');
            const counter = lightbox.querySelector('.lightbox-counter');
            
            lightboxImg.src = img.dataset.gallery || img.src;
            lightboxImg.alt = img.alt;
            counter.textContent = `${index + 1} / ${images.length}`;
        };

        showImage(currentIndex);

        // Navigation
        lightbox.querySelector('.lightbox-prev').addEventListener('click', () => {
            currentIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
            showImage(currentIndex);
        });

        lightbox.querySelector('.lightbox-next').addEventListener('click', () => {
            currentIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
            showImage(currentIndex);
        });

        // Keyboard navigation
        const handleKeydown = (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                    lightbox.querySelector('.lightbox-prev').click();
                    break;
                case 'ArrowRight':
                    lightbox.querySelector('.lightbox-next').click();
                    break;
                case 'Escape':
                    this.closeLightbox();
                    break;
            }
        };

        document.addEventListener('keydown', handleKeydown);

        // Close lightbox
        lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
            document.removeEventListener('keydown', handleKeydown);
            this.closeLightbox();
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                document.removeEventListener('keydown', handleKeydown);
                this.closeLightbox();
            }
        });

        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';
        
        // Animate in
        setTimeout(() => {
            lightbox.classList.add('active');
        }, 10);
    },

    createLightbox() {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close">&times;</button>
                <button class="lightbox-prev">&#8249;</button>
                <button class="lightbox-next">&#8250;</button>
                <img class="lightbox-image" src="" alt="">
                <div class="lightbox-counter"></div>
            </div>
        `;
        return lightbox;
    },

    closeLightbox() {
        const lightbox = document.querySelector('.lightbox');
        if (lightbox) {
            lightbox.classList.remove('active');
            setTimeout(() => {
                lightbox.remove();
                document.body.style.overflow = '';
            }, 300);
        }
    },

    setupGalleryFilter() {
        const filterButtons = document.querySelectorAll('[data-filter]');
        const galleryItems = document.querySelectorAll('[data-category]');
        
        if (filterButtons.length === 0 || galleryItems.length === 0) return;

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter gallery items
                galleryItems.forEach(item => {
                    const category = item.dataset.category;
                    const shouldShow = filter === 'all' || category === filter;
                    
                    if (shouldShow) {
                        item.style.display = 'block';
                        item.classList.add('animate-fade-in');
                    } else {
                        item.style.display = 'none';
                        item.classList.remove('animate-fade-in');
                    }
                });
            });
        });
    },

    setupInfiniteScroll() {
        const galleryContainer = document.querySelector('[data-infinite-scroll]');
        if (!galleryContainer) return;

        let loading = false;
        let page = 1;

        const loadMore = async () => {
            if (loading) return;
            
            loading = true;
            
            try {
                // Simulate loading more images
                const newImages = await this.loadMoreImages(page);
                this.appendImages(galleryContainer, newImages);
                page++;
            } catch (error) {
                console.error('Error loading more images:', error);
            } finally {
                loading = false;
            }
        };

        const handleScroll = Utils.throttle(() => {
            const scrollPosition = window.scrollY + window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            
            if (scrollPosition >= documentHeight - 1000) {
                loadMore();
            }
        }, 250);

        window.addEventListener('scroll', handleScroll);
    },

    async loadMoreImages(page) {
        // Simulate API call for more images
        return new Promise(resolve => {
            setTimeout(() => {
                const images = Array.from({ length: 6 }, (_, i) => ({
                    src: `https://images.pexels.com/photos/${1000000 + page * 100 + i}/pexels-photo-${1000000 + page * 100 + i}.jpeg?auto=compress&cs=tinysrgb&w=400&h=300`,
                    alt: `Gallery image ${page}-${i + 1}`,
                    category: 'weddings'
                }));
                resolve(images);
            }, 1000);
        });
    },

    appendImages(container, images) {
        images.forEach(image => {
            const imgElement = document.createElement('div');
            imgElement.className = 'gallery-item animate-fade-in';
            imgElement.setAttribute('data-category', image.category);
            imgElement.innerHTML = `
                <img src="${image.src}" alt="${image.alt}" data-gallery="${image.src}" class="w-full h-64 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300">
            `;
            container.appendChild(imgElement);
            
            // Add click event for lightbox
            const img = imgElement.querySelector('img');
            img.addEventListener('click', (e) => {
                e.preventDefault();
                const allImages = container.querySelectorAll('[data-gallery]');
                const index = Array.from(allImages).indexOf(img);
                this.openLightbox(allImages, index);
            });
        });
    },

    setupImageLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if (images.length === 0) return;

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            img.classList.add('lazy');
            imageObserver.observe(img);
        });
    }
};

// Performance Controller
const PerformanceController = {
    init() {
        this.optimizeImages();
        this.setupPreloader();
        this.monitorPerformance();
    },

    optimizeImages() {
        // Convert images to WebP if supported
        const supportsWebP = this.checkWebPSupport();
        
        if (supportsWebP) {
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                if (img.src && !img.src.includes('.webp')) {
                    const webpSrc = img.src.replace(/\.(jpg|jpeg|png)/, '.webp');
                    
                    // Check if WebP version exists
                    this.checkImageExists(webpSrc).then(exists => {
                        if (exists) {
                            img.src = webpSrc;
                        }
                    });
                }
            });
        }
    },

    checkWebPSupport() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    },

    checkImageExists(url) {
        return new Promise(resolve => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    },

    setupPreloader() {
        const preloader = document.querySelector('.preloader');
        if (!preloader) return;

        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }, 1000);
        });
    },

    monitorPerformance() {
        // Monitor Core Web Vitals
        if ('PerformanceObserver' in window) {
            // Largest Contentful Paint
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.startTime);
            }).observe({ entryTypes: ['largest-contentful-paint'] });

            // First Input Delay
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                entries.forEach(entry => {
                    console.log('FID:', entry.processingStart - entry.startTime);
                });
            }).observe({ entryTypes: ['first-input'] });

            // Cumulative Layout Shift
            new PerformanceObserver((entryList) => {
                let clsValue = 0;
                entryList.getEntries().forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                console.log('CLS:', clsValue);
            }).observe({ entryTypes: ['layout-shift'] });
        }
    }
};

// Main App Initialization
class WeddinboxApp {
    constructor() {
        this.isInitialized = false;
        this.init();
    }

    init() {
        if (this.isInitialized) return;

        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }

    initializeApp() {
        try {
            // Initialize all controllers
            NavigationController.init();
            AnimationsController.init();
            FormsController.init();
            GalleryController.init();
            PerformanceController.init();

            this.setupGlobalEventListeners();
            this.isInitialized = true;

            console.log('🎉 Weddinbox App initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing Weddinbox App:', error);
        }
    }

    setupGlobalEventListeners() {
        // Handle window resize
        window.addEventListener('resize', Utils.debounce(() => {
            this.handleResize();
        }, 250));

        // Handle orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.handleResize(), 500);
        });

        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.handlePageVisible();
            }
        });
    }

    handleResize() {
        const deviceType = Utils.getDeviceType();
        document.body.setAttribute('data-device', deviceType);
        
        // Trigger custom resize event
        window.dispatchEvent(new CustomEvent('weddinbox:resize', {
            detail: { deviceType }
        }));
    }

    handlePageVisible() {
        // Restart any paused animations
        const pausedAnimations = document.querySelectorAll('.animation-paused');
        pausedAnimations.forEach(element => {
            element.classList.remove('animation-paused');
        });
    }
}

// Initialize the app
const app = new WeddinboxApp();

// Export for use in other scripts
window.WeddinboxApp = app;
window.WeddinboxUtils = Utils;
