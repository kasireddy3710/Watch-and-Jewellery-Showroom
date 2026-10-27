 document.addEventListener('DOMContentLoaded', () => {
// Logo Assets Config (Change these URLs to your specific dark/light variant source paths)
     const LOGO_CONFIG = {
       dark: "/348ff6b1-04ec-484f-9048-3adbe8c20263.jpg",     // Dark Mode Logo Source
       light: "/fdbb74cb-907d-422c-88f9-e7a5595067a9.jpg"    // Light Mode Logo Source
     };

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

        document.querySelectorAll('.nav-link:not(#homeDropdownBtn)').forEach(link => {
          link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
            link.classList.add('active');
          });
        });
      }

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

      // 5. Cart Drawer Logic & Live Price Calculation
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

      // 6. VIP Booking Modal Engine
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
        openBookModalBtn.addEventListener('click', () => triggerBookingModal('Bespoke Horology & Haute Jewellery Allocation'));
      }

      document.querySelectorAll('.quick-book-trigger').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const itemName = btn.getAttribute('data-item') || 'Selected High Horology / Solitaire Piece';
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
          alert(`Private appointment confirmed for ${guest}.\n\nMasterpiece: ${piece}\nShowroom: ${salon}\n\nOur Head Concierge will contact you within 2 business hours.`);
          bookModalOverlay.classList.remove('active');
          bookingForm.reset();
        });
      }

      // 7. Connoisseur Quiz Logic
      let quizState = { aesthetic: null, complication: null };
      const quizResultBox = document.getElementById('quizResultBox');
      const quizMatchTitle = document.getElementById('quizMatchTitle');

      function evaluateQuiz() {
        if (quizState.aesthetic && quizState.complication) {
          let match = "Aethelgard Monopusher Tourbillon Chrono";
          if (quizState.aesthetic === 'skeleton' && quizState.complication === 'tourbillon') {
            match = "Aethelgard Monopusher Skeleton Tourbillon (Piece Unique)";
          } else if (quizState.aesthetic === 'classic') {
            match = "Grand Feu Enamel Perpetual Calendar 18K Gold";
          } else if (quizState.aesthetic === 'sport') {
            match = "Titanium COSC Certified Chronograph";
          }
          if (quizMatchTitle) quizMatchTitle.textContent = match;
          if (quizResultBox) {
            quizResultBox.style.display = 'flex';
            const reqBtn = quizResultBox.querySelector('.quick-book-trigger');
            if (reqBtn) reqBtn.setAttribute('data-item', match);
          }
        }
      }

      document.querySelectorAll('#q1Options .quiz-option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('#q1Options .quiz-option-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          quizState.aesthetic = btn.getAttribute('data-val');
          evaluateQuiz();
        });
      });

      document.querySelectorAll('#q2Options .quiz-option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('#q2Options .quiz-option-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          quizState.complication = btn.getAttribute('data-val');
          evaluateQuiz();
        });
      });

      // 8. Flagship Salon Location Tabs
      const salonData = {
        mumbai: {
          badge: '<i class="fa-solid fa-gem"></i> Flagship Maison & VIP Vault',
          title: "Mumbai — High Street Phoenix",
          img: "https://i.pinimg.com/736x/3b/df/e9/3bdfe91a444e5c84a088a1335231ab48.jpg",
          address: "Level 2, Palladium Mall, Senapati Bapat Marg, Lower Parel, Mumbai, Maharashtra 400013",
          hours: "Monday – Sunday: 11:00 AM – 9:30 PM (Concierge on call 24/7)",
          phone: "+91 (022) 2490 0012 / +91 98200 44101",
          amenities: "Dedicated Luxury Valet, Private Champagne Lounge, Ultrasonic Watch Spa",
          map: "https://maps.google.com/?q=Palladium+Mall+Lower+Parel+Mumbai",
          reserveItem: "Mumbai Palladium VIP Salon Consultation"
        },
        delhi: {
          badge: '<i class="fa-solid fa-crown"></i> Haute Joaillerie & Master Atelier',
          title: "Delhi NCR — DLF Emporio",
          img: "https://tse2.mm.bing.net/th/id/OIP.U7KR1SIocnuMi8RFBm1zqAAAAA?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
          address: "Ground Floor, Luxury Pavilion, 4 Nelson Mandela Marg, Vasant Kunj II, New Delhi 110070",
          hours: "Monday – Sunday: 11:00 AM – 9:00 PM",
          phone: "+91 (011) 4500 0023 / +91 98110 55202",
          amenities: "GIA Certified Gemmologist On-Site, Private Security Escort, Gate 3 Chauffeur Drop",
          map: "https://maps.google.com/?q=DLF+Emporio+Vasant+Kunj+New+Delhi",
          reserveItem: "Delhi DLF Emporio Private Salon Consultation"
        },
        bengaluru: {
          badge: '<i class="fa-solid fa-clock"></i> Grand Complications Lab',
          title: "Bengaluru — UB City Mall",
          img: "https://ouyedisplay.com/wp-content/uploads/2022/09/interior-design-jewelry-store-1024x681.jpg",
          address: "The Collection, 24 Vittal Mallya Road, Ashok Nagar, Bengaluru, Karnataka 560001",
          hours: "Monday – Sunday: 10:30 AM – 8:30 PM",
          phone: "+91 (080) 2200 0034 / +91 99000 77303",
          amenities: "Pressure Testing to 100 Bar, Helipad Transfer Support, VIP Piazza Balcony",
          map: "https://maps.google.com/?q=UB+City+Mall+Bengaluru",
          reserveItem: "Bengaluru UB City VIP Atelier Consultation"
        },
        hyderabad: {
          badge: '<i class="fa-solid fa-ring"></i> Heritage Villa & Royal Vault',
          title: "Hyderabad — Jubilee Hills",
          img: "https://i.pinimg.com/originals/62/f1/ee/62f1ee0138c8db2658aa6dfdd15af43e.png",
          address: "Road No. 36, Near Checkpost, Jubilee Hills Luxury Circle, Hyderabad, Telangana 500033",
          hours: "Monday – Sunday: 11:00 AM – 9:00 PM",
          phone: "+91 (040) 2300 0045 / +91 97000 88404",
          amenities: "Private Gated Courtyard, Bridal Polki & Solitaire Safe, Geneva-Accredited Watchmaker",
          map: "https://maps.google.com/?q=Jubilee+Hills+Road+36+Hyderabad",
          reserveItem: "Hyderabad Jubilee Hills Royal Pavilion Viewing"
        }
      };

      const salonTabBtns = document.querySelectorAll('.salon-tab-btn');
      const salonBadge = document.getElementById('salonBadge');
      const salonTitle = document.getElementById('salonTitle');
      const salonImage = document.getElementById('salonImage');
      const salonAddress = document.getElementById('salonAddress');
      const salonHours = document.getElementById('salonHours');
      const salonPhone = document.getElementById('salonPhone');
      const salonAmenities = document.getElementById('salonAmenities');
      const salonMapLink = document.getElementById('salonMapLink');
      const salonReserveBtn = document.getElementById('salonReserveBtn');

      salonTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          salonTabBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const city = btn.getAttribute('data-city');
          const data = salonData[city];
          if (!data) return;

          if (salonImage) {
            salonImage.style.opacity = '0.3';
            setTimeout(() => {
              salonImage.src = data.img;
              salonImage.style.opacity = '1';
            }, 200);
          }

          if (salonBadge) salonBadge.innerHTML = data.badge;
          if (salonTitle) salonTitle.textContent = data.title;
          if (salonAddress) salonAddress.textContent = data.address;
          if (salonHours) salonHours.textContent = data.hours;
          if (salonPhone) salonPhone.textContent = data.phone;
          if (salonAmenities) salonAmenities.textContent = data.amenities;
          if (salonMapLink) salonMapLink.href = data.map;
          if (salonReserveBtn) salonReserveBtn.setAttribute('data-item', data.reserveItem);
        });
      });

      // 9. Interactive Specular Border Mouse-Tracking Engine
      const specularCards = document.querySelectorAll('.specular-card, .border-glow-wrapper, .concierge-card');
      specularCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          card.style.setProperty('--mouse-x', `${x}px`);
          card.style.setProperty('--mouse-y', `${y}px`);
        });
      });

      // 10. Hero 3D Card Interactive Parallax on Mouse Movement
      const heroCard = document.getElementById('heroInteractiveCard');
      const heroSection = document.getElementById('heroZenith');

      if (heroCard && heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
          const rect = heroSection.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          heroCard.style.transform = `perspective(1000px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-8px)`;
        });

        heroSection.addEventListener('mouseleave', () => {
          heroCard.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0px)';
        });
      }

      // Initialize initial bag values
      updateCartTotals();
    });