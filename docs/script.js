// Smooth scrolling for navigation links
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

// Install modal functionality
const installModal = document.getElementById('install-modal');
const installButtons = document.querySelectorAll('.btn-install');
const modalClose = document.querySelector('.modal-close');

const appCommands = {
    'liberchat': 'yunohost app install https://github.com/Liberchat/LiberChat-Marketplace/tree/main/apps/liberchat_ynh',
    'contact-cnt-ait': 'yunohost app install https://github.com/Liberchat/LiberChat-Marketplace/tree/main/apps/contact-cnt-ait_ynh'
};

const appNames = {
    'liberchat': 'Liberchat',
    'contact-cnt-ait': 'Contacts Libres CNT-AIT'
};

// Open modal when install button is clicked
installButtons.forEach(button => {
    button.addEventListener('click', function() {
        const appId = this.getAttribute('data-app');
        const appName = appNames[appId];
        const command = appCommands[appId];
        
        document.getElementById('modal-app-name').textContent = appName;
        document.getElementById('install-command').textContent = command;
        
        installModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
});

// Close modal
function closeModal() {
    installModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

modalClose.addEventListener('click', closeModal);

// Close modal when clicking outside
installModal.addEventListener('click', function(e) {
    if (e.target === installModal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && installModal.style.display === 'block') {
        closeModal();
    }
});

// Copy to clipboard functionality
function copyToClipboard() {
    const command = document.getElementById('install-command').textContent;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(command).then(() => {
            showCopyFeedback();
        }).catch(() => {
            fallbackCopyToClipboard(command);
        });
    } else {
        fallbackCopyToClipboard(command);
    }
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopyFeedback();
    } catch (err) {
        console.error('Fallback: Could not copy text: ', err);
    }
    
    document.body.removeChild(textArea);
}

function showCopyFeedback() {
    const copyBtn = document.querySelector('.copy-btn');
    const originalText = copyBtn.innerHTML;
    
    copyBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20,6 9,17 4,12"/>
        </svg>
        Copié !
    `;
    copyBtn.style.background = '#10b981';
    
    setTimeout(() => {
        copyBtn.innerHTML = originalText;
        copyBtn.style.background = '#3b82f6';
    }, 2000);
}

// Header scroll effect with mobile optimization
let lastScrollTop = 0;
let ticking = false;
const header = document.querySelector('.header');

function updateHeader() {
    // Only apply scroll effect on larger screens
    if (window.innerWidth > 480) {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    }
    ticking = false;
}

window.addEventListener('scroll', function() {
    if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
    }
});

// Reset header position on resize
window.addEventListener('resize', function() {
    if (window.innerWidth <= 480) {
        header.style.transform = 'translateY(0)';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.app-card, .feature-card, .submit-step, .step');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Terminal typing animation
function typeCommand() {
    const commandElement = document.querySelector('.command');
    const command = 'yunohost app install https://github.com/Liberchat/LiberChat-Marketplace/tree/main/apps/liberchat_ynh';
    let i = 0;
    
    commandElement.textContent = '';
    
    function type() {
        if (i < command.length) {
            commandElement.textContent += command.charAt(i);
            i++;
            setTimeout(type, 50);
        }
    }
    
    setTimeout(type, 1000);
}

// Start typing animation when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(typeCommand, 2000);
});

// Stats counter animation
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const target = stat.textContent;
        if (target.includes('%')) {
            animateNumber(stat, 0, 100, '%');
        } else if (target.includes('min')) {
            animateNumber(stat, 0, 5, 'min', '<');
        } else if (target === '∞') {
            // Keep infinity symbol
            return;
        } else {
            const num = parseInt(target);
            animateNumber(stat, 0, num);
        }
    });
}

function animateNumber(element, start, end, suffix = '', prefix = '') {
    const duration = 2000;
    const increment = (end - start) / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        
        element.textContent = prefix + Math.floor(current) + suffix;
    }, 16);
}

// Trigger stats animation when stats section is visible
const statsSection = document.querySelector('.stats');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statsObserver.observe(statsSection);
}

// Mobile menu toggle (if needed in future)
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('mobile-open');
}

// Add loading states to buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function() {
        if (this.href && this.href.includes('github.com')) {
            this.style.opacity = '0.7';
            this.style.pointerEvents = 'none';
            
            setTimeout(() => {
                this.style.opacity = '1';
                this.style.pointerEvents = 'auto';
            }, 1000);
        }
    });
    
    // Add touch feedback for mobile
    btn.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.98)';
    });
    
    btn.addEventListener('touchend', function() {
        this.style.transform = 'scale(1)';
    });
});

// Form validation for future contact forms
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Keyboard navigation for modal
document.addEventListener('keydown', function(e) {
    if (installModal.style.display === 'block') {
        if (e.key === 'Tab') {
            // Handle tab navigation within modal
            const focusableElements = installModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    }
});

// Performance optimization: Lazy load images if any are added
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Add smooth transitions to all interactive elements
document.addEventListener('DOMContentLoaded', function() {
    const interactiveElements = document.querySelectorAll('button, a, .app-card, .feature-card');
    
    interactiveElements.forEach(el => {
        el.style.transition = 'all 0.2s ease';
    });
});

console.log('🏪 Liberchat Marketplace loaded successfully!');
console.log('📱 Ready to install amazing YunoHost applications!');
console.log('🚀 Visit https://github.com/Liberchat/LiberChat-Marketplace for more info');