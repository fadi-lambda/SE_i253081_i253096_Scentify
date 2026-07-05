document.addEventListener('DOMContentLoaded', () => {
    const AUTH_USERS_KEY = 'scentifyUsers';
    const AUTH_SESSION_KEY = 'scentifySession';

    const loginBlock = document.getElementById('loginBlock');
    const signupBlock = document.getElementById('signupBlock');
    const showLoginLink = document.getElementById('showLogin');
    const showSignupLink = document.getElementById('showSignup');

    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    const loginError = document.getElementById('loginError');
    const signupError = document.getElementById('signupError');
    const loginEmailInput = document.getElementById('loginEmail');
    const loginPasswordInput = document.getElementById('loginPassword');
    const signupFullnameInput = document.getElementById('signupFullname');
    const signupEmailInput = document.getElementById('signupEmail');
    const signupPasswordInput = document.getElementById('signupPassword');
    const signupPasswordStrength = document.getElementById('signupPasswordStrength');
    const signupPasswordStrengthText = document.getElementById('signupPasswordStrengthText');

    const passwordToggleButtons = document.querySelectorAll('[data-password-toggle]');

    const isValidEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const normalizeEmail = (email) => String(email || '').trim().toLowerCase();
    const normalizeName = (name) => String(name || '').trim().replace(/\s+/g, ' ');

    const getStoredUsers = () => {
        try {
            const users = JSON.parse(localStorage.getItem(AUTH_USERS_KEY));
            return Array.isArray(users) ? users : [];
        } catch {
            return [];
        }
    };

    const saveStoredUsers = (users) => {
        localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
    };

    const saveSession = (user) => {
        localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({
            email: user.email,
            fullName: user.fullName,
            signedInAt: new Date().toISOString()
        }));
    };

    const getRedirectTarget = () => {
        const params = new URLSearchParams(window.location.search);
        const returnTo = params.get('returnTo');

        if (!returnTo) return 'index.html';
        if (returnTo.includes('://') || returnTo.startsWith('//')) return 'index.html';
        return returnTo;
    };

    const setMessage = (element, text, kind = 'error') => {
        if (!element) return;
        element.textContent = text;
        element.classList.remove('is-success', 'is-error');
        element.classList.add(kind === 'success' ? 'is-success' : 'is-error');
    };

    const clearMessage = (element) => {
        if (!element) return;
        element.textContent = '';
        element.classList.remove('is-success', 'is-error');
    };

    const evaluatePasswordStrength = (password) => {
        const value = String(password || '');
        const checks = [
            value.length >= 8,
            /[a-z]/.test(value),
            /[A-Z]/.test(value),
            /\d/.test(value),
            /[^A-Za-z0-9]/.test(value)
        ];
        const score = checks.filter(Boolean).length;

        if (!value) {
            return { score: 0, label: 'Use 8+ characters with upper and lower case letters, a number, and a symbol.', className: 'empty' };
        }

        if (value.length < 8 || score <= 2) {
            return { score: 1, label: 'Weak password. Add more length and character variety.', className: 'weak' };
        }

        if (score <= 4) {
            return { score: 2, label: 'Medium strength. Add another character type to improve it.', className: 'medium' };
        }

        return { score: 3, label: 'Strong password.', className: 'strong' };
    };

    const renderPasswordStrength = () => {
        if (!signupPasswordStrength || !signupPasswordStrengthText) return;

        const strength = evaluatePasswordStrength(signupPasswordInput ? signupPasswordInput.value : '');
        const segments = Array.from(signupPasswordStrength.querySelectorAll('.strength-segment'));

        signupPasswordStrength.dataset.state = strength.className;
        signupPasswordStrengthText.textContent = strength.label;

        segments.forEach((segment, index) => {
            segment.classList.toggle('active', index < strength.score);
        });
    };

    const checkHashAndToggleForm = () => {
        const hash = window.location.hash;

        if (hash === '#signup') {
            if (loginBlock && signupBlock) {
                loginBlock.classList.add('hidden-block');
                signupBlock.classList.remove('hidden-block');
                clearMessage(loginError);
            }
        } else {
            if (loginBlock && signupBlock) {
                loginBlock.classList.remove('hidden-block');
                signupBlock.classList.add('hidden-block');
                clearMessage(signupError);
            }
        }
    };

    const updateAuthAfterLogin = (user) => {
        saveSession(user);
        window.location.href = getRedirectTarget();
    };

    passwordToggleButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-password-toggle');
            const passwordInput = document.getElementById(targetId);

            if (!passwordInput) return;

            const isPasswordHidden = passwordInput.type === 'password';
            passwordInput.type = isPasswordHidden ? 'text' : 'password';
            button.setAttribute('aria-pressed', String(isPasswordHidden));
            button.setAttribute('aria-label', isPasswordHidden ? 'Hide password' : 'Show password');
            button.setAttribute('data-visible', String(isPasswordHidden));
        });
    });

    checkHashAndToggleForm();
    window.addEventListener('hashchange', checkHashAndToggleForm);

    if (signupPasswordInput) {
        signupPasswordInput.addEventListener('input', renderPasswordStrength);
        renderPasswordStrength();
    }

    if (showSignupLink) {
        showSignupLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.hash = 'signup';
        });
    }

    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.hash = 'login';
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            clearMessage(loginError);

            const emailValue = normalizeEmail(loginEmailInput ? loginEmailInput.value : '');
            const passwordValue = loginPasswordInput ? loginPasswordInput.value : '';

            if (!emailValue || !passwordValue) {
                setMessage(loginError, 'Please fill out both email and password.');
                return;
            }

            if (!isValidEmail(emailValue)) {
                setMessage(loginError, 'Please enter a valid email address.');
                return;
            }

            const users = getStoredUsers();
            const matchedUser = users.find(user => normalizeEmail(user.email) === emailValue);

            if (!matchedUser) {
                setMessage(loginError, 'No account found for this email. Please sign up first.');
                return;
            }

            if (matchedUser.password !== passwordValue) {
                setMessage(loginError, 'Incorrect password for this email.');
                return;
            }

            setMessage(loginError, 'Sign in successful. Redirecting...', 'success');
            updateAuthAfterLogin(matchedUser);
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            clearMessage(signupError);

            const fullNameValue = normalizeName(signupFullnameInput ? signupFullnameInput.value : '');
            const emailValue = normalizeEmail(signupEmailInput ? signupEmailInput.value : '');
            const passwordValue = signupPasswordInput ? signupPasswordInput.value : '';
            const passwordStrength = evaluatePasswordStrength(passwordValue);

            if (!fullNameValue || !emailValue || !passwordValue) {
                setMessage(signupError, 'Please fill out all fields.');
                return;
            }

            if (fullNameValue.length < 2 || !/[A-Za-z]/.test(fullNameValue)) {
                setMessage(signupError, 'Please enter a valid full name.');
                return;
            }

            if (!isValidEmail(emailValue)) {
                setMessage(signupError, 'Please enter a valid email address.');
                return;
            }

            if (passwordStrength.score < 2) {
                setMessage(signupError, 'Use a stronger password before creating the account.');
                return;
            }

            const users = getStoredUsers();
            const duplicateUser = users.find(user => normalizeEmail(user.email) === emailValue);

            if (duplicateUser) {
                setMessage(signupError, 'An account already exists for this email. Please sign in instead.');
                return;
            }

            users.push({
                fullName: fullNameValue,
                email: emailValue,
                password: passwordValue,
                createdAt: new Date().toISOString()
            });

            saveStoredUsers(users);

            if (signupPasswordInput) signupPasswordInput.value = '';
            if (signupFullnameInput) signupFullnameInput.value = fullNameValue;
            if (signupEmailInput) signupEmailInput.value = emailValue;
            renderPasswordStrength();

            setMessage(signupError, 'Account created. You can now sign in.', 'success');
            window.location.hash = 'login';
            if (loginEmailInput) loginEmailInput.value = emailValue;
        });
    }
});
