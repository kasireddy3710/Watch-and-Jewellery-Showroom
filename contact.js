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

      // 5. Cart Drawer Engine
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

      // 6. "Book Item" VIP Reservation Modal Engine
      const openBookModalBtn = document.getElementById('openBookModalBtn');
      const closeBookModalBtn = document.getElementById('closeBookModalBtn');
      const bookModalOverlay = document.getElementById('bookModalOverlay');
      const bookItemSelect = document.getElementById('bookItemSelect');
      const bookingModalForm = document.getElementById('bookingModalForm');

      window.triggerBookingModal = function(itemTitle) {
        if (itemTitle && bookItemSelect) {
          bookItemSelect.value = itemTitle;
        }
        if (bookModalOverlay) {
          bookModalOverlay.classList.add('active');
        }
      };

      if (openBookModalBtn) {
        openBookModalBtn.addEventListener('click', () => triggerBookingModal('Private Client Concierge Consultation'));
      }

      document.querySelectorAll('.quick-book-trigger').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const itemName = btn.getAttribute('data-item') || 'Boutique Salon Consultation';
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

      if (bookingModalForm) {
        bookingModalForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const guest = document.getElementById('bookGuestName').value;
          const piece = bookItemSelect.value;
          const salon = document.getElementById('bookSalon').value;
          alert(`Private appointment confirmed for ${guest}.\n\nReference: ${piece}\nShowroom: ${salon}\n\nOur Senior Concierge will contact you within 2 business hours.`);
          bookModalOverlay.classList.remove('active');
          bookingModalForm.reset();
        });
      }

      // 7. Interactive Flagship Salon Tab Switcher
      const salonData = {
        mumbai: {
          badge: '<i class="fa-solid fa-gem"></i> Flagship Maison & VIP Vault',
          title: "Mumbai — High Street Phoenix",
          img: "https://images.prestigeonline.com/wp-content/uploads/sites/4/2020/09/16111334/Feminine-Area-resize-1024x519.jpg",
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
          img: "https://www.swisswatchexpo.com/images/showroom-carousel-1.jpg",
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
          img: "https://i.pinimg.com/originals/19/ff/36/19ff363dd093f96ebc4ae0564e703d9e.jpg",
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
          img: "https://www.dutyfreehunter.com/blog/wp-content/uploads/2024/04/FRA-AIRPORt.T1B.03.24.022.jpg",
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

      // 8. FAQ Accordion Toggle
      const faqItems = document.querySelectorAll('.faq-item');
      faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        trigger.addEventListener('click', () => {
          const isActive = item.classList.contains('active');
          faqItems.forEach(i => i.classList.remove('active'));
          if (!isActive) item.classList.add('active');
        });
      });

      // 9. Main Concierge Form Submission
      const contactConciergeForm = document.getElementById('contactConciergeForm');
      if (contactConciergeForm) {
        contactConciergeForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const name = document.getElementById('conciergeName').value;
          const service = document.getElementById('conciergeService').value;
          const salon = document.getElementById('conciergeSalon').value;
          const date = document.getElementById('conciergeDate').value;
          
          alert(`Thank you, ${name}.\n\nYour confidential appointment request for "${service}" at our ${salon} on ${date} has been dispatched.\n\nOur Chief Concierge Officer will review your requirements and reach out via encrypted communication within two hours.`);
          contactConciergeForm.reset();
        });
      }

      updateCartTotals();
    });