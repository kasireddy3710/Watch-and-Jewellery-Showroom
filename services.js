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

      // RTL Toggle
      const rtlToggleBtn = document.getElementById('rtlToggleBtn');
      rtlToggleBtn.addEventListener('click', () => {
        const nextDir = rootHtml.getAttribute('dir') === 'ltr' ? 'rtl' : 'ltr';
        rootHtml.setAttribute('dir', nextDir);
        rtlToggleBtn.textContent = nextDir === 'rtl' ? 'LTR' : 'RTL';
      });

      // Mobile Menu
      const hamburgerBtn = document.getElementById('hamburgerBtn');
      const navMenu = document.getElementById('navMenu');
      hamburgerBtn.addEventListener('click', () => {
        navMenu.classList.toggle('open');
      });

      // Cart Badge Counter Engine
      let cartCount = 0;
      const cartBadgeCount = document.getElementById('cartBadgeCount');
      const cartBtn = document.getElementById('cartBtn');

      cartBtn.addEventListener('click', () => {
        alert(`Your cart currently contains ${cartCount} selected service item(s).`);
      });

      // Booking Modal Engine
      const closeBookModalBtn = document.getElementById('closeBookModalBtn');
      const bookModalOverlay = document.getElementById('bookModalOverlay');
      const bookItemSelect = document.getElementById('bookItemSelect');
      const bookingForm = document.getElementById('bookingForm');

      function triggerBookingModal(itemTitle) {
        if (itemTitle && bookItemSelect) bookItemSelect.value = itemTitle;
        bookModalOverlay.classList.add('active');
        
        // Increment cart count dynamically when booking an item
        cartCount++;
        if (cartBadgeCount) cartBadgeCount.textContent = cartCount;
      }

      document.querySelectorAll('.quick-book-trigger').forEach(btn => {
        btn.addEventListener('click', () => triggerBookingModal(btn.getAttribute('data-item')));
      });

      if (closeBookModalBtn) closeBookModalBtn.addEventListener('click', () => bookModalOverlay.classList.remove('active'));
      if (bookModalOverlay) {
        bookModalOverlay.addEventListener('click', (e) => {
          if (e.target === bookModalOverlay) bookModalOverlay.classList.remove('active');
        });
      }

      if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
          e.preventDefault();
          alert('Your service appointment has been successfully scheduled with our master horologist.');
          bookModalOverlay.classList.remove('active');
          bookingForm.reset();
        });
      }
    });