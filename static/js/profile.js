        // Add smooth reveal animations
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

        document.querySelectorAll('.section, .project-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'all 0.6s ease-out';
            observer.observe(el);
        });          // Global variables for multiple certificate navigation
        let currentCertificates = [];
        let currentCertTitles = [];
        let currentCertIndex = 0;
          // Certificate modal functionality - Single certificate
        function openCertModal(id, title, description, imageUrl) {
            const modal = document.getElementById('certModal');
            const modalTitle = document.getElementById('certModalTitle');
            const modalDesc = document.getElementById('certModalDescription');
            const modalImage = document.getElementById('certModalImage');
            const modalNav = document.getElementById('certModalNav');
            const modalImageContainer = document.querySelector('.cert-modal-image-container');
            
            // Hide navigation for single certificate
            modalNav.style.display = 'none';
            modalTitle.textContent = title;
            modalDesc.textContent = description;
            
            // Add placeholder state before image loads
            modalImageContainer.classList.add('loading');
            
            // Set image properties
            modalImage.onload = function() {
                // Remove loading state once image is loaded
                modalImageContainer.classList.remove('loading');
            };
            
            modalImage.onerror = function() {
                // Handle image load error
                modalImageContainer.classList.remove('loading');
                modalImageContainer.classList.add('error');
                console.error('Failed to load certificate image:', imageUrl);
            };
            
            modalImage.src = imageUrl;
            modalImage.alt = title + ' Certificate';
            
            // Display modal with animation
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
            
            // Disable scrolling on body when modal is open
            document.body.style.overflow = 'hidden';
            
            // Add ESC key to close modal
            document.addEventListener('keydown', closeModalOnEsc);
            
            // Add ESC key to close modal
            document.addEventListener('keydown', closeModalOnEsc);
        }
          // Certificate modal functionality - Multiple certificates
        function openCertModalMultiple(id, title, description, imageUrls, certTitles) {
            const modal = document.getElementById('certModal');
            const modalTitle = document.getElementById('certModalTitle');
            const modalDesc = document.getElementById('certModalDescription');
            const modalImage = document.getElementById('certModalImage');
            const modalNav = document.getElementById('certModalNav');
            const modalTabs = document.querySelector('.cert-modal-tabs');
            const modalImageContainer = document.querySelector('.cert-modal-image-container');
            
            // Set up global variables for navigation
            currentCertificates = imageUrls;
            currentCertTitles = certTitles;
            currentCertIndex = 0;
            
            // Show navigation for multiple certificates
            modalNav.style.display = 'flex';
            
            // Set the main title and description
            modalTitle.textContent = title;
            modalDesc.textContent = description;
            
            // Clear previous tabs
            modalTabs.innerHTML = '';
            
            // Create tabs for each certificate
            certTitles.forEach((certTitle, index) => {
                const tab = document.createElement('div');
                tab.className = 'cert-tab' + (index === 0 ? ' active' : '');
                tab.textContent = certTitle;
                tab.onclick = () => showCert(index);
                tab.setAttribute('tabindex', '0');
                tab.setAttribute('role', 'tab');
                tab.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
                tab.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        showCert(index);
                        e.preventDefault();
                    }
                });
                modalTabs.appendChild(tab);
            });
            
            // Add placeholder state before image loads
            modalImageContainer.classList.add('loading');
            
            // Set image properties for first certificate
            modalImage.onload = function() {
                // Remove loading state once image is loaded
                modalImageContainer.classList.remove('loading');
            };
            
            modalImage.onerror = function() {
                // Handle image load error
                modalImageContainer.classList.remove('loading');
                modalImageContainer.classList.add('error');
                console.error('Failed to load certificate image:', imageUrls[0]);
            };
            
            modalImage.src = imageUrls[0];
            modalImage.alt = certTitles[0];
            
            // Display modal with animation
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
            
            // Disable scrolling on body when modal is open
            document.body.style.overflow = 'hidden';
            
            // Add ESC key to close modal
            document.addEventListener('keydown', closeModalOnEsc);
        }        // Show a specific certificate by index
        function showCert(index) {
            if (index < 0 || index >= currentCertificates.length) return;
            
            currentCertIndex = index;
            const modalImage = document.getElementById('certModalImage');
            const tabs = document.querySelectorAll('.cert-tab');
            const modalImageContainer = document.querySelector('.cert-modal-image-container');
            const prevBtn = document.querySelector('.cert-nav-btn.prev-btn');
            const nextBtn = document.querySelector('.cert-nav-btn.next-btn');
            
            // Add loading state
            modalImageContainer.classList.add('loading');
            modalImageContainer.classList.remove('error');
            
            // Handle image loading
            modalImage.onload = function() {
                modalImageContainer.classList.remove('loading');
            };
            
            modalImage.onerror = function() {
                modalImageContainer.classList.remove('loading');
                modalImageContainer.classList.add('error');
                console.error('Failed to load certificate image:', currentCertificates[index]);
            };
            
            // Update image
            modalImage.src = currentCertificates[index];
            modalImage.alt = currentCertTitles[index];
            
            // Update active tab
            tabs.forEach((tab, i) => {
                if (i === index) {
                    tab.classList.add('active');
                    tab.setAttribute('aria-selected', 'true');
                    tab.focus(); // Focus on the active tab for accessibility
                } else {
                    tab.classList.remove('active');
                    tab.setAttribute('aria-selected', 'false');
                }
            });
            
            // Update navigation buttons state
            if (prevBtn && nextBtn) {
                // Disable/enable prev button
                prevBtn.disabled = index === 0;
                prevBtn.style.opacity = index === 0 ? '0.5' : '1';
                prevBtn.style.cursor = index === 0 ? 'not-allowed' : 'pointer';
                
                // Disable/enable next button
                nextBtn.disabled = index === currentCertificates.length - 1;
                nextBtn.style.opacity = index === currentCertificates.length - 1 ? '0.5' : '1';
                nextBtn.style.cursor = index === currentCertificates.length - 1 ? 'not-allowed' : 'pointer';
            }

            // Announce for screen readers
            const announcer = document.createElement('div');
            announcer.setAttribute('role', 'status');
            announcer.setAttribute('aria-live', 'polite');
            announcer.className = 'sr-only';
            announcer.textContent = `Viewing ${currentCertTitles[index]} certificate`;
            document.body.appendChild(announcer);
            
            // Remove after announcement
            setTimeout(() => {
                if (announcer.parentNode) {
                    announcer.parentNode.removeChild(announcer);
                }
            }, 1000);
        }
          function closeModalOnEsc(e) {
            if (e.key === 'Escape') {
                closeCertModal();
            } else if (e.key === 'ArrowRight') {
                // Navigate to next certificate
                if (currentCertificates.length > 1 && currentCertIndex < currentCertificates.length - 1) {
                    showCert(currentCertIndex + 1);
                }
            } else if (e.key === 'ArrowLeft') {
                // Navigate to previous certificate
                if (currentCertificates.length > 1 && currentCertIndex > 0) {
                    showCert(currentCertIndex - 1);
                }
            }
        }
        
        function closeCertModal() {
            const modal = document.getElementById('certModal');
            const modalImageContainer = document.querySelector('.cert-modal-image-container');
            
            // Remove any loading or error states
            modalImageContainer.classList.remove('loading');
            modalImageContainer.classList.remove('error');
            
            // Animate closing
            modal.classList.remove('show');
            
            setTimeout(() => {
                modal.style.display = 'none';
                
                // Re-enable scrolling
                document.body.style.overflow = 'auto';
            }, 300); // Match transition duration
            
            // Remove ESC key listener
            document.removeEventListener('keydown', closeModalOnEsc);
            
            // Reset certificate navigation variables
            currentCertificates = [];
            currentCertTitles = [];
            currentCertIndex = 0;
        }
          // Close modal when clicking outside of the modal content
        window.onclick = function(event) {
            const modal = document.getElementById('certModal');
            if (event.target === modal) {
                closeCertModal();
            }
        }
        
        // Preload certificate images for better user experience
        document.addEventListener('DOMContentLoaded', function() {
            const certBadges = document.querySelectorAll('.certification-badge[onclick]');
            certBadges.forEach(badge => {
                if (badge.hasAttribute('onclick')) {
                    const onclickAttr = badge.getAttribute('onclick');
                    
                    // Check for multiple certificates
                    const multipleMatch = onclickAttr.match(/openCertModalMultiple\([^,]+,[^,]+,[^,]+,\s*\[([^\]]+)\]/);
                    if (multipleMatch && multipleMatch[1]) {
                        // Extract URLs from the array
                        const urlsText = multipleMatch[1];
                        const urls = urlsText.split(',').map(url => url.trim().replace(/['"]/g, ''));
                        urls.forEach(url => {
                            const img = new Image();
                            img.src = url;
                        });
                    } else {
                        // Check for single certificate
                        const singleMatch = onclickAttr.match(/'([^']*\.(jpg|png))'/);
                        if (singleMatch && singleMatch[1]) {
                            const img = new Image();
                            img.src = singleMatch[1];
                        }
                    }
                }
            });
        });