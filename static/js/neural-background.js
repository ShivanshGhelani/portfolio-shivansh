(() => {
    'use strict';
    
    console.log('Neural background script loaded');
    
    class NeuralBackground {
        constructor(canvasId) {
            this.canvas = document.getElementById(canvasId);
            if (!this.canvas) {
                console.error('Canvas element not found:', canvasId);
                return;
            }
            
            this.ctx = this.canvas.getContext('2d');
            if (!this.ctx) {
                console.error('Could not get canvas context');
                return;
            }
            
            this.nodes = [];
            this.connections = new Map();
            this.animationFrame = null;
            this.resizeTimeout = null;
            
            this.initialize();
        }
        
        initialize() {
            console.log('Initializing neural background');
            this.setupCanvas();
            this.createNodes();
            this.startAnimation();
            this.addEventListeners();
        }
        
        setupCanvas() {
            const updateSize = () => {
                const dpr = window.devicePixelRatio || 1;
                const rect = this.canvas.getBoundingClientRect();
                
                this.canvas.width = rect.width * dpr;
                this.canvas.height = rect.height * dpr;
                this.canvas.style.width = rect.width + 'px';
                this.canvas.style.height = rect.height + 'px';
                
                this.ctx.scale(dpr, dpr);
            };
            
            updateSize();
            window.addEventListener('resize', () => {
                if (this.resizeTimeout) {
                    clearTimeout(this.resizeTimeout);
                }
                this.resizeTimeout = setTimeout(() => {
                    updateSize();
                    this.createNodes();
                }, 250);
            });
        }
        
        createNodes() {
            const count = Math.min(50, Math.floor((this.canvas.width * this.canvas.height) / 20000));
            this.nodes = Array.from({ length: count }, () => ({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                radius: Math.random() * 2 + 1
            }));
        }
        
        drawNodes() {
            this.nodes.forEach(node => {
                this.ctx.beginPath();
                this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = '#6366f1';
                this.ctx.fill();
            });
        }
        
        updateNodes() {
            this.nodes.forEach(node => {
                node.x += node.vx;
                node.y += node.vy;
                
                if (node.x < 0) node.x = this.canvas.width;
                if (node.x > this.canvas.width) node.x = 0;
                if (node.y < 0) node.y = this.canvas.height;
                if (node.y > this.canvas.height) node.y = 0;
            });
        }
        
        drawConnections() {
            const maxDistance = 150;
            
            this.nodes.forEach((nodeA, i) => {
                this.nodes.slice(i + 1).forEach(nodeB => {
                    const dx = nodeB.x - nodeA.x;
                    const dy = nodeB.y - nodeA.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < maxDistance) {
                        const opacity = 1 - (distance / maxDistance);
                        this.ctx.beginPath();
                        this.ctx.moveTo(nodeA.x, nodeA.y);
                        this.ctx.lineTo(nodeB.x, nodeB.y);
                        this.ctx.strokeStyle = `rgba(99, 102, 241, ${opacity * 0.2})`;
                        this.ctx.stroke();
                    }
                });
            });
        }
        
        animate() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.updateNodes();
            this.drawConnections();
            this.drawNodes();
            
            this.animationFrame = requestAnimationFrame(() => this.animate());
        }
        
        startAnimation() {
            if (this.animationFrame) {
                cancelAnimationFrame(this.animationFrame);
            }
            this.animate();
        }
        
        addEventListeners() {
            window.addEventListener('unload', () => {
                if (this.animationFrame) {
                    cancelAnimationFrame(this.animationFrame);
                }
                if (this.resizeTimeout) {
                    clearTimeout(this.resizeTimeout);
                }
            });
        }
    }
    
    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM Content Loaded - Starting neural background');
        new NeuralBackground('neural-canvas');
    });
})();
