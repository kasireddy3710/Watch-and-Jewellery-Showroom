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

      // 3. Circular RTL Reading Direction Switcher
      const rtlToggleBtn = document.getElementById('rtlToggleBtn');
      if (rtlToggleBtn) {
        rtlToggleBtn.addEventListener('click', () => {
          const currentDir = rootHtml.getAttribute('dir');
          const nextDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
          rootHtml.setAttribute('dir', nextDir);
          rtlToggleBtn.textContent = nextDir === 'rtl' ? 'LTR' : 'RTL';
        });
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

      // 5. Gifting Category Filter Engine for 15 Creations
      const filterBtns = document.querySelectorAll('.gifting-filter-btn');
      const productCards = document.querySelectorAll('.product-card');

      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          filterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const filterValue = btn.getAttribute('data-filter');

          productCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            if (filterValue === 'all' || cardCategory === filterValue) {
              card.style.display = 'flex';
            } else {
              card.style.display = 'none';
            }
          });
        });
      });

      // 6. Wishlist Heart Toggle
      document.querySelectorAll('.wishlist-heart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          btn.classList.toggle('active');
          const icon = btn.querySelector('i');
          if (btn.classList.contains('active')) {
            icon.classList.remove('fa-regular');
            icon.classList.add('fa-solid');
          } else {
            icon.classList.remove('fa-solid');
            icon.classList.add('fa-regular');
          }
        });
      });

      // 7. Cart Drawer Logic & Live Price Calculation
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

      // Add to Bag Event Binding
      document.querySelectorAll('.add-to-bag-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          const title = btn.getAttribute('data-title');
          const price = parseInt(btn.getAttribute('data-price'), 10);
          const img = btn.getAttribute('data-img');

          if (!cartItemsContainer) return;

          const newRow = document.createElement('div');
          newRow.className = 'cart-item-row';
          newRow.setAttribute('data-id', id);
          newRow.innerHTML = `
            <div class="cart-item-img">
              <img src="${img}" alt="${title}" />
            </div>
            <div class="cart-item-info">
              <h6>${title}</h6>
              <div class="cart-item-price">₹ ${price.toLocaleString('en-IN')}</div>
            </div>
            <button class="remove-cart-item-btn" style="color: var(--text-muted);"><i class="fa-solid fa-trash-can"></i></button>
          `;

          cartItemsContainer.appendChild(newRow);
          updateCartTotals();
          if (cartDrawerOverlay) cartDrawerOverlay.classList.add('active');
        });
      });

      // Remove from Cart
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

      // 8. VIP Booking Modal Engine
      const openBookModalBtn = document.getElementById('openBookModalBtn');
      const closeBookModalBtn = document.getElementById('closeBookModalBtn');
      const bookModalOverlay = document.getElementById('bookModalOverlay');
      const bookItemSelect = document.getElementById('bookItemSelect');
      const bookingForm = document.getElementById('bookingForm');

      function triggerBookingModal(itemTitle) {
        if (itemTitle && bookItemSelect) {
          bookItemSelect.value = itemTitle;
        }
        if (bookModalOverlay) {
          bookModalOverlay.classList.add('active');
        }
      }

      if (openBookModalBtn) {
        openBookModalBtn.addEventListener('click', () => triggerBookingModal('Bespoke Anniversary Gifting Consultation'));
      }

      document.querySelectorAll('.quick-book-trigger').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const itemName = btn.getAttribute('data-item') || 'Selected Anniversary Creation';
          triggerBookingModal(itemName);
        });
      });

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
          const piece = bookItemSelect.value;
          const salon = document.getElementById('bookSalon').value;
          alert(`Private appointment confirmed for ${guest}.\n\nMasterpiece: ${piece}\nShowroom: ${salon}\n\nOur Head Gifting Concierge will contact you within 2 business hours.`);
          bookModalOverlay.classList.remove('active');
          bookingForm.reset();
        });
      }

      // Initialize totals
      updateCartTotals();
    });