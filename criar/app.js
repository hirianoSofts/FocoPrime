import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
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

let currentUser = null;
let slugDebounceTimeout = null;
let isSlugAvailable = false;

document.addEventListener('DOMContentLoaded', () => {
  // Injeta Sidebar e Header
  const appContainer = document.getElementById('appContainer');
  const mainContent = document.getElementById('mainContent');

  // Na página de Criar Nova IA, certifique-se de passar '../' para a renderização da sidebar
if (appContainer) {
    appContainer.insertAdjacentHTML('afterbegin', renderSidebar('../'));
    initSidebarListeners();
}

  if (mainContent) {
    mainContent.insertAdjacentHTML('afterbegin', renderHeader());
    initHeaderListeners();
  }

  setupEventListeners();
});

function setupEventListeners() {
  // 1. Slug Input & Verificação Realtime com Skeleton
  const slugInput = document.getElementById('aiSlug');
  slugInput.addEventListener('input', (e) => {
    let cleanVal = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    e.target.value = cleanVal;

    clearTimeout(slugDebounceTimeout);
    const skeleton = document.getElementById('slugSkeleton');
    const statusMsg = document.getElementById('slugStatus');

    if (!cleanVal) {
      skeleton.classList.add('hidden');
      statusMsg.textContent = '';
      isSlugAvailable = false;
      return;
    }

    skeleton.classList.remove('hidden');
    statusMsg.textContent = '';

    slugDebounceTimeout = setTimeout(async () => {
      await checkSlugAvailability(cleanVal);
    }, 600);
  });

  // 2. Prévia de Imagem de Logótipo com Skeleton
  const logoInput = document.getElementById('aiLogoUrl');
  const avatarSkeleton = document.getElementById('avatarSkeleton');
  const avatarPreview = document.getElementById('avatarPreview');
  const avatarPlaceholder = document.getElementById('avatarPlaceholder');

  logoInput.addEventListener('input', (e) => {
    const url = e.target.value.trim();
    if (!url) {
      avatarPreview.classList.add('hidden');
      avatarSkeleton.classList.add('hidden');
      avatarPlaceholder.classList.remove('hidden');
      return;
    }

    avatarPlaceholder.classList.add('hidden');
    avatarPreview.classList.add('hidden');
    avatarSkeleton.classList.remove('hidden');

    const img = new Image();
    img.src = url;
    img.onload = () => {
      avatarSkeleton.classList.add('hidden');
      avatarPreview.src = url;
      avatarPreview.classList.remove('hidden');
    };
    img.onerror = () => {
      avatarSkeleton.classList.add('hidden');
      avatarPlaceholder.classList.remove('hidden');
    };
  });

  // 3. Seletor de Cores do Tema (Presets + Custom)
  const presets = document.querySelectorAll('.color-preset');
  const customColorInput = document.getElementById('aiThemeColor');
  const hexDisplay = document.getElementById('hexValue');

  presets.forEach(btn => {
    btn.addEventListener('click', () => {
      presets.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const selectedColor = btn.getAttribute('data-color');
      customColorInput.value = selectedColor;
      hexDisplay.textContent = selectedColor.toUpperCase();
    });
  });

  customColorInput.addEventListener('input', (e) => {
    const hex = e.target.value.toUpperCase();
    hexDisplay.textContent = hex;
    presets.forEach(p => {
      p.classList.toggle('active', p.getAttribute('data-color').toUpperCase() === hex);
    });
  });

  // 4. Seletor de Modelos
  document.querySelectorAll('.model-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.model-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });

  // 5. Seletor de Templates Visual
  document.querySelectorAll('.template-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.template-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    });
  });

  // 6. Envio do Formulário
  document.getElementById('createAiForm').addEventListener('submit', handleFormSubmit);
}

async function checkSlugAvailability(slug) {
  const skeleton = document.getElementById('slugSkeleton');
  const statusMsg = document.getElementById('slugStatus');

  try {
    const snapshot = await get(ref(db, `assistants/${slug}`));
    skeleton.classList.add('hidden');

    if (snapshot.exists()) {
      statusMsg.textContent = '✖ Este endereço já está em uso. Escolha outro.';
      statusMsg.className = 'slug-status-msg unavailable';
      isSlugAvailable = false;
    } else {
      statusMsg.textContent = `✓ Disponível! (${slug}.focoprime.online)`;
      statusMsg.className = 'slug-status-msg available';
      isSlugAvailable = true;
    }
  } catch (err) {
    console.error(err);
    skeleton.classList.add('hidden');
    statusMsg.textContent = 'Erro ao verificar disponibilidade.';
    statusMsg.className = 'slug-status-msg unavailable';
    isSlugAvailable = false;
  }
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
  } else {
    const cachedUser = localStorage.getItem('focoai_user');
    if (!cachedUser) {
      window.location.href = '../auth/login/index.html';
    }
  }
});

async function handleFormSubmit(e) {
  e.preventDefault();

  const slug = document.getElementById('aiSlug').value.trim().toLowerCase();

  if (!slug || !isSlugAvailable) {
    alert('Por favor, defina um link único e disponível antes de continuar.');
    return;
  }

  const name = document.getElementById('aiName').value.trim();
  const description = document.getElementById('aiDescription').value.trim();
  const logoUrl = document.getElementById('aiLogoUrl').value.trim();
  const themeColor = document.getElementById('aiThemeColor').value;
  const model = document.querySelector('input[name="aiModel"]:checked').value;
  const systemPrompt = document.getElementById('aiSystemPrompt').value.trim();
  const welcomeMessage = document.getElementById('aiWelcomeMessage').value.trim();
  const template = document.querySelector('.template-card.selected').getAttribute('data-template');

  const btnSubmit = document.getElementById('btnSaveAi');
  btnSubmit.textContent = 'Salvando IA...';
  btnSubmit.disabled = true;

  try {
    const userId = currentUser ? currentUser.uid : 'anon_user';
    const aiData = {
      ownerUid: userId,
      name: name,
      slug: slug,
      description: description,
      logoUrl: logoUrl || 'https://placehold.co/100x100/6366f1/ffffff?text=AI',
      themeColor: themeColor,
      model: model,
      systemPrompt: systemPrompt,
      welcomeMessage: welcomeMessage || 'Olá! Como posso ajudar?',
      template: template,
      createdAt: new Date().toISOString()
    };

    // Trecho atualizado na função handleFormSubmit em app.js (Criação)
    await set(ref(db, `assistants/${slug}`), aiData);

    const publicLink = `https://${slug}.focoprime.online`;
    alert(`Parabéns! Sua Inteligência Artificial foi criada com sucesso.\n\nEndereço público do site:\n${publicLink}`);
    
    // Redireciona para a página de personalização e controlo da IA criada
    window.location.href = `../personalize/index.html?slug=${slug}`;


  } catch (error) {
    console.error(error);
    alert('Erro ao salvar IA no Firebase: ' + error.message);
    btnSubmit.textContent = 'Criar e Publicar IA';
    btnSubmit.disabled = false;
  }
}
