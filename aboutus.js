 document.addEventListener('DOMContentLoaded', () => {
  
  // Logo Assets Config (Change these URLs to your specific dark/light variant source paths)
     const LOGO_CONFIG = {
       dark: "/348ff6b1-04ec-484f-9048-3adbe8c20263.jpg",     // Dark Mode Logo Source
       light: "/fdbb74cb-907d-422c-88f9-e7a5595067a9.jpg"    // Light Mode Logo Source
     };
  
  // Header Scroll Shadow
      const siteHeader = document.getElementById('siteHeader');
      window.addEventListener('scroll', () => {
        if (window.scrollY > 40) siteHeader.classList.add('scrolled');
        else siteHeader.classList.remove('scrolled');
      });

      // Theme Toggle
      const themeToggleBtn = document.getElementById('themeToggleBtn');
     const rootHtml = document.documentElement;
     const logoImages = document.querySelectorAll('.brand-logo-img:not(svg)');

     const updateLogosForTheme = (theme) => {
       const targetSrc = LOGO_CONFIG[theme] || LOGO_CONFIG.dark;
       logoImages.forEach(img => {
         img.src = targetSrc;
       });
     };

     const applyTheme = (theme) => {
       rootHtml.setAttribute('data-theme', theme);
       localStorage.setItem('tt_theme_pref', theme);
       updateLogosForTheme(theme);
     };

     if (themeToggleBtn) {
       themeToggleBtn.addEventListener('click', () => {
         const currentTheme = rootHtml.getAttribute('data-theme');
         const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
         applyTheme(nextTheme);
       });
     }

     const savedTheme = localStorage.getItem('tt_theme_pref') || 'dark';
     applyTheme(savedTheme);

      // RTL Direction Switcher
      const rtlToggleBtn = document.getElementById('rtlToggleBtn');
      if (rtlToggleBtn) {
        rtlToggleBtn.addEventListener('click', () => {
          const currentDir = rootHtml.getAttribute('dir');
          const nextDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
          rootHtml.setAttribute('dir', nextDir);
          rtlToggleBtn.textContent = nextDir === 'rtl' ? 'LTR' : 'RTL';
        });
      }

      // Mobile Menu Toggle
      const hamburgerBtn = document.getElementById('hamburgerBtn');
      const navMenu = document.getElementById('navMenu');
      if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => navMenu.classList.toggle('open'));
      }

      // Cart Drawer Logic
      const openCartBtn = document.getElementById('openCartBtn');
      const closeCartBtn = document.getElementById('closeCartBtn');
      const cartDrawerOverlay = document.getElementById('cartDrawerOverlay');
      if (openCartBtn && cartDrawerOverlay) openCartBtn.addEventListener('click', () => cartDrawerOverlay.classList.add('active'));
      if (closeCartBtn && cartDrawerOverlay) closeCartBtn.addEventListener('click', () => cartDrawerOverlay.classList.remove('active'));

      // Cart Item Deletion & Total Update Logic
      function updateCartTotals() {
        const items = document.querySelectorAll('.cart-item-row');
        const cartCountBadge = document.getElementById('cartCountBadge');
        const cartTotalVal = document.getElementById('cartTotalVal');
        const cartDrawerItems = document.getElementById('cartDrawerItems');

        let total = 0;
        items.forEach(item => {
          const price = parseFloat(item.getAttribute('data-price') || 0);
          total += price;
        });

        if (cartCountBadge) cartCountBadge.textContent = items.length;
        if (cartTotalVal) cartTotalVal.textContent = '₹ ' + total.toLocaleString('en-IN');

        if (items.length === 0 && cartDrawerItems) {
          cartDrawerItems.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 40px 0; font-weight: 600;">Your luxury bag is currently empty.</div>';
        }
      }

      document.querySelectorAll('.remove-cart-item-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const row = e.target.closest('.cart-item-row');
          if (row) {
            row.remove();
            updateCartTotals();
          }
        });
      });

      // VIP Booking Modal
      const openBookModalBtn = document.getElementById('openBookModalBtn');
      const closeBookModalBtn = document.getElementById('closeBookModalBtn');
      const bookModalOverlay = document.getElementById('bookModalOverlay');
      const bookItemSelect = document.getElementById('bookItemSelect');
      const bookingForm = document.getElementById('bookingForm');

      function triggerBookingModal(itemTitle) {
        if (itemTitle && bookItemSelect) bookItemSelect.value = itemTitle;
        if (bookModalOverlay) bookModalOverlay.classList.add('active');
      }

      if (openBookModalBtn) openBookModalBtn.addEventListener('click', () => triggerBookingModal('VIP Private Salon Suite Consultation'));
      document.querySelectorAll('.quick-book-trigger').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          triggerBookingModal(btn.getAttribute('data-item') || 'VIP Consultation');
        });
      });
      if (closeBookModalBtn && bookModalOverlay) closeBookModalBtn.addEventListener('click', () => bookModalOverlay.classList.remove('active'));

      if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
          e.preventDefault();
          alert('Private appointment confirmed. Our Head Concierge will contact you within 2 business hours.');
          bookModalOverlay.classList.remove('active');
          bookingForm.reset();
        });
      }

      // Specular & Mouse Tracking Effects
      document.querySelectorAll('.specular-card, .border-glow-wrapper, .network-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
          card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        });
      });
    });