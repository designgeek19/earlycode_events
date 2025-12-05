// event-details.js - Event Details Page Functionality

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const bookmarkBtn = document.getElementById('event-bookmark');
    const scheduleTabs = document.querySelectorAll('.schedule-tab');
    const scheduleContents = document.querySelectorAll('.schedule-content');
    const registrationForm = document.getElementById('event-registration');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    // Initialize bookmarked state from localStorage
    let bookmarkedEvents = JSON.parse(localStorage.getItem('earlycode_bookmarks')) || [];
    const eventId = '2'; // Event ID for "Best Ways to Monetize Your Tech Skills"
    
    // Check if current event is bookmarked
    if (bookmarkedEvents.includes(eventId)) {
        bookmarkBtn.classList.add('bookmarked');
        bookmarkBtn.innerHTML = '<i class="fas fa-bookmark"></i> Bookmarked';
    }
    
    // Bookmark functionality
    bookmarkBtn.addEventListener('click', function() {
        if (bookmarkedEvents.includes(eventId)) {
            // Remove bookmark
            const index = bookmarkedEvents.indexOf(eventId);
            bookmarkedEvents.splice(index, 1);
            bookmarkBtn.classList.remove('bookmarked');
            bookmarkBtn.innerHTML = '<i class="far fa-bookmark"></i> Bookmark';
            showNotification('Event removed from bookmarks', 'info');
        } else {
            // Add bookmark
            bookmarkedEvents.push(eventId);
            bookmarkBtn.classList.add('bookmarked');
            bookmarkBtn.innerHTML = '<i class="fas fa-bookmark"></i> Bookmarked';
            showNotification('Event bookmarked!', 'success');
            
            // Add animation effect
            bookmarkBtn.style.transform = 'scale(1.1)';
            setTimeout(() => {
                bookmarkBtn.style.transform = 'scale(1)';
            }, 300);
        }
        
        // Save to localStorage
        localStorage.setItem('earlycode_bookmarks', JSON.stringify(bookmarkedEvents));
    });
    
    // Schedule tabs functionality
    scheduleTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetDay = this.getAttribute('data-day');
            
            // Update active tab
            scheduleTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding content
            scheduleContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === targetDay) {
                    content.classList.add('active');
                }
            });
        });
    });
    
    // Registration form submission
    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const formValues = Object.fromEntries(formData);
        
        // Validate form
        if (!formValues['full-name'] || !formValues['email'] || !formValues['profession'] || !formValues['location']) {
            showNotification('Please fill in all required fields', 'info');
            return;
        }
        
        // Validate email
        if (!validateEmail(formValues['email'])) {
            showNotification('Please enter a valid email address', 'info');
            return;
        }
        
        // Simulate form submission
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        
        // Simulate API call delay
        setTimeout(() => {
            // Show success message
            showNotification('Registration successful! Check your email for confirmation.', 'success');
            
            // Reset form
            registrationForm.reset();
            
            // Restore button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
            
            // Save registration to localStorage (for demo purposes)
            const registrations = JSON.parse(localStorage.getItem('earlycode_registrations')) || [];
            registrations.push({
                event: 'Best Ways to Monetize Your Tech Skills in 2026',
                eventId: eventId,
                ...formValues,
                date: new Date().toISOString()
            });
            localStorage.setItem('earlycode_registrations', JSON.stringify(registrations));
        }, 2000);
    });
    
    // Mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('show');
            
            // Update button icon
            if (navMenu.classList.contains('show')) {
                mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
                document.body.style.overflow = 'hidden';
            } else {
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') return;
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Helper Functions
    function showNotification(message, type) {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        // Add notification styles if not already added
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    background: white;
                    padding: 1rem 1.5rem;
                    border-radius: var(--radius-md);
                    box-shadow: var(--shadow-lg);
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    z-index: 10000;
                    animation: slideIn 0.3s ease forwards;
                    border-left: 4px solid var(--primary-color);
                    max-width: 350px;
                }
                .notification-success {
                    border-left-color: var(--success-color);
                }
                .notification-info {
                    border-left-color: var(--accent-color);
                }
                .notification i {
                    font-size: 1.2rem;
                }
                .notification-success i {
                    color: var(--success-color);
                }
                .notification-info i {
                    color: var(--accent-color);
                }
                .notification-close {
                    background: none;
                    border: none;
                    color: var(--text-light);
                    cursor: pointer;
                    margin-left: auto;
                    padding: 0.25rem;
                }
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOut {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Close notification on button click
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Share buttons functionality
    document.querySelectorAll('.share-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.href === '#') {
                e.preventDefault();
                const eventTitle = encodeURIComponent('Best Ways to Monetize Your Tech Skills in 2026');
                const eventUrl = encodeURIComponent(window.location.href);
                const eventDescription = encodeURIComponent('Join this free workshop to learn how to turn your tech skills into sustainable income streams in 2026.');
                
                let shareUrl = '';
                const platform = this.classList[1]; // twitter, linkedin, etc.
                
                switch(platform) {
                    case 'twitter':
                        shareUrl = `https://twitter.com/intent/tweet?text=${eventTitle}&url=${eventUrl}&hashtags=EarlyCode,TechSkills,Monetization`;
                        break;
                    case 'linkedin':
                        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${eventUrl}`;
                        break;
                    case 'whatsapp':
                        shareUrl = `https://api.whatsapp.com/send?text=${eventTitle} ${eventUrl}`;
                        break;
                    case 'email':
                        shareUrl = `mailto:?subject=${eventTitle}&body=${eventDescription}%0A%0A${eventUrl}`;
                        break;
                }
                
                if (shareUrl) {
                    window.open(shareUrl, '_blank', 'width=600,height=400');
                }
            }
        });
    });
});