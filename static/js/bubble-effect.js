/**
 * Bubble effect with fish eye bulge for neural network background
 * Creates interactive bubbles with distortion effect following mouse movement
 */

class BubbleEffect {
    constructor(canvas, config = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d', {
            alpha: true,
            willReadFrequently: true
        });
        
        // Get viewport dimensions
        const width = window.innerWidth;
        const height = window.innerHeight;
        const scaleFactor = Math.min(width, height) / 1080;
        
        // Enhanced configuration with responsive defaults
        this.config = {
            bubbleCount: config.bubbleCount || (width < 768 ? 8 : 15),
            minRadius: (config.minRadius || 30) * scaleFactor,
            maxRadius: (config.maxRadius || 120) * scaleFactor,
            distortionFactor: config.distortionFactor || 2.5,
            distortionRadius: (config.distortionRadius || 150) * scaleFactor,
            opacity: config.opacity || 0.06,
            colors: config.colors || ['#9C77FE', '#B988FF', '#8257E6', '#6366f1']
        };
        
        this.bubbles = [];
        this.mouse = {
            x: null,
            y: null,
            active: false
        };
        
        this.initBubbles();
        this.addEventListeners();
    }
    
    initBubbles() {
        var width = window.innerWidth;
        var height = window.innerHeight;
        var speedFactor = Math.min(width, height) / 1920;
        
        this.bubbles = [];
        for (let i = 0; i < this.config.bubbleCount; i++) {
            // Create grid-like distribution
            const col = i % 3;
            const row = Math.floor(i / 3);
            const sectionWidth = width / 3;
            const sectionHeight = height / 3;
            
            this.bubbles.push({
                x: (col * sectionWidth) + (Math.random() * sectionWidth),
                y: (row * sectionHeight) + (Math.random() * sectionHeight),
                radius: this.randomRange(this.config.minRadius, this.config.maxRadius),
                vx: this.randomRange(-0.2, 0.2) * speedFactor,
                vy: this.randomRange(-0.2, 0.2) * speedFactor,
                color: this.config.colors[Math.floor(Math.random() * this.config.colors.length)]
            });
        }
    }
    
    randomRange(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    update() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.bubbles.forEach(bubble => {
            bubble.x += bubble.vx;
            bubble.y += bubble.vy;
            
            // Wrap around screen edges
            if (bubble.x - bubble.radius > width) bubble.x = -bubble.radius;
            if (bubble.x + bubble.radius < 0) bubble.x = width + bubble.radius;
            if (bubble.y - bubble.radius > height) bubble.y = -bubble.radius;
            if (bubble.y + bubble.radius < 0) bubble.y = height + bubble.radius;
        });
    }
    
    draw() {
        this.bubbles.forEach(bubble => {
            let radius = bubble.radius;
            let distortedX = bubble.x;
            let distortedY = bubble.y;
            
            // Apply mouse distortion
            if (this.mouse.active) {
                const dx = bubble.x - this.mouse.x;
                const dy = bubble.y - this.mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.config.distortionRadius) {
                    const effect = 1 - (distance / this.config.distortionRadius);
                    const distortionStrength = effect * this.config.distortionFactor;
                    
                    distortedX = bubble.x + dx * distortionStrength * 0.8;
                    distortedY = bubble.y + dy * distortionStrength * 0.8;
                    radius = bubble.radius * (1 + effect * 0.5);
                }
            }
            
            // Draw bubble with gradient
            this.ctx.save();
            const gradient = this.ctx.createRadialGradient(
                distortedX, distortedY, 0,
                distortedX, distortedY, radius
            );
            
            gradient.addColorStop(0, `${bubble.color}15`);
            gradient.addColorStop(0.6, `${bubble.color}${Math.floor(this.config.opacity * 255).toString(16).padStart(2, '0')}`);
            gradient.addColorStop(1, 'transparent');
            
            this.ctx.fillStyle = gradient;
            this.ctx.globalCompositeOperation = 'screen';
            
            this.ctx.beginPath();
            this.ctx.arc(distortedX, distortedY, radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }
    
    animate() {
        this.update();
        this.draw();
    }
    
    onResize() {
        // Get new viewport dimensions
        const width = window.innerWidth;
        const height = window.innerHeight;
        const scaleFactor = Math.min(width, height) / 1080;
        
        // Update config for new viewport
        this.config.minRadius *= scaleFactor;
        this.config.maxRadius *= scaleFactor;
        this.config.distortionRadius *= scaleFactor;
        
        // Reinitialize bubbles for new viewport
        this.initBubbles();
    }
    
    addEventListeners() {
        const handleMove = (clientX, clientY) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = clientX - rect.left;
            this.mouse.y = clientY - rect.top;
            this.mouse.active = true;
        };
        
        window.addEventListener('mousemove', (e) => {
            handleMove(e.clientX, e.clientY);
        });
        
        window.addEventListener('touchmove', (e) => {
            if (e.touches && e.touches[0]) {
                handleMove(e.touches[0].clientX, e.touches[0].clientY);
            }
        });
        
        window.addEventListener('mouseout', () => {
            this.mouse.active = false;
        });
        
        window.addEventListener('mouseleave', () => {
            this.mouse.active = false;
        });
        
        window.addEventListener('touchend', () => {
            this.mouse.active = false;
        });
    }
}

// Export for global use
window.BubbleEffect = BubbleEffect;
