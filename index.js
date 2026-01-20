// ============================================
// INDEX PAGE - AUTHENTICATION CHECK & LOGOUT
// ============================================

import { auth } from './firebase-config.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// ============================================
// CHECK IF USER IS AUTHENTICATED
// ============================================

onAuthStateChanged(auth, (user) => {
    if (!user) {
        // User is not signed in, redirect to auth page
        console.log('User not authenticated, redirecting to auth.html');
        window.location.href = 'auth.html';
    } else {
        console.log('User authenticated:', user.email);
        // 🔓 Mostra la pagina solo dopo conferma Firebase
        document.body.classList.remove('auth-loading');
        // Update user info in the UI if needed
        updateUserProfile(user);
    }
});

// ============================================
// UPDATE USER PROFILE IN UI
// ============================================

function updateUserProfile(user) {
    const userNameElement = document.querySelector('.user-profile span');
    const userAvatarElement = document.querySelector('.user-profile .avatar');

    if (user.displayName) {
        if (userNameElement) {
            userNameElement.textContent = user.displayName;
        }
        if (userAvatarElement) {
            // Create initials from display name
            const initials = user.displayName
                .split(' ')
                .map(word => word[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);
            userAvatarElement.textContent = initials;
        }
    } else if (user.email) {
        if (userNameElement) {
            userNameElement.textContent = user.email;
        }
        if (userAvatarElement) {
            // Create initials from email
            const initials = user.email.slice(0, 2).toUpperCase();
            userAvatarElement.textContent = initials;
        }
    }
}

// ============================================
// LOGOUT FUNCTIONALITY
// ============================================

function setupLogoutButton() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await signOut(auth);
                console.log('User signed out successfully');
                // Redirect will happen automatically via onAuthStateChanged
            } catch (error) {
                console.error('Error signing out:', error);
                alert('Errore durante il logout. Riprova.');
            }
        });
    }
}

// Initialize logout button when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupLogoutButton);
} else {
    setupLogoutButton();
}
