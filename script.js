// Wait for all resources to load before initializing
window.addEventListener('load', function() {
    // Initialize components only after verifying they exist
    initializeGlobe();
    initializeNavigation();
    initializeContactForms(); // Initialize contact forms globally
    initializeContactModal(); // Initialize the new contact modal
});

function initializeGlobe() {
    const heroBackground = document.querySelector('#hero-background');
    if (heroBackground && window.VANTA && window.VANTA.GLOBE) {
        try {
            window.VANTA.GLOBE({
                el: "#hero-background",
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.00,
                scaleMobile: 1.00,
                color: 0x00aaff,
                color2: 0x0077b6,
                backgroundColor: 0xffffff,
                size: 1.20
            });
        } catch (e) {
            console.warn('Failed to initialize globe:', e);
        }
    }
}

function initializeNavigation() {
    // Only initialize navigation elements if they exist on the page
    const menuToggle = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    const dropdowns = document.querySelectorAll('.nav-item-dropdown');

    if (menuToggle && navMenu) { // Check if these elements exist
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            if (!link.classList.contains('nav-link-dropdown')) {
                link.addEventListener('click', () => {
                    if (navMenu.classList.contains('active')) {
                        menuToggle.classList.remove('active');
                        navMenu.classList.remove('active');
                    }
                });
            }
        });
    }

    // Only add dropdown listeners if dropdowns exist
    if (dropdowns.length > 0) {
        dropdowns.forEach(dropdown => {
            const link = dropdown.querySelector('.nav-link-dropdown');
            if (link) {
                link.addEventListener('click', (e) => {
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        dropdowns.forEach(d => {
                            if (d !== dropdown) {
                                d.classList.remove('open');
                            }
                        });
                        dropdown.classList.toggle('open');
                    }
                });
            }
        });
    }

    // Handle active link highlighting - only if navLinks exist
    const navLinks = document.querySelectorAll('.nav-menu a.nav-link');
    if ('IntersectionObserver' in window && navLinks.length > 0) {
        const sections = document.querySelectorAll('section[id]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href').includes(entry.target.id)) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, { threshold: 0.5 });

        sections.forEach(section => observer.observe(section));
    }
}

// Global function to initialize all contact forms
function initializeContactForms() {
    const forms = document.querySelectorAll('.global-contact-form');

    forms.forEach(form => {
        const submitButton = form.querySelector('button[type="submit"]');
        let formMessage = form.querySelector('.form-message'); // Try to find existing message div
        if (!formMessage) { // Create if not found (e.g., for the new modal case)
            formMessage = document.createElement('div');
            formMessage.classList.add('form-message');
            // Find a suitable place to insert, e.g., right before the submit button
            form.insertBefore(formMessage, submitButton); 
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            formMessage.textContent = ''; // Clear previous messages
            formMessage.classList.remove('success', 'error');

            const formData = new FormData(form);
            let isValid = true;
            let missingFields = [];

            // Basic client-side validation for required fields
            form.querySelectorAll('[required]').forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    const fieldName = input.placeholder || input.name;
                    if (fieldName) {
                        missingFields.push(fieldName);
                    }
                    input.classList.add('error-border'); // Add visual error cue
                } else {
                    input.classList.remove('error-border');
                }
            });

            if (!isValid) {
                formMessage.textContent = `Please fill out all required fields: ${missingFields.join(', ')}.`;
                formMessage.classList.add('error');
                return;
            }

            // Disable button and show loading state
            submitButton.disabled = true;
            submitButton.classList.add('loading');
            submitButton.textContent = 'Sending...';

            try {
                // Simulate form submission
                // In a real application, you would send this data to a backend server
                // const response = await fetch('/api/contact', {
                //     method: 'POST',
                //     body: formData
                // });
                // const result = await response.json();

                // For demonstration, simulate a successful response after a delay
                await new Promise(resolve => setTimeout(resolve, 1500)); 

                // Simulate success
                formMessage.textContent = 'Message sent successfully! We will get back to you soon.';
                formMessage.classList.add('success');
                form.reset(); // Clear form fields

            } catch (error) {
                console.error('Form submission error:', error);
                formMessage.textContent = 'There was an error sending your message. Please try again later.';
                formMessage.classList.add('error');
            } finally {
                // Re-enable button and reset text
                submitButton.disabled = false;
                submitButton.classList.remove('loading');
                submitButton.textContent = submitButton.dataset.originalText || 'Submit';
            }
        });

        // Remove error border on input focus
        form.querySelectorAll('[required]').forEach(input => {
            input.addEventListener('focus', () => {
                input.classList.remove('error-border');
            });
        });
    });
}

// New function to handle modal logic
function initializeContactModal() {
    const openModalBtn = document.getElementById('openContactModal');
    const contactModal = document.getElementById('contactModal');
    const closeModalBtn = contactModal ? contactModal.querySelector('.close-button') : null;

    if (openModalBtn && contactModal) {
        openModalBtn.addEventListener('click', () => {
            contactModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling background
            // Reset form message when opening
            const formMessage = contactModal.querySelector('.form-message');
            if (formMessage) {
                formMessage.textContent = '';
                formMessage.classList.remove('success', 'error');
            }
            // Reset form fields
            const form = contactModal.querySelector('.global-contact-form');
            if (form) {
                form.reset();
                form.querySelectorAll('[required]').forEach(input => {
                    input.classList.remove('error-border');
                });
            }
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            contactModal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        });
    }

    if (contactModal) {
        // Close modal when clicking outside the content
        contactModal.addEventListener('click', (e) => {
            if (e.target === contactModal) {
                contactModal.classList.remove('active');
                document.body.style.overflow = ''; // Restore scrolling
            }
        });
    }
}

// Handle smooth scrolling polyfill
document.addEventListener('DOMContentLoaded', function() {
    if (!('scrollBehavior' in document.documentElement.style)) {
        import('https://cdn.jsdelivr.net/npm/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js')
            .then(module => {
                if (module.polyfill) {
                    module.polyfill();
                }
            })
            .catch(error => console.warn('Failed to load smooth scroll polyfill:', error));
    }
});