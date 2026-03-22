// ============================================
// Wait for HTML parts to load, then initialize
// ============================================

const STEAM_COLORS = ['#4CD964', '#9B6BFF', '#FF9F43', '#FFD93D', '#4F9DFF'];

function createFloatingBlocks() {
  const container = document.querySelector('.bg-blocks');
  if (!container) return;

  for (let i = 0; i < 18; i++) {
    const block = document.createElement('div');
    block.className = 'bg-block';

    const size = 20 + Math.random() * 50;
    block.style.width = size + 'px';
    block.style.height = size + 'px';
    block.style.left = Math.random() * 100 + '%';
    block.style.background = STEAM_COLORS[Math.floor(Math.random() * STEAM_COLORS.length)];
    block.style.animationDuration = (15 + Math.random() * 25) + 's';
    block.style.animationDelay = (Math.random() * -30) + 's';
    block.style.borderRadius = (4 + Math.random() * 6) + 'px';

    container.appendChild(block);
  }
}

function initTabs() {
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.panel');

  // No tabs on this page (e.g., project pages)
  if (!tabs.length) return;

  function setActiveTab(tab) {
    tabs.forEach((t) => {
      t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
    });

    panels.forEach((panel) => {
      const isCurrent = panel.id === tab.dataset.panel;
      panel.classList.toggle('active', isCurrent);
      panel.hidden = !isCurrent;
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => setActiveTab(tab));
    tab.addEventListener('keydown', (e) => {
      const index = [...tabs].indexOf(tab);
      if (e.key === 'ArrowRight') {
        tabs[(index + 1) % tabs.length].focus();
      } else if (e.key === 'ArrowLeft') {
        tabs[(index - 1 + tabs.length) % tabs.length].focus();
      }
    });
  });

  // Hash-based tab navigation (e.g., index.html#technology)
  function activateTabFromHash() {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const match = [...tabs].find((t) => t.dataset.panel === hash);
      if (match) { setActiveTab(match); return; }
    }
    setActiveTab(tabs[0]);
  }

  activateTabFromHash();
  window.addEventListener('hashchange', activateTabFromHash);

  // Make header STEAM block letters clickable to switch tabs
  document.querySelectorAll('.block-letter[data-tab]').forEach((letter) => {
    letter.addEventListener('click', (e) => {
      e.preventDefault();
      const match = [...tabs].find((t) => t.dataset.panel === letter.dataset.tab);
      if (match) {
        setActiveTab(match);
        document.querySelector('.tab-panels').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });
}

// ============================================
// Initialize after parts are loaded
// ============================================

document.addEventListener('partsLoaded', () => {
  createFloatingBlocks();
  initTabs();
});

// Fallback: if parts loader isn't present (shouldn't happen, but safe)
if (!document.querySelector('[data-part]')) {
  createFloatingBlocks();
  initTabs();
}
