// Di bagian init() pada setting.js
async function init() {
  // Load data dari localStorage atau cloud
  var data = await fetchCloudData();
  if (data && Object.keys(data).length > 2) {
    var merged = JSON.parse(JSON.stringify(defaultData));
    for (var key in data) { if (key !== 'bukuTamu' && key !== 'banks' && key !== 'chapters') merged[key] = data[key]; }
    if (data.banks && Array.isArray(data.banks)) merged.banks = data.banks;
    merged.bukuTamu = data.bukuTamu || [];
    if (data.showVideo !== undefined) merged.showVideo = data.showVideo;
    if (data.chapters) merged.chapters = data.chapters;
    data = merged;
    dataSource = 'cloud';
  } else {
    try { var localStr = localStorage.getItem('undanganData_v2'); if (localStr) { data = JSON.parse(localStr); dataSource = 'local'; } else { data = null; } } catch (e) { data = null; }
  }
  if (!data) { data = JSON.parse(JSON.stringify(defaultData)); dataSource = 'default'; }
  
  applyDataToHTML(data);
  if (dataSource === 'cloud' || dataSource === 'default') { try { localStorage.setItem('undanganData_v2', JSON.stringify(data)); } catch (e) {} }
  
  // Tampilkan tab pertama
  switchTab('chapters');
  showToast('Panel Admin siap!', 'success');
}

// Function untuk switch tab
window.switchTab = function(tabName) {
  var tabs = document.querySelectorAll('.tab-content');
  tabs.forEach(function(tab) { tab.classList.add('hidden'); });
  var selectedTab = document.getElementById('tab-' + tabName);
  if (selectedTab) selectedTab.classList.remove('hidden');
  
  var buttons = document.querySelectorAll('.sidebar-btn');
  buttons.forEach(function(btn) {
    if (btn.dataset.tab === tabName) { 
      btn.classList.add('active'); 
      btn.classList.remove('text-gray-600');
    } else { 
      btn.classList.remove('active'); 
      btn.classList.add('text-gray-600');
    }
  });
  
  // Update title
  var titles = {
    'chapters': 'Pengaturan Chapter',
    'couple': 'Data Mempelai',
    'design': 'Desain & Dekorasi',
    'events': 'Jadwal Acara',
    'content': 'Konten & Galeri',
    'banks': 'Rekening Bank',
    'tools': 'Tools & Sinkronisasi'
  };
  document.getElementById('page-title').textContent = titles[tabName] || 'Pengaturan';
};

if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
