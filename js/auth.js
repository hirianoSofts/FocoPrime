import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { renderSidebar, initSidebarListeners } from "../components/sidebar.js";
import { renderHeader, initHeaderListeners } from "../components/header.js";

const firebaseConfig = {
    apiKey: "AIzaSyAwj0vcsUbdFDwFLt3xfOHCC--OhpF6nXs",
    authDomain: "focoplataforms.firebaseapp.com",
    databaseURL: "https://focoplataforms-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "focoplataforms",
    storageBucket: "focoplataforms.firebasestorage.app",
    messagingSenderId: "363051075501",
    appId: "1:363051075501:web:3ed9f67c5b46badce34324"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

function injectAuthLoader() {
    if (document.getElementById('authLoaderOverlay')) return;
    const overlay = document.createElement('div');
    overlay.id = 'authLoaderOverlay';
    overlay.style.cssText = `
        position: fixed; inset: 0; background: rgba(255,255,255,0.9); backdrop-filter: blur(4px);
        z-index: 99999; display: flex; flex-direction: column; align-items: center; justify-content: center;
        gap: 12px; font-family: 'DM Sans', sans-serif; color: #0f172a;
    `;
    overlay.innerHTML = `
        <div style="width: 42px; height: 42px; border: 3px solid #e2e8f0; border-top-color: #6366f1; border-radius: 50%; animation: spinAuth 0.8s linear infinite;"></div>
        <p style="font-size: 14px; font-weight: 600; letter-spacing: -0.01em;">Verificando autenticação...</p>
        <style>@keyframes spinAuth { to { transform: rotate(360deg); } }</style>
    `;
    document.body.appendChild(overlay);
}

// Injeta a Sidebar e o Header dinamicamente assim que o DOM carrega
document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('appContainer');
    const mainContent = document.getElementById('mainContent');

    if (appContainer) {
        // Insere a sidebar no início do container principal
        appContainer.insertAdjacentHTML('afterbegin', renderSidebar());
        initSidebarListeners();
    }

    if (mainContent) {
        // Insere o cabeçalho no início da tag main
        mainContent.insertAdjacentHTML('afterbegin', renderHeader());
        initHeaderListeners();
    }
});

onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            const userRef = ref(db, 'users/' + user.uid);
            const snapshot = await get(userRef);
            if (snapshot.exists()) {
                const userData = snapshot.val();
                localStorage.setItem('focoai_user', JSON.stringify(userData));
                updateDashboardUI(userData);
            } else {
                const basicData = {
                    email: user.email,
                    displayName: user.displayName || user.email.split('@')[0],
                    credits: 250,
                    plan: 'Pessoal · Gratuito'
                };
                updateDashboardUI(basicData);
            }
        } catch (e) {
            console.error(e);
        }
    } else {
        const cachedUser = localStorage.getItem('focoai_user');
        if (cachedUser) {
            updateDashboardUI(JSON.parse(cachedUser));
        } else {
            injectAuthLoader();
            setTimeout(() => {
                window.location.href = 'auth/login/index.html';
            }, 600);
        }
    }
});

function updateDashboardUI(userData) {
    const welcomeTitle = document.getElementById('welcomeTitle');
    const profileInitial = document.getElementById('profileInitial');
    const popoverName = document.getElementById('popoverName');
    const popoverEmail = document.getElementById('popoverEmail');
    const creditsBadge = document.getElementById('creditsBadge');

    const firstName = userData.firstName || userData.displayName?.split(' ')[0] || userData.email?.split('@')[0] || 'Usuário';

    if (welcomeTitle) welcomeTitle.innerHTML = `Olá, ${firstName}👋`;
    if (profileInitial) profileInitial.textContent = firstName.charAt(0).toUpperCase();
    if (popoverName) popoverName.textContent = userData.displayName || userData.username || 'FocoPrime User';
    if (popoverEmail) popoverEmail.textContent = userData.email || '';
    if (creditsBadge) creditsBadge.textContent = userData.credits !== undefined ? userData.credits : 250;
}

window.handleLogout = async function() {
    try {
        await auth.signOut();
        localStorage.removeItem('focoai_user');
        injectAuthLoader();
        setTimeout(() => {
            window.location.href = 'auth/login/index.html';
        }, 500);
    } catch (e) {
        console.error(e);
    }
};
