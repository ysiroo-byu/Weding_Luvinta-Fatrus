/* ========================================
   MAIN.JS - Undangan Fatrus & Luvinta
   (Gabungan Logika Tamu + Admin Settings)
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
  
  // ✅ STATE ADMIN (YANG HILANG SEBELUMNYA)
  let ADMIN_PIN = null;
  let bankIdCounter = 3;
  let pendingUploadField = null;
  let pendingUploadPreviewId = null;
  let pendingUploadType = 'image';
  let currentChapters = {};

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
    ornamentHomeTL: "https://indoinvite.com/nikah/template/elegan/elegan-gold/EG-AKR.webp", ornamentHomeTR: "https://indoinvite.com/nikah/template/elegan/elegan-gold/EG-AKN.webp",
    ornamentHomeBL: "https://indoinvite.com/nikah/template/elegan/elegan-gold/EG-BKR2.webp", ornamentHomeBR: "https://indoinvite.com/nikah/template/elegan/elegan-gold/EG-BKN2.webp",
    ornamentCoupleTL: "https://indoinvite.com/nikah/template/elegan/elegan-gold/EG-AKR1.webp", ornamentCoupleTR: "https://indoinvite.com/nikah/template/elegan/elegan-gold/EG-AKN1.webp",
    ornamentEventTL: "https://indoinvite.com/nikah/template/elegan/elegan-gold/EG-AKR2.webp", ornamentEventTR: "https://indoinvite.com/nikah/template/elegan/elegan-gold/EG-AKN2.webp",
    ornamentFooterTL: "https://indoinvite.com/nikah/template/elegan/elegan-gold/EG-AKR2.webp", ornamentFooterTR: "https://indoinvite.com/nikah/template/elegan/elegan-gold/EG-AKN2.webp",
    ornamentFooterBL: "https://indoinvite.com/nikah/template/elegan/elegan-gold/EG-BKR.webp", ornamentFooterBR: "https://indoinvite.com/nikah/template/elegan/elegan-gold/EG-BKN2.webp",
    loaderOrnamentTL: "https://indoinvite.com/nikah/template/elegan/elegan-gold/EG-AKR.webp", loaderOrnamentTR: "https://indoinvite.com/nikah/template/elegan/elegan-gold/EG-AKN.webp",
    loaderOrnamentBL: "https://indoinvite.com/nikah/template/elegan/elegan-gold/EG-BKR2.webp", loaderOrnamentBR: "https://indoinvite.com/nikah/template/elegan/elegan-gold/EG-BKN2.webp",
    chapters: {
      "home": { active: true, label: "Home/Welcome" }, "chapter01": { active: true, label: "Chapter 01 - Assalamu'alaikum" },
      "chapter02": { active: true, label: "Chapter 02 - Mempelai" }, "chapter03": { active: true, label: "Chapter 03 - Love Story" },
      "chapter04": { active: true, label: "Chapter 04 - Save The Date" }, "chapter05": { active: true, label: "Chapter 05 - Wedding Gift" },
      "chapter06": { active: true, label: "Chapter 06 - Buku Tamu" }, "chapter07": { active: true, label: "Chapter 07 - Gallery" },
      "footer": { active: true, label: "Footer" }
    }
  };

  // ✅ ARRAY DEKORASI (YANG HILANG SEBELUMNYA)
  const decorFields = [
    'backgroundImg', 'borderFrame',
    'ornamentHomeTL', 'ornamentHomeTR', 'ornamentHomeBL', 'ornamentHomeBR',
    'ornamentCoupleTL', 'ornamentCoupleTR', 'ornamentEventTL', 'ornamentEventTR',
    'ornamentFooterTL', 'ornamentFooterTR', 'ornamentFooterBL', 'ornamentFooterBR',
    'loaderOrnamentTL', 'loaderOrnamentTR', 'loaderOrnamentBL', 'loaderOrnamentBR'
  ];

  const decorMapping = {
    'ornamentHomeTL': 'orn-home-tl', 'ornamentHomeTR': 'orn-home-tr', 'ornamentHomeBL': 'orn-home-bl', 'ornamentHomeBR': 'orn-home-br',
    'ornamentCoupleTL': 'orn-couple-tl', 'ornamentCoupleTR': 'orn-couple-tr', 'ornamentEventTL': 'orn-event-tl', 'ornamentEventTR': 'orn-event-tr',
    'ornamentFooterTL': 'orn-footer-tl', 'ornamentFooterTR': 'orn-footer-tr', 'ornamentFooterBL': 'orn-footer-bl', 'ornamentFooterBR': 'orn-footer-br',
    'loaderOrnamentTL': 'loader-orn-tl', 'loaderOrnamentTR': 'loader-orn-tr', 'loaderOrnamentBL': 'loader-orn-bl', 'loaderOrnamentBR': 'loader-orn-br'
  };

  const decorLabels = {
    'ornamentHomeTL': 'Kiri Atas', 'ornamentHomeTR': 'Kanan Atas', 'ornamentHomeBL': 'Kiri Bawah', 'ornamentHomeBR': 'Kanan Bawah',
    'ornamentCoupleTL': 'Kiri Atas', 'ornamentCoupleTR': 'Kanan Atas', 'ornamentEventTL': 'Kiri Atas', 'ornamentEventTR': 'Kanan Atas',
    'ornamentFooterTL': 'Kiri Atas', 'ornamentFooterTR': 'Kanan Atas', 'ornamentFooterBL': 'Kiri Bawah', 'ornamentFooterBR': 'Kanan Bawah',
    'loaderOrnamentTL': 'Kiri Atas', 'loaderOrnamentTR': 'Kanan Atas', 'loaderOrnamentBL': 'Kiri Bawah', 'loaderOrnamentBR': 'Kanan Bawah'
  };

  // === UTILITIES ===
  const $ = (id) => document.getElementById(id);
  const $$ = (sel) => document.querySelectorAll(sel);

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function normalizeDateString(d) {
    if (!d) return "";
    if (d.indexOf('T') !== -1) { const dt = new Date(d); if (!isNaN(dt)) return dt.toISOString().split('T')[0]; }
    return d;
  }

  function showToast(msg, type) {
    type = type || 'info';
    const c = $('toast-container');
    if (!c) return;
    const t = document.createElement('div');
    t.className = 'toast-item';
    const icons = { success: 'fa-check-circle text-green-500', error: 'fa-exclamation-circle text-red-500', info: 'fa-info-circle text-blue-500' };
    t.innerHTML = `<div class="flex items-center gap-3"><i class="fa-solid ${icons[type] || icons.info}"></i><span class="text-sm text-gray-700">${msg}</span></div>`;
    c.appendChild(t);
    requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('show')));
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 3000);
  }

  // === LOADER & ANIMATIONS ===
  function startLoaderTyping() {
    const nameEl = $('loader-name-text');
    if (!nameEl) return;
    const fullName = (defaultData.priaNick || 'Fatrus') + ' & ' + (defaultData.wanitaNick || 'Luvinta');
    let currentIndex = 0;
    function typeChar() {
      if (currentIndex <= fullName.length) { nameEl.textContent = fullName.substring(0, currentIndex); currentIndex++; setTimeout(typeChar, 120); }
      else { setTimeout(() => nameEl.classList.add('done'), 500); }
    }
    setTimeout(typeChar, 800);
  }

  function smoothScrollTo(targetY, duration = 1000) {
    const startY = window.pageYOffset, diff = targetY - startY; let startTime = null;
    function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
    function step(currentTime) {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      window.scrollTo(0, startY + diff * easeInOutCubic(progress));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function updateScrollProgress() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    const bar = $('scroll-progress');
    if (bar) bar.style.width = progress + '%';
  }

  function updateParallax() {
    document.querySelectorAll('.parallax-layer').forEach(layer => {
      const speed = parseFloat(layer.getAttribute('data-parallax-speed')) || 0.1;
      const rect = layer.getBoundingClientRect();
      const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
      layer.style.transform = `translateY(${offset}px)`;
    });
  }

  function initSectionReveal() {
    const obs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('revealed'); }); }, { threshold: 0.1 });
    document.querySelectorAll('.section-reveal').forEach(el => obs.observe(el));
  }

  function initSplitText() {
    document.querySelectorAll('.split-text').forEach(el => {
      if (el.dataset.splitDone) return;
      el.innerHTML = el.textContent.trim().split(/\s+/).map(w => `<span class="word">${w}</span>`).join('');
      el.dataset.splitDone = 'true';
    });
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('animate'); e.target.querySelectorAll('.word').forEach((w, i) => w.style.transitionDelay = (i * 0.1) + 's'); }
        else e.target.classList.remove('animate');
      });
    }, { threshold: 0.3 });
    document.querySelectorAll('.split-text').forEach(el => obs.observe(el));
  }

  function onScroll() {
    if (!ticking) { requestAnimationFrame(() => { updateScrollProgress(); updateParallax(); ticking = false; }); ticking = true; }
  }

  function initAllAnimations() {
    if (animationsInitialized) return;
    animationsInitialized = true;
    setTimeout(() => { initSplitText(); initSectionReveal(); AOS.refresh(); }, 200);
  }

  // === FETCH CLOUD DATA ===
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

  // ==========================================
  // ✅ LOGIKA ADMIN (KLIK 5X & PIN MODAL)
  // ==========================================
  (function initSilentAdminTap() {
    const heartEl = $('footer-heart');
    if (!heartEl) return;
    let tapCount = 0, tapTimer = null;
    
    const handleTap = (e) => {
      e.preventDefault(); e.stopPropagation();
      tapCount++;
      if (tapTimer) clearTimeout(tapTimer);
      tapTimer = setTimeout(() => tapCount = 0, 2000);
      if (tapCount >= 5) { 
        tapCount = 0; 
        if (tapTimer) clearTimeout(tapTimer); 
        window.openPinModal(); 
      }
    };

    heartEl.addEventListener('click', handleTap);
    heartEl.addEventListener('touchend', (e) => { e.preventDefault(); handleTap(e); });
  })();

  // Shortcut Keyboard (Ctrl + Shift + A)
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
      e.preventDefault();
      window.openPinModal();
    }
  });

  window.openPinModal = function() {
    const modal = $('pin-modal');
    if (!modal) {
      // Fallback jika HTML tidak punya modal, langsung redirect ke setting.html (jika ada)
      if (confirm('Modal PIN tidak ditemukan di HTML. Apakah Anda ingin diarahkan ke halaman setting.html?')) {
        window.location.href = 'setting.html';
      }
      return;
    }
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => { const firstInput = document.querySelector('.pin-input[data-pin-index="0"]'); if (firstInput) firstInput.focus(); }, 300);
  };

  window.closePinModal = function() {
    $('pin-modal').classList.remove('active');
    document.body.style.overflow = '';
    document.querySelectorAll('.pin-input').forEach(input => { input.value = ''; input.classList.remove('filled', 'error'); });
    const err = $('pin-error'); if (err) err.classList.add('hidden');
  };

  // Auto-focus PIN Input
  document.querySelectorAll('.pin-input').forEach(input => {
    input.addEventListener('input', function() {
      if (this.value.length === 1) {
        this.classList.add('filled');
        const next = document.querySelector(`.pin-input[data-pin-index="${parseInt(this.dataset.pinIndex) + 1}"]`);
        if (next) next.focus();
      }
    });
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Backspace' && this.value === '') {
        const prev = document.querySelector(`.pin-input[data-pin-index="${parseInt(this.dataset.pinIndex) - 1}"]`);
        if (prev) prev.focus();
      }
      if (e.key === 'Enter') window.verifyPin();
    });
  });

  window.verifyPin = async function() {
    const inputs = document.querySelectorAll('.pin-input');
    let pin = ''; inputs.forEach(i => pin += i.value);
    if (pin.length !== 4) { showToast('PIN harus 4 digit', 'error'); return; }
    
    const btn = $('btn-verify-pin');
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> Memverifikasi...'; }
    
    // Bypass verifikasi server jika API belum di-deploy (Mode Lokal)
    if (pin === '1234') {
        ADMIN_PIN = pin;
        window.closePinModal();
        window.openSettings();
        showToast('Verifikasi berhasil! (Mode Lokal)', 'success');
        if (btn) { btn.disabled = false; btn.innerHTML = 'Verifikasi'; }
        return;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
      const res = await fetch(GOOGLE_API_URL, { method: 'POST', body: JSON.stringify({ action: "verifyPin", pin: pin }), signal: controller.signal });
      clearTimeout(timeoutId);
      const result = await res.json();
      if (result.status === 'success') {
        ADMIN_PIN = pin; window.closePinModal(); window.openSettings(); showToast('Verifikasi berhasil!', 'success');
      } else { throw new Error(result.message || 'PIN salah'); }
    } catch (err) {
      console.warn('Verifikasi PIN gagal:', err);
      inputs.forEach(i => i.classList.add('error'));
      const errEl = $('pin-error'); if (errEl) errEl.classList.remove('hidden');
      showToast('PIN salah!', 'error');
      setTimeout(() => { inputs.forEach(i => { i.value = ''; i.classList.remove('filled', 'error'); }); if ($('pin-error')) $('pin-error').classList.add('hidden'); }, 1500);
    } finally {
      if (btn) { btn.disabled = false; btn.innerHTML = 'Verifikasi'; }
    }
  };

  // ==========================================
  // ✅ LOGIKA SETTINGS MODAL
  // ==========================================
  window.openSettings = function() {
    if (!appData) appData = JSON.parse(JSON.stringify(defaultData));
    populateSettingsForm(appData);
    const modal = $('settings-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        // Fallback jika menggunakan setting.html terpisah
        window.location.href = 'setting.html';
    }
  };

  window.closeSettings = function() {
    const modal = $('settings-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
  };

  window.switchSettingsTab = function(tabName) {
    document.querySelectorAll('.settings-tab-content').forEach(tab => tab.classList.add('hidden'));
    const selectedTab = $('tab-' + tabName);
    if (selectedTab) selectedTab.classList.remove('hidden');
    
    document.querySelectorAll('.settings-tab-btn').forEach(btn => {
      if (btn.dataset.tab === tabName) { btn.classList.remove('text-gray-600', 'hover:bg-gray-100'); btn.classList.add('bg-gold', 'text-white'); }
      else { btn.classList.add('text-gray-600', 'hover:bg-gray-100'); btn.classList.remove('bg-gold', 'text-white'); }
    });
  };

  function populateSettingsForm(data) {
    const fields = ['priaNick', 'priaFull', 'priaOrtu', 'priaIg', 'wanitaNick', 'wanitaFull', 'wanitaOrtu', 'wanitaIg', 'fotoSampul', 'fotoPria', 'fotoWanita', 'countdownTarget', 'musicUrl', 'akadDate', 'akadTime', 'akadLokasi', 'akadMapUrl', 'resepsiDate', 'resepsiTime', 'resepsiLokasi', 'resepsiMapUrl', 'dinnerDate', 'dinnerTime', 'dinnerLokasi', 'dinnerMapUrl', 'mapIframeUrl', 'story1Title', 'story1Desc', 'story1Img', 'story2Title', 'story2Desc', 'story2Img', 'videoYoutubeUrl'];
    fields.forEach(f => { const el = $('set-' + f); if (el && data[f] !== undefined) el.value = data[f]; });
    decorFields.forEach(f => { const el = $('set-' + f); if (el && data[f] !== undefined) el.value = data[f]; });
    for (let i = 1; i <= currentGalleryCount; i++) { const el = $('set-galeri' + i); if (el && data['galeri' + i]) el.value = data['galeri' + i]; }
    const showVideoEl = $('set-showVideo'); if (showVideoEl) showVideoEl.checked = data.showVideo !== false;
    
    renderBankSettings();
    buildDecorGrids(data);
    buildGalleryUrlFields();
    if (data.chapters) { currentChapters = data.chapters; renderChaptersList(); }
  }

  window.saveSettings = function() {
    showToast('Simpan settings belum di-setup penuh di file ini. Gunakan setting.html untuk hasil maksimal.', 'info');
    // Logic save ke cloud bisa ditambahkan di sini jika menggunakan single page
  };

  function buildDecorGrids(data) {
    const sections = {
      'decor-home-grid': ['ornamentHomeTL', 'ornamentHomeTR', 'ornamentHomeBL', 'ornamentHomeBR'],
      'decor-couple-grid': ['ornamentCoupleTL', 'ornamentCoupleTR'],
      'decor-event-grid': ['ornamentEventTL', 'ornamentEventTR'],
      'decor-footer-grid': ['ornamentFooterTL', 'ornamentFooterTR', 'ornamentFooterBL', 'ornamentFooterBR'],
      'decor-loader-grid': ['loaderOrnamentTL', 'loaderOrnamentTR', 'loaderOrnamentBL', 'loaderOrnamentBR']
    };
    for (const gridId in sections) {
      const grid = $(gridId); if (!grid) continue; grid.innerHTML = '';
      sections[gridId].forEach(field => {
        const label = decorLabels[field] || field;
        const url = (data && data[field]) ? data[field] : '';
        const item = document.createElement('div'); item.className = 'decor-item';
        item.innerHTML = `<div class="decor-preview" id="preview-${field}"><img src="${escapeHtml(url)}" alt="preview" ${url ? '' : 'style="display:none;"'}><span class="no-image" ${url ? 'style="display:none;"' : ''}><i class="fa-regular fa-image"></i></span></div><div class="decor-info"><div class="decor-label">${label}</div><input type="text" id="set-${field}" value="${escapeHtml(url)}" class="w-full px-2 py-1 border border-gray-200 rounded text-[10px] outline-none focus:border-gold-light" placeholder="URL"></div>`;
        grid.appendChild(item);
      });
    }
  }

  function renderBankSettings() { /* Placeholder untuk settings */ }
  function buildGalleryUrlFields() {
    const grid = $('gallery-url-grid'); if (!grid) return; grid.innerHTML = '';
    for (let i = 1; i <= currentGalleryCount; i++) {
      const div = document.createElement('div'); div.className = 'space-y-1 bg-gray-50 p-2 rounded-lg border border-gray-100';
      div.innerHTML = `<label class="text-[11px] text-gray-500 font-semibold">Galeri ${i}</label><div class="photo-upload-row"><div class="preview-wrap" id="preview-galeri${i}"><img src="" alt="preview" class="hidden"><span class="no-image"><i class="fa-regular fa-image"></i></span></div><div class="field-group flex gap-2"><input type="text" id="set-galeri${i}" class="flex-1 px-2.5 py-1.5 border border-gray-200 rounded-lg outline-none text-xs" placeholder="URL gambar"></div></div>`;
      grid.appendChild(div);
    }
  }
  function renderChaptersList() {
    const container = $('chapters-list'); if (!container) return;
    let html = '';
    for (const key in currentChapters) {
      const c = currentChapters[key]; const isActive = c.active !== false;
      html += `<div class="chapter-item ${isActive ? '' : 'disabled'}"><div class="chapter-info"><div class="chapter-name">${escapeHtml(c.label)}</div></div><span class="chapter-status ${isActive ? 'active' : 'inactive'}">${isActive ? 'Aktif' : 'Nonaktif'}</span></div>`;
    }
    container.innerHTML = html;
  }

  // ==========================================
  // ✅ LOGIKA TAMPILAN TAMU (SISANYA)
  // ==========================================
  function applyDataToHTML(data) {
    appData = data;
    $$('.val-pria-nick').forEach(el => el.textContent = data.priaNick);
    $$('.val-wanita-nick').forEach(el => el.textContent = data.wanitaNick);
    if ($('val-pria-full')) $('val-pria-full').textContent = data.priaFull;
    if ($('val-wanita-full')) $('val-wanita-full').textContent = data.wanitaFull;
    if ($('val-pria-ortu')) $('val-pria-ortu').textContent = data.priaOrtu;
    if ($('val-wanita-ortu')) $('val-wanita-ortu').textContent = data.wanitaOrtu;
    
    ['val-fotoSampul', 'val-fotoSampul2', 'val-fotoSampul3'].forEach(id => { const el = $(id); if (el && data.fotoSampul) el.style.backgroundImage = `url('${data.fotoSampul}')`; });
    if ($('val-fotoPria')) { $('val-fotoPria').src = data.fotoPria || ''; if (data.fotoPria) $('val-fotoPria').style.display = 'block'; }
    if ($('val-fotoWanita')) { $('val-fotoWanita').src = data.fotoWanita || ''; if (data.fotoWanita) $('val-fotoWanita').style.display = 'block'; }
    
    const audio = $('bg-music'); if (data.musicUrl && audio.src !== data.musicUrl) { audio.src = data.musicUrl; audio.load(); }
    
    if ($('val-story1-title')) $('val-story1-title').textContent = data.story1Title || '';
    if ($('val-story1-desc')) $('val-story1-desc').textContent = data.story1Desc || '';
    if ($('val-story2-title')) $('val-story2-title').textContent = data.story2Title || '';
    if ($('val-story2-desc')) $('val-story2-desc').textContent = data.story2Desc || '';
    
    if ($('val-akad-date')) $('val-akad-date').textContent = data.akadDate || '';
    if ($('val-akad-time')) $('val-akad-time').textContent = data.akadTime || '';
    if ($('val-akad-lokasi')) $('val-akad-lokasi').textContent = data.akadLokasi || '';
    if ($('val-resepsi-date')) $('val-resepsi-date').textContent = data.resepsiDate || '';
    if ($('val-resepsi-time')) $('val-resepsi-time').textContent = data.resepsiTime || '';
    if ($('val-resepsi-lokasi')) $('val-resepsi-lokasi').textContent = data.resepsiLokasi || '';
    
    if (data.backgroundImg) document.querySelectorAll('.box-container').forEach(el => el.style.backgroundImage = `url('${data.backgroundImg}')`);
    
    galleryImages = [];
    for (let i = 1; i <= currentGalleryCount; i++) { const url = data['galeri' + i] || ''; if (url) galleryImages.push(url); }
    renderGallery();
    renderBankList();
    rsvpList = data.bukuTamu || []; renderRsvpList();
    document.title = 'Undangan ' + (data.priaNick || '') + ' & ' + (data.wanitaNick || '');
    startCountdown(normalizeDateString(data.countdownTarget));
    if (data.chapters) applyChapterVisibility(data.chapters);
  }

  function renderGallery() {
    const grid = $('gallery-grid'); if (!grid) return; grid.innerHTML = '';
    galleryImages.forEach((src, i) => {
      const img = document.createElement('img'); img.src = src; img.className = 'gallery-item'; img.setAttribute('loading', 'lazy');
      img.onclick = () => openLightbox(i); img.onerror = function() { this.style.display = 'none'; };
      grid.appendChild(img);
    });
  }

  function openLightbox(index) { currentLightboxIndex = index; $('lightbox-img').src = galleryImages[currentLightboxIndex]; $('lightbox').classList.add('active'); document.body.style.overflow = 'hidden'; }
  window.closeLightbox = function() { $('lightbox').classList.remove('active'); document.body.style.overflow = ''; };
  window.navLightbox = function(dir) { currentLightboxIndex = (currentLightboxIndex + dir + galleryImages.length) % galleryImages.length; $('lightbox-img').src = galleryImages[currentLightboxIndex]; };

  function renderBankList() {
    const container = $('bank-list-container'); if (!container) return;
    const banks = (appData && appData.banks) ? appData.banks.filter(b => b.visible !== false) : [];
    container.innerHTML = banks.map(bank => `<div class="bank-card flex items-center justify-between"><div class="text-left"><h4 class="font-bold text-gray-800 text-sm">${escapeHtml(bank.name)}</h4><p class="text-lg font-mono text-gray-700 my-1">${escapeHtml(bank.rek)}</p><p class="text-xs text-gray-400">a.n. ${escapeHtml(bank.an)}</p></div><button onclick="copyRek('${escapeHtml(bank.rek)}', this)" class="bg-gold text-white px-4 py-2 rounded-xl text-xs">Salin</button></div>`).join('');
  }

  window.copyRek = function(text, btn) {
    navigator.clipboard.writeText(text).then(() => { btn.innerHTML = 'Tersalin'; showToast('Nomor rekening disalin', 'success'); setTimeout(() => btn.innerHTML = 'Salin', 2000); });
  };

  function startCountdown(target) {
    if (countdownInterval) clearInterval(countdownInterval); if (!target) return;
    const targetDate = new Date(target + 'T00:00:00'); if (isNaN(targetDate.getTime())) return;
    function update() {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) { $('cd-days').textContent = '0'; $('cd-hours').textContent = '0'; $('cd-mins').textContent = '0'; $('cd-secs').textContent = '0'; clearInterval(countdownInterval); return; }
      $('cd-days').textContent = Math.floor(diff / 86400000);
      $('cd-hours').textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
      $('cd-mins').textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
      $('cd-secs').textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
    }
    update(); countdownInterval = setInterval(update, 1000);
  }

  window.bukaUndangan = function() {
    $('awal').classList.add('opened'); $('main-content').classList.remove('hidden'); $('bottom-nav').classList.remove('hidden'); $('audio-toggle').classList.remove('hidden');
    const audio = $('bg-music'); audio.volume = 0.35;
    if (appData && appData.musicUrl) { audio.src = appData.musicUrl; audio.load(); }
    audio.play().then(() => { isMusicPlaying = true; $('audio-toggle').classList.add('playing'); }).catch(err => console.warn('Autoplay gagal:', err));
    setTimeout(() => $('bottom-nav').classList.add('visible'), 800);
    window.scrollTo({ top: 0, behavior: 'smooth' }); setTimeout(initAllAnimations, 300);
  };

  window.toggleAudio = function() {
    const audio = $('bg-music'), btn = $('audio-toggle');
    if (isMusicPlaying) { audio.pause(); isMusicPlaying = false; btn.classList.remove('playing'); btn.innerHTML = '<i class="fa-solid fa-volume-xmark text-sm"></i>'; }
    else { audio.play().then(() => { isMusicPlaying = true; btn.classList.add('playing'); btn.innerHTML = '<i class="fa-solid fa-music text-sm"></i>'; }); }
  };

  window.toggleJumlah = function(val) { if (val === 'Hadir') $('jumlah-wrapper').classList.remove('hidden'); else $('jumlah-wrapper').classList.add('hidden'); };

  window.submitRSVP = async function(e) {
    e.preventDefault();
    const btn = $('btn-submit-rsvp'); btn.disabled = true; btn.innerHTML = 'Mengirim...';
    const payload = { action: "rsvp", nama: $('rsvp-name').value.trim(), kehadiran: $('rsvp-status').value, jumlah: $('rsvp-jumlah').value || '1', ucapan: $('rsvp-message').value.trim() };
    const localItem = { ...payload, tanggal: new Date().toLocaleString('id-ID') };
    try {
      const res = await fetch(GOOGLE_API_URL, { method: 'POST', body: JSON.stringify(payload) });
      const result = await res.json();
      if (result.status === 'success') { rsvpList.unshift(localItem); renderRsvpList(); showToast('Ucapan terkirim!', 'success'); }
    } catch (err) { rsvpList.unshift(localItem); renderRsvpList(); showToast('Tersimpan lokal', 'info'); }
    $('rsvp-message').value = ''; $('rsvp-status').value = ''; btn.disabled = false; btn.innerHTML = 'Kirim Ucapan';
  };

  function renderRsvpList() {
    const container = $('rsvp-list-container'); if (!container) return;
    $('rsvp-count').textContent = 'Ucapan Tamu (' + rsvpList.length + ')';
    container.innerHTML = rsvpList.map(item => `<div class="bg-gray-50 rounded-xl p-4 border border-gray-100"><div class="font-semibold text-sm text-gray-800">${escapeHtml(item.nama)}</div><p class="text-sm text-gray-600 mt-1">${escapeHtml(item.ucapan)}</p></div>`).join('');
  }

  function applyChapterVisibility(chapters) {
    const map = { 'home': ['home'], 'chapter02': ['couple'], 'chapter03': ['story'], 'chapter04': ['event'], 'chapter05': ['gift'], 'chapter06': ['rsvp'], 'chapter07': ['gallery'] };
    for (const id in chapters) {
      const secs = map[id] || [];
      secs.forEach(s => { const el = document.getElementById(s); if (el) el.style.display = chapters[id].active === false ? 'none' : ''; });
    }
  }

  function initScrollNav() {
    const nav = $('bottom-nav'); if(!nav) return;
    const sections = ['home', 'couple', 'story', 'event', 'gallery', 'rsvp'];
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', e => { e.preventDefault(); const el = document.getElementById(link.getAttribute('href').substring(1)); if (el) smoothScrollTo(el.getBoundingClientRect().top + window.pageYOffset - 20, 900); });
    });
  }

  // === INIT ===
  async function init() {
    startLoaderTyping();
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('kpd') || "Bapak/Ibu/Saudara/i";
    if ($('nama-tamu')) $('nama-tamu').innerText = guestName;
    if ($('rsvp-name') && guestName !== "Bapak/Ibu/Saudara/i") $('rsvp-name').value = guestName;

    let data = await window.fetchCloudData();
    if (!data || Object.keys(data).length < 2) {
      try { const l = localStorage.getItem('undanganData_v2'); if (l) data = JSON.parse(l); } catch(e) {}
    }
    if (!data) data = JSON.parse(JSON.stringify(defaultData));

    applyDataToHTML(data);
    initScrollNav();
    window.addEventListener('scroll', onScroll, { passive: true });
    updateScrollProgress();

    $('main-loader').classList.add('fade-out');
    $('awal').style.visibility = 'visible';
    AOS.init({ duration: 1000, once: false, mirror: true, easing: 'ease-out-cubic', offset: 80 });
    AOS.refresh();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
