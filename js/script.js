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

// Navbar background change on scroll
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(13, 17, 23, 0.95)';
    } else {
        navbar.style.background = 'rgba(13, 17, 23, 0.9)';
    }
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Add fade-in class to sections
document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
});

// Scroll to top button
const scrollToTopBtn = document.getElementById('scroll-to-top');

window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
    }
});

scrollToTopBtn.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Form submission simulation
function handleFormSubmit(formId, messageId) {
    const form = document.getElementById(formId);
    const messageDiv = document.getElementById(messageId);

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Simulate form submission
            messageDiv.innerHTML = '<p style="color: #00A859; text-align: center;">Thanks for reaching out! We\'ll get back to you soon.</p>';

            // Reset form after 3 seconds
            setTimeout(() => {
                form.reset();
                messageDiv.innerHTML = '';
            }, 3000);
        });
    }
}

// Contact form removed - only booking form remains

// Handle booking form with Zapier webhook
function handleBookingForm() {
    const form = document.getElementById('booking-form');
    const messageDiv = document.getElementById('booking-message');
    const modal = document.getElementById('success-modal');
    const modalClose = document.querySelector('.modal-close');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(form);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                service: formData.get('service'),
                message: formData.get('message'),
                timestamp: new Date().toISOString()
            };

            // Show loading message with spinner
            messageDiv.innerHTML = '<p style="color: #00B2FF; text-align: center;"><span class="loading-spinner"></span>Sending your booking request...</p>';

            // Send to Zapier webhook
            fetch('https://hooks.zapier.com/hooks/catch/25228794/u8syfm3/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (response.ok) {
                    // Hide loading message
                    messageDiv.innerHTML = '';
                    // Show success modal
                    modal.classList.add('show');
                    // Reset form
                    form.reset();
                } else {
                    throw new Error('Network response was not ok');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                messageDiv.innerHTML = '<p style="color: #ff6b6b; text-align: center;">Sorry, there was an error sending your request. Please try again or contact us directly.</p>';
                // Clear error message after 5 seconds
                setTimeout(() => {
                    messageDiv.innerHTML = '';
                }, 5000);
            });
        });
    }

    // Modal close functionality
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            modal.classList.remove('show');
        });
    }

    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    }
}

// Initialize booking form
handleBookingForm();

// Mobile menu toggle (if needed in future)
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

// Add mobile menu functionality if screen is small
if (window.innerWidth <= 768) {
    const navbar = document.querySelector('.nav-container');
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.innerHTML = '☰';
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.onclick = toggleMobileMenu;
    navbar.appendChild(mobileMenuBtn);

    // Add CSS for mobile menu
    const style = document.createElement('style');
    style.textContent = `
        .mobile-menu-btn {
            display: block;
            background: none;
            border: none;
            color: #EDEDED;
            font-size: 1.5rem;
            cursor: pointer;
        }
        .nav-menu {
            display: none;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background: rgba(13, 17, 23, 0.95);
            padding: 20px;
        }
        .nav-menu.active {
            display: flex;
        }
        .nav-menu li {
            margin: 10px 0;
        }
    `;
    document.head.appendChild(style);
}
