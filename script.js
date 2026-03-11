/**
 * FERO RESTAURANT — script.js
 * All interactive functionality for the Fero restaurant website.
 * Sections: Navbar, Scroll Reveal, Menu Tabs, Lightbox,
 *           Reservation System, Testimonials Slider, Footer Year,
 *           Newsletter, Mobile Nav Overlay
 */

'use strict';

/* ================================================================
   1. NAVBAR — scroll behaviour + mobile toggle
================================================================ */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const toggle    = document.getElementById('navToggle');
  const menu      = document.getElementById('navMenu');
  const navLinks  = menu ? menu.querySelectorAll('a') : [];
  let   menuOpen  = false;

  /* Scroll: add .scrolled class once past 60px */
  function onScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* Mobile toggle */
  function openMenu() {
    menuOpen = true;
    menu.classList.add('open');
    toggle.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menuOpen = false;
    menu.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', function () {
    menuOpen ? closeMenu() : openMenu();
  });

  /* Close when a nav link is clicked */
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (menuOpen) closeMenu();
    });
  });

  /* Close on outside click */
  document.addEventListener('click', function (e) {
    if (menuOpen && !menu.contains(e.target) && !toggle.contains(e.target)) {
      closeMenu();
    }
  });

  /* Active link highlight based on scroll position */
  const sections = document.querySelectorAll('section[id]');

  function updateActiveLink() {
    let current = '';
    sections.forEach(function (sec) {
      if (window.scrollY >= sec.offsetTop - 120) {
        current = sec.getAttribute('id');
      }
    });
    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
})();


/* ================================================================
   2. SCROLL REVEAL — Intersection Observer for fade-in animations
================================================================ */
(function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.reveal-section, .reveal-fade, .reveal-up, .intro-strip'
  );

  if (!('IntersectionObserver' in window)) {
    // Fallback: show all immediately
    targets.forEach(function (el) { el.classList.add('visible'); });
    return;
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate once only
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach(function (el) { observer.observe(el); });
})();


/* ================================================================
   3. MENU TABS — switch between menu categories
================================================================ */
(function initMenuTabs() {
  const tabs   = document.querySelectorAll('.menu-tab');
  const panels = document.querySelectorAll('.menu-panel');

  if (!tabs.length) return;

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      const target = tab.getAttribute('data-tab');

      // Update tabs
      tabs.forEach(function (t) {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Update panels
      panels.forEach(function (panel) {
        if (panel.id === 'tab-' + target) {
          panel.classList.add('active');
          panel.removeAttribute('hidden');

          // Re-trigger scroll reveal for newly visible items
          const items = panel.querySelectorAll('.reveal-section');
          items.forEach(function (item) {
            item.classList.add('visible');
          });
        } else {
          panel.classList.remove('active');
          panel.setAttribute('hidden', '');
        }
      });
    });
  });
})();


/* ================================================================
   4. GALLERY LIGHTBOX
================================================================ */
(function initLightbox() {
  const items       = document.querySelectorAll('.gallery-item');
  const lightbox    = document.getElementById('lightbox');
  const closeBtn    = document.getElementById('lightboxClose');
  const prevBtn     = document.getElementById('lightboxPrev');
  const nextBtn     = document.getElementById('lightboxNext');
  const imgEl       = document.getElementById('lightboxImg');
  const captionEl   = document.getElementById('lightboxCaption');

  if (!lightbox || !items.length) return;

  let currentIndex = 0;

  const galleryData = Array.from(items).map(function (item) {
    return {
      src:     item.getAttribute('data-src'),
      caption: item.getAttribute('data-caption') || '',
      alt:     item.querySelector('img') ? item.querySelector('img').getAttribute('alt') : ''
    };
  });

  function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    lightbox.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.setAttribute('hidden', '');
    document.body.style.overflow = '';
    items[currentIndex].focus();
  }

  function updateLightbox() {
    const data = galleryData[currentIndex];
    imgEl.src         = data.src;
    imgEl.alt         = data.alt;
    captionEl.textContent = data.caption;
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
    updateLightbox();
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % galleryData.length;
    updateLightbox();
  }

  items.forEach(function (item, index) {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');

    item.addEventListener('click', function () { openLightbox(index); });

    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(index);
      }
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', showPrev);
  nextBtn.addEventListener('click', showNext);

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (lightbox.hasAttribute('hidden')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   showPrev();
    if (e.key === 'ArrowRight')  showNext();
  });
})();


/* ================================================================
   5. RESERVATION SYSTEM
   - Time slots: some pre-booked, user can add bookings
   - Simulates front-end booking state
================================================================ */
(function initReservation() {
  const form        = document.getElementById('reservationForm');
  const timeslotsEl = document.getElementById('timeslots');
  const successEl   = document.getElementById('reservationSuccess');
  const summaryEl   = document.getElementById('reservationSummary');

  if (!form || !timeslotsEl) return;

  /* -- Time slot configuration --
     true  = available
     false = pre-booked / fully booked
  -------------------------------- */
  const ALL_SLOTS = [
    { time: '18:00', available: true  },
    { time: '18:30', available: true  },
    { time: '19:00', available: false }, // pre-booked
    { time: '19:30', available: true  },
    { time: '20:00', available: false }, // pre-booked
    { time: '20:30', available: true  },
    { time: '21:00', available: true  },
    { time: '21:30', available: false }, // pre-booked
    { time: '22:00', available: true  },
  ];

  /* Track bookings made during this session */
  const sessionBookings = new Set();

  let selectedSlot = null;

  /* Build time slot buttons */
  function buildSlots() {
    timeslotsEl.innerHTML = '';
    ALL_SLOTS.forEach(function (slot) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'slot-btn';
      btn.textContent = slot.time;
      btn.setAttribute('data-time', slot.time);
      btn.setAttribute('aria-label', slot.time);

      const isBooked = !slot.available || sessionBookings.has(slot.time);

      if (isBooked) {
        btn.classList.add('booked');
        btn.disabled = true;
        btn.setAttribute('aria-disabled', 'true');
      } else {
        btn.addEventListener('click', function () {
          selectSlot(slot.time);
        });
      }

      timeslotsEl.appendChild(btn);
    });
  }

  function selectSlot(time) {
    selectedSlot = time;

    /* Update button visual states */
    timeslotsEl.querySelectorAll('.slot-btn').forEach(function (btn) {
      btn.classList.remove('selected');
      if (btn.getAttribute('data-time') === time) {
        btn.classList.add('selected');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.setAttribute('aria-pressed', 'false');
      }
    });
  }

  /* Initialise slots on load */
  buildSlots();

  /* -- Form submission -- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const date     = form.querySelector('#resDate').value;
    const guests   = form.querySelector('#resGuests').value;
    const name     = form.querySelector('#resName').value.trim();
    const email    = form.querySelector('#resEmail').value.trim();

    /* Basic validation */
    if (!date) {
      alert('Please select a date.');
      return;
    }
    if (!guests) {
      alert('Please select the number of guests.');
      return;
    }
    if (!selectedSlot) {
      alert('Please select a time slot.');
      return;
    }
    if (!name) {
      alert('Please enter your full name.');
      form.querySelector('#resName').focus();
      return;
    }
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address.');
      form.querySelector('#resEmail').focus();
      return;
    }

    /* Mark slot as booked in this session */
    sessionBookings.add(selectedSlot);

    /* Display success */
    const formatted = new Date(date).toLocaleDateString('en-GB', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });

    summaryEl.textContent =
      'Dear ' + name + ', your table for ' + guests +
      ' guest' + (parseInt(guests, 10) > 1 ? 's' : '') +
      ' on ' + formatted + ' at ' + selectedSlot +
      ' has been reserved. A confirmation will be sent to ' + email + '.';

    form.style.display = 'none';
    successEl.removeAttribute('hidden');
    successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

    /* Reset internal state */
    selectedSlot = null;

    /* Rebuild slots to reflect new booking */
    buildSlots();
  });

  /* Prefill today's date as minimum */
  const dateInput = document.getElementById('resDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
    dateInput.value = today;
  }
})();


/* ================================================================
   6. TESTIMONIALS SLIDER — manual + auto-advance
================================================================ */
(function initTestimonials() {
  const track    = document.getElementById('testimonialsTrack');
  const prevBtn  = document.getElementById('testiBtnPrev');
  const nextBtn  = document.getElementById('testiBtnNext');
  const dotsWrap = document.getElementById('testiDots');

  if (!track) return;

  const slides     = track.querySelectorAll('.testimonial');
  const total      = slides.length;
  let   current    = 0;
  let   autoTimer  = null;

  /* Build dots */
  slides.forEach(function (_, i) {
    const dot = document.createElement('button');
    dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', 'Testimonial ' + (i + 1));
    dot.addEventListener('click', function () { goTo(i); });
    dotsWrap.appendChild(dot);
  });

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';

    /* Update dots */
    dotsWrap.querySelectorAll('.testi-dot').forEach(function (dot, i) {
      dot.classList.toggle('active', i === current);
    });
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  nextBtn.addEventListener('click', function () { next(); resetAuto(); });
  prevBtn.addEventListener('click', function () { prev(); resetAuto(); });

  /* Auto-advance every 6 seconds */
  function startAuto() {
    autoTimer = setInterval(next, 6000);
  }

  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  startAuto();

  /* Pause on hover */
  const slider = track.closest('.testimonials-slider');
  if (slider) {
    slider.addEventListener('mouseenter', function () { clearInterval(autoTimer); });
    slider.addEventListener('mouseleave', startAuto);
  }

  /* Touch swipe support */
  let touchStartX = 0;

  track.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', function (e) {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? next() : prev();
      resetAuto();
    }
  }, { passive: true });
})();


/* ================================================================
   7. NEWSLETTER FORM
================================================================ */
(function initNewsletter() {
  const form    = document.getElementById('newsletterForm');
  const success = document.getElementById('newsletterSuccess');

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    if (!input || !input.value.includes('@')) return;

    success.removeAttribute('hidden');
    input.value = '';
    form.querySelector('button').disabled = true;
  });
})();


/* ================================================================
   8. FOOTER YEAR — auto-update copyright year
================================================================ */
(function initFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
})();


/* ================================================================
   9. SMOOTH SCROLL for anchor links (additional safety layer)
================================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const offset = 70; // navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });
})();
