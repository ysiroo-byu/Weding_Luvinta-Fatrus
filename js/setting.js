/* ========================================
   SETTING.JS - Panel Admin Undangan
   ======================================== */
(function() {
  'use strict';

  // === KONFIGURASI ===
  const GOOGLE_API_URL = "https://script.google.com/macros/s/AKfycbxHZX63O8l14Ksa91PIGhdkjIMsLoPodVdmV_3C9ZU0WkSEDmhaoV_lCQj4cm6R9d1g/exec";
  const GALLERY_COUNT = 6;
  const FETCH_TIMEOUT = 15000;

  // === STATE ===
  let ADMIN_PIN = null;
  let appData = null;
  let dataSource = 'default';
  let currentChapters = {};
  let currentGalleryCount = 6;
  let bankIdCounter = 3;
  let pendingUploadField = null;
  let pendingUploadPreviewId = null;
  let pendingUploadType = 'image';
  let rsvpList = [];
  let galleryImages = [];

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

  // === TOAST ===
  function showToast(msg, type = 'info') {
    const c = $('toast-container');
    if (!c) return;
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

  // === FETCH CLOUD DATA ===
  // ✅ Didefinisikan di window scope agar accessible global
  window.fetchCloudData = async function() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
      const response = await fetch(GOOGLE_API_URL, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const data = await response.json();
      if (data.status === "error") throw new Error(data.message);
      return data;
    } catch (err) {
      console.warn('Fetch cloud gagal:', err.message);
      return null;
    }
  };

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
    updatePreview('musicUrl', data.musicUrl || '');
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

  // === DECOR GRIDS ===
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
    try { localStorage.setItem('gallerySlotCount', String(currentGalleryCount)); } catch (e) {}
    showToast('Slot galeri ditambahkan', 'success');
  };

  window.removeGallerySlot = function() {
    if (currentGalleryCount <= 6) { showToast('Minimal 6 slot galeri', 'error'); return; }
    const slot = $('gallery-slot-' + currentGalleryCount);
    if (slot) {
      slot.remove();
      currentGalleryCount--;
      if ($('gallery-slot-count')) $('gallery-slot-count').textContent = currentGalleryCount;
      try { localStorage.setItem('gallerySlotCount', String(currentGalleryCount)); } catch (e) {}
      showToast('Slot galeri dihapus', 'info');
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
      showToast('Chapter ' + currentChapters[chapterId].label + ' ' + (isActive ? 'diaktifkan' : 'dinonaktifkan'), 'info');
    }
  };

  window.toggleAllChapters = function(active) {
    for (const key in currentChapters) currentChapters[key].active = active;
    renderChaptersList();
    showToast('Semua chapter ' + (active ? 'diaktifkan' : 'dinonaktifkan'), 'info');
  };

  window.resetChaptersToDefault = function() {
    if (confirm('Reset semua chapter ke pengaturan default?')) {
      currentChapters = JSON.parse(JSON.stringify(defaultData.chapters));
      renderChaptersList();
      showToast('Chapter direset ke default', 'success');
    }
  };

  // === POPULATE FORM ===
  function populateSettingsForm(data) {
    appData = data;
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
    renderGuestHistory();
  }

  // === SAVE SETTINGS ===
  window.saveSettings = function() {
    const btn = $('btn-save-settings') || $('btn-save-settings-2');
    const statusEl = $('save-status');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> Menyimpan...';
    }
    const fields = ['priaNick', 'priaFull', 'priaOrtu', 'priaIg', 'wanitaNick', 'wanitaFull', 'wanitaOrtu', 'wanitaIg', 'fotoSampul', 'fotoPria', 'fotoWanita', 'countdownTarget', 'musicUrl', 'akadDate', 'akadTime', 'akadLokasi', 'akadMapUrl', 'resepsiDate', 'resepsiTime', 'resepsiLokasi', 'resepsiMapUrl', 'dinnerDate', 'dinnerTime', 'dinnerLokasi', 'dinnerMapUrl', 'mapIframeUrl', 'story1Title', 'story1Desc', 'story1Img', 'story2Title', 'story2Desc', 'story2Img', 'videoYoutubeUrl'];
    const payload = { action: "settings" };
    if (ADMIN_PIN) payload.adminPin = ADMIN_PIN;
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
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up mr-1"></i> Simpan Perubahan';
        }
      });
  };

  // === REFRESH FROM CLOUD ===
  window.refreshFromCloud = function() {
    const btn = $('btn-refresh-cloud') || $('btn-refresh-cloud-2');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengambil...';
    }
    window.fetchCloudData().then(cloudData => {
      if (cloudData) {
        const merged = JSON.parse(JSON.stringify(defaultData));
        for (const key in cloudData) {
          if (key !== 'bukuTamu' && key !== 'banks') merged[key] = cloudData[key];
        }
        if (cloudData.banks && Array.isArray(cloudData.banks)) merged.banks = cloudData.banks;
        merged.bukuTamu = cloudData.bukuTamu || [];
        if (cloudData.showVideo !== undefined) merged.showVideo = cloudData.showVideo;
        if (cloudData.chapters) merged.chapters = cloudData.chapters;
        populateSettingsForm(merged);
        try { localStorage.setItem('undanganData_v2', JSON.stringify(merged)); } catch (e) {}
        dataSource = 'cloud';
        updateSyncBadge('cloud');
        showToast('Data dari cloud!', 'success');
      } else {
        showToast('Menggunakan data default', 'info');
      }
    }).finally(() => {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-cloud-arrow-down"></i> Tarik dari Cloud';
      }
    });
  };

  // === PIN CHANGE ===
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

  // === GUEST LINK GENERATOR ===
  window.generateGuestLink = function() {
    const nameInput = $('guest-name-input');
    const name = nameInput.value.trim();
    if (!name) { showToast('Masukkan nama tamu', 'error'); return; }
    const encodedName = encodeURIComponent(name).replace(/%20/g, '+');
    const baseUrl = window.location.origin + '/index.html';
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

  // === TAB SWITCHING ===
  window.switchTab = function(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.add('hidden'));
    const selectedTab = $('tab-' + tabName);
    if (selectedTab) selectedTab.classList.remove('hidden');
    const buttons = document.querySelectorAll('.sidebar-btn');
    buttons.forEach(btn => {
      if (btn.dataset.tab === tabName) {
        btn.classList.add('active');
        btn.classList.remove('text-gray-600');
      } else {
        btn.classList.remove('active');
        btn.classList.add('text-gray-600');
      }
    });
    const titles = {
      'chapters': 'Pengaturan Chapter',
      'couple': 'Data Mempelai',
      'design': 'Desain & Dekorasi',
      'events': 'Jadwal Acara',
      'content': 'Konten & Galeri',
      'banks': 'Rekening Bank',
      'security': 'Keamanan',
      'tools': 'Tools & Sinkronisasi'
    };
    const titleEl = $('page-title');
    if (titleEl) titleEl.textContent = titles[tabName] || 'Pengaturan';
  };

  // === INIT ===
  async function init() {
    // Load gallery count from localStorage
    try {
      const savedCount = localStorage.getItem('gallerySlotCount');
      if (savedCount) {
        const parsed = parseInt(savedCount);
        if (parsed >= 6 && parsed <= 20) currentGalleryCount = parsed;
      }
    } catch (e) {}

    buildGalleryUrlFields();

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

    for (let i = 20; i >= 6; i--) {
      if (data['galeri' + i]) {
        currentGalleryCount = i;
        try { localStorage.setItem('gallerySlotCount', String(currentGalleryCount)); } catch (e) {}
        break;
      }
    }

    populateSettingsForm(data);

    // Set default tab
    switchTab('chapters');

    showToast('✅ Panel Admin siap!', 'success');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
