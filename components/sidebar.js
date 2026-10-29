export function renderSidebar() {
  return `
    <!-- Overlay Mobile -->
    <div class="sidebar-overlay" id="sidebarOverlay"></div>

    <!-- Sidebar Principal -->
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-header">
        <a href="#" class="brand">
          <img src="assets/logo.png" alt="FocoPrime Logo" class="brand-logo" onerror="this.src='https://placehold.co/120x36/6366f1/ffffff?text=FocoPrime'">
        </a>
        <button class="close-sidebar-btn" id="closeSidebarBtn">
          <i class="fi fi-rr-cross-small"></i>
        </button>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section">
          <span class="nav-label">Geral</span>
          <a href="#" class="nav-item active">
            <i class="fi fi-rr-apps"></i>
            <span>Dashboard</span>
          </a>
          <a href="#" class="nav-item">
            <i class="fi fi-rr-brain"></i>
            <span>Minhas IAs</span>
          </a>
          <a href="#" class="nav-item">
            <i class="fi fi-rr-layout"></i>
            <span>Criador de Sites</span>
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
