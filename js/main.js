/* ========================================
   UNDANGAN FATRUSS & LUVINTA - MAIN JS
   ======================================== */
(function() {
  'use strict';

  // === KONFIGURASI ===
  const GOOGLE_API_URL = "https://script.google.com/macros/s/AKfycbxHZX63O8l14Ksa91PIGhdkjIMsLoPodVdmV_3C9ZU0WkSEDmhaoV_lCQj4cm6R9d1g/exec";
  const GALLERY_COUNT = 6;
  const FETCH_TIMEOUT = 10000;

  // === STATE ===
  let ADMIN_PIN = null;
  let appData = null;
  let dataSource = 'default';
  let countdownInterval = null;
  let isMusicPlaying = false;
  let currentLightboxIndex = 0;
  let galleryImages = [];
  let rsvpList = [];
  let ticking = false;
  let animationsInitialized = false;
  let bankIdCounter = 3;
  let pendingUploadField = null;
  let pendingUploadPreviewId = null;
  let pendingUploadType = 'image';
  let deferredPrompt = null;
  let currentChapters = {};
  let currentGalleryCount = 6;

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
    loaderOrnamentTL: "https://indoinvite.com/nikah/template/elegan/elegan-gold/EG-AKR.webp",
    loaderOrnamentTR: "https://indoinvite.com/nikah/template/elegan/elegan-gold/EG-AKN.webp",
    loaderOrnamentBL: "https://indoinvite.com/nikah/template/elegan/elegan-gold/EG-BKR2.webp",
    loaderOrnamentBR: "https://indoinvite.com/nikah/template/elegan/elegan-gold/EG-BKN2.webp",
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

  const decorFields = [
    'backgroundImg', 'borderFrame',
    'ornamentHomeTL', 'ornamentHomeTR', 'ornamentHomeBL', 'ornamentHomeBR',
    'ornamentCoupleTL', 'ornamentCoupleTR',
    'ornamentEventTL', 'ornamentEventTR',
    'ornamentFooterTL', 'ornamentFooterTR', 'ornamentFooterBL', 'ornamentFooterBR',
    'loaderOrnamentTL', 'loaderOrnamentTR', 'loaderOrnamentBL', 'loaderOrnamentBR'
  ];

  const decorMapping = {
    'ornamentHomeTL': 'orn-home-tl', 'ornamentHomeTR': 'orn-home-tr',
    'ornamentHomeBL': 'orn-home-bl', 'ornamentHomeBR': 'orn-home-br',
    'ornamentCoupleTL': 'orn-couple-tl', 'ornamentCoupleTR': 'orn-couple-tr',
    'ornamentEventTL': 'orn-event-tl', 'ornamentEventTR': 'orn-event-tr',
    'ornamentFooterTL': 'orn-footer-tl', 'ornamentFooterTR': 'orn-footer-tr',
    'ornamentFooterBL': 'orn-footer-bl', 'ornamentFooterBR': 'orn-footer-br',
    'loaderOrnamentTL': 'loader-orn-tl', 'loaderOrnamentTR': 'loader-orn-tr',
    'loaderOrnamentBL': 'loader-orn-bl', 'loaderOrnamentBR': 'loader-orn-br'
  };

  const decorLabels = {
    'ornamentHomeTL': 'Kiri Atas', 'ornamentHomeTR': 'Kanan Atas',
    'ornamentHomeBL': 'Kiri Bawah', 'ornamentHomeBR': 'Kanan Bawah',
    'ornamentCoupleTL': 'Kiri Atas', 'ornamentCoupleTR': 'Kanan Atas',
    'ornamentEventTL': 'Kiri Atas', 'ornamentEventTR': 'Kanan Atas',
    'ornamentFooterTL': 'Kiri Atas', 'ornamentFooterTR': 'Kanan Atas',
    'ornamentFooterBL': 'Kiri Bawah', 'ornamentFooterBR': 'Kanan Bawah',
    'loaderOrnamentTL': 'Kiri Atas', 'loaderOrnamentTR': 'Kanan Atas',
    'loaderOrnamentBL': 'Kiri Bawah', 'loaderOrnamentBR': 'Kanan Bawah'
  };

  // === UTILITIES ===
  const $ = (id) => document.getElementById(id);
  const $$ = (sel) => document.querySelectorAll(sel);

  const escapeHtml = (str) => {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  const normalizeDateString = (d) => {
    if (!d) return "";
    if (d.indexOf('T') !== -1) {
      const dt = new Date(d);
      if (!isNaN(dt)) return dt.toISOString().split('T')[0];
    }
    return d;
  };

  // === TOAST ===
  function showToast(msg, type = 'info') {
    const c = $('toast-container');
    const t = document.createElement('div');
    t.className = 'toast-item';
    const icons = {
      success: 'fa-check-circle text-green-500',
      error: 'fa-exclamation-circle text-red-500',
      info: 'fa-info-circle text-blue-500'
    };
    t.innerHTML = `<div class="flex items-center gap-3"><i class="fa-solid ${icons[type] || icons.info}"></i><span class="text-sm text-gray-700">${msg}</span></div>`;
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
  function smoothScrollTo(targetY, duration = 1000) {
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
      layer.style.transform = `translateY(${offset}px)`;
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
      el.innerHTML = words.map(w => `<span class="word">${w}</span>`).join('');
      el.dataset.splitDone = 'true';
    });
    const splitObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.classList.add('animate');
          const words = el.querySelectorAll('.word');
          words.forEach((w, i) => w.style.transitionDelay = (i * 0.1) + 's');
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

  // === SYNC BADGE ===
  function updateSyncBadge(source) {
    const el = $('sync-indicator');
    if (!el) return;
    if (source === 'cloud') {
      el.className = 'sync-badge cloud';
      el.innerHTML = '<i class="fa-solid fa-cloud"></i> Cloud';
    } else if (source === 'local') {
      el.className = 'sync-badge local';
      el.innerHTML = '<i class="fa-solid fa-database"></i> Lokal';
    } else {
      el.className = 'sync-badge offline';
      el.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Default';
    }
  }

  // === ADMIN PIN MODAL ===
  (function initSilentAdminTap() {
    const heartEl = $('footer-heart');
    if (!heartEl) return;
    let tapCount = 0, tapTimer = null;
    heartEl.addEventListener('click', e => {
      e.preventDefault(); e.stopPropagation();
      tapCount++;
      if (tapTimer) clearTimeout(tapTimer);
      tapTimer = setTimeout(() => tapCount = 0, 2000);
      if (tapCount >= 5) {
        tapCount = 0;
        if (tapTimer) clearTimeout(tapTimer);
        window.openPinModal();
      }
    });
    heartEl.addEventListener('touchend', e => { e.preventDefault(); heartEl.click(); });
  })();

  window.openPinModal = function() {
    $('pin-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      const firstInput = document.querySelector('.pin-input[data-pin-index="0"]');
      if (firstInput) firstInput.focus();
    }, 300);
  };

  window.closePinModal = function() {
    $('pin-modal').classList.remove('active');
    document.body.style.overflow = '';
    clearPinInputs();
  };

  function clearPinInputs() {
    document.querySelectorAll('.pin-input').forEach(input => {
      input.value = '';
      input.classList.remove('filled', 'error');
    });
    $('pin-error').classList.add('hidden');
  }

  document.querySelectorAll('.pin-input').forEach(input => {
    input.addEventListener('input', function() {
      if (this.value.length === 1) {
        this.classList.add('filled');
        const nextIndex = parseInt(this.dataset.pinIndex) + 1;
        const nextInput = document.querySelector(`.pin-input[data-pin-index="${nextIndex}"]`);
        if (nextInput) nextInput.focus();
      }
    });
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Backspace' && this.value === '') {
        const prevIndex = parseInt(this.dataset.pinIndex) - 1;
        const prevInput = document.querySelector(`.pin-input[data-pin-index="${prevIndex}"]`);
        if (prevInput) prevInput.focus();
      }
      if (e.key === 'Enter') window.verifyPin();
    });
  });

  window.verifyPin = async function() {
    const inputs = document.querySelectorAll('.pin-input');
    let pin = '';
    inputs.forEach(input => pin += input.value);
    if (pin.length !== 4) { showToast('PIN harus 4 digit', 'error'); return; }
    const btn = $('btn-verify-pin');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> Memverifikasi...';
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
      const res = await fetch(GOOGLE_API_URL, {
        method: 'POST',
        body: JSON.stringify({ action: "verifyPin", pin: pin }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      const result = await res.json();
      if (result.status === 'success') {
        ADMIN_PIN = pin;
        window.closePinModal();
        window.openSettings();
        showToast('Verifikasi berhasil!', 'success');
      } else {
        throw new Error(result.message || 'PIN salah');
      }
    } catch (err) {
      console.warn('Verifikasi PIN gagal:', err);
      inputs.forEach(input => input.classList.add('error'));
      $('pin-error').classList.remove('hidden');
      showToast('PIN salah!', 'error');
      setTimeout(clearPinInputs, 1500);
    } finally {
      btn.disabled = false;
      btn.innerHTML = 'Verifikasi';
    }
  };

  window.changePin = async function() {
    const oldPin = $('set-oldPin').value;
    const newPin = $('set-newPin').value;
    const confirmPin = $('set-confirmPin').value;
    if (!oldPin || !newPin || !confirmPin) { showToast('Semua field harus diisi', 'error'); return; }
    if (newPin.length < 4 || !/^\d+$/.test(newPin)) { showToast('PIN baru harus 4 digit angka', 'error'); return; }
    if (newPin !== confirmPin) { showToast('Konfirmasi PIN tidak cocok', 'error'); return; }
    if (oldPin === newPin) { showToast('PIN baru tidak boleh sama dengan PIN lama', 'error'); return; }
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
      const res = await fetch(GOOGLE_API_URL, {
        method: 'POST',
        body: JSON.stringify({ action: "changePin", oldPin: oldPin, newPin: newPin }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      const result = await res.json();
      if (result.status === 'success') {
        ADMIN_PIN = newPin;
        $('set-oldPin').value = '';
        $('set-newPin').value = '';
        $('set-confirmPin').value = '';
        showToast('PIN berhasil diubah!', 'success');
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      showToast('Gagal ubah PIN: ' + err.message, 'error');
    }
  };

  // === FETCH CLOUD DATA ===
  async function fetchCloudData() {
    const statusEl = $('loader-status');
    if (statusEl) statusEl.innerHTML = 'Merajut kisah bahagia<span class="dot-loader"></span><span class="dot-loader"></span><span class="dot-loader"></span>';
    try {
      const response = await fetch(GOOGLE_API_URL);
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
  }

  // === FILE UPLOAD ===
  window.triggerUpload = function(fieldId, previewId, type) {
    pendingUploadField = fieldId;
    pendingUploadPreviewId = previewId || fieldId;
    pendingUploadType = type || 'image';
    const input = $('file-upload-input');
    if (pendingUploadType === 'audio') {
      input.setAttribute('accept', 'audio/*');
    } else {
      input.setAttribute('accept', 'image/*');
    }
    input.click();
  };

  $('file-upload-input').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file || !pendingUploadField) return;
    const maxSize = pendingUploadType === 'audio' ? 10 * 1024 * 1024 : 2 * 1024 * 1024;
    const maxLabel = pendingUploadType === 'audio' ? '10MB' : '2MB';
    if (file.size > maxSize) {
      showToast('Ukuran file terlalu besar (maks ' + maxLabel + ')', 'error');
      return;
    }
    showToast('Mengupload ' + file.name + ' ...', 'info');
    const reader = new FileReader();
    reader.onload = function(ev) {
      const base64 = ev.target.result;
      const payload = {
        action: 'upload',
        filename: file.name,
        fieldName: pendingUploadField,
        base64Data: base64
      };
      fetch(GOOGLE_API_URL, {
        method: 'POST',
        body: JSON.stringify(payload)
      })
        .then(r => r.json())
        .then(result => {
          if (result.status === 'success' && result.link) {
            const field = $(pendingUploadField);
            if (field) {
              field.value = result.link;
              updatePreview(pendingUploadPreviewId, result.link);
              showToast('Upload berhasil!', 'success');
              if (pendingUploadField.indexOf('set-galeri') === 0) {
                handleGalleryUpload(pendingUploadField, result.link);
              }
              if (pendingUploadType === 'audio') {
                const audio = $('bg-music');
                if (audio) {
                  audio.src = result.link;
                  audio.load();
                  audio.play()
                    .then(() => { audio.pause(); showToast('✅ Musik berhasil dimuat!', 'success'); })
                    .catch(err => console.warn('Test play gagal:', err));
                }
              }
            }
          } else {
            showToast('Upload gagal: ' + (result.message || 'Unknown error'), 'error');
          }
        })
        .catch(err => showToast('Upload gagal: ' + err.message, 'error'))
        .finally(() => {
          pendingUploadField = null;
          pendingUploadPreviewId = null;
          pendingUploadType = 'image';
          $('file-upload-input').value = '';
        });
    };
    reader.readAsDataURL(file);
  });

  function handleGalleryUpload(fieldId, url) {
    if (!ADMIN_PIN) {
      showToast('⚠️ Upload berhasil! Jangan lupa klik "Simpan Perubahan"', 'info');
      return;
    }
    showToast('Menyimpan foto ke cloud...', 'info');
    const galleryPayload = {};
    for (let i = 1; i <= currentGalleryCount; i++) {
      const el = $('set-galeri' + i);
      if (el && el.value) galleryPayload['galeri' + i] = el.value;
    }
    const payload = { action: "settings", adminPin: ADMIN_PIN, ...galleryPayload };
    fetch(GOOGLE_API_URL, { method: 'POST', body: JSON.stringify(payload) })
      .then(r => r.json())
      .then(result => {
        if (result.status === 'success') showToast('✅ Foto tersimpan!', 'success');
        else showToast('️ Upload berhasil tapi gagal auto-save', 'error');
      })
      .catch(err => showToast('⚠️ Upload berhasil tapi gagal auto-save. Klik "Simpan Perubahan" manual.', 'error'));
  }

  // === UPDATE PREVIEW ===
  function updatePreview(previewId, url) {
    const previewWrap = $('preview-' + previewId);
    if (previewWrap) {
      const img = previewWrap.querySelector('img');
      const noImg = previewWrap.querySelector('.no-image');
      if (img && url) {
        img.src = url;
        img.classList.remove('hidden');
        if (noImg) noImg.style.display = 'none';
      } else if (img) {
        img.classList.add('hidden');
        if (noImg) noImg.style.display = 'inline';
      }
    }
    if (previewId === 'fotoPria' && url) {
      const imgPria = $('val-fotoPria');
      if (imgPria) {
        imgPria.src = url;
        imgPria.style.display = 'block';
        const fb = imgPria.nextElementSibling;
        if (fb && fb.classList.contains('img-fallback')) fb.style.display = 'none';
      }
    }
    if (previewId === 'fotoWanita' && url) {
      const imgWanita = $('val-fotoWanita');
      if (imgWanita) {
        imgWanita.src = url;
        imgWanita.style.display = 'block';
        const fb = imgWanita.nextElementSibling;
        if (fb && fb.classList.contains('img-fallback')) fb.style.display = 'none';
      }
    }
    if (previewId === 'fotoSampul' && url) {
      ['val-fotoSampul', 'val-fotoSampul2', 'val-fotoSampul3'].forEach(id => {
        const el = $(id);
        if (el) el.style.backgroundImage = `url('${url}')`;
      });
    }
    if (previewId === 'story1Img' && url) {
      const img = $('val-story1-img');
      if (img) { img.src = url; img.style.display = 'block'; }
    }
    if (previewId === 'story2Img' && url) {
      const img = $('val-story2-img');
      if (img) { img.src = url; img.style.display = 'block'; }
    }
    if (previewId.indexOf('galeri') === 0 && url) {
      if (appData) appData[previewId] = url;
      galleryImages = [];
      for (let i = 1; i <= currentGalleryCount; i++) {
        const gUrl = (appData && appData['galeri' + i]) ? appData['galeri' + i] : '';
        if (gUrl) galleryImages.push(gUrl);
      }
      renderGallery();
    }
    if (decorFields.indexOf(previewId) !== -1 && url) {
      if (appData) appData[previewId] = url;
      if (previewId === 'backgroundImg') {
        document.querySelectorAll('.box-container').forEach(el => {
          el.style.backgroundImage = `url('${url}')`;
        });
      } else if (previewId === 'borderFrame') {
        ['border-frame-awal', 'border-frame-home', 'border-frame-footer'].forEach(id => {
          const el = $(id);
          if (el) el.src = url;
        });
      } else {
        const elId = decorMapping[previewId];
        if (elId) {
          const el = $(elId);
          if (el) el.src = url;
        }
      }
    }
    if (previewId === 'musicUrl' && url) {
      const audio = $('bg-music');
      if (audio) { audio.src = url; audio.load(); }
    }
    if (previewId.indexOf('banklogo-') === 0 && url) {
      const bankId = previewId.replace('banklogo-', '');
      const previewWrap = $('preview-banklogo-' + bankId);
      if (previewWrap) {
        previewWrap.innerHTML = '';
        const newImg = document.createElement('img');
        newImg.id = 'bank-logo-img-' + bankId;
        newImg.src = url;
        newImg.alt = 'logo';
        previewWrap.appendChild(newImg);
      }
      if (appData && appData.banks) {
        const bank = appData.banks.find(b => b.id === bankId);
        if (bank) bank.logo = url;
      }
    }
  }

  function refreshAllPreviews(data) {
    ['fotoSampul', 'fotoPria', 'fotoWanita', 'story1Img', 'story2Img'].forEach(f => updatePreview(f, data[f] || ''));
    for (let i = 1; i <= currentGalleryCount; i++) updatePreview('galeri' + i, data['galeri' + i] || '');
    decorFields.forEach(f => updatePreview(f, data[f] || ''));
    updatePreview('musicUrl', data.musicUrl || '');
  }

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
        logoHtml = `<div class="bank-logo-wrap"><img src="${escapeHtml(bank.logo)}" alt="${escapeHtml(bank.name)}" onerror="this.style.display='none';this.parentElement.innerHTML='<div class=\\'bank-logo-fallback\\'>🏦</div>';"></div>`;
      } else {
        logoHtml = '<div class="bank-logo-wrap"><div class="bank-logo-fallback">🏦</div></div>';
      }
      return `<div class="bank-card flex items-center justify-between" data-aos="reveal-${idx % 2 === 0 ? 'left' : 'right'}" data-aos-delay="${150 + idx * 100}">
        <div class="flex items-center flex-1 min-w-0">
          ${logoHtml}
          <div class="text-left flex-1 min-w-0">
            <h4 class="font-bold text-gray-800 text-sm">${escapeHtml(bank.name || 'Bank')}</h4>
            <p class="text-lg font-mono text-gray-700 my-1 tracking-wider">${escapeHtml(bank.rek || '')}</p>
            <p class="text-xs text-gray-400">a.n. <span>${escapeHtml(bank.an || '')}</span></p>
          </div>
        </div>
        <button onclick="copyRek('${escapeHtml(bank.rek || '')}', this)" class="bg-gold-ghost text-gold px-4 py-2.5 rounded-xl text-xs hover:bg-gold hover:text-white transition font-semibold whitespace-nowrap">
          <i class="fa-regular fa-copy mr-1"></i> Salin
        </button>
      </div>`;
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

  // === APPLY DATA TO HTML ===
  function applyDataToHTML(data) {
    appData = data;
    $$('.val-pria-nick').forEach(el => el.textContent = data.priaNick);
    $$('.val-wanita-nick').forEach(el => el.textContent = data.wanitaNick);
    if ($('val-pria-full')) $('val-pria-full').textContent = data.priaFull;
    if ($('val-wanita-full')) $('val-wanita-full').textContent = data.wanitaFull;
    if ($('val-pria-ortu')) $('val-pria-ortu').textContent = data.priaOrtu;
    if ($('val-wanita-ortu')) $('val-wanita-ortu').textContent = data.wanitaOrtu;
    if ($('val-pria-ig')) $('val-pria-ig').textContent = data.priaIg;
    if ($('val-wanita-ig')) $('val-wanita-ig').textContent = data.wanitaIg;
    if ($('val-pria-ig-link')) $('val-pria-ig-link').href = 'https://instagram.com/' + data.priaIg;
    if ($('val-wanita-ig-link')) $('val-wanita-ig-link').href = 'https://instagram.com/' + data.wanitaIg;

    ['val-fotoSampul', 'val-fotoSampul2', 'val-fotoSampul3'].forEach(id => {
      const el = $(id);
      if (el && data.fotoSampul) el.style.backgroundImage = `url('${data.fotoSampul}')`;
    });

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

    const audio = $('bg-music');
    if (data.musicUrl && audio.src !== data.musicUrl) {
      audio.src = data.musicUrl;
      audio.load();
    }

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

    const showVideo = data.showVideo !== false;
    const videoWrapper = $('video-section-wrapper');
    if (videoWrapper) videoWrapper.style.display = showVideo ? 'block' : 'none';
    if ($('val-videoYoutubeUrl')) $('val-videoYoutubeUrl').src = data.videoYoutubeUrl || '';

    if (data.backgroundImg) {
      document.querySelectorAll('.box-container').forEach(el => {
        el.style.backgroundImage = `url('${data.backgroundImg}')`;
      });
    }
    if (data.borderFrame) {
      ['border-frame-awal', 'border-frame-home', 'border-frame-footer'].forEach(id => {
        const el = $(id);
        if (el) el.src = data.borderFrame;
      });
    }
    decorFields.forEach(field => {
      if (field === 'backgroundImg' || field === 'borderFrame') return;
      const elId = decorMapping[field];
      if (elId && data[field]) {
        const el = $(elId);
        if (el) el.src = data[field];
      }
    });

    galleryImages = [];
    for (let i = 1; i <= currentGalleryCount; i++) {
      const url = data['galeri' + i] || '';
      if (url) galleryImages.push(url);
    }
    renderGallery();
    renderBankList();

    rsvpList = data.bukuTamu || [];
    renderRsvpList();

    document.title = 'Undangan ' + (data.priaNick || '') + ' & ' + (data.wanitaNick || '');
    startCountdown(normalizeDateString(data.countdownTarget));
    refreshAllPreviews(data);
    populateSettingsForm(data);

    if (data.chapters) {
      currentChapters = data.chapters;
      applyChapterVisibility();
    }
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
      p.style.animation = `petal-fall ${3 + Math.random() * 4}s linear ${Math.random() * 2}s forwards`;
      document.body.appendChild(p);
      (el => setTimeout(() => el.remove(), 8000))(p);
    }
  }

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
      return `<div class="bg-gray-50 rounded-xl p-4 border border-gray-100" style="${i === 0 ? 'animation:fadeSlideIn 0.4s ease' : ''}">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-gold text-white flex items-center justify-center text-xs font-bold">${escapeHtml(nama[0].toUpperCase())}</div>
            <span class="font-semibold text-sm text-gray-800">${escapeHtml(nama)}</span>
          </div>
          <span class="text-[10px] px-2 py-0.5 rounded-full font-semibold ${kehadiran === 'Hadir' ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}">${escapeHtml(kehadiran)}</span>
        </div>
        <p class="text-sm text-gray-600 leading-relaxed pl-10">${escapeHtml(ucapan)}</p>
        ${tanggal ? `<p class="text-[10px] text-gray-400 pl-10 mt-1.5">${escapeHtml(tanggal)}</p>` : ''}
      </div>`;
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

  // === SETTINGS ===
  function populateSettingsForm(data) {
    const fields = ['priaNick', 'priaFull', 'priaOrtu', 'priaIg', 'wanitaNick', 'wanitaFull', 'wanitaOrtu', 'wanitaIg', 'fotoSampul', 'fotoPria', 'fotoWanita', 'countdownTarget', 'musicUrl', 'akadDate', 'akadTime', 'akadLokasi', 'akadMapUrl', 'resepsiDate', 'resepsiTime', 'resepsiLokasi', 'resepsiMapUrl', 'dinnerDate', 'dinnerTime', 'dinnerLokasi', 'dinnerMapUrl', 'mapIframeUrl', 'story1Title', 'story1Desc', 'story1Img', 'story2Title', 'story2Desc', 'story2Img', 'videoYoutubeUrl'];
    fields.forEach(f => {
      const el = $('set-' + f);
      if (el && data[f] !== undefined) el.value = data[f];
    });
    decorFields.forEach(f => {
      const el = $('set-' + f);
      if (el && data[f] !== undefined) el.value = data[f];
    });
    for (let i = 1; i <= currentGalleryCount; i++) {
      const el = $('set-galeri' + i);
      if (el && data['galeri' + i]) el.value = data['galeri' + i];
    }
    const showVideoEl = $('set-showVideo');
    if (showVideoEl) showVideoEl.checked = data.showVideo !== false;
    renderBankSettings();
    updateSyncBadge(dataSource);
    refreshAllPreviews(data);
    buildDecorGrids(data);
    currentChapters = data.chapters ? data.chapters : JSON.parse(JSON.stringify(defaultData.chapters));
    renderChaptersList();
  }

  function buildDecorGrids(data) {
    const sections = {
      'decor-home-grid': ['ornamentHomeTL', 'ornamentHomeTR', 'ornamentHomeBL', 'ornamentHomeBR'],
      'decor-couple-grid': ['ornamentCoupleTL', 'ornamentCoupleTR'],
      'decor-event-grid': ['ornamentEventTL', 'ornamentEventTR'],
      'decor-footer-grid': ['ornamentFooterTL', 'ornamentFooterTR', 'ornamentFooterBL', 'ornamentFooterBR'],
      'decor-loader-grid': ['loaderOrnamentTL', 'loaderOrnamentTR', 'loaderOrnamentBL', 'loaderOrnamentBR']
    };
    for (const gridId in sections) {
      const grid = $(gridId);
      if (!grid) continue;
      grid.innerHTML = '';
      sections[gridId].forEach(field => {
        const label = decorLabels[field] || field;
        const url = (data && data[field]) ? data[field] : '';
        const item = document.createElement('div');
        item.className = 'decor-item';
        item.innerHTML = `
          <div class="decor-preview" id="preview-${field}">
            <img src="${escapeHtml(url)}" alt="preview" ${url ? '' : 'style="display:none;"'}>
            <span class="no-image" ${url ? 'style="display:none;"' : ''}><i class="fa-regular fa-image"></i></span>
          </div>
          <div class="decor-info">
            <div class="decor-label">${label}</div>
            <input type="text" id="set-${field}" value="${escapeHtml(url)}" class="w-full px-2 py-1 border border-gray-200 rounded text-[10px] outline-none focus:border-gold-light" placeholder="URL">
          </div>
          <button type="button" onclick="triggerUpload('set-${field}', '${field}')" class="decor-btn" title="Upload"><i class="fa-solid fa-upload"></i></button>
        `;
        grid.appendChild(item);
      });
    }
  }

  window.resetDecorToDefault = function() {
    if (!confirm('Reset semua dekorasi ke default?')) return;
    decorFields.forEach(f => {
      if (defaultData[f]) {
        const el = $('set-' + f);
        if (el) el.value = defaultData[f];
        if (appData) appData[f] = defaultData[f];
        updatePreview(f, defaultData[f]);
      }
    });
    buildDecorGrids(appData);
    showToast('Dekorasi direset ke default', 'success');
  };

  // === SETTINGS MODAL ===
  window.openSettings = function() {
    if (!appData) return;
    populateSettingsForm(appData);
    renderGuestHistory();
    $('settings-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeSettings = function() {
    $('settings-modal').classList.remove('active');
    document.body.style.overflow = '';
  };

  window.saveSettings = function() {
    if (!ADMIN_PIN) {
      showToast('Sesi admin expired. Silakan login ulang.', 'error');
      window.closeSettings();
      setTimeout(window.openPinModal, 300);
      return;
    }
    const btn = $('btn-save-settings');
    const statusEl = $('save-status');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> Menyimpan...';
    const fields = ['priaNick', 'priaFull', 'priaOrtu', 'priaIg', 'wanitaNick', 'wanitaFull', 'wanitaOrtu', 'wanitaIg', 'fotoSampul', 'fotoPria', 'fotoWanita', 'countdownTarget', 'musicUrl', 'akadDate', 'akadTime', 'akadLokasi', 'akadMapUrl', 'resepsiDate', 'resepsiTime', 'resepsiLokasi', 'resepsiMapUrl', 'dinnerDate', 'dinnerTime', 'dinnerLokasi', 'dinnerMapUrl', 'mapIframeUrl', 'story1Title', 'story1Desc', 'story1Img', 'story2Title', 'story2Desc', 'story2Img', 'videoYoutubeUrl'];
    const payload = { action: "settings", adminPin: ADMIN_PIN };
    fields.forEach(f => {
      const el = $('set-' + f);
      if (el && el.value) payload[f] = el.value;
    });
    decorFields.forEach(f => {
      const el = $('set-' + f);
      if (el && el.value) payload[f] = el.value;
    });
    for (let i = 1; i <= currentGalleryCount; i++) {
      const el = $('set-galeri' + i);
      if (el && el.value) payload['galeri' + i] = el.value;
    }
    const showVideoEl = $('set-showVideo');
    payload.showVideo = showVideoEl ? showVideoEl.checked : true;
    payload.banks = collectBankSettings();
    payload.chapters = currentChapters;

    const newData = Object.assign({}, appData, payload);
    newData.banks = payload.banks;
    newData.bukuTamu = rsvpList;
    newData.chapters = currentChapters;
    applyDataToHTML(newData);

    try { localStorage.setItem('undanganData_v2', JSON.stringify(newData)); } catch (e) {}

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
    fetch(GOOGLE_API_URL, {
      method: 'POST',
      body: JSON.stringify(payload),
      signal: controller.signal
    })
      .then(r => { clearTimeout(timeoutId); return r.json(); })
      .then(result => {
        if (result.status === 'success') {
          dataSource = 'cloud';
          updateSyncBadge('cloud');
          if (statusEl) statusEl.textContent = 'Tersinkron ke Cloud!';
          showToast('Data tersimpan!', 'success');
        } else {
          throw new Error(result.message);
        }
      })
      .catch(err => {
        dataSource = 'local';
        updateSyncBadge('local');
        if (statusEl) statusEl.textContent = 'Tersimpan Lokal';
        showToast('Lokal saja: ' + err.message, 'info');
      })
      .finally(() => {
        setTimeout(() => { if (statusEl) statusEl.textContent = ''; }, 3000);
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up mr-1"></i> Simpan Perubahan';
      });
  };

  window.refreshFromCloud = function() {
    const btn = $('btn-refresh-cloud');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengambil...';
    fetchCloudData().then(cloudData => {
      if (cloudData) {
        const merged = JSON.parse(JSON.stringify(defaultData));
        for (const key in cloudData) {
          if (key !== 'bukuTamu' && key !== 'banks') merged[key] = cloudData[key];
        }
        if (cloudData.banks && Array.isArray(cloudData.banks)) merged.banks = cloudData.banks;
        merged.bukuTamu = cloudData.bukuTamu || [];
        if (cloudData.showVideo !== undefined) merged.showVideo = cloudData.showVideo;
        if (cloudData.chapters) merged.chapters = cloudData.chapters;
        applyDataToHTML(merged);
        try { localStorage.setItem('undanganData_v2', JSON.stringify(merged)); } catch (e) {}
        dataSource = 'cloud';
        updateSyncBadge('cloud');
        showToast('Data dari cloud!', 'success');
      } else {
        showToast('Menggunakan data default', 'info');
      }
    }).finally(() => {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-cloud-arrow-down"></i> Tarik dari Cloud';
    });
  };

  // === BANK SETTINGS ===
  function renderBankSettings() {
    const container = $('bank-settings-container');
    if (!container) return;
    let banks = (appData && appData.banks) ? appData.banks : [];
    if (!banks.length) {
      banks = [
        { id: 'b1', name: 'BCA', rek: '12345678', an: 'Luvinta', visible: true, logo: '' },
        { id: 'b2', name: 'BNI', rek: '0982309823', an: 'Fatrus', visible: true, logo: '' }
      ];
      appData.banks = banks;
    }
    banks.forEach(b => {
      if (b.id && b.id.startsWith('b')) {
        const num = parseInt(b.id.replace('b', ''));
        if (num >= bankIdCounter) bankIdCounter = num + 1;
      }
    });
    container.innerHTML = banks.map(bank => {
      const checked = bank.visible !== false ? 'checked' : '';
      const logoUrl = bank.logo || '';
      return `
        <div class="bank-entry" data-bank-id="${bank.id}">
          <button type="button" class="remove-bank-btn" onclick="removeBankSetting('${bank.id}')" title="Hapus"><i class="fa-solid fa-trash-can"></i></button>
          <div class="grid grid-cols-1 sm:grid-cols-4 gap-2">
            <div><label class="text-[10px] text-gray-400">Nama Bank</label><input type="text" class="bank-field-name w-full px-2 py-1.5 border border-gray-200 rounded-lg outline-none text-xs focus:border-gold-light" value="${escapeHtml(bank.name || '')}" placeholder="BCA"></div>
            <div><label class="text-[10px] text-gray-400">No. Rekening</label><input type="text" class="bank-field-rek w-full px-2 py-1.5 border border-gray-200 rounded-lg outline-none text-xs focus:border-gold-light" value="${escapeHtml(bank.rek || '')}" placeholder="12345678"></div>
            <div><label class="text-[10px] text-gray-400">Atas Nama</label><input type="text" class="bank-field-an w-full px-2 py-1.5 border border-gray-200 rounded-lg outline-none text-xs focus:border-gold-light" value="${escapeHtml(bank.an || '')}" placeholder="Nama"></div>
            <div class="flex items-center justify-start sm:justify-end gap-2 pt-1"><label class="bank-visibility-toggle text-xs"><input type="checkbox" class="bank-field-visible" ${checked}> Tampilkan</label></div>
          </div>
          <div class="bank-logo-input-wrap">
            <div class="bank-logo-preview" id="preview-banklogo-${bank.id}">
              ${logoUrl ? `<img id="bank-logo-img-${bank.id}" src="${escapeHtml(logoUrl)}" alt="logo">` : `<span id="bank-logo-noimg-${bank.id}" class="no-logo"><i class="fa-regular fa-image"></i></span>`}
            </div>
            <div class="bank-logo-field">
              <label class="text-[10px] text-gray-400 font-semibold">️ Logo Bank (PNG)</label>
              <input type="text" id="set-banklogo-${bank.id}" class="bank-field-logo w-full px-2 py-1 border border-gray-200 rounded outline-none text-[10px] focus:border-gold-light mt-1" value="${escapeHtml(logoUrl)}" placeholder="URL logo bank">
            </div>
            <button type="button" class="bank-logo-upload-btn" onclick="triggerUpload('set-banklogo-${bank.id}', 'banklogo-${bank.id}')" title="Upload Logo"><i class="fa-solid fa-upload"></i></button>
          </div>
        </div>
      `;
    }).join('');
  }

  window.addBankSetting = function() {
    if (!appData) return;
    if (!appData.banks) appData.banks = [];
    const newId = 'b' + bankIdCounter++;
    appData.banks.push({ id: newId, name: '', rek: '', an: '', visible: true, logo: '' });
    renderBankSettings();
    showToast('Rekening baru ditambahkan', 'success');
  };

  window.removeBankSetting = function(id) {
    if (!appData || !appData.banks) return;
    if (appData.banks.length <= 1) { showToast('Minimal 1 rekening', 'error'); return; }
    appData.banks = appData.banks.filter(b => b.id !== id);
    renderBankSettings();
    showToast('Rekening dihapus', 'info');
  };

  function collectBankSettings() {
    const container = $('bank-settings-container');
    if (!container) return [];
    const entries = container.querySelectorAll('.bank-entry');
    const result = [];
    entries.forEach(entry => {
      const id = entry.dataset.bankId || 'b' + bankIdCounter++;
      const name = entry.querySelector('.bank-field-name')?.value || '';
      const rek = entry.querySelector('.bank-field-rek')?.value || '';
      const an = entry.querySelector('.bank-field-an')?.value || '';
      const visible = entry.querySelector('.bank-field-visible')?.checked !== false;
      const logoInput = entry.querySelector('.bank-field-logo');
      const logo = logoInput ? logoInput.value : '';
      result.push({ id, name, rek, an, visible, logo });
    });
    return result;
  }

  // === GALLERY SLOTS ===
  function buildGalleryUrlFields() {
    const grid = $('gallery-url-grid');
    if (!grid) return;
    grid.innerHTML = '';
    const count = currentGalleryCount || GALLERY_COUNT;
    for (let i = 1; i <= count; i++) {
      const div = document.createElement('div');
      div.id = 'gallery-slot-' + i;
      div.className = 'space-y-1 bg-gray-50 p-2 rounded-lg border border-gray-100';
      div.innerHTML = `
        <label class="text-[11px] text-gray-500 font-semibold">Galeri ${i}</label>
        <div class="photo-upload-row">
          <div class="preview-wrap" id="preview-galeri${i}">
            <img src="" alt="preview" class="hidden" id="preview-img-galeri${i}">
            <span class="no-image" id="noimg-galeri${i}"><i class="fa-regular fa-image"></i></span>
          </div>
          <div class="field-group flex gap-2">
            <input type="text" id="set-galeri${i}" class="flex-1 px-2.5 py-1.5 border border-gray-200 rounded-lg outline-none text-xs focus:border-gold-light" placeholder="URL gambar">
            <button type="button" onclick="triggerUpload('set-galeri${i}', 'galeri${i}')" class="bg-gold text-white px-3 py-1.5 rounded-lg text-xs hover:bg-gold-mid transition whitespace-nowrap"><i class="fa-solid fa-upload mr-1"></i> Upload</button>
          </div>
        </div>
      `;
      grid.appendChild(div);
    }
    if ($('gallery-slot-count')) $('gallery-slot-count').textContent = count;
  }

  window.addGallerySlot = function() {
    if (currentGalleryCount >= 20) { showToast('Maksimal 20 foto galeri', 'error'); return; }
    currentGalleryCount++;
    const grid = $('gallery-url-grid');
    const newIndex = currentGalleryCount;
    const div = document.createElement('div');
    div.className = 'space-y-1 bg-gray-50 p-2 rounded-lg border border-gray-100';
    div.id = 'gallery-slot-' + newIndex;
    div.innerHTML = `
      <label class="text-[11px] text-gray-500 font-semibold">Galeri ${newIndex}</label>
      <div class="photo-upload-row">
        <div class="preview-wrap" id="preview-galeri${newIndex}">
          <img src="" alt="preview" class="hidden" id="preview-img-galeri${newIndex}">
          <span class="no-image" id="noimg-galeri${newIndex}"><i class="fa-regular fa-image"></i></span>
        </div>
        <div class="field-group flex gap-2">
          <input type="text" id="set-galeri${newIndex}" class="flex-1 px-2.5 py-1.5 border border-gray-200 rounded-lg outline-none text-xs focus:border-gold-light" placeholder="URL gambar">
          <button type="button" onclick="triggerUpload('set-galeri${newIndex}', 'galeri${newIndex}')" class="bg-gold text-white px-3 py-1.5 rounded-lg text-xs hover:bg-gold-mid transition whitespace-nowrap"><i class="fa-solid fa-upload mr-1"></i> Upload</button>
        </div>
      </div>
    `;
    grid.appendChild(div);
    if ($('gallery-slot-count')) $('gallery-slot-count').textContent = currentGalleryCount;
    showToast('Slot galeri ditambahkan', 'success');
  };

  window.removeGallerySlot = function() {
    if (currentGalleryCount <= 6) { showToast('Minimal 6 slot galeri', 'error'); return; }
    const slot = $('gallery-slot-' + currentGalleryCount);
    if (slot) {
      slot.remove();
      currentGalleryCount--;
      if ($('gallery-slot-count')) $('gallery-slot-count').textContent = currentGalleryCount;
      showToast('Slot galeri dihapus', 'info');
    }
  };

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

  // === GUEST LINK GENERATOR ===
  window.generateGuestLink = function() {
    const nameInput = $('guest-name-input');
    const name = nameInput.value.trim();
    if (!name) { showToast('Masukkan nama tamu', 'error'); return; }
    const encodedName = encodeURIComponent(name).replace(/%20/g, '+');
    const baseUrl = window.location.origin + window.location.pathname;
    const fullLink = baseUrl + '?kpd=' + encodedName;
    $('generated-link-output').value = fullLink;
    $('generated-link-box').classList.remove('hidden');
    let history = JSON.parse(localStorage.getItem('guestLinkHistory') || '[]');
    history.unshift({ name, link: fullLink, date: new Date().toLocaleString('id-ID') });
    if (history.length > 50) history = history.slice(0, 50);
    localStorage.setItem('guestLinkHistory', JSON.stringify(history));
    renderGuestHistory();
    nameInput.value = '';
    showToast('Link berhasil dibuat!', 'success');
  };

  window.copyGeneratedLink = function() {
    const link = $('generated-link-output').value;
    navigator.clipboard.writeText(link)
      .then(() => showToast('Link disalin ke clipboard!', 'success'))
      .catch(() => showToast('Gagal menyalin', 'error'));
  };

  window.shareViaWhatsApp = function() {
    const link = $('generated-link-output').value;
    const message = `Assalamu'alaikum,\nKami mengundang Anda untuk hadir di acara pernikahan kami.\nSilakan klik link berikut untuk membuka undangan:\n${link}\nMerupakan suatu kehormatan apabila Anda berkenan hadir.\nWassalamu'alaikum Wr. Wb.`;
    const waUrl = 'https://wa.me/?text=' + encodeURIComponent(message);
    window.open(waUrl, '_blank');
  };

  function renderGuestHistory() {
    const container = $('guest-link-history');
    if (!container) return;
    const history = JSON.parse(localStorage.getItem('guestLinkHistory') || '[]');
    if (!history.length) {
      container.innerHTML = '<p class="text-xs text-gray-400 italic text-center py-2">Belum ada link yang dibuat</p>';
      return;
    }
    container.innerHTML = history.map((item, i) => `
      <div class="bg-white border border-gray-200 rounded-lg p-2 flex items-center gap-2 hover:border-gold-pale transition">
        <div class="flex-1 min-w-0">
          <p class="text-xs font-semibold text-gray-800 truncate">${escapeHtml(item.name)}</p>
          <p class="text-[10px] text-gray-400 truncate font-mono">${escapeHtml(item.link)}</p>
        </div>
        <button onclick="copyLinkFromHistory(${i})" class="text-gold hover:text-gold-mid transition p-1" title="Salin"><i class="fa-regular fa-copy text-sm"></i></button>
      </div>
    `).join('');
  }

  window.copyLinkFromHistory = function(index) {
    const history = JSON.parse(localStorage.getItem('guestLinkHistory') || '[]');
    if (history[index]) {
      navigator.clipboard.writeText(history[index].link)
        .then(() => showToast('Link untuk ' + history[index].name + ' disalin!', 'success'));
    }
  };

  window.clearGuestHistory = function() {
    if (confirm('Hapus semua riwayat link tamu?')) {
      localStorage.removeItem('guestLinkHistory');
      renderGuestHistory();
      showToast('Riwayat dihapus', 'info');
    }
  };

  // === CHAPTERS ===
  function renderChaptersList() {
    const container = $('chapters-list');
    if (!container) return;
    const chapters = currentChapters || {};
    let html = '';
    for (const key in chapters) {
      const chapter = chapters[key];
      const isActive = chapter.active !== false;
      html += `
        <div class="chapter-item ${isActive ? '' : 'disabled'}" data-chapter="${key}">
          <div class="chapter-info">
            <div class="chapter-name">${escapeHtml(chapter.label)}</div>
            <div class="chapter-desc">Section ID: <code class="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded">${key}</code></div>
          </div>
          <span class="chapter-status ${isActive ? 'active' : 'inactive'}">${isActive ? 'Aktif' : 'Nonaktif'}</span>
          <label class="toggle-switch">
            <input type="checkbox" ${isActive ? 'checked' : ''} onchange="toggleChapter('${key}', this.checked)">
            <span class="toggle-slider"></span>
          </label>
        </div>
      `;
    }
    container.innerHTML = html;
  }

  window.toggleChapter = function(chapterId, isActive) {
    if (currentChapters[chapterId]) {
      currentChapters[chapterId].active = isActive;
      renderChaptersList();
      applyChapterVisibility();
      showToast('Chapter ' + currentChapters[chapterId].label + ' ' + (isActive ? 'diaktifkan' : 'dinonaktifkan'), 'info');
    }
  };

  window.toggleAllChapters = function(active) {
    for (const key in currentChapters) currentChapters[key].active = active;
    renderChaptersList();
    applyChapterVisibility();
    showToast('Semua chapter ' + (active ? 'diaktifkan' : 'dinonaktifkan'), 'info');
  };

  window.resetChaptersToDefault = function() {
    if (confirm('Reset semua chapter ke pengaturan default?')) {
      currentChapters = JSON.parse(JSON.stringify(defaultData.chapters));
      renderChaptersList();
      applyChapterVisibility();
      showToast('Chapter direset ke default', 'success');
    }
  };

  function applyChapterVisibility() {
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
    for (const chapterId in currentChapters) {
      const chapter = currentChapters[chapterId];
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

  // === SETTINGS TAB ===
  window.switchSettingsTab = function(tabName) {
    const tabs = document.querySelectorAll('.settings-tab-content');
    tabs.forEach(tab => tab.classList.add('hidden'));
    const selectedTab = $('tab-' + tabName);
    if (selectedTab) selectedTab.classList.remove('hidden');
    const buttons = document.querySelectorAll('.settings-tab-btn');
    buttons.forEach(btn => {
      if (btn.dataset.tab === tabName) {
        btn.classList.remove('text-gray-600', 'hover:bg-gray-100');
        btn.classList.add('bg-gold', 'text-white');
      } else {
        btn.classList.add('text-gray-600', 'hover:bg-gray-100');
        btn.classList.remove('bg-gold', 'text-white');
      }
    });
    if (window.innerWidth <= 768) {
      const body = $('settings-body');
      const overlay = document.querySelector('.settings-overlay');
      body.classList.remove('sidebar-active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  window.toggleSettingsMenu = function() {
    const body = $('settings-body');
    const overlay = document.querySelector('.settings-overlay');
    if (body.classList.contains('sidebar-active')) {
      body.classList.remove('sidebar-active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    } else {
      body.classList.add('sidebar-active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
      e.preventDefault();
      window.openPinModal();
    }
  });

  // === INIT ===
  async function init() {
    startLoaderTyping();
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('kpd') || "Bapak/Ibu/Saudara/i";
    if ($('nama-tamu')) $('nama-tamu').innerText = guestName;
    if ($('rsvp-name') && guestName !== "Bapak/Ibu/Saudara/i") $('rsvp-name').value = guestName;

    try {
      const savedCount = localStorage.getItem('gallerySlotCount');
      if (savedCount) {
        const parsed = parseInt(savedCount);
        if (parsed >= 6 && parsed <= 20) currentGalleryCount = parsed;
      }
    } catch (e) {}

    buildGalleryUrlFields();

    let data = await fetchCloudData();
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
        } else data = null;
      } catch (e) { data = null; }
    }

    if (!data) {
      data = JSON.parse(JSON.stringify(defaultData));
      dataSource = 'default';
    }

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
