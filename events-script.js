// events-script.js - Enhanced Events Page Functionality

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const categoryFilter = document.getElementById('category-filter');
    const dateFilter = document.getElementById('date-filter');
    const statusFilter = document.getElementById('status-filter');
    const resetFiltersBtn = document.querySelector('.reset-filters');
    const eventsContainer = document.getElementById('events-container');
    const eventCards = document.querySelectorAll('.event-card');
    const bookmarkButtons = document.querySelectorAll('.btn-bookmark');
    const paginationBtns = document.querySelectorAll('.pagination-btn');
    const newsletterForm = document.querySelector('.newsletter-form');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const navActions = document.querySelector('.nav-actions');
    
    // Initialize bookmarked events from localStorage
    let bookmarkedEvents = JSON.parse(localStorage.getItem('earlycode_bookmarks')) || [];
    
    // Apply bookmarked state on page load
    bookmarkButtons.forEach(btn => {
        const eventId = btn.getAttribute('data-event');
        if (bookmarkedEvents.includes(eventId)) {
            btn.classList.add('bookmarked');
            btn.innerHTML = '<i class="fas fa-bookmark"></i>';
        }
    });
    
    // Filter Events Function
    function filterEvents() {
        const category = categoryFilter.value;
        const date = dateFilter.value;
        const status = statusFilter.value;
        
        let visibleCount = 0;
        
        eventCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const cardStatus = card.getAttribute('data-status');
            const cardDateElement = card.querySelector('.event-date span');
            const cardDateText = cardDateElement ? cardDateElement.textContent : '';
            
            let categoryMatch = category === 'all' || category === cardCategory;
            let statusMatch = status === 'all' || status === cardStatus;
            let dateMatch = true;  
            
            // Date filtering logic
            if (date !== 'upcoming' && date !== 'latest') {
                const eventDate = new Date(cardDateText.split(',')[0]);
                const today = new Date();
                
                if (date === 'month') {
                    const nextMonth = new Date(today);
                    nextMonth.setMonth(today.getMonth() + 1);
                    dateMatch = eventDate >= today && eventDate <= nextMonth;
                } else if (date === 'quarter') {
                    const nextQuarter = new Date(today);
                    nextQuarter.setMonth(today.getMonth() + 3);
                    dateMatch = eventDate >= today && eventDate <= nextQuarter;
                }
            }
            
            if (categoryMatch && statusMatch && dateMatch) {
                card.style.display = 'flex';
                visibleCount++;
                
                // Add animation for appearing cards
                card.style.animation = 'none';
                setTimeout(() => {
                    card.style.animation = 'fadeIn 0.5s ease forwards';
                }, 10);
            } else {
                card.style.display = 'none';
            }
        });
        
        // Show/hide no events message
        let noEventsMsg = document.querySelector('.no-events');
        if (!noEventsMsg && visibleCount === 0) {
            noEventsMsg = document.createElement('div');
            noEventsMsg.className = 'no-events';
            noEventsMsg.innerHTML = `
                <i class="fas fa-calendar-times"></i>
                <h3>No Events Found</h3>
                <p>Try adjusting your filters to find more events that match your criteria.</p>
                <button class="btn btn-primary" style="margin-top: 1.5rem;">Reset Filters</button>
            `;
            eventsContainer.appendChild(noEventsMsg);
            
            // Add reset button functionality
            noEventsMsg.querySelector('button').addEventListener('click', resetFilters);
        } else if (noEventsMsg && visibleCount > 0) {
            noEventsMsg.remove();
        }
        
        // Sort events by date if needed
        if (date === 'latest') {
            const container = document.querySelector('.events-grid');
            const cards = Array.from(container.querySelectorAll('.event-card[style*="display: flex"]'));
            
            cards.sort((a, b) => {
                const dateA = new Date(a.querySelector('.event-date span').textContent.split(',')[0]);
                const dateB = new Date(b.querySelector('.event-date span').textContent.split(',')[0]);
                return dateB - dateA;
            });
            
            cards.forEach(card => container.appendChild(card));
        }
    }
    
    // Reset Filters Function
    function resetFilters() {
        categoryFilter.value = 'all';
        dateFilter.value = 'upcoming';
        statusFilter.value = 'all';
        filterEvents();
        
        // Show success notification
        showNotification('Filters reset successfully!', 'success');
    }
    
    // Bookmark Event Function
    function toggleBookmark(event) {
        event.preventDefault();
        const btn = this;
        const eventId = btn.getAttribute('data-event');
        
        if (bookmarkedEvents.includes(eventId)) {
            // Remove bookmark
            const index = bookmarkedEvents.indexOf(eventId);
            bookmarkedEvents.splice(index, 1);
            btn.classList.remove('bookmarked');
            btn.innerHTML = '<i class="far fa-bookmark"></i>';
            showNotification('Event removed from bookmarks', 'info');
        } else {
            // Add bookmark
            bookmarkedEvents.push(eventId);
            btn.classList.add('bookmarked');
            btn.innerHTML = '<i class="fas fa-bookmark"></i>';
            showNotification('Event bookmarked! View in your profile', 'success');
            
            // Add animation effect
            btn.style.transform = 'scale(1.2)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 300);
        }
        
        // Save to localStorage
        localStorage.setItem('earlycode_bookmarks', JSON.stringify(bookmarkedEvents));
    }
    
    // Show Notification Function
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
        
        // Add styles
        const style = document.createElement('style');
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
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        // Close notification on button click
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
                
                // Add slideOut animation
                const slideOutStyle = document.createElement('style');
                slideOutStyle.textContent = `
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
                document.head.appendChild(slideOutStyle);
            }
        }, 5000);
    }
    
    // Newsletter Form Submission
    function handleNewsletterSubmit(e) {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if (!email) {
            showNotification('Please enter your email address', 'info');
            emailInput.focus();
            return;
        }
        
        if (!validateEmail(email)) {
            showNotification('Please enter a valid email address', 'info');
            emailInput.focus();
            return;
        }
        
        // Simulate API call
        emailInput.disabled = true;
        newsletterForm.querySelector('button').disabled = true;
        newsletterForm.querySelector('button').innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
        
        setTimeout(() => {
            showNotification('Successfully subscribed to newsletter!', 'success');
            emailInput.value = '';
            emailInput.disabled = false;
            newsletterForm.querySelector('button').disabled = false;
            newsletterForm.querySelector('button').innerHTML = 'Subscribe';
            
            // Save to localStorage
            const subscribers = JSON.parse(localStorage.getItem('earlycode_subscribers')) || [];
            if (!subscribers.includes(email)) {
                subscribers.push(email);
                localStorage.setItem('earlycode_subscribers', JSON.stringify(subscribers));
            }
        }, 1500);
    }
    
    // Email validation
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Pagination functionality
    function handlePagination(e) {
        const btn = e.currentTarget;
        if (btn.classList.contains('disabled')) return;
        
        paginationBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Simulate page change
        showNotification('Loading events...', 'info');
        
        setTimeout(() => {
            showNotification('Page loaded successfully', 'success');
        }, 800);
    }
    
    // Mobile menu toggle
    function toggleMobileMenu() {
        navMenu.classList.toggle('show');
        navActions.classList.toggle('show');
        
        // Update button icon
        if (navMenu.classList.contains('show')) {
            mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
            document.body.style.overflow = 'hidden';
        } else {
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = 'auto';
        }
    }
    
    // Add CSS for mobile menu
    const mobileMenuStyles = document.createElement('style');
    mobileMenuStyles.textContent = `
        @media (max-width: 768px) {
            .nav-menu.show,
            .nav-actions.show {
                display: flex;
                flex-direction: column;
                position: absolute;
                top: 100%;
                left: 0;
                width: 100%;
                background: var(--bg-white);
                padding: 2rem;
                box-shadow: var(--shadow-lg);
                z-index: 1000;
                animation: slideDown 0.3s ease forwards;
            }
            .nav-menu.show {
                align