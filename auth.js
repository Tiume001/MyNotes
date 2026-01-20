// ============================================
// AUTHENTICATION LOGIC
// ============================================

import { auth } from './firebase-config.js';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged,
    updateProfile,
    sendEmailVerification
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// ============================================
// DOM ELEMENTS
// ============================================

const loginToggle = document.getElementById('loginToggle');
const signupToggle = document.getElementById('signupToggle');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const errorMessage = document.getElementById('errorMessage');

// Login Form Elements
const loginEmailInput = document.getElementById('loginEmail');
const loginPasswordInput = document.getElementById('loginPassword');
const loginBtn = document.getElementById('loginBtn');
const googleLoginBtn = document.getElementById('googleLoginBtn');

// Signup Form Elements
const signupNameInput = document.getElementById('signupName');
const signupEmailInput = document.getElementById('signupEmail');
const signupPasswordInput = document.getElementById('signupPassword');
const signupBtn = document.getElementById('signupBtn');
const googleSignupBtn = document.getElementById('googleSignupBtn');

// ============================================
// CHECK AUTHENTICATION STATE
// ============================================

// Note: We don't auto-redirect on auth state change in auth.html
// Users should only be redirected after explicitly logging in/signing up

// ============================================
// TOGGLE BETWEEN LOGIN AND SIGNUP
// ============================================

loginToggle.addEventListener('click', () => {
    loginToggle.classList.add('active');
    signupToggle.classList.remove('active');
    loginForm.classList.add('active');
    signupForm.classList.remove('active');
    hideError();
});

signupToggle.addEventListener('click', () => {
    signupToggle.classList.add('active');
    loginToggle.classList.remove('active');
    signupForm.classList.add('active');
    loginForm.classList.remove('active');
    hideError();
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
}

function hideError() {
    errorMessage.classList.remove('show');
    errorMessage.textContent = '';
    // Reset styling to default error colors
    errorMessage.style.background = '';
    errorMessage.style.borderColor = '';
    errorMessage.style.color = '';
}

function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.classList.add('loading');
        button.dataset.originalText = button.textContent;
        button.textContent = '';
    } else {
        button.disabled = false;
        button.classList.remove('loading');
        button.textContent = button.dataset.originalText || button.textContent;
    }
}

function getFirebaseErrorMessage(errorCode) {
    const errorMessages = {
        'auth/email-already-in-use': 'Questa email è già registrata. Prova ad accedere.',
        'auth/invalid-email': 'Email non valida.',
        'auth/operation-not-allowed': 'Operazione non permessa.',
        'auth/weak-password': 'La password deve essere di almeno 6 caratteri.',
        'auth/user-disabled': 'Questo account è stato disabilitato.',
        'auth/user-not-found': 'Nessun account trovato con questa email.',
        'auth/wrong-password': 'Password errata.',
        'auth/invalid-credential': 'Credenziali non valide. Verifica email e password.',
        'auth/too-many-requests': 'Troppi tentativi falliti. Riprova più tardi.',
        'auth/network-request-failed': 'Errore di connessione. Verifica la tua rete.',
        'auth/popup-closed-by-user': 'Login annullato.',
        'auth/cancelled-popup-request': 'Login annullato.',
        'auth/invalid-api-key': 'Configurazione Firebase non valida. Controlla firebase-config.js',
        'auth/app-deleted': 'Configurazione Firebase non valida.',
        'auth/unauthorized-domain': 'Dominio non autorizzato. Aggiungi questo dominio nella Firebase Console.'
    };

    return errorMessages[errorCode] || 'Si è verificato un errore. Riprova.';
}

// ============================================
// EMAIL/PASSWORD LOGIN
// ============================================

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();

    const email = loginEmailInput.value.trim();
    const password = loginPasswordInput.value;

    if (!email || !password) {
        showError('Inserisci email e password.');
        return;
    }

    setButtonLoading(loginBtn, true);

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Check if email is verified (skip check for Google sign-in users)
        if (!user.emailVerified && user.providerData[0]?.providerId === 'password') {
            console.log('Email not verified for:', user.email);

            // Log out the user
            await auth.signOut();

            // Show error with option to resend verification
            setButtonLoading(loginBtn, false);
            showError('⚠️ Email non verificata. Controlla la tua casella di posta e clicca sul link di verifica. Non hai ricevuto l\'email?');
            errorMessage.style.background = 'rgba(251, 146, 60, 0.1)';
            errorMessage.style.borderColor = 'rgba(251, 146, 60, 0.5)';
            errorMessage.style.color = '#fb923c';

            // Add resend button
            const resendBtn = document.createElement('button');
            resendBtn.textContent = 'Reinvia email di verifica';
            resendBtn.className = 'resend-verification-btn';
            resendBtn.style.cssText = 'margin-top: 0.5rem; padding: 0.5rem 1rem; background: rgba(251, 146, 60, 0.2); border: 1px solid rgba(251, 146, 60, 0.5); color: #fb923c; border-radius: 8px; cursor: pointer; font-size: 0.9rem;';
            resendBtn.onclick = async () => {
                try {
                    // Re-authenticate to get user object
                    const tempUser = await signInWithEmailAndPassword(auth, email, password);
                    await sendEmailVerification(tempUser.user);
                    await auth.signOut();
                    showError('✅ Email di verifica inviata! Controlla la tua casella di posta.');
                    errorMessage.style.background = 'rgba(34, 197, 94, 0.1)';
                    errorMessage.style.borderColor = 'rgba(34, 197, 94, 0.5)';
                    errorMessage.style.color = '#22c55e';
                } catch (err) {
                    console.error('Error resending verification:', err);
                    showError('Errore durante l\'invio dell\'email. Riprova più tardi.');
                }
            };
            errorMessage.appendChild(resendBtn);
            return;
        }

        console.log('Login successful:', user.email);
        // Redirect to main site
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Login error:', error.code, error.message);
        showError(getFirebaseErrorMessage(error.code));
        setButtonLoading(loginBtn, false);
    }
});

// ============================================
// EMAIL/PASSWORD SIGNUP
// ============================================

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();

    const name = signupNameInput.value.trim();
    const email = signupEmailInput.value.trim();
    const password = signupPasswordInput.value;

    if (!name || !email || !password) {
        showError('Compila tutti i campi.');
        return;
    }

    if (password.length < 6) {
        showError('La password deve essere di almeno 6 caratteri.');
        return;
    }

    setButtonLoading(signupBtn, true);

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Update user profile with name
        await updateProfile(userCredential.user, {
            displayName: name
        });

        console.log('Signup successful:', userCredential.user.email);

        // Send email verification
        await sendEmailVerification(userCredential.user);
        console.log('Verification email sent to:', userCredential.user.email);

        // Log out the user immediately after signup
        await auth.signOut();

        // Clear signup form
        signupNameInput.value = '';
        signupEmailInput.value = '';
        signupPasswordInput.value = '';

        // Switch to login form
        loginToggle.click();

        // Show success message with verification instructions
        setButtonLoading(signupBtn, false);
        showError('✅ Registrazione completata! Ti abbiamo inviato un\'email di verifica. Controlla la tua casella di posta e clicca sul link di conferma prima di effettuare il login.');
        errorMessage.style.background = 'rgba(34, 197, 94, 0.1)';
        errorMessage.style.borderColor = 'rgba(34, 197, 94, 0.5)';
        errorMessage.style.color = '#22c55e';

    } catch (error) {
        console.error('Signup error:', error.code, error.message);
        showError(getFirebaseErrorMessage(error.code));
        setButtonLoading(signupBtn, false);
    }
});

// ============================================
// GOOGLE SIGN-IN
// ============================================

async function handleGoogleSignIn(button) {
    hideError();
    setButtonLoading(button, true);

    const provider = new GoogleAuthProvider();

    try {
        const result = await signInWithPopup(auth, provider);
        console.log('Google sign-in successful:', result.user.email);
        // Redirect to main site
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Google sign-in error:', error.code, error.message);

        // Don't show error if user simply closed the popup
        if (error.code !== 'auth/popup-closed-by-user' &&
            error.code !== 'auth/cancelled-popup-request') {
            showError(getFirebaseErrorMessage(error.code));
        }

        setButtonLoading(button, false);
    }
}

googleLoginBtn.addEventListener('click', () => handleGoogleSignIn(googleLoginBtn));
googleSignupBtn.addEventListener('click', () => handleGoogleSignIn(googleSignupBtn));

// ============================================
// CLEAR INPUTS ON FORM SWITCH
// ============================================

function clearFormInputs() {
    loginEmailInput.value = '';
    loginPasswordInput.value = '';
    signupNameInput.value = '';
    signupEmailInput.value = '';
    signupPasswordInput.value = '';
}

loginToggle.addEventListener('click', clearFormInputs);
signupToggle.addEventListener('click', clearFormInputs);
