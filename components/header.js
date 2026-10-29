export function renderHeader() {
  return `
      <!-- Barra Promocional -->
      <div class="promo-bar" id="promoBar">
        <div class="promo-content">
          <p>Conheça os novos recursos de IA e automações avançadas no <strong>FocoPrime</strong>.</p>
          <a href="#" class="promo-link">Ver novidades <i class="fi fi-rr-arrow-right"></i></a>
        </div>
        <button class="promo-close" id="promoCloseBtn" title="Fechar">
          <i class="fi fi-rr-cross-small"></i>
        </button>
      </div>
      
      <!-- Navbar Superior -->
      <header class="top-navbar">
        <div class="navbar-left">
          <button class="menu-toggle-btn" id="menuToggleBtn">
            <i class="fi fi-rr-sidebar"></i>
          </button>
          <div class="search-box">
            <i class="fi fi-rr-search"></i>
            <input type="text" placeholder="Buscar agentes de IA, sites, configurações...">
          </div>
        </div>

        <div class="navbar-right">
          <!-- Botão Pontos / Créditos -->
          <button class="btn-pontos">
            <span id="creditsBadge">250</span>
          </button>
          
          <div class="notifications-wrapper">
            <button class="nav-icon-btn notif-btn" id="notifBtn">
              <i class="fi fi-rr-bell"></i>
              <span class="badge">2</span>
            </button>
          </div>

          <!-- Componente de Perfil Dinâmico -->
          <div class="profile-dropdown-wrapper">
            <button class="profile-avatar-btn" id="profileBtn">
              <span id="profileInitial">H</span>
            </button>

            <!-- Popover / Menu suspenso -->
            <div class="profile-popover" id="profilePopover">
              <div class="popover-header">
                <strong id="popoverName">Carregando...</strong>
                <span class="user-email" id="popoverEmail">...</span>
              </div>
              <div class="popover-menu">
                <a href="#" class="popover-item active">
                  <i class="fi fi-rr-dashboard"></i>
                  <span>Dashboard</span>
                </a>
                <a href="#" class="popover-item">
                  <i class="fi fi-rr-user"></i>
                  <span>Perfil</span>
                </a>
                <a href="#" class="popover-item">
                  <i class="fi fi-rr-box"></i>
                  <span>Plano e assinatura</span>
                </a>
                <a href="#" class="popover-item">
                  <i class="fi fi-rr-settings"></i>
                  <span>Configurações</span>
                </a>
                <div class="popover-divider"></div>
                <button type="button" class="popover-item text-danger" onclick="handleLogout()" style="width: 100%; border: none; background: none; cursor: pointer;">
                  <i class="fi fi-rr-sign-out-alt"></i>
                  <span>Sair</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
  `;
}

export function initHeaderListeners() {
  const profileBtn = document.getElementById('profileBtn');
  const profilePopover = document.getElementById('profilePopover');
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const closeSidebarBtn = document.getElementById('closeSidebarBtn');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const promoCloseBtn = document.getElementById('promoCloseBtn');
  const promoBar = document.getElementById('promoBar');

  // 1. Toggle Popover do Perfil
  if (profileBtn && profilePopover) {
    profileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      profilePopover.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!profilePopover.contains(e.target) && !profileBtn.contains(e.target)) {
        profilePopover.classList.remove('active');
      }
    });
  }

  // 2. Controlar Sidebar Mobile (Menu Hamburguer)
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

  // 3. Fechar Barra Promocional
  if (promoCloseBtn && promoBar) {
    promoCloseBtn.addEventListener('click', () => {
      promoBar.style.display = 'none';
    });
  }
}
