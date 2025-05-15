/**
 * Completely new category filtering implementation
 * Designed to eliminate all empty spaces
 */
document.addEventListener('DOMContentLoaded', function() {
    initCategoryFiltering();
    handleMobileInteractions();
});

function initCategoryFiltering() {
    // Get all required elements
    const categoryTabs = document.querySelectorAll('.category-tab');
    const services = document.querySelector('.services');
    const projects = document.querySelectorAll('.service');
    const footer = document.querySelector('footer');
    let animationInProgress = false;
    
    // Initially hide all projects and set up properly
    services.style.opacity = '0';
    
    // Give time for page to load
    setTimeout(() => {
        // Initialize all projects as visible
        projects.forEach(project => {
            project.classList.remove('hidden');
            project.style.opacity = '1';
            project.style.transform = 'scale(1)';
        });
        
        services.style.opacity = '1';
    }, 100);
    
    // Setup click events for tabs
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Don't do anything if animation is in progress or same tab clicked
            if (animationInProgress || this.classList.contains('active')) {
                return;
            }
            
            // Lock UI during animation
            animationInProgress = true;
            
            // Update active tab
            categoryTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Get selected category
            const selectedCategory = this.getAttribute('data-category');
            
            // Fade out everything
            services.style.opacity = '0';
            services.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                // Create a new container to replace the old one
                const newServices = document.createElement('div');
                newServices.className = 'services';
                newServices.style.opacity = '0';
                newServices.style.transform = 'translateY(10px)';
                
                // Filter and add only visible items to the new container
                let visibleCount = 0;
                
                projects.forEach(project => {
                    const projectCategory = project.getAttribute('data-category');
                    const shouldShow = selectedCategory === 'all' || projectCategory === selectedCategory;
                    
                    if (shouldShow) {
                        // Clone the project for the new container
                        const clonedProject = project.cloneNode(true);
                        clonedProject.style.opacity = '0';
                        newServices.appendChild(clonedProject);
                        visibleCount++;
                    }
                });
                
                // Replace the old container with the new one
                services.parentNode.replaceChild(newServices, services);
                
                // Adjust footer margin based on content
                if (visibleCount === 0) {
                    footer.style.marginTop = '2rem';
                    newServices.style.marginBottom = '0';
                } else {
                    footer.style.marginTop = '4rem'; 
                    newServices.style.marginBottom = '4rem';
                }
                
                // Force layout recalculation
                document.body.offsetHeight;
                
                // Fade in the new container
                setTimeout(() => {
                    newServices.style.opacity = '1';
                    newServices.style.transform = 'translateY(0)';
                    
                    // Fade in each project with staggered delay
                    Array.from(newServices.children).forEach((project, index) => {
                        setTimeout(() => {
                            project.style.opacity = '1';
                            project.style.transform = 'scale(1)';
                        }, index * 50);
                    });
                    
                    // Re-attach event listeners to the new elements
                    reattachEventListeners(newServices);
                    
                    // Mobile scroll adjustment
                    if (window.innerWidth <= 768) {
                        const header = document.querySelector('.header');
                        const headerHeight = header ? header.offsetHeight : 0;
                        
                        window.scrollTo({
                            top: newServices.offsetTop - headerHeight - 20,
                            behavior: 'smooth'
                        });
                    }
                    
                    // Allow clicking again
                    setTimeout(() => {
                        animationInProgress = false;
                    }, 500);
                }, 100);
                
            }, 300);
        });
    });
}

function reattachEventListeners(container) {
    // Reattach hover effects and other interactions to cloned elements
    const services = container.querySelectorAll('.service');
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    services.forEach(service => {
        // Mouse tracking for card effect
        service.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            this.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            this.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        });
        
        // Touch device enhancements
        if (isTouchDevice) {
            service.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            }, { passive: true });
            
            service.addEventListener('touchend', function() {
                this.style.transform = '';
                setTimeout(() => document.activeElement.blur(), 100);
            }, { passive: true });
        }
    });
}

function handleMobileInteractions() {
    const categoryTabs = document.querySelectorAll('.category-tab');
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Add touch effects for tabs
    if (isTouchDevice) {
        categoryTabs.forEach(tab => {
            tab.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.95)';
            }, { passive: true });
            
            tab.addEventListener('touchend', function() {
                this.style.transform = '';
            }, { passive: true });
        });
    }
    
    // Handle tab display on very small screens
    function adjustTabDisplay() {
        const isMobile = window.innerWidth <= 600;
        
        categoryTabs.forEach(tab => {
            const span = tab.querySelector('span');
            if (span) {
                if (isMobile) {
                    tab.setAttribute('title', span.textContent);
                    tab.setAttribute('aria-label', span.textContent);
                } else {
                    tab.removeAttribute('title');
                }
            }
        });
    }
    
    // Initial adjustment
    adjustTabDisplay();
    
    // Adjust on resize
    window.addEventListener('resize', adjustTabDisplay);
    
    // Add lazy loading for images
    if ('loading' in HTMLImageElement.prototype) {
        document.querySelectorAll('img').forEach(img => {
            img.loading = 'lazy';
        });
    }
}
