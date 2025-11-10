// DOM Elements
const authContainer = document.getElementById('authContainer');
const dashboardContainer = document.getElementById('dashboardContainer');
const loginTab = document.getElementById('loginTab');
const signupTab = document.getElementById('signupTab');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const messageDiv = document.getElementById('message');
const logoutBtn = document.getElementById('logoutBtn');

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        showDashboard();
    }
    
    // Initialize password toggles
    initPasswordToggles();
});

// Tab switching functionality
loginTab.addEventListener('click', function() {
    switchToLogin();
});

signupTab.addEventListener('click', function() {
    switchToSignup();
});

function switchToLogin() {
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
    loginForm.style.display = 'flex';
    signupForm.style.display = 'none';
    clearMessage();
}

function switchToSignup() {
    signupTab.classList.add('active');
    loginTab.classList.remove('active');
    signupForm.style.display = 'flex';
    loginForm.style.display = 'none';
    clearMessage();
}

// Login form submission
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    
    if (!email || !password) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Find user with matching email and password
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Login successful
        localStorage.setItem('currentUser', JSON.stringify(user));
        showMessage('Login successful! Redirecting...', 'success');
        
        setTimeout(() => {
            showDashboard();
        }, 1500);
    } else {
        showMessage('Invalid email or password', 'error');
    }
});

// Signup form submission
signupForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('signupEmail').value.trim(),
        phoneNumber: document.getElementById('phoneNumber').value.trim(),
        dateOfBirth: document.getElementById('dateOfBirth').value,
        gender: document.getElementById('gender').value,
        address: document.getElementById('address').value.trim(),
        qualification: document.getElementById('qualification').value.trim(),
        stateOfOrigin: document.getElementById('stateOfOrigin').value.trim(),
        nationality: document.getElementById('nationality').value.trim(),
        occupation: document.getElementById('occupation').value.trim(),
        nextOfKinName: document.getElementById('nextOfKinName').value.trim(),
        nextOfKinPhone: document.getElementById('nextOfKinPhone').value.trim(),
        hearAboutUs: document.getElementById('hearAboutUs').value,
        password: document.getElementById('signupPassword').value.trim()
    };
    
    const termsChecked = document.getElementById('terms').checked;
    
    // Validation
    if (!validateSignupForm(formData, termsChecked)) {
        return;
    }
    
    // Check if email already exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find(u => u.email === formData.email);
    
    if (existingUser) {
        showMessage('Email already exists. Please sign in instead.', 'error');
        setTimeout(() => {
            switchToLogin();
            document.getElementById('loginEmail').value = formData.email;
        }, 2000);
        return;
    }
    
    // Add user to localStorage
    const newUser = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    showMessage('Account created successfully! Redirecting...', 'success');
    
    setTimeout(() => {
        showDashboard();
    }, 1500);
});

// Form validation
function validateSignupForm(formData, termsChecked) {
    // Check if all required fields are filled
    for (const [key, value] of Object.entries(formData)) {
        if (!value) {
            showMessage(`Please fill in ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`, 'error');
            return false;
        }
    }
    
    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showMessage('Please enter a valid email address', 'error');
        return false;
    }
    
    // Check password length
    if (formData.password.length < 6) {
        showMessage('Password must be at least 6 characters long', 'error');
        return false;
    }
    
    // Check terms and conditions
    if (!termsChecked) {
        showMessage('Please accept the terms and conditions', 'error');
        return false;
    }
    
    return true;
}

// Show/hide message
function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    
    // Auto hide after 5 seconds for error messages
    if (type === 'error') {
        setTimeout(() => {
            clearMessage();
        }, 5000);
    }
}

function clearMessage() {
    messageDiv.style.display = 'none';
    messageDiv.textContent = '';
    messageDiv.className = 'message';
}

// Show dashboard
function showDashboard() {
    authContainer.style.display = 'none';
    dashboardContainer.style.display = 'block';
    
    // Update dashboard with user info
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        // Update the greeting with user's name
        const greetingElements = document.querySelectorAll('.mobile-greeting h2');
        greetingElements.forEach(element => {
            element.textContent = `Hi ${currentUser.firstName} ${currentUser.lastName}`;
        });
    }
}

// Logout functionality
logoutBtn.addEventListener('click', function() {
    localStorage.removeItem('currentUser');
    dashboardContainer.style.display = 'none';
    authContainer.style.display = 'block';
    
    // Reset forms
    loginForm.reset();
    signupForm.reset();
    clearMessage();
    
    // Switch to login tab
    switchToLogin();
    
    showMessage('Logged out successfully', 'success');
});

// Password toggle functionality
function initPasswordToggles() {
    const passwordToggles = document.querySelectorAll('.password-toggle');
    
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const passwordField = this.parentElement.querySelector('.form-input');
            const eyeIcon = this.querySelector('.eye-icon');
            
            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                eyeIcon.textContent = '🙈';
            } else {
                passwordField.type = 'password';
                eyeIcon.textContent = '👁️';
            }
        });
    });
}

// Course card interactions
document.addEventListener('DOMContentLoaded', function() {
    // Add click handlers to course cards
    const courseCards = document.querySelectorAll('.course-card');
    
    courseCards.forEach(card => {
        card.addEventListener('click', function() {
            const cardText = this.querySelector('h3').textContent;
            
            if (cardText.includes('certificate')) {
                showMessage('Certificate download feature coming soon!', 'success');
            } else if (cardText.includes('receipt')) {
                showMessage('Receipt print feature coming soon!', 'success');
            } else {
                showMessage('No ongoing courses at the moment', 'error');
            }
        });
    });
    
    // Mobile menu functionality
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const exploreCourses = document.getElementById('exploreCourses');
    const profileMenu = document.getElementById('profileMenu');
    const logoutMenu = document.getElementById('logoutMenu');
    const exploreCoursesLink = document.getElementById('exploreCoursesLink');
    
    if (mobileMenuBtn && dropdownMenu) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            dropdownMenu.classList.remove('show');
        });
        
        // Prevent dropdown from closing when clicking inside
        dropdownMenu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // Menu item handlers
    if (exploreCourses) {
        exploreCourses.addEventListener('click', function(e) {
            e.preventDefault();
            dropdownMenu.classList.remove('show');
            showMessage('Explore Courses feature coming soon!', 'success');
        });
    }
    
    if (profileMenu) {
        profileMenu.addEventListener('click', function(e) {
            e.preventDefault();
            dropdownMenu.classList.remove('show');
            showMessage('Profile feature coming soon!', 'success');
        });
    }
    
    if (logoutMenu) {
        logoutMenu.addEventListener('click', function(e) {
            e.preventDefault();
            dropdownMenu.classList.remove('show');
            // Trigger logout
            logoutBtn.click();
        });
    }
    
    // Explore courses link handler
    if (exploreCoursesLink) {
        exploreCoursesLink.addEventListener('click', function(e) {
            e.preventDefault();
            showMessage('Explore Other Courses feature coming soon!', 'success');
        });
    }
});