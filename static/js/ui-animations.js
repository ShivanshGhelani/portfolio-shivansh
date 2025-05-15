/**
 * UI Animations and Particle Effects
 * Handles interactive UI elements, hover effects and particle animations
 */

document.addEventListener('DOMContentLoaded', () => {
    initParticleEffects();
    initHoverEffects();
    applyBackgroundTexture();
});

/**
 * Initialize particle effects for interactive UI elements like buttons
 * Note: The navigation button has been removed, so this function is kept
 * for future use if we decide to add interactive elements again
 */
function initParticleEffects() {
    // Navigation button removed - functionality maintained for future use
    const buttons = document.querySelectorAll('.interactive-button');
    
    buttons.forEach(button => {
        if (!button.querySelector('.particles')) {
            const particlesContainer = document.createElement('div');
            particlesContainer.className = 'particles';
            button.appendChild(particlesContainer);
        }
        
        button.addEventListener('mouseover', () => {
            const particlesContainer = button.querySelector('.particles');
            if (!particlesContainer) return;
            
            for(let i = 0; i < 15; i++) {
                setTimeout(() => {
                    const particle = document.createElement('div');
                    particle.className = 'particle';
                    
                    const size = Math.random() * 4 + 2;
                    particle.style.width = `${size}px`;
                    particle.style.height = `${size}px`;
                    
                    const startX = Math.random() * 100;
                    const startY = Math.random() * 100;
                    const angle = Math.random() * Math.PI * 2;
                    const velocity = Math.random() * 100 + 50;
                    
                    particle.style.left = `${startX}%`;
                    particle.style.top = `${startY}%`;
                    
                    particlesContainer.appendChild(particle);
                    
                    particle.animate([
                        {
                            transform: `translate(0, 0)`,
                            opacity: 1
                        },
                        {
                            transform: `translate(
                                ${Math.cos(angle) * velocity}px,
                                ${Math.sin(angle) * velocity}px
                            )`,
                            opacity: 0
                        }
                    ], {
                        duration: Math.random() * 1000 + 500,
                        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                        fill: 'forwards'
                    }).onfinish = () => {
                        particle.remove();
                    };
                }, i * 50);
            }
        });
    });
}

/**
 * Initialize hover effects for service cards
 */
function initHoverEffects() {
    const services = document.querySelectorAll('.service');
    
    services.forEach(service => {
        service.addEventListener('mousemove', (e) => {
            const rect = service.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            service.style.setProperty('--mouse-x', `${x}px`);
            service.style.setProperty('--mouse-y', `${y}px`);
        });
    });
    
    // Add advanced hover effects for other elements
    addScrollAnimations();
}

/**
 * Add scroll-based animations for elements entering the viewport
 */
function addScrollAnimations() {
    const animatedElements = document.querySelectorAll('.service, .category-tab');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

/**
 * Create and apply subtle background grain texture
 */
function applyBackgroundTexture() {
    const root = document.documentElement;
    const intensity = getComputedStyle(root).getPropertyValue('--texture-intensity') || '0.03';
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const size = 200;
    canvas.width = size;
    canvas.height = size;
    
    ctx.fillStyle = 'transparent';
    ctx.fillRect(0, 0, size, size);
    
    for (let i = 0; i < size * size * parseFloat(intensity) * 2; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const brightness = Math.random() * 255;
        
        ctx.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness}, ${Math.random() * 0.03 + 0.01})`;
        ctx.fillRect(x, y, 1, 1);
    }
    
    document.body.style.backgroundImage = `url(${canvas.toDataURL('image/png')})`;
}
