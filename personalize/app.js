import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getDatabase, ref, get, set, remove } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { renderSidebar, initSidebarListeners } from "../../components/sidebar.js";
import { renderHeader, initHeaderListeners } from "../../components/header.js";

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

let currentSlug = null;
let aiCurrentData = null;

document.addEventListener('DOMContentLoaded', async () => {
  const appContainer = document.getElementById('appContainer');
  const mainContent = document.getElementById('mainContent');

  if (appContainer) {
    appContainer.insertAdjacentHTML('afterbegin', renderSidebar('../'));
    initSidebarListeners();
  }
  if (mainContent) {
    mainContent.insertAdjacentHTML('afterbegin', renderHeader('../'));
    initHeaderListeners();
  }

  // Captura o slug via URL params (?slug=...)
  const urlParams = new URLSearchParams(window.location.search);
  currentSlug = urlParams.get('slug');

  if (!currentSlug) {
    alert('Nenhum assistente especificado.');
    window.location.href = '../index.html';
    return;
  }

  await loadAiData(currentSlug);
  setupEventListeners();
});

async function loadAiData(slug) {
  try {
    const snapshot = await get(ref(db, `assistants/${slug}`));
    const skeleton = document.getElementById('pageSkeleton');
    const form = document.getElementById('personalizeForm');

    if (!snapshot.exists()) {
      alert('Assistente não encontrado.');
      window.location.href = '../index.html';
      return;
    }

    aiCurrentData = snapshot.val();
    populateForm(aiCurrentData);

    skeleton.classList.add('hidden');
    form.classList.remove('hidden');

  } catch (error) {
    console.error(error);
    alert('Erro ao carregar dados da IA.');
  }
}

function populateForm(data) {
  document.getElementById('aiName').value = data.name || '';
  document.getElementById('aiSlugDisplay').value = data.slug || '';
  document.getElementById('aiDescription').value = data.description || '';
  document.getElementById('aiLogoUrl').value = data.logoUrl || '';
  
  // Cor do tema
  const color = data.themeColor || '#6366f1';
  document.getElementById('aiThemeColor').value = color;
  document.getElementById('hexValue').textContent = color.toUpperCase();
  
  // Presets de cores
  document.querySelectorAll('.color-preset').forEach(btn => {
    if (btn.getAttribute('data-color').toUpperCase() === color.toUpperCase()) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Logo Preview
  if (data.logoUrl) {
    const avatarPreview = document.getElementById('avatarPreview');
    const avatarPlaceholder = document.getElementById('avatarPlaceholder');
    avatarPreview.src = data.logoUrl;
    avatarPreview.classList.remove('hidden');
    avatarPlaceholder.classList.add('hidden');
  }

  // Modelo de IA
  const modelVal = data.model || 'foco-wanga-3.0';
  document.querySelectorAll('.model-card').forEach(card => {
    const radio = card.querySelector('input[type="radio"]');
    if (radio && radio.value === modelVal) {
      radio.checked = true;
      card.classList.add('selected');
    } else {
      card.classList.remove('selected');
    }
  });

  // Template Visual
  const templateVal = data.template || 'modern';
  document.querySelectorAll('.template-card').forEach(card => {
    if (card.getAttribute('data-template') === templateVal) {
      card.classList.add('selected');
    } else {
      card.classList.remove('selected');
    }
  });

  document.getElementById('aiSystemPrompt').value = data.systemPrompt || '';
  document.getElementById('aiWelcomeMessage').value = data.welcomeMessage || '';

  // Link ao Vivo e Cabeçalho
  const fullUrl = `https://${data.slug}.focoprime.online`;
  document.getElementById('fullUrlText').textContent = fullUrl;
  const btnViewLive = document.getElementById('btnViewLive');
  btnViewLive.href = fullUrl;
  btnViewLive.classList.remove('hidden');
}

function setupEventListeners() {
  // Logo Preview com Skeleton
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

  // Seletor de Cores
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

  // Modelos Card
  document.querySelectorAll('.model-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.model-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });

  // Templates Card
  document.querySelectorAll('.template-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.template-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    });
  });

  // Copiar Link
  document.getElementById('btnCopyLink').addEventListener('click', () => {
    const link = `https://${currentSlug}.focoprime.online`;
    navigator.clipboard.writeText(link);
    alert('Link copiado para a área de transferência!');
  });

  // Eliminar IA
  document.getElementById('btnDeleteAi').addEventListener('click', async () => {
    if (confirm('Tem certeza de que deseja eliminar esta Inteligência Artificial? Esta ação não pode ser desfeita.')) {
      try {
        await remove(ref(db, `assistants/${currentSlug}`));
        alert('Assistente eliminado com sucesso.');
        window.location.href = '../index.html';
      } catch (err) {
        console.error(err);
        alert('Erro ao eliminar assistente.');
      }
    }
  });

  // Salvar Alterações
  document.getElementById('personalizeForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const btnSave = document.getElementById('btnSaveAi');
    btnSave.textContent = 'Salvando...';
    btnSave.disabled = true;

    try {
      const updatedData = {
        ...aiCurrentData,
        name: document.getElementById('aiName').value.trim(),
        description: document.getElementById('aiDescription').value.trim(),
        logoUrl: document.getElementById('aiLogoUrl').value.trim() || aiCurrentData.logoUrl,
        themeColor: document.getElementById('aiThemeColor').value,
        model: document.querySelector('input[name="aiModel"]:checked').value,
        systemPrompt: document.getElementById('aiSystemPrompt').value.trim(),
        welcomeMessage: document.getElementById('aiWelcomeMessage').value.trim(),
        template: document.querySelector('.template-card.selected').getAttribute('data-template'),
        updatedAt: new Date().toISOString()
      };

      await set(ref(db, `assistants/${currentSlug}`), updatedData);
      aiCurrentData = updatedData;

      alert('Alterações salvas com sucesso!');
      btnSave.innerHTML = '<i class="fi fi-rr-disk"></i> Salvar Alterações';
      btnSave.disabled = false;

    } catch (error) {
      console.error(error);
      alert('Erro ao salvar alterações: ' + error.message);
      btnSave.innerHTML = '<i class="fi fi-rr-disk"></i> Salvar Alterações';
      btnSave.disabled = false;
    }
  });
}
