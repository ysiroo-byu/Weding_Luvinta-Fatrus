/* ========================================
   MAIN.JS - Undangan Fatrus & Luvinta
   Halaman Tamu (index.html)
   ======================================== */
(function() {
  'use strict';

  // === KONFIGURASI ===
  const GOOGLE_API_URL = "https://script.google.com/macros/s/AKfycbxHZX63O8l14Ksa91PIGhdkjIMsLoPodVdmV_3C9ZU0WkSEDmhaoV_lCQj4cm6R9d1g/exec";
  const GALLERY_COUNT = 6;
  const FETCH_TIMEOUT = 15000;

  // === STATE ===
  let appData = null;
  let dataSource = 'default';
  let countdownInterval = null;
  let isMusicPlaying = false;
  let currentLightboxIndex = 0;
  let galleryImages = [];
  let rsvpList = [];
  let ticking = false;
  let animationsInitialized = false;
  let currentGalleryCount = 6;
  let deferredPrompt = null;

  // === DEFAULT DATA ===
  const defaultData = {
    priaNick: "Fatrus", wanitaNick: "Luvinta",
    priaFull: "Ahmad Fatrussulukhi", wanitaFull: "Luvinta Citra Fitria",
    priaOrtu: "Bapak Jasro'i (Alm) & Ibu Siti Mutmainah (Cangaan - Genteng - Banyuwangi)",
    wanitaOrtu: "Bapak Majik Ismail & Ibu Nikmatul Sholikah (Yosowinangun - Jajag - Banyuwangi)",
    priaIg: "", wanitaIg: "",
    musicUrl: "https://media.indoinvite.com/2db3bf1e16cd47a08843bb881e39cce7:indoinvite-staging/indoinvite-staging/indoinvite-staging/nikah/theme/music/1659512405.mp3",
    fotoSampul: "https://media.indoinvite.com/2db3bf1e16cd47a08843bb881e39cce7:indoinvite-staging/indoinvite-staging/indoinvite-staging/nikah/upload/sampul_19521762398202.jpeg",
    fotoPria: "https://media.indoinvite.com/2db3bf1e16cd47a08843bb881e39cce7:indoinvite-staging/indoinvite-staging/indoinvite-staging/nikah/upload/1952/1679297306foto_pria.jpeg",
    fotoWanita: "https://media.indoinvite.com/2db3bf1e16cd47a08843bb881e39cce7:indoinvite-staging/indoinvite-staging/indoinvite-staging/nikah/upload/1952/1679297306foto_wanita.jpeg",
    story1Title: "Pertemuan Di Kereta Api", story1Desc: "Pertemuan tak terduga di sebuah kereta api...", story1Img: "",
    story2Title: "Lanjut Ke Pelaminan", story2Desc: "Setelah itu, Ryan dan Aria terus berhubungan...", story2Img: "",
    akadDate: "20 Juli 2026", akadTime: "09:00 WIB - Selesai", akadLokasi: "Rumah Bapak Majik di Jajag", akadMapUrl: "https://maps.app.goo.gl/TeRdppG4vnbVYjZR7",
    resepsiDate: "20 Juli 2026", resepsiTime: "11:00 WIB - Selesai", resepsiLokasi: "Rumah Bapak Majik di Jajag", resepsiMapUrl: "https://maps.app.goo.gl/TeRdppG4vnbVYjZR7",
    dinnerDate: "20 Juli 2026", dinnerTime: "18:00 WIB - Selesai", dinnerLokasi: "Rumah Bapak Majik di Jajag", dinnerMapUrl: "https://maps.app.goo.gl/TeRdppG4vnbVYjZR7",
    mapIframeUrl: "https://maps.google.com/maps?width=600&height=400&hl=en&q=H54V%2BRJF%2C%20Warung%20nikmah%2C%20Jl.%20KH.%20Wahid%20Hasyim%2C%20Talunrejo%2C%20Sembulung%2C%20Kec.%20Cluring%2C%20Kabupaten%20Banyuwangi%2C%20Jawa%20Timur%2068486%2C%20Indonesia&t=&z=14&ie=UTF8&iwloc=B&output=embed",
    banks: [
      { id: 'b1', name: 'BCA', rek: '12345678', an: 'Luvinta', visible: true, logo: '' },
      { id: 'b2', name: 'BNI', rek: '0982309823', an: 'Fatrus', visible: true, logo: '' }
    ],
    videoYoutubeUrl: "https://www.youtube.com/embed/7ztcdznpX9w", showVideo: true,
    galeri1: "", galeri2: "", galeri3: "", galeri4: "", galeri5: "", galeri6: "",
    countdownTarget: "2026-07-20", bukuTamu: [],
    backgroundImg: "https://indoinvite.com/nikah/template/elegan/elegan-gold/EG-BC.jpg",
    borderFrame: "https://indoinvite.com/nikah/template/elegan/elegan-gold/EG-Border.webp",
    ornamentHomeTL: "https://indoinvite.com/nikah/template/elegan/elegan-gold/EG-AKR.webp",
    ornamentHomeTR: "https://indoinvite.com/nikah/template/elegan/elegan-gold/EG-AKN.webp",
    ornamentHomeBL: "https://indoinvite.com/nikah/template/elegan/elegan-gold/EG-BKR2.webp",
    ornamentHomeBR: "https://indoinvite.com/nikah/template/elegan/elegan-gold/EG-BKN2.webp",
    ornamentCoupleTL: "https://indoinvite.com/nikah/template/elegan/elegan-gold/EG-AKR1.webp",
    ornamentCoupleTR: "https://indoinvite.com/nikah/template/elegan/elegan-gold/EG-AKN1.webp",
    ornamentEventTL: "https://indoinvite.com/nikah/template/elegan/elegan-gold/EG-AKR2.webp",
    ornamentEventTR: "https://indoinvite.com/nikah/template/elegan/elegan-gold/EG-AKN2.webp",
    ornamentFooterTL: "https://indoinvite.com/nikah/template/elegan/elegan-gold/EG-AKR2.webp",
    ornamentFooterTR: "https://indoinvite.com/nikah/template/elegan/elegan-gold/EG-AKN2.webp",
    ornamentFooterBL: "https://indoinvite.com/nikah/template/elegan/elegan-gold/EG-BKR.webp",
    ornamentFooterBR: "https://indoinvite.com/nikah/template/elegan/elegan-gold/EG-BKN2.webp",
    chapters: {
      "home": { active: true, label: "Home/Welcome" },
      "chapter01": { active: true, label: "Chapter 01 - Assalamu'alaikum" },
      "chapter02": { active: true, label: "Chapter 02 - Mempelai" },
      "chapter03": { active: true, label: "Chapter 03 - Love Story" },
      "chapter04": { active: true, label: "Chapter 04 - Save The Date" },
      "chapter05": { active: true, label: "Chapter 05 - Wedding Gift" },
      "chapter06": { active: true, label: "Chapter 06 - Buku Tamu" },
      "chapter07": { active: true, label: "Chapter 07 - Gallery" },
      "footer": { active: true, label: "Footer" }
    }
  };

  const decorMapping = {
    'ornamentHomeTL': 'orn-home-tl', 'ornamentHomeTR': 'orn-home-tr',
    'ornamentHomeBL': 'orn-home-bl', 'ornamentHomeBR': 'orn-home-br',
    'ornamentCoupleTL': 'orn-couple-tl', 'ornamentCoupleTR': 'orn-couple-tr',
    'ornamentEventTL': 'orn-event-tl', 'ornamentEventTR': 'orn-event-tr',
    'ornamentFooterTL': 'orn-footer-tl', 'ornamentFooterTR': 'orn-footer-tr',
    'ornamentFooterBL': 'orn-footer-bl', 'ornamentFooterBR': 'orn-footer-br'
  };

  // === UTILITIES ===
  const $ = (id) => document.getElementById(id);
  const $$ = (sel) => document.querySelectorAll(sel);

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function normalizeDateString(d) {
    if (!d) return "";
    if (d.indexOf('T') !== -1) {
      const dt = new Date(d);
      if (!isNaN(dt)) return dt.toISOString().split('T')[0];
    }
    return d;
  }

  // === TOAST ===
  function showToast(msg, type) {
    type = type || 'info';
    const c = $('toast-container');
    if (!c) return;
    const t = document.createElement('div');
    t.className = 'toast-item';
    const icons = {
      success: 'fa-check-circle text-green-500',
      error: 'fa-exclamation-circle text-red-500',
      info: 'fa-info-circle text-blue-500'
    };
    t.innerHTML = '<div class="flex items-center gap-3"><i class="fa-solid ' + (icons[type] || icons.info) + '"></i><span class="text-sm text-gray-700">' + msg + '</span></div>';
    c.appendChild(t);
    requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('show')));
    setTimeout(() => {
      t.classList.remove('show');
      setTimeout(() => t.remove(), 400);
    }, 3000);
  }

  // === LOADER TYPING ===
  function startLoaderTyping() {
    const nameEl = $('loader-name-text');
    if (!nameEl) return;
    const fullName = (defaultData.priaNick || 'Fatrus') + ' & ' + (defaultData.wanitaNick || 'Luvinta');
    let currentIndex = 0;
    function typeChar() {
      if (currentIndex <= fullName.length) {
        nameEl.textContent = fullName.substring(0, currentIndex);
        currentIndex++;
        setTimeout(typeChar, 120);
      } else {
        setTimeout(() => nameEl.classList.add('done'), 500);
      }
    }
    setTimeout(typeChar, 800);
  }

  // === SMOOTH SCROLL ===
  function smoothScrollTo(targetY, duration) {
    duration = duration || 1000;
    const startY = window.pageYOffset;
    const diff = targetY - startY;
    let startTime = null;
    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    function step(currentTime) {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, startY + diff * easeInOutCubic(progress));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // === SCROLL PROGRESS ===
  function updateScrollProgress() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    const bar = $('scroll-progress');
    if (bar) bar.style.width = progress + '%';
  }

  // === PARALLAX ===
  function updateParallax() {
    const layers = document.querySelectorAll('.parallax-layer');
    layers.forEach(layer => {
      const speed = parseFloat(layer.getAttribute('data-parallax-speed')) || 0.1;
      const rect = layer.getBoundingClientRect();
      const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
      layer.style.transform = 'translateY(' + offset + 'px)';
    });
  }

  // === SECTION REVEAL ===
  function initSectionReveal() {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('revealed');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.section-reveal').forEach(el => revealObserver.observe(el));
  }

  // === SPLIT TEXT ===
  function initSplitText() {
    const splitElements = document.querySelectorAll('.split-text');
    splitElements.forEach(el => {
      if (el.dataset.splitDone) return;
      const text = el.textContent.trim();
      const words = text.split(/\s+/);
      el.innerHTML = words.map(word => '<span class="word">' + word + '</span>').join('');
      el.dataset.splitDone = 'true';
    });
    const splitObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.classList.add('animate');
          const words = el.querySelectorAll('.word');
          words.forEach((word, i) => { word.style.transitionDelay = (i * 0.1) + 's'; });
        } else {
          entry.target.classList.remove('animate');
        }
      });
    }, { threshold: 0.3 });
    document.querySelectorAll('.split-text').forEach(el => splitObserver.observe(el));
  }

  // === SCROLL HANDLER ===
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateScrollProgress();
        updateParallax();
        ticking = false;
      });
      ticking = true;
    }
  }

  function initAllAnimations() {
    if (animationsInitialized) return;
    animationsInitialized = true;
    setTimeout(() => {
      initSplitText();
      initSectionReveal();
      AOS.refresh();
    }, 200);
  }

  // === FETCH CLOUD DATA ===
  // ✅ Didefinisikan sebagai window.fetchCloudData agar accessible global
  window.fetchCloudData = async function() {
    const statusEl = $('loader-status');
    if (statusEl) statusEl.innerHTML = 'Merajut kisah bahagia<span class="dot-loader"></span><span class="dot-loader"></span><span class="dot-loader"></span>';
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
      const response = await fetch(GOOGLE_API_URL, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const data = await response.json();
      if (data.status === "error") throw new Error(data.message);
      if (statusEl) statusEl.innerHTML = '✨ Undangan Siap Dibuka';
      return data;
    } catch (err) {
      console.warn('Fetch cloud gagal:', err.message);
      if (statusEl) statusEl.innerHTML = '💝 Mempersiapkan momen terbaik...';
      return null;
    }
  };

  // === APPLY DATA TO HTML ===
  function applyDataToHTML(data) {
    appData = data;

    // Nama panggilan
    $$('.val-pria-nick').forEach(el => el.textContent = data.priaNick);
    $$('.val-wanita-nick').forEach(el => el.textContent = data.wanitaNick);

    // Nama lengkap
    if ($('val-pria-full')) $('val-pria-full').textContent = data.priaFull;
    if ($('val-wanita-full')) $('val-wanita-full').textContent = data.wanitaFull;

    // Orang tua
    if ($('val-pria-ortu')) $('val-pria-ortu').textContent = data.priaOrtu;
    if ($('val-wanita-ortu')) $('val-wanita-ortu').textContent = data.wanitaOrtu;

    // Instagram
    if ($('val-pria-ig')) $('val-pria-ig').textContent = data.priaIg;
    if ($('val-wanita-ig')) $('val-wanita-ig').textContent = data.wanitaIg;
    if ($('val-pria-ig-link')) $('val-pria-ig-link').href = 'https://instagram.com/' + data.priaIg;
    if ($('val-wanita-ig-link')) $('val-wanita-ig-link').href = 'https://instagram.com/' + data.wanitaIg;

    // Foto sampul
    ['val-fotoSampul', 'val-fotoSampul2', 'val-fotoSampul3'].forEach(id => {
      const el = $(id);
      if (el && data.fotoSampul) el.style.backgroundImage = "url('" + data.fotoSampul + "')";
    });

    // Foto mempelai
    if ($('val-fotoPria')) {
      $('val-fotoPria').src = data.fotoPria || '';
      if (data.fotoPria) {
        $('val-fotoPria').style.display = 'block';
        const fb = $('val-fotoPria').nextElementSibling;
        if (fb && fb.classList.contains('img-fallback')) fb.style.display = 'none';
      }
    }
    if ($('val-fotoWanita')) {
      $('val-fotoWanita').src = data.fotoWanita || '';
      if (data.fotoWanita) {
        $('val-fotoWanita').style.display = 'block';
        const fb = $('val-fotoWanita').nextElementSibling;
        if (fb && fb.classList.contains('img-fallback')) fb.style.display = 'none';
      }
    }

    // Musik
    const audio = $('bg-music');
    if (data.musicUrl && audio.src !== data.musicUrl) {
      audio.src = data.musicUrl;
      audio.load();
    }

    // Love story
    if ($('val-story1-title')) $('val-story1-title').textContent = data.story1Title || '';
    if ($('val-story1-desc')) $('val-story1-desc').textContent = data.story1Desc || '';
    if ($('val-story1-img')) {
      $('val-story1-img').src = data.story1Img || '';
      if (data.story1Img) $('val-story1-img').style.display = 'block';
    }
    if ($('val-story2-title')) $('val-story2-title').textContent = data.story2Title || '';
    if ($('val-story2-desc')) $('val-story2-desc').textContent = data.story2Desc || '';
    if ($('val-story2-img')) {
      $('val-story2-img').src = data.story2Img || '';
      if (data.story2Img) $('val-story2-img').style.display = 'block';
    }

    // Acara
    if ($('val-akad-date')) $('val-akad-date').textContent = data.akadDate || '';
    if ($('val-akad-time')) $('val-akad-time').textContent = data.akadTime || '';
    if ($('val-akad-lokasi')) $('val-akad-lokasi').textContent = data.akadLokasi || '';
    if ($('val-akad-map')) $('val-akad-map').href = data.akadMapUrl || '#';
    if ($('val-resepsi-date')) $('val-resepsi-date').textContent = data.resepsiDate || '';
    if ($('val-resepsi-time')) $('val-resepsi-time').textContent = data.resepsiTime || '';
    if ($('val-resepsi-lokasi')) $('val-resepsi-lokasi').textContent = data.resepsiLokasi || '';
    if ($('val-resepsi-map')) $('val-resepsi-map').href = data.resepsiMapUrl || '#';
    if ($('val-dinner-date')) $('val-dinner-date').textContent = data.dinnerDate || '';
    if ($('val-dinner-time')) $('val-dinner-time').textContent = data.dinnerTime || '';
    if ($('val-dinner-lokasi')) $('val-dinner-lokasi').textContent = data.dinnerLokasi || '';
    if ($('val-dinner-map')) $('val-dinner-map').href = data.dinnerMapUrl || '#';
    if ($('val-map-iframe')) $('val-map-iframe').src = data.mapIframeUrl || '';

    // Video
    const showVideo = data.showVideo !== false;
    const videoWrapper = $('video-section-wrapper');
    if (videoWrapper) videoWrapper.style.display = showVideo ? 'block' : 'none';
    if ($('val-videoYoutubeUrl')) $('val-videoYoutubeUrl').src = data.videoYoutubeUrl || '';

    // Background & dekorasi
    if (data.backgroundImg) {
      document.querySelectorAll('.box-container').forEach(el => {
        el.style.backgroundImage = "url('" + data.backgroundImg + "')";
      });
    }
    if (data.borderFrame) {
      ['border-frame-awal', 'border-frame-home', 'border-frame-footer'].forEach(id => {
        const el = $(id);
        if (el) el.src = data.borderFrame;
      });
    }
    Object.keys(decorMapping).forEach(field => {
      if (data[field]) {
        const elId = decorMapping[field];
        const el = $(elId);
        if (el) el.src = data[field];
      }
    });

    // Galeri
    galleryImages = [];
    for (let i = 1; i <= currentGalleryCount; i++) {
      const url = data['galeri' + i] || '';
      if (url) galleryImages.push(url);
    }
    renderGallery();

    // Bank
    renderBankList();

    // RSVP
    rsvpList = data.bukuTamu || [];
    renderRsvpList();

    // Title
    document.title = 'Undangan ' + (data.priaNick || '') + ' & ' + (data.wanitaNick || '');

    // Countdown
    startCountdown(normalizeDateString(data.countdownTarget));

    // Chapter visibility
    if (data.chapters) applyChapterVisibility(data.chapters);
  }

  // === RENDER GALLERY ===
  function renderGallery() {
    const grid = $('gallery-grid');
    if (!grid) return;
    grid.innerHTML = '';
    galleryImages.forEach((src, i) => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = 'Gallery ' + (i + 1);
      img.className = 'gallery-item';
      img.setAttribute('loading', 'lazy');
      img.setAttribute('data-aos', 'reveal-up');
      img.setAttribute('data-aos-delay', String((i % 3) * 120));
      img.onclick = () => openLightbox(i);
      img.onerror = function() { this.style.display = 'none'; };
      grid.appendChild(img);
    });
    if (galleryImages.length > 0) AOS.refresh();
  }

  // === LIGHTBOX ===
  function openLightbox(index) {
    if (!galleryImages.length) return;
    currentLightboxIndex = index;
    updateLightbox();
    $('lightbox').classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    $('lightbox').classList.remove('active');
    document.body.style.overflow = '';
  }
  function navLightbox(dir) {
    currentLightboxIndex = (currentLightboxIndex + dir + galleryImages.length) % galleryImages.length;
    updateLightbox();
  }
  function updateLightbox() {
    $('lightbox-img').src = galleryImages[currentLightboxIndex];
    $('lb-counter').textContent = (currentLightboxIndex + 1) + ' / ' + galleryImages.length;
  }

  window.closeLightbox = closeLightbox;
  window.navLightbox = navLightbox;

  (function() {
    const lb = $('lightbox');
    if (!lb) return;
    lb.addEventListener('click', e => {
      if (e.target.closest('[data-lb-close]')) { closeLightbox(); return; }
      if (e.target.closest('[data-lb-prev]')) { navLightbox(-1); return; }
      if (e.target.closest('[data-lb-next]')) { navLightbox(1); return; }
      if (e.target === lb || e.target.id === 'lb-counter') { closeLightbox(); return; }
    });
  })();

  document.addEventListener('keydown', e => {
    if (!$('lightbox').classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navLightbox(-1);
    if (e.key === 'ArrowRight') navLightbox(1);
  });

  // === COUNTDOWN ===
  function startCountdown(target) {
    if (countdownInterval) clearInterval(countdownInterval);
    if (!target) return;
    const targetDate = new Date(target + 'T00:00:00');
    if (isNaN(targetDate.getTime())) return;
    function update() {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) {
        $('cd-days').textContent = '0';
        $('cd-hours').textContent = '0';
        $('cd-mins').textContent = '0';
        $('cd-secs').textContent = '0';
        clearInterval(countdownInterval);
        return;
      }
      $('cd-days').textContent = Math.floor(diff / 86400000);
      $('cd-hours').textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
      $('cd-mins').textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
      $('cd-secs').textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
    }
    update();
    countdownInterval = setInterval(update, 1000);
  }

  // === BUKA UNDANGAN ===
  window.bukaUndangan = function() {
    $('awal').classList.add('opened');
    $('main-content').classList.remove('hidden');
    $('bottom-nav').classList.remove('hidden');
    $('audio-toggle').classList.remove('hidden');
    const audio = $('bg-music');
    audio.volume = 0.35;
    if (!audio.src || audio.src === location.href) {
      if (appData && appData.musicUrl) {
        audio.src = appData.musicUrl;
        audio.load();
      }
    }
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        isMusicPlaying = true;
        $('audio-toggle').classList.add('playing');
        $('audio-toggle').innerHTML = '<i class="fa-solid fa-music text-sm"></i>';
      }).catch(err => {
        console.warn('Autoplay gagal:', err);
        isMusicPlaying = false;
        $('audio-toggle').innerHTML = '<i class="fa-solid fa-volume-xmark text-sm"></i>';
      });
    }
    setTimeout(() => $('bottom-nav').classList.add('visible'), 800);
    spawnPetals();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(initAllAnimations, 300);
  };

  function spawnPetals() {
    const colors = ['#cba657', '#e8d5a3', '#ae814c', '#f5eed8', '#d4a843'];
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'petal';
      p.style.left = Math.random() * 100 + 'vw';
      p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      p.style.width = (8 + Math.random() * 10) + 'px';
      p.style.height = (8 + Math.random() * 10) + 'px';
      p.style.animation = 'petal-fall ' + (3 + Math.random() * 4) + 's linear ' + (Math.random() * 2) + 's forwards';
      document.body.appendChild(p);
      (el => setTimeout(() => el.remove(), 8000))(p);
    }
  }

  // === TOGGLE AUDIO ===
  window.toggleAudio = function() {
    const audio = $('bg-music');
    const btn = $('audio-toggle');
    if (isMusicPlaying) {
      audio.pause();
      isMusicPlaying = false;
      btn.classList.remove('playing');
      btn.innerHTML = '<i class="fa-solid fa-volume-xmark text-sm"></i>';
    } else {
      if (!audio.src || audio.src === location.href) {
        if (appData && appData.musicUrl) {
          audio.src = appData.musicUrl;
          audio.load();
        } else return;
      }
      audio.play()
        .then(() => {
          isMusicPlaying = true;
          btn.classList.add('playing');
          btn.innerHTML = '<i class="fa-solid fa-music text-sm"></i>';
        })
        .catch(() => btn.innerHTML = '<i class="fa-solid fa-volume-xmark text-sm"></i>');
    }
  };

  // === RENDER BANK LIST ===
  function renderBankList() {
    const container = $('bank-list-container');
    const emptyMsg = $('bank-empty-msg');
    if (!container) return;
    const banks = (appData && appData.banks) ? appData.banks : [];
    const visibleBanks = banks.filter(b => b.visible !== false);
    if (!visibleBanks.length) {
      container.innerHTML = '';
      if (emptyMsg) emptyMsg.classList.remove('hidden');
      return;
    }
    if (emptyMsg) emptyMsg.classList.add('hidden');
    container.innerHTML = visibleBanks.map((bank, idx) => {
      let logoHtml = '';
      if (bank.logo) {
        logoHtml = '<div class="bank-logo-wrap"><img src="' + escapeHtml(bank.logo) + '" alt="' + escapeHtml(bank.name) + '" onerror="this.style.display=\'none\';this.parentElement.innerHTML=\'<div class=\\\'bank-logo-fallback\\\'>🏦</div>\';"></div>';
      } else {
        logoHtml = '<div class="bank-logo-wrap"><div class="bank-logo-fallback">🏦</div></div>';
      }
      return '<div class="bank-card flex items-center justify-between" data-aos="reveal-' + (idx % 2 === 0 ? 'left' : 'right') + '" data-aos-delay="' + (150 + idx * 100) + '">' +
        '<div class="flex items-center flex-1 min-w-0">' + logoHtml +
        '<div class="text-left flex-1 min-w-0"><h4 class="font-bold text-gray-800 text-sm">' + escapeHtml(bank.name || 'Bank') + '</h4>' +
        '<p class="text-lg font-mono text-gray-700 my-1 tracking-wider">' + escapeHtml(bank.rek || '') + '</p>' +
        '<p class="text-xs text-gray-400">a.n. <span>' + escapeHtml(bank.an || '') + '</span></p></div></div>' +
        '<button onclick="copyRek(\'' + escapeHtml(bank.rek || '') + '\', this)" class="bg-gold-ghost text-gold px-4 py-2.5 rounded-xl text-xs hover:bg-gold hover:text-white transition font-semibold whitespace-nowrap"><i class="fa-regular fa-copy mr-1"></i> Salin</button></div>';
    }).join('');
  }

  window.copyRek = function(text, btn) {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      const orig = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-check mr-1"></i> Tersalin';
      btn.classList.add('!bg-green-100', '!text-green-600');
      showToast('Nomor rekening disalin', 'success');
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.classList.remove('!bg-green-100', '!text-green-600');
      }, 2000);
    }).catch(() => showToast('Gagal menyalin', 'error'));
  };

  // === RSVP ===
  window.toggleJumlah = function(val) {
    if (val === 'Hadir') {
      $('jumlah-wrapper').classList.remove('hidden');
    } else {
      $('jumlah-wrapper').classList.add('hidden');
      $('rsvp-jumlah').value = '1';
    }
  };

  window.submitRSVP = async function(e) {
    e.preventDefault();
    const btn = $('btn-submit-rsvp');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengirim...';
    const status = $('rsvp-status').value;
    const jumlah = (status === 'Hadir') ? ($('rsvp-jumlah').value || '1') : '0';
    const payload = {
      action: "rsvp",
      nama: $('rsvp-name').value.trim(),
      kehadiran: status,
      jumlah: jumlah,
      ucapan: $('rsvp-message').value.trim()
    };
    const localItem = {
      nama: payload.nama,
      kehadiran: payload.kehadiran,
      jumlah: payload.jumlah,
      ucapan: payload.ucapan,
      tanggal: new Date().toLocaleString('id-ID')
    };
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
      const res = await fetch(GOOGLE_API_URL, {
        method: 'POST',
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      const result = await res.json();
      if (result.status === 'success') {
        rsvpList.unshift(localItem);
        renderRsvpList();
        showToast('Ucapan terkirim!', 'success');
      } else {
        throw new Error(result.message || 'Gagal');
      }
    } catch (err) {
      console.warn('Gagal kirim ke cloud:', err);
      rsvpList.unshift(localItem);
      renderRsvpList();
      showToast('Tersimpan lokal (offline)', 'info');
    }
    $('rsvp-message').value = '';
    $('rsvp-status').value = '';
    $('rsvp-jumlah').value = '1';
    $('jumlah-wrapper').classList.add('hidden');
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Kirim Ucapan';
  };

  function renderRsvpList() {
    const container = $('rsvp-list-container');
    const countEl = $('rsvp-count');
    if (!container) return;
    countEl.textContent = 'Ucapan Tamu (' + rsvpList.length + ')';
    if (!rsvpList.length) {
      container.innerHTML = '<p class="text-sm text-gray-400 italic text-center py-4">Belum ada ucapan. Jadilah yang pertama!</p>';
      return;
    }
    container.innerHTML = rsvpList.map((item, i) => {
      const nama = item.nama || item.name || '?';
      const kehadiran = item.kehadiran || item.status || '-';
      const ucapan = item.ucapan || item.message || '';
      const tanggal = item.tanggal || item.time || '';
      return '<div class="bg-gray-50 rounded-xl p-4 border border-gray-100" style="' + (i === 0 ? 'animation:fadeSlideIn 0.4s ease' : '') + '">' +
        '<div class="flex items-center justify-between mb-2"><div class="flex items-center gap-2"><div class="w-8 h-8 rounded-full bg-gold text-white flex items-center justify-center text-xs font-bold">' + escapeHtml(nama[0].toUpperCase()) + '</div>' +
        '<span class="font-semibold text-sm text-gray-800">' + escapeHtml(nama) + '</span></div>' +
        '<span class="text-[10px] px-2 py-0.5 rounded-full font-semibold ' + (kehadiran === 'Hadir' ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500') + '">' + escapeHtml(kehadiran) + '</span></div>' +
        '<p class="text-sm text-gray-600 leading-relaxed pl-10">' + escapeHtml(ucapan) + '</p>' +
        (tanggal ? '<p class="text-[10px] text-gray-400 pl-10 mt-1.5">' + escapeHtml(tanggal) + '</p>' : '') + '</div>';
    }).join('');
  }

  // === SCROLL NAV ===
  function initScrollNav() {
    const nav = $('bottom-nav');
    const sections = ['home', 'couple', 'story', 'event', 'gallery', 'rsvp'];
    const links = nav.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          const targetY = targetEl.getBoundingClientRect().top + window.pageYOffset - 20;
          smoothScrollTo(targetY, 900);
        }
      });
    });
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300 && !nav.classList.contains('visible')) nav.classList.add('visible');
      let current = sections[0];
      for (let j = 0; j < sections.length; j++) {
        const el = document.getElementById(sections[j]);
        if (el && el.getBoundingClientRect().top <= 200) current = sections[j];
      }
      links.forEach(a => a.classList.toggle('active', a.getAttribute('data-section') === current));
    }, { passive: true });
  }

  // === CHAPTER VISIBILITY ===
  function applyChapterVisibility(chapters) {
    if (!chapters) return;
    const chapterMap = {
      'home': ['home'],
      'chapter01': [],
      'chapter02': ['couple'],
      'chapter03': ['story'],
      'chapter04': ['event'],
      'chapter05': ['gift'],
      'chapter06': ['rsvp'],
      'chapter07': ['gallery'],
      'footer': []
    };
    for (const chapterId in chapters) {
      const chapter = chapters[chapterId];
      const sections = chapterMap[chapterId] || [];
      sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.style.display = chapter.active === false ? 'none' : '';
        }
      });
    }
    const dividers = document.querySelectorAll('.section-divider');
    dividers.forEach(divider => {
      const prevSection = divider.previousElementSibling;
      const nextSection = divider.nextElementSibling;
      if (prevSection && nextSection) {
        if (prevSection.style.display === 'none' || nextSection.style.display === 'none') {
          divider.style.display = 'none';
        } else {
          divider.style.display = '';
        }
      }
    });
  }

  // === PWA ===
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    $('pwa-install-btn').classList.add('show');
  });

  window.installPWA = function() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(choiceResult => {
        if (choiceResult.outcome === 'accepted') showToast('Aplikasi berhasil diinstall!', 'success');
        deferredPrompt = null;
        $('pwa-install-btn').classList.remove('show');
      });
    } else {
      showToast('Buka di Chrome/Edge untuk install', 'info');
    }
  };

  // === INIT ===
  async function init() {
    startLoaderTyping();

    // Guest name dari URL
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('kpd') || "Bapak/Ibu/Saudara/i";
    if ($('nama-tamu')) $('nama-tamu').innerText = guestName;
    if ($('rsvp-name') && guestName !== "Bapak/Ibu/Saudara/i") $('rsvp-name').value = guestName;

    // Load gallery count
    try {
      const savedCount = localStorage.getItem('gallerySlotCount');
      if (savedCount) {
        const parsed = parseInt(savedCount);
        if (parsed >= 6 && parsed <= 20) currentGalleryCount = parsed;
      }
    } catch (e) {}

    // Fetch data
    let data = await window.fetchCloudData();
    if (data && Object.keys(data).length > 2) {
      const merged = JSON.parse(JSON.stringify(defaultData));
      for (const key in data) {
        if (key !== 'bukuTamu' && key !== 'banks' && key !== 'chapters') merged[key] = data[key];
      }
      if (data.banks && Array.isArray(data.banks)) merged.banks = data.banks;
      merged.bukuTamu = data.bukuTamu || [];
      if (data.showVideo !== undefined) merged.showVideo = data.showVideo;
      if (data.chapters) merged.chapters = data.chapters;
      data = merged;
      dataSource = 'cloud';
    } else {
      try {
        const localStr = localStorage.getItem('undanganData_v2');
        if (localStr) {
          data = JSON.parse(localStr);
          dataSource = 'local';
        } else {
          data = null;
        }
      } catch (e) {
        data = null;
      }
    }

    if (!data) {
      data = JSON.parse(JSON.stringify(defaultData));
      dataSource = 'default';
    }

    // Update gallery count dari data
    for (let i = 20; i >= 6; i--) {
      if (data['galeri' + i]) {
        currentGalleryCount = i;
        try { localStorage.setItem('gallerySlotCount', String(currentGalleryCount)); } catch (e) {}
        break;
      }
    }

    applyDataToHTML(data);
    if (dataSource === 'cloud' || dataSource === 'default') {
      try { localStorage.setItem('undanganData_v2', JSON.stringify(data)); } catch (e) {}
    }

    initScrollNav();
    window.addEventListener('scroll', onScroll, { passive: true });
    updateScrollProgress();

    $('main-loader').classList.add('fade-out');
    $('awal').style.visibility = 'visible';
    AOS.refresh();

    // Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./js/sw.js')
        .then(reg => console.log('[PWA] Service Worker registered'))
        .catch(err => console.warn('[PWA] SW registration failed:', err));
    }
  }

  // === AOS INIT ===
  AOS.init({
    duration: 1000,
    once: false,
    mirror: true,
    easing: 'ease-out-cubic',
    offset: 80,
    anchorPlacement: 'top-bottom'
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
