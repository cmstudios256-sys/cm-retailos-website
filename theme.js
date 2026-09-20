/**
 * CM RetailOS Theme Switcher (Dark / Light Mode)
 * Zero dependencies, persists to localStorage, respects OS preferences
 */
(function () {
  // Anti-flash execution
  try {
    const saved = localStorage.getItem('cm_retailos_theme');
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    if (saved === 'light' || (!saved && prefersLight)) {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  } catch (e) {}
})();

function initThemeToggle() {
  const themeToggles = document.querySelectorAll('.theme-toggle');
  if (!themeToggles.length) return;

  function updateAria(theme) {
    const isLight = theme === 'light';
    themeToggles.forEach(btn => {
      btn.setAttribute('title', isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode');
      btn.setAttribute('aria-label', isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode');
    });
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('cm_retailos_theme', theme);
    } catch (e) {}
    updateAria(theme);
  }

  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  updateAria(currentTheme);

  themeToggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      setTheme(next);
    });
  });
}

/* =========================================================
   DEDICATED WHATSAPP CONTACT MODAL
   Prompts visitor for Name & Service, then launches WhatsApp
   ========================================================= */
function initWhatsAppModal() {
  const waLinks = document.querySelectorAll('a[href*="wa.me/256759604799"], a[aria-label="WhatsApp"]');
  if (!waLinks.length) return;

  function ensureModal() {
    let backdrop = document.getElementById('waModalBackdrop');
    if (backdrop) return backdrop;

    backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop wa-modal-backdrop';
    backdrop.id = 'waModalBackdrop';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');
    backdrop.setAttribute('aria-labelledby', 'waModalTitle');

    backdrop.innerHTML = `
      <div class="modal-card wa-modal-card">
        <div class="modal-header">
          <div class="wa-header-info">
            <div class="wa-badge">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
              Direct WhatsApp Support
            </div>
            <h3 id="waModalTitle">Chat with CM RetailOS</h3>
            <p>Tell us your name and what you need assistance with, and we'll open WhatsApp directly with your message ready.</p>
          </div>
          <button type="button" class="modal-close" id="waModalClose" aria-label="Close dialog">&times;</button>
        </div>
        <form id="waForm" class="wa-form">
          <div class="wa-form-group">
            <label for="waVisitorName">Your Name</label>
            <input type="text" id="waVisitorName" class="wa-input" placeholder="e.g., Sarah Davis" autocomplete="name" />
          </div>
          <div class="wa-form-group">
            <label for="waServiceSelect">Service / Inquiry</label>
            <select id="waServiceSelect" class="wa-select">
              <option value="retail POS services and store setup" selected>General POS Inquiry &amp; Setup</option>
              <option value="hardware bundling (Touch POS, Scanner, Thermal Printer)">Hardware Bundle (Touch POS, Scanner, Thermal Printer)</option>
              <option value="multi-store inventory &amp; warehouse sync">Multi-Store Inventory &amp; Warehouse Sync</option>
              <option value="offline LAN mode &amp; local server setup">Offline LAN Mode &amp; Local Server Setup</option>
              <option value="a tailored software demo and pricing">Request Live Demo &amp; Pricing</option>
              <option value="technical support &amp; custom integration">Technical Support &amp; Integration</option>
            </select>
          </div>
          <div class="wa-preview-wrap">
            <span class="wa-preview-label">Live Message Preview:</span>
            <div class="wa-preview-box" id="waPreviewBox">
              Hello CM RetailOS, my name is <span class="wa-highlight" id="waPreviewName">[Your Name]</span>. I would like to inquire about your <span class="wa-highlight" id="waPreviewService">retail POS services and store setup</span>.
            </div>
          </div>
          <div class="wa-actions">
            <button type="button" class="btn btn-outline wa-cancel-btn" id="waCancelBtn">Cancel</button>
            <button type="submit" class="btn btn-primary wa-submit-btn" id="waSubmitBtn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
              Open WhatsApp
            </button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(backdrop);

    const nameInput = backdrop.querySelector('#waVisitorName');
    const serviceSelect = backdrop.querySelector('#waServiceSelect');
    const previewBox = backdrop.querySelector('#waPreviewBox');
    const form = backdrop.querySelector('#waForm');
    const closeBtn = backdrop.querySelector('#waModalClose');
    const cancelBtn = backdrop.querySelector('#waCancelBtn');

    function updatePreview() {
      const name = nameInput.value.trim();
      const service = serviceSelect.value;
      if (name) {
        previewBox.innerHTML = `Hello CM RetailOS, my name is <span class="wa-highlight">${escapeHtml(name)}</span>. I would like to inquire about your <span class="wa-highlight">${escapeHtml(service)}</span>.`;
      } else {
        previewBox.innerHTML = `Hello CM RetailOS, my name is <span class="wa-highlight">[Your Name]</span>. I would like to inquire about your <span class="wa-highlight">${escapeHtml(service)}</span>.`;
      }
    }

    function escapeHtml(str) {
      return str.replace(/[&<>"']/g, m => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      }[m]));
    }

    nameInput.addEventListener('input', updatePreview);
    serviceSelect.addEventListener('change', updatePreview);

    function closeModal() {
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && backdrop.classList.contains('active')) {
        closeModal();
      }
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = nameInput.value.trim();
      const service = serviceSelect.value;
      const phone = '256759604799';

      let message = '';
      if (name) {
        message = `Hello CM RetailOS, my name is ${name}. I would like to inquire about your ${service}.`;
      } else {
        message = `Hello CM RetailOS, I would like to inquire about your ${service}.`;
      }

      const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      closeModal();
    });

    return backdrop;
  }

  function openModal() {
    const backdrop = ensureModal();
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    const nameInput = backdrop.querySelector('#waVisitorName');
    if (nameInput) {
      setTimeout(() => nameInput.focus(), 80);
    }
  }

  waLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });
}

/* =========================================================
   YOUTUBE EMBED FULL QUALITY ENFORCEMENT
   Requests 1080p Full HD stream on player initialization and play
   ========================================================= */
function initYouTubeHD() {
  const iframes = document.querySelectorAll('iframe[src*="youtube.com/embed/g7xSnU4vMXM"], iframe[src*="youtube-nocookie.com/embed/g7xSnU4vMXM"]');
  if (!iframes.length) return;

  function attachPlayerListeners() {
    if (!window.YT || !window.YT.Player) return;
    iframes.forEach((iframe, idx) => {
      if (!iframe.id) iframe.id = 'yt_hd_player_' + idx;
      try {
        new window.YT.Player(iframe.id, {
          events: {
            onReady: function (e) {
              try {
                if (typeof e.target.setPlaybackQuality === 'function') {
                  e.target.setPlaybackQuality('hd1080');
                }
              } catch (err) {}
            },
            onStateChange: function (e) {
              try {
                // When player starts playing (1) or buffering (3), request 1080p
                if (e.data === 1 || e.data === 3) {
                  if (typeof e.target.setPlaybackQuality === 'function') {
                    e.target.setPlaybackQuality('hd1080');
                  }
                }
              } catch (err) {}
            }
          }
        });
      } catch (err) {}
    });
  }

  if (window.YT && window.YT.Player) {
    attachPlayerListeners();
  } else {
    const prevCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = function () {
      if (typeof prevCallback === 'function') prevCallback();
      attachPlayerListeners();
    };

    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      tag.async = true;
      document.head.appendChild(tag);
    }
  }
}

function initAll() {
  initThemeToggle();
  initWhatsAppModal();
  initYouTubeHD();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}




