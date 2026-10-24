document.addEventListener('DOMContentLoaded', () => {

      // 1. Header Scroll Shadow
      const siteHeader = document.getElementById('siteHeader');
      window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
          siteHeader.classList.add('scrolled');
        } else {
          siteHeader.classList.remove('scrolled');
        }
      });

      // 2. Theme Toggle (Dark vs Light Theme)
      const themeToggleBtn = document.getElementById('themeToggleBtn');
      const rootHtml = document.documentElement;

      if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
          const currentTheme = rootHtml.getAttribute('data-theme');
          const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
          rootHtml.setAttribute('data-theme', nextTheme);
          localStorage.setItem('tt_theme_pref', nextTheme);
        });
      }

      const savedTheme = localStorage.getItem('tt_theme_pref');
      if (savedTheme) {
        rootHtml.setAttribute('data-theme', savedTheme);
      }

      // 3. Circular RTL Reading Direction Switcher (Fully Connected & Persisted)
      const rtlToggleBtn = document.getElementById('rtlToggleBtn');
      
      const applyDirection = (dir) => {
        rootHtml.setAttribute('dir', dir);
        if (rtlToggleBtn) {
          rtlToggleBtn.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
        }
      };

      if (rtlToggleBtn) {
        rtlToggleBtn.addEventListener('click', () => {
          const currentDir = rootHtml.getAttribute('dir') || 'ltr';
          const nextDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
          applyDirection(nextDir);
          localStorage.setItem('tt_dir_pref', nextDir);
        });
      }

      const savedDir = localStorage.getItem('tt_dir_pref');
      if (savedDir) {
        applyDirection(savedDir);
      }

      // 4. Mobile Menu Navigation
      const hamburgerBtn = document.getElementById('hamburgerBtn');
      const navMenu = document.getElementById('navMenu');

      if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
          navMenu.classList.toggle('open');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
          link.addEventListener('click', () => {
            navMenu.classList.remove('open');
          });
        });
      }

      // 5. Cart Drawer Logic & Totals
      const openCartBtn = document.getElementById('openCartBtn');
      const closeCartBtn = document.getElementById('closeCartBtn');
      const cartDrawerOverlay = document.getElementById('cartDrawerOverlay');
      const cartItemsContainer = document.getElementById('cartDrawerItems');
      const cartCountBadge = document.getElementById('cartCountBadge');
      const cartTotalVal = document.getElementById('cartTotalVal');

      const updateCartTotals = () => {
        if (!cartItemsContainer) return;
        const rows = cartItemsContainer.querySelectorAll('.cart-item-row');
        if (cartCountBadge) cartCountBadge.textContent = rows.length;
        let sum = 0;
        rows.forEach(r => {
          const priceText = r.querySelector('.cart-item-price').textContent;
          const num = parseInt(priceText.replace(/[^0-9]/g, ''), 10);
          if (!isNaN(num)) sum += num;
        });
        if (cartTotalVal) cartTotalVal.textContent = '₹ ' + sum.toLocaleString('en-IN');
      };

      if (openCartBtn && cartDrawerOverlay) {
        openCartBtn.addEventListener('click', () => cartDrawerOverlay.classList.add('active'));
      }

      if (closeCartBtn && cartDrawerOverlay) {
        closeCartBtn.addEventListener('click', () => cartDrawerOverlay.classList.remove('active'));
      }

      if (cartDrawerOverlay) {
        cartDrawerOverlay.addEventListener('click', (e) => {
          if (e.target === cartDrawerOverlay) cartDrawerOverlay.classList.remove('active');
        });
      }

      if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (e) => {
          const removeBtn = e.target.closest('.remove-cart-item-btn');
          if (removeBtn) {
            const row = removeBtn.closest('.cart-item-row');
            if (row) {
              row.remove();
              updateCartTotals();
            }
          }
        });
      }

      // 6. VIP Booking Modal Engine
      const openBookModalBtn = document.getElementById('openBookModalBtn');
      const closeBookModalBtn = document.getElementById('closeBookModalBtn');
      const bookModalOverlay = document.getElementById('bookModalOverlay');
      const bookItemSelect = document.getElementById('bookItemSelect');
      const bookingForm = document.getElementById('bookingForm');

      window.triggerBookingModal = function(consultationTopic) {
        if (consultationTopic && bookItemSelect) {
          bookItemSelect.value = consultationTopic;
        }
        if (bookModalOverlay) {
          bookModalOverlay.classList.add('active');
        }
      };

      if (openBookModalBtn && bookModalOverlay) {
        openBookModalBtn.addEventListener('click', () => triggerBookingModal('Bespoke Horological & Solitaire Viewing'));
      }

      if (closeBookModalBtn && bookModalOverlay) {
        closeBookModalBtn.addEventListener('click', () => bookModalOverlay.classList.remove('active'));
      }

      if (bookModalOverlay) {
        bookModalOverlay.addEventListener('click', (e) => {
          if (e.target === bookModalOverlay) bookModalOverlay.classList.remove('active');
        });
      }

      if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const guest = document.getElementById('bookGuestName').value;
          const salon = document.getElementById('bookSalon').value;
          const focus = bookItemSelect.value;
          alert(`Private appointment confirmed for ${guest}.\n\nFocus: ${focus}\nLocation: ${salon}\n\nOur Senior Horological Concierge will contact you within 2 business hours.`);
          bookModalOverlay.classList.remove('active');
          bookingForm.reset();
        });
      }

      updateCartTotals();
    });