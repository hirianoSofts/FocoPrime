document.addEventListener('DOMContentLoaded', () => {
  // Elementos DOM
  const profileBtn = document.getElementById('profileBtn');
  const profilePopover = document.getElementById('profilePopover');
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const closeSidebarBtn = document.getElementById('closeSidebarBtn');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const balanceToggleBtn = document.getElementById('balanceToggleBtn');
  const eyeIcon = document.getElementById('eyeIcon');
  const statValues = document.querySelectorAll('.stat-value');

  let isBalanceHidden = false;

  // 1. Toggle Popover do Perfil
  if (profileBtn && profilePopover) {
    profileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      profilePopover.classList.toggle('active');
    });

    // Fechar ao clicar fora
    document.addEventListener('click', (e) => {
      if (!profilePopover.contains(e.target) && !profileBtn.contains(e.target)) {
        profilePopover.classList.remove('active');
      }
    });
  }

  // 2. Controlar Sidebar Mobile
  const openSidebar = () => {
    sidebar.classList.add('active');
    sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeSidebar = () => {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (menuToggleBtn) menuToggleBtn.addEventListener('click', openSidebar);
  if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', closeSidebar);
  if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

  // 3. Ocultar/Exibir Valores em Pontos (Regra do projeto)
  if (balanceToggleBtn) {
    balanceToggleBtn.addEventListener('click', () => {
      isBalanceHidden = !isBalanceHidden;

      statValues.forEach((el) => {
        if (isBalanceHidden) {
          el.textContent = '••••••••';
        } else {
          el.textContent = el.getAttribute('data-value');
        }
      });

      // Alternar ícone do olho
      if (isBalanceHidden) {
        eyeIcon.classList.remove('fi-rr-eye');
        eyeIcon.classList.add('fi-rr-eye-crossed');
      } else {
        eyeIcon.classList.remove('fi-rr-eye-crossed');
        eyeIcon.classList.add('fi-rr-eye');
      }
    });
  }
});

  // Fechar barra promocional
  const promoCloseBtn = document.getElementById('promoCloseBtn');
  const promoBar = document.getElementById('promoBar');
  if (promoCloseBtn && promoBar) {
    promoCloseBtn.addEventListener('click', () => {
      promoBar.style.display = 'none';
    });
  }
