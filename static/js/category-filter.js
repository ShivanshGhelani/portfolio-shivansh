document.addEventListener('DOMContentLoaded', () => {
    const categoryTabs = document.querySelectorAll('.category-tab');
    const services = document.querySelector('.services');
    const projects = document.querySelectorAll('.service');
    let animationInProgress = false;

    // Function to update the neural background and container heights
    function updateHeights() {
        const content = document.querySelector('.content-wrapper');
        const neuralBackground = document.querySelector('.neural-background');
        const canvas = document.querySelector('#neural-canvas');
        const totalHeight = content.scrollHeight;
        
        // Update neural background height to match content
        if (neuralBackground) {
            neuralBackground.style.height = `${Math.max(totalHeight, window.innerHeight)}px`;
        }
        if (canvas) {
            canvas.style.height = `${Math.max(totalHeight, window.innerHeight)}px`;
        }

        // Update services container height
        if (services) {
            services.style.height = 'auto';
            const minHeight = Math.max(projects.length ? 200 : 0, window.innerHeight * 0.3);
            services.style.minHeight = `${minHeight}px`;
        }
    }

    // Create ResizeObserver to watch for content changes
    const resizeObserver = new ResizeObserver(() => {
        updateHeights();
    });

    // Start observing the services container
    if (services) {
        resizeObserver.observe(services);
    }

    function filterProjects(category) {
        if (animationInProgress) return;
        animationInProgress = true;

        const visibleProjects = Array.from(projects).filter(project => 
            category === 'all' || project.dataset.category === category
        );

        // Fade out non-matching items
        projects.forEach(project => {
            project.style.transition = 'all 0.3s ease-in-out';
            const shouldShow = category === 'all' || project.dataset.category === category;
            
            if (!shouldShow) {
                project.style.opacity = '0';
                project.style.transform = 'scale(0.95) translateY(10px)';
                setTimeout(() => {
                    project.style.display = 'none';
                }, 300);
            } else {
                project.style.display = 'flex';
                setTimeout(() => {
                    project.style.opacity = '1';
                    project.style.transform = 'scale(1) translateY(0)';
                }, 10);
            }
        });

        // Update container and heights
        if (visibleProjects.length === 0) {
            services.style.minHeight = '0';
        } 

        // Update heights after animation
        setTimeout(() => {
            updateHeights();
            animationInProgress = false;
        }, 400);
    }

    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            if (animationInProgress || tab.classList.contains('active')) return;
            
            categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            filterProjects(tab.dataset.category);

            // Add smooth scroll for mobile
            if (window.innerWidth <= 768) {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const servicesTop = services.offsetTop;
                window.scrollTo({
                    top: servicesTop - headerHeight - 20,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Initialize with 'all' category and handle window resize
    filterProjects('all');
    window.addEventListener('resize', updateHeights);
});
