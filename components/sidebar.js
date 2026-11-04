export function renderSidebar(basePath = '') {
  // Verifica em qual página o usuário está com base na URL
  const path = window.location.pathname;
  const isCreatePage = path.includes('criar');
  const isDashboardPage = path.endsWith('index.html') || path.endsWith('/') || path === '';

  return `
    <!-- Overlay Mobile -->
    <div class="sidebar-overlay" id="sidebarOverlay"></div>

    <!-- Sidebar Principal -->
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-header">
        <a href="${basePath}index.html" class="brand">
          <img src="${basePath}assets/logo.png" alt="FocoPrime Logo" class="brand-logo" onerror="this.src='https://placehold.co/120x36/6366f1/ffffff?text=FocoPrime'">
        </a>
        <button class="close-sidebar-btn" id="closeSidebarBtn">
          <i class="fi fi-rr-cross-small"></i>
        </button>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section">
          <span class="nav-label">Geral</span>
          <!-- Dashboard ativo condicionalmente -->
          <a href="${basePath}index.html" class="nav-item ${isDashboardPage && !isCreatePage ? 'active' : ''}">
            <i class="fi fi-rr-apps"></i>
            <span>Dashboard</span>
          </a>

          <!-- Menu Desdobrável: Minhas IAs -->
          <div class="nav-dropdown ${isCreatePage ? 'open' : ''}" id="navDropdownAi">
            <button class="nav-item nav-dropdown-toggle ${isCreatePage ? 'active-parent' : ''}" id="aiDropdownToggle">
              <div class="nav-item-left">
                <i class="fi fi-rr-brain"></i>
                <span>Minhas IAs</span>
              </div>
              <i class="fi fi-rr-angle-small-down dropdown-arrow"></i>
            </button>
            <div class="dropdown-menu" id="aiDropdownMenu">
              <a href="${basePath}criar/index.html" class="dropdown-sub-item ${isCreatePage ? 'active' : ''}">Criar nova</a>
              <a href="${basePath}ai/index.html" class="dropdown-sub-item">Minhas IAs</a>
              <a href="${basePath}personalize/index.html" class="dropdown-sub-item">Personalizar</a>
            </div>
          </div>

          <a href="#" class="nav-item">
            <i class="fi fi-rr-boxes"></i>
            <span>Modelos</span>
          </a>
          <a href="#" class="nav-item">
            <i class="fi fi-rr-chart-histogram"></i>
            <span>Métricas & Uso</span>
          </a>
        </div>

        <div class="nav-section">
          <span class="nav-label">Gerenciamento</span>
          <a href="#" class="nav-item">
            <i class="fi fi-rr-credit-card"></i>
            <span>Plano e Assinatura</span>
          </a>
          <a href="#" class="nav-item">
            <i class="fi fi-rr-settings"></i>
            <span>Configurações</span>
          </a>
        </div>
      </nav>

      <div class="sidebar-footer">
        <div class="ia-status-card">
          <div class="status-header">
            <i class="fi fi-sr-bolt"></i>
            <span>Limite de Tokens</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: 68%;"></div>
          </div>
          <span class="status-text">68.400 / 100.000 tokens usados</span>
        </div>
      </div>
    </aside>
  `;
}

export function initSidebarListeners() {
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const closeSidebarBtn = document.getElementById('closeSidebarBtn');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  
  // Lógica do Submenu Minhas IAs com animação
  const aiDropdownToggle = document.getElementById('aiDropdownToggle');
  const navDropdownAi = document.getElementById('navDropdownAi');

  if (aiDropdownToggle && navDropdownAi) {
    aiDropdownToggle.addEventListener('click', (e) => {
      e.preventDefault();
      navDropdownAi.classList.toggle('open');
    });
  }

  const openSidebar = () => {
    if (sidebar) sidebar.classList.add('active');
    if (sidebarOverlay) sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeSidebar = () => {
    if (sidebar) sidebar.classList.remove('active');
    if (sidebarOverlay) sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (menuToggleBtn) menuToggleBtn.addEventListener('click', openSidebar);
  if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', closeSidebar);
  if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);
}
