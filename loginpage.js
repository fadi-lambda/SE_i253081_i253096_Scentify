document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Zaroori Elements ko pakadna ---
    const loginBlock = document.getElementById('loginBlock');
    const signupBlock = document.getElementById('signupBlock');
    const showLoginLink = document.getElementById('showLogin');
    const showSignupLink = document.getElementById('showSignup');

    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    const loginError = document.getElementById('loginError');
    const signupError = document.getElementById('signupError');

    // --- 2. URL Hash Checking (Main functionality) ---

    // Yeh function check karta hai ki URL mein '#signup' hai ya nahi
    const checkHashAndToggleForm = () => {
        const hash = window.location.hash;
        
        if (hash === '#signup') {
            // Agar '#signup' hai, toh Sign Up block dikhao
            if (loginBlock && signupBlock) {
                loginBlock.classList.add('hidden-block');
                signupBlock.classList.remove('hidden-block');
                loginError.textContent = ''; // Error saaf karo
            }
        } else {
            // Agar koi hash nahi hai ya '#login' hai, toh Login block dikhao
            if (loginBlock && signupBlock) {
                loginBlock.classList.remove('hidden-block');
                signupBlock.classList.add('hidden-block');
                signupError.textContent = ''; // Error saaf karo
            }
        }
    };

    // Page load hone par aur URL hash change hone par check karo
    checkHashAndToggleForm();
    window.addEventListener('hashchange', checkHashAndToggleForm);


    // --- 3. Internal Form Toggling (Signup/Login Links) ---

    // Login Link -> Signup Form
    if (showSignupLink) {
        showSignupLink.addEventListener('click', (e) => {
            e.preventDefault();
            // Hash ko update karo, jisse checkHashAndToggleForm function automatically run ho
            window.location.hash = 'signup'; 
        });
    }

    // Signup Link -> Login Form
    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            // Hash ko update karo, jisse checkHashAndToggleForm function automatically run ho
            window.location.hash = 'login'; 
        });
    }

    // --- 4. Validation Logic ---
    
    // Basic Email format check
    const isValidEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    // Login Form Submission
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            loginError.textContent = '';

            const emailInput = document.getElementById('loginEmail');
            const passwordInput = document.getElementById('loginPassword');

            if (!emailInput.value || !passwordInput.value) {
                loginError.textContent = 'Please fill out all fields.';
                return;
            }
            if (!isValidEmail(emailInput.value)) {
                loginError.textContent = 'Please enter a valid email address.';
                return;
            }
            
            // Agar validation theek hai, toh yahan aapka server/API call aayega
            loginError.textContent = 'Login Successful! Redirecting...';
            // Example: window.location.href = 'homepage.html';
        });
    }

    // Signup Form Submission
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            signupError.textContent = '';

            const fullNameInput = document.getElementById('signupFullname');
            const emailInput = document.getElementById('signupEmail');
            const passwordInput = document.getElementById('signupPassword');

            if (!fullNameInput.value || !emailInput.value || !passwordInput.value) {
                signupError.textContent = 'Please fill out all fields.';
                return;
            }
            if (!isValidEmail(emailInput.value)) {
                signupError.textContent = 'Please enter a valid email address.';
                return;
            }
            if (passwordInput.value.length < 6) {
                 signupError.textContent = 'Password must be at least 6 characters long.';
                return;
            }
            
            // Agar validation theek hai, toh yahan aapka server/API call aayega
            signupError.textContent = 'Account Created! You can now log in.';
            // Example: window.location.hash = 'login'; // Ya phir redirect karo
        });
    }

});
   