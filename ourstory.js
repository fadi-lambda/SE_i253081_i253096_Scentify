document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Sticky Header Functionality ---
    const mainHeader = document.querySelector('.main-header');
    
    if (mainHeader) {
        // 'sticky' class ko CSS mein define kiya ja sakta hai agar header ko style karna ho.
        const handleScroll = () => {
            const stickyThreshold = 50; 
            if (window.scrollY > stickyThreshold) {
                mainHeader.classList.add('sticky');
            } else {
                mainHeader.classList.remove('sticky');
            }
        };

        window.addEventListener('scroll', handleScroll);
        // Page load par bhi check karein agar user ne scroll kiya ho
        handleScroll(); 
    }

    // --- 2. Login Form Submission Handling (Dummy) ---
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Basic validation
            if (email.length < 5 || password.length < 6) {
                alert("Please enter a valid email and password (minimum 6 characters).");
                return;
            }
            
            // In a real application, AJAX request for login would go here
            console.log(`Attempting login for: ${email}`);
            
            // Success message (dummy)
            alert(`Login successful for ${email}! Redirecting...`);
            
            // Optional: Redirect to user dashboard
            // window.location.href = 'dashboard.html';
        });
    }

});