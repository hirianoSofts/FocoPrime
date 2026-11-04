import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

/**
 * Renderiza dinamicamente as IAs reais do usuário na secção "Suas IAs" do dashboard com Skeleton moderno.
 * @param {string} userId - O UID do usuário autenticado.
 */
export async function renderUserAIs(userId) {
  const gridContainer = document.getElementById('aiCardsGrid') || document.querySelector('.ai-cards-grid');
  if (!gridContainer) return;

  // Exibe skeleton moderno de carregamento com 3 placeholders
  gridContainer.innerHTML = `
    <div class="ai-card-skeleton">
      <div class="skeleton-top">
        <div class="skeleton-icon skeleton-shine"></div>
        <div class="skeleton-badge skeleton-shine"></div>
      </div>
      <div class="skeleton-title skeleton-shine"></div>
      <div>
        <div class="skeleton-line skeleton-shine" style="margin-bottom: 6px;"></div>
        <div class="skeleton-line-short skeleton-shine"></div>
      </div>
      <div class="skeleton-meta">
        <div class="skeleton-meta-item skeleton-shine"></div>
        <div class="skeleton-meta-item skeleton-shine" style="width: 45%;"></div>
      </div>
      <div class="skeleton-actions">
        <div class="skeleton-btn-primary skeleton-shine"></div>
        <div class="skeleton-btn-outline skeleton-shine"></div>
      </div>
    </div>
    <div class="ai-card-skeleton">
      <div class="skeleton-top">
        <div class="skeleton-icon skeleton-shine"></div>
        <div class="skeleton-badge skeleton-shine"></div>
      </div>
      <div class="skeleton-title skeleton-shine"></div>
      <div>
        <div class="skeleton-line skeleton-shine" style="margin-bottom: 6px;"></div>
        <div class="skeleton-line-short skeleton-shine"></div>
      </div>
      <div class="skeleton-meta">
        <div class="skeleton-meta-item skeleton-shine"></div>
        <div class="skeleton-meta-item skeleton-shine" style="width: 45%;"></div>
      </div>
      <div class="skeleton-actions">
        <div class="skeleton-btn-primary skeleton-shine"></div>
        <div class="skeleton-btn-outline skeleton-shine"></div>
      </div>
    </div>
    <div class="ai-card-skeleton">
      <div class="skeleton-top">
        <div class="skeleton-icon skeleton-shine"></div>
        <div class="skeleton-badge skeleton-shine"></div>
      </div>
      <div class="skeleton-title skeleton-shine"></div>
      <div>
        <div class="skeleton-line skeleton-shine" style="margin-bottom: 6px;"></div>
        <div class="skeleton-line-short skeleton-shine"></div>
      </div>
      <div class="skeleton-meta">
        <div class="skeleton-meta-item skeleton-shine"></div>
        <div class="skeleton-meta-item skeleton-shine" style="width: 45%;"></div>
      </div>
      <div class="skeleton-actions">
        <div class="skeleton-btn-primary skeleton-shine"></div>
        <div class="skeleton-btn-outline skeleton-shine"></div>
      </div>
    </div>
  `;

  const db = getDatabase();
  
  try {
    const assistantsRef = ref(db, 'assistants');
    const snapshot = await get(assistantsRef);

    let cardsHtml = '';
    let hasAi = false;

    if (snapshot.exists()) {
      const data = snapshot.val();
      
      Object.keys(data).forEach((slug) => {
        const ai = data[slug];
        
        if (ai.ownerUid === userId) {
          hasAi = true;
          const logo = ai.logoUrl || 'https://placehold.co/100x100/6366f1/ffffff?text=AI';
          
          cardsHtml += `
            <div class="ai-card">
              <div class="ai-card-top">
                <div class="ai-icon-box" style="background: ${ai.themeColor ? ai.themeColor + '15' : '#e0e7ff'}; color: ${ai.themeColor || 'var(--primary)'};">
                  <img src="${logo}" alt="${ai.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: var(--radius-sm);" onerror="this.onerror=null; this.src='https://placehold.co/44x44/6366f1/ffffff?text=AI'">
                </div>
                <span class="status-badge status-online">Ativo</span>
              </div>
              <h3>${ai.name}</h3>
              <p>${ai.description || 'Assistente de IA personalizado para atendimento e conversão.'}</p>
              <div class="ai-card-meta">
                <span><i class="fi fi-rr-globe"></i> ${ai.slug}.focoprime.online</span>
                <span><i class="fi fi-rr-calendar"></i> ${new Date(ai.createdAt).toLocaleDateString()}</span>
              </div>
              <div class="ai-card-actions">
                <a href="personalize/index.html?slug=${ai.slug}" class="btn-secondary" style="text-align: center;">Personalizar</a>
                <button class="btn-outline" onclick="window.open('https://${ai.slug}.focoprime.online', '_blank')" title="Ver site"><i class="fi fi-rr-eye"></i></button>
              </div>
            </div>
          `;
        }
      });
    }

    // Cartão estático para criar novo agente no final da grelha
    cardsHtml += `
      <div class="ai-card new-ai-card" id="createNewAiCard">
        <div class="new-ai-content">
          <div class="add-icon">
            <i class="fi fi-rr-add"></i>
          </div>
          <h3>Criar Novo Agente de IA</h3>
          <p>Construa um novo modelo de inteligência artificial personalizado para o seu site.</p>
        </div>
      </div>
    `;

    gridContainer.innerHTML = cardsHtml;

    updateWelcomeAction(hasAi);

    const createCard = document.getElementById('createNewAiCard');
    if (createCard) {
      createCard.addEventListener('click', () => {
        triggerProgressAndRedirect('criar/index.html');
      });
    }

    return hasAi;
  } catch (error) {
    console.error("Erro ao carregar as IAs do usuário:", error);
    gridContainer.innerHTML = `<div style="grid-column: span 3; text-align: center; padding: 30px; color: var(--danger);">Erro ao carregar os seus agentes. Tente novamente.</div>`;
  }
}

function updateWelcomeAction(hasAi) {
  const welcomeHeaderBtn = document.getElementById('welcomeActionBtn') || document.querySelector('.welcome-header .btn-primary, .welcome-header .btn-upgrade-gold');
  
  if (!welcomeHeaderBtn) return;

  if (hasAi) {
    welcomeHeaderBtn.className = 'btn-upgrade-gold';
    welcomeHeaderBtn.innerHTML = `
      <i class="fi fi-sr-crown" style="color: #fbbf24;"></i>
      <span>Upgrade para PRO</span>
    `;
    welcomeHeaderBtn.onclick = (e) => {
      e.preventDefault();
      triggerProgressAndRedirect('/planos/');
    };
  } else {
    welcomeHeaderBtn.className = 'btn-primary';
    welcomeHeaderBtn.innerHTML = `
      <i class="fi fi-rr-plus"></i>
      <span>Criar Uma Nova IA</span>
    `;
    welcomeHeaderBtn.onclick = (e) => {
      e.preventDefault();
      triggerProgressAndRedirect('criar/index.html');
    };
  }
}

function triggerProgressAndRedirect(targetUrl) {
  if (document.getElementById('pageTransitionProgressBar')) return;

  const progressBar = document.createElement('div');
  progressBar.id = 'pageTransitionProgressBar';
  progressBar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 3px; background: var(--primary, #6366f1);
    z-index: 99999; width: 0%; transition: width 0.4s ease-in-out;
  `;
  document.body.appendChild(progressBar);

  setTimeout(() => {
    progressBar.style.width = '70%';
  }, 50);

  setTimeout(() => {
    progressBar.style.width = '100%';
    setTimeout(() => {
      window.location.href = targetUrl;
    }, 200);
  }, 350);
}
