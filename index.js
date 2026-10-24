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

      // 4. Mobile Menu Navigation & Active Link Highlighting
      const hamburgerBtn = document.getElementById('hamburgerBtn');
      const navMenu = document.getElementById('navMenu');
      const homeNavItem = document.getElementById('homeNavItem');
      const homeDropdownBtn = document.getElementById('homeDropdownBtn');

      if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
          navMenu.classList.toggle('open');
        });

        // Close on normal link clicks
        document.querySelectorAll('.nav-link:not(#homeDropdownBtn)').forEach(link => {
          link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
            link.classList.add('active');
          });
        });
      }

      // Home Dropdown Mobile Click Toggle
      if (homeDropdownBtn && homeNavItem) {
        homeDropdownBtn.addEventListener('click', (e) => {
          if (window.innerWidth <= 868) {
            e.preventDefault();
            homeNavItem.classList.toggle('active-open');
            const isExpanded = homeNavItem.classList.contains('active-open');
            homeDropdownBtn.setAttribute('aria-expanded', isExpanded);
          }
        });
      }

      // Close dropdown & mobile menu when a dropdown sub-link is clicked
      document.querySelectorAll('.dropdown-vault-link').forEach(subLink => {
        subLink.addEventListener('click', () => {
          if (navMenu) navMenu.classList.remove('open');
          if (homeNavItem) homeNavItem.classList.remove('active-open');
          if (homeDropdownBtn) homeDropdownBtn.setAttribute('aria-expanded', 'false');
          document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
          if (homeDropdownBtn) homeDropdownBtn.classList.add('active');
        });
      });

      // Close dropdown if clicked outside on touch screens
      document.addEventListener('click', (e) => {
        if (homeNavItem && !homeNavItem.contains(e.target)) {
          homeNavItem.classList.remove('active-open');
          if (homeDropdownBtn) homeDropdownBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // 5. Product Category Filtering
      const filterBtns = document.querySelectorAll('.filter-btn');
      const productCards = document.querySelectorAll('.product-card');

      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          filterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const category = btn.getAttribute('data-filter');
          productCards.forEach(card => {
            const cardCat = card.getAttribute('data-category');
            if (category === 'all' || cardCat === category) {
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

      // 7. Cart Drawer Logic & Real-time Total Calculation
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
        openCartBtn.addEventListener('click', () => {
          cartDrawerOverlay.classList.add('active');
        });
      }

      if (closeCartBtn && cartDrawerOverlay) {
        closeCartBtn.addEventListener('click', () => {
          cartDrawerOverlay.classList.remove('active');
        });
      }

      if (cartDrawerOverlay) {
        cartDrawerOverlay.addEventListener('click', (e) => {
          if (e.target === cartDrawerOverlay) {
            cartDrawerOverlay.classList.remove('active');
          }
        });
      }

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

      // 8. "Book Item" VIP Reservation Modal Engine
      const openBookModalBtn = document.getElementById('openBookModalBtn');
      const closeBookModalBtn = document.getElementById('closeBookModalBtn');
      const bookModalOverlay = document.getElementById('bookModalOverlay');
      const bookItemSelect = document.getElementById('bookItemSelect');
      const bookingForm = document.getElementById('bookingForm');
      const bookMovementConsultBtn = document.getElementById('bookMovementConsultBtn');

      function triggerBookingModal(itemTitle) {
        if (itemTitle && bookItemSelect) {
          bookItemSelect.value = itemTitle;
        }
        if (bookModalOverlay) {
          bookModalOverlay.classList.add('active');
        }
      }

      if (openBookModalBtn) {
        openBookModalBtn.addEventListener('click', () => triggerBookingModal('Bespoke VIP Appointment'));
      }

      if (bookMovementConsultBtn) {
        bookMovementConsultBtn.addEventListener('click', () => triggerBookingModal('Geneva Calibre Chronomètre Technical Inspection'));
      }

      document.querySelectorAll('.quick-book-trigger').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const itemName = btn.getAttribute('data-item') || 'High Watch / Diamond Masterpiece';
          triggerBookingModal(itemName);
        });
      });

      if (closeBookModalBtn && bookModalOverlay) {
        closeBookModalBtn.addEventListener('click', () => {
          bookModalOverlay.classList.remove('active');
        });
      }

      if (bookModalOverlay) {
        bookModalOverlay.addEventListener('click', (e) => {
          if (e.target === bookModalOverlay) {
            bookModalOverlay.classList.remove('active');
          }
        });
      }

      if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const guest = document.getElementById('bookGuestName').value;
          const piece = bookItemSelect.value;
          const salon = document.getElementById('bookSalon').value;
          alert(`Private appointment confirmed for ${guest}.\n\nMasterpiece: ${piece}\nShowroom: ${salon}\n\nOur Head Concierge will contact you within 2 business hours.`);
          bookModalOverlay.classList.remove('active');
          bookingForm.reset();
        });
      }

      // 9. Video Showcase Controls
      const featureCinemaVideo = document.getElementById('featureCinemaVideo');
      const cinemaHeroPlayBtn = document.getElementById('cinemaHeroPlayBtn');
      const cinemaHeroIcon = document.getElementById('cinemaHeroIcon');
      const cinemaBackdrop = document.getElementById('cinemaBackdrop');
      const cinemaMuteBtn = document.getElementById('cinemaMuteBtn');
      const muteIcon = document.getElementById('muteIcon');
      const cinemaFullscreenBtn = document.getElementById('cinemaFullscreenBtn');

      let isCinemaPlaying = false;

      function toggleCinemaPlayback() {
        if (!featureCinemaVideo) return;
        if (featureCinemaVideo.paused) {
          featureCinemaVideo.play().then(() => {
            isCinemaPlaying = true;
            if (cinemaHeroIcon) {
              cinemaHeroIcon.classList.remove('fa-play');
              cinemaHeroIcon.classList.add('fa-pause');
            }
            if (cinemaHeroPlayBtn) cinemaHeroPlayBtn.style.opacity = '0.4';
            if (cinemaBackdrop) cinemaBackdrop.style.opacity = '0.2';
          }).catch(err => console.log('Playback error:', err));
        } else {
          featureCinemaVideo.pause();
          isCinemaPlaying = false;
          if (cinemaHeroIcon) {
            cinemaHeroIcon.classList.remove('fa-pause');
            cinemaHeroIcon.classList.add('fa-play');
          }
          if (cinemaHeroPlayBtn) cinemaHeroPlayBtn.style.opacity = '1';
          if (cinemaBackdrop) cinemaBackdrop.style.opacity = '1';
        }
      }

      if (cinemaHeroPlayBtn) cinemaHeroPlayBtn.addEventListener('click', toggleCinemaPlayback);
      if (featureCinemaVideo) featureCinemaVideo.addEventListener('click', toggleCinemaPlayback);

      if (cinemaHeroPlayBtn) {
        cinemaHeroPlayBtn.addEventListener('mouseenter', () => {
          if (isCinemaPlaying) cinemaHeroPlayBtn.style.opacity = '1';
        });
        cinemaHeroPlayBtn.addEventListener('mouseleave', () => {
          if (isCinemaPlaying) cinemaHeroPlayBtn.style.opacity = '0.4';
        });
      }

      if (cinemaMuteBtn && featureCinemaVideo && muteIcon) {
        cinemaMuteBtn.addEventListener('click', () => {
          featureCinemaVideo.muted = !featureCinemaVideo.muted;
          if (featureCinemaVideo.muted) {
            muteIcon.classList.remove('fa-volume-high');
            muteIcon.classList.add('fa-volume-xmark');
          } else {
            muteIcon.classList.remove('fa-volume-xmark');
            muteIcon.classList.add('fa-volume-high');
          }
        });
      }

      if (cinemaFullscreenBtn && featureCinemaVideo) {
        cinemaFullscreenBtn.addEventListener('click', () => {
          if (!document.fullscreenElement) {
            featureCinemaVideo.requestFullscreen().catch(err => console.log(err));
          } else {
            document.exitFullscreen();
          }
        });
      }

      // 10. Calibre Movement Architecture Switcher
      const calibreData = {
        tourbillon: {
          badge: "Geneva Precision Manufacture",
          ref: "Manufacture Reference: TT-901",
          title: "Geneva Calibre Chronomètre",
          desc: "Every movement undergoes five-position temperature testing across 360 hours. Fitted with a flying tourbillon cage and a silicon hairspring invulnerable to magnetic fields up to 15,000 Gauss.",
          img: "https://www.highendwatchteam.com/wp-content/uploads/2026/01/20260116_52117.webp",
          inspect: "Macro 10x Caseback View",
          beat: "28,800 VPH (4Hz)",
          jewels: "42 Synthetic Rubies",
          reserve: "72 Hours Reserve",
          cert: "COSC & Geneva Seal",
          pins: [
            { top: "36%", left: "48%", label: "Flying Tourbillon Escapement Cage" },
            { top: "68%", left: "34%", label: "Twin Glucydur Mainspring Barrels" },
            { top: "25%", left: "72%", label: "Hand-Chamfered Bridges (Anglage)" }
          ]
        },
        skeleton: {
          badge: "Atelier Haute Horlogerie",
          ref: "Manufacture Reference: TT-902",
          title: "Aero-Skeleton Automatic Calibre",
          desc: "Pared down to its structural architecture through 80 hours of five-axis micro-milling. Features a 22K solid gold openworked rotor with low-friction ceramic ball bearings.",
          img: "https://sothebys-md.brightspotcdn.com/dims4/default/2cb4d3c/2147483647/strip/true/crop/1000x1000+0+0/resize/800x800!/quality/90/?url=http:%2F%2Fsothebys-brightspot.s3.amazonaws.com%2Fmedia-desk%2Fbc%2F43%2F142928794706ac8eb82ab3856cc6%2F3.jpg",
          inspect: "Skeleton Openwork Cutaway",
          beat: "28,800 VPH (4Hz)",
          jewels: "38 Synthetic Rubies",
          reserve: "65 Hours Reserve",
          cert: "METAS Master Chronometer",
          pins: [
            { top: "42%", left: "50%", label: "Openworked Balance Wheel" },
            { top: "22%", left: "38%", label: "22K Solid Gold Micro-Rotor" },
            { top: "62%", left: "64%", label: "Black-Polished Steel Pinions" }
          ]
        },
        chronograph: {
          badge: "Grand Complication Atelier",
          ref: "Manufacture Reference: TT-903",
          title: "Column-Wheel Monopusher Chrono",
          desc: "An integrated lateral-clutch column-wheel chronograph with instantaneous 30-minute register. Calibrated with heat-blued screws and a Breguet overcoil hairspring.",
          img: "https://assets.catawiki.nl/assets/2022/12/23/f/4/8/f4856ad3-8d57-4344-843a-a4facc0218c8.jpg",
          inspect: "Precision Chrono Assembly",
          beat: "36,000 VPH (5Hz)",
          jewels: "48 Synthetic Rubies",
          reserve: "50 Hours Reserve",
          cert: "Chronofiable® High-Beat",
          pins: [
            { top: "32%", left: "46%", label: "Thermal-Blued Column Wheel" },
            { top: "58%", left: "32%", label: "Lateral Friction Clutch Mechanism" },
            { top: "45%", left: "70%", label: "Breguet Terminal Curve Spring" }
          ]
        }
      };

      const calibreMainImage = document.getElementById('calibreMainImage');
      const calibreSyncBadge = document.querySelector('#calibreSyncBadge span');
      const calibreRefText = document.getElementById('calibreRefText');
      const calibreTitleText = document.getElementById('calibreTitleText');
      const calibreDescText = document.getElementById('calibreDescText');
      const inspectModeLabel = document.getElementById('inspectModeLabel');
      const specBeat = document.getElementById('specBeat');
      const specJewels = document.getElementById('specJewels');
      const specReserve = document.getElementById('specReserve');
      const specCert = document.getElementById('specCert');
      const calibrePinsContainer = document.getElementById('calibrePinsContainer');
      const calibreViewBtns = document.querySelectorAll('.calibre-view-btn');

      calibreViewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          calibreViewBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const key = btn.getAttribute('data-calibre');
          const data = calibreData[key];
          if (!data) return;

          if (calibreMainImage) {
            calibreMainImage.style.opacity = '0';
            setTimeout(() => {
              calibreMainImage.src = data.img;
              calibreMainImage.alt = data.title;
              calibreMainImage.style.opacity = '1';
            }, 250);
          }

          if (calibreSyncBadge) calibreSyncBadge.textContent = data.badge;
          if (calibreRefText) calibreRefText.textContent = data.ref;
          if (calibreTitleText) calibreTitleText.textContent = data.title;
          if (calibreDescText) calibreDescText.textContent = data.desc;
          if (inspectModeLabel) inspectModeLabel.textContent = data.inspect;
          if (specBeat) specBeat.textContent = data.beat;
          if (specJewels) specJewels.textContent = data.jewels;
          if (specReserve) specReserve.textContent = data.reserve;
          if (specCert) specCert.textContent = data.cert;

          if (calibrePinsContainer) {
            calibrePinsContainer.innerHTML = '';
            data.pins.forEach(pin => {
              const pinEl = document.createElement('div');
              pinEl.className = 'movement-pin';
              pinEl.style.top = pin.top;
              pinEl.style.left = pin.left;
              pinEl.innerHTML = `<div class="movement-pin-tooltip">${pin.label}</div>`;
              calibrePinsContainer.appendChild(pinEl);
            });
          }
        });
      });

      // 11. 3D Boutique Card Flip Engine
      const boutiqueContainers = document.querySelectorAll('.boutique-card-container');
      boutiqueContainers.forEach(card => {
        card.addEventListener('click', (e) => {
          if (e.target.closest('.no-flip-action') || e.target.closest('a')) return;
          card.classList.toggle('is-flipped');
        });

        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            if (e.target.closest('.no-flip-action') || e.target.closest('a')) return;
            e.preventDefault();
            card.classList.toggle('is-flipped');
          }
        });
      });

      // Initialize totals
      updateCartTotals();
    });