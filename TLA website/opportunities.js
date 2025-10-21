// opportunities.js - Filtering and search functionality

const FILTER_OPTIONS = {
  subjects: ['all', 'science', 'math', 'biology', 'physics', 'chemistry', 'engineering', 'cs', 'robotics', 'innovation', 'english'],
  types: ['all', 'competition', 'program', 'platform', 'publisher', 'repository'],
  availability: ['all', 'available', 'unavailable']
};

const activeFilters = { subject: 'all', type: 'all', available: 'all', search: '' };

// Populate select dropdowns
function populateSelect(id, options) {
  const sel = document.getElementById(id);
  if (!sel) return;
  sel.innerHTML = '';
  options.forEach(opt => {
    const el = document.createElement('option');
    el.value = opt;
    el.textContent = opt === 'all' ? 'All' : opt[0].toUpperCase() + opt.slice(1);
    sel.appendChild(el);
  });
}

// Save filters to localStorage and URL
function saveFilters() {
  try { 
    localStorage.setItem('oppFiltersSelect', JSON.stringify({
      subject: activeFilters.subject, 
      type: activeFilters.type, 
      available: activeFilters.available
    })); 
  } catch(e){}
  
  const params = new URLSearchParams();
  for (const k of ['subject', 'type', 'available']) {
    if (activeFilters[k] && activeFilters[k] !== 'all') {
      params.set(k, activeFilters[k]);
    }
  }
  history.replaceState(null, '', window.location.pathname + (params.toString() ? '?' + params.toString() : ''));
}

// Load filters from URL or localStorage
function loadFiltersFromStorageOrURL() {
  const urlParams = Object.fromEntries(new URLSearchParams(window.location.search).entries());
  if (Object.keys(urlParams).length) {
    if (urlParams.subject) activeFilters.subject = urlParams.subject;
    if (urlParams.type) activeFilters.type = urlParams.type;
    if (urlParams.available) activeFilters.available = urlParams.available;
    return;
  }
  
  try {
    const saved = JSON.parse(localStorage.getItem('oppFiltersSelect') || '{}');
    if (saved.subject) activeFilters.subject = saved.subject;
    if (saved.type) activeFilters.type = saved.type;
    if (saved.available) activeFilters.available = saved.available;
  } catch(e){}
}

// Apply filters and update display
function applyFilters() {
  const items = Array.from(document.querySelectorAll('.material'));
  let visible = 0;
  const totals = { competition: 0, program: 0, session: 0, platform: 0, publisher: 0, repository: 0 };
  
  // Count totals
  items.forEach(it => {
    const t = (it.dataset.type || '').toLowerCase();
    if (t in totals) totals[t]++;
  });

  // Apply filters
  items.forEach(it => {
    const subject = (it.dataset.subject || '').toLowerCase();
    const type = (it.dataset.type || '').toLowerCase();
    const avail = (it.dataset.available || 'true') === 'true' ? 'available' : 'unavailable';
    const text = (it.textContent || '').toLowerCase();

    const matchSubject = (activeFilters.subject === 'all' || subject === activeFilters.subject);
    const matchType = (activeFilters.type === 'all' || type === activeFilters.type);
    const matchAvail = (activeFilters.available === 'all' || avail === activeFilters.available);
    const matchSearch = (!activeFilters.search || text.includes(activeFilters.search));

    if (matchSubject && matchType && matchAvail && matchSearch) { 
      it.classList.remove('hidden'); 
      visible++; 
    } else { 
      it.classList.add('hidden'); 
      if (it.open) it.removeAttribute('open'); 
    }
  });

  // Update individual counters
  const elComp = document.getElementById('count-competition');
  const elProg = document.getElementById('count-program');
  const elSess = document.getElementById('count-session');
  
  if (elComp) elComp.textContent = `${countVisibleByType('competition')}/${totals.competition}`;
  if (elProg) elProg.textContent = `${countVisibleByType('program')}/${totals.program}`;
  if (elSess) elSess.textContent = `${countVisibleByType('session')}/${totals.session}`;

  // Show no results message
  const noResults = document.getElementById('no-results');
  if (noResults) noResults.classList.toggle('hidden', visible > 0);
}

// Count visible items by type
function countVisibleByType(tname) {
  return document.querySelectorAll(`.material[data-type="${tname}"]:not(.hidden)`).length;
}

// Initialize filter controls
function initFilterControls() {
  populateSelect('filter-subject', FILTER_OPTIONS.subjects);
  populateSelect('filter-type', FILTER_OPTIONS.types);
  populateSelect('filter-availability', FILTER_OPTIONS.availability);

  const s = document.getElementById('filter-subject');
  if (s) s.value = activeFilters.subject;
  
  const t = document.getElementById('filter-type');
  if (t) t.value = activeFilters.type;
  
  const a = document.getElementById('filter-availability');
  if (a) a.value = activeFilters.available;

  // Filter change listeners
  document.getElementById('filter-subject').addEventListener('change', (e) => {
    activeFilters.subject = e.target.value;
    saveFilters();
    applyFilters();
  });

  document.getElementById('filter-type').addEventListener('change', (e) => {
    activeFilters.type = e.target.value;
    saveFilters();
    applyFilters();
  });

  document.getElementById('filter-availability').addEventListener('change', (e) => {
    activeFilters.available = e.target.value;
    saveFilters();
    applyFilters();
  });

  // Search input listener
  const search = document.getElementById('search-input');
  if (search) {
    search.addEventListener('input', (e) => {
      activeFilters.search = e.target.value.trim().toLowerCase();
      applyFilters();
    });
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Load saved filters
  loadFiltersFromStorageOrURL();
  
  // Initialize controls
  initFilterControls();
  
  // Apply initial filters
  applyFilters();

  // Header scroll effect
  window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Keep only one details element open at a time
  document.addEventListener('click', (e) => {
    const sum = e.target.closest('summary.mat-summary');
    if (!sum) return;
    
    const clicked = sum.parentElement;
    setTimeout(() => {
      if (!clicked.open) return;
      document.querySelectorAll('.material').forEach(d => {
        if (d !== clicked && d.open) d.removeAttribute('open');
      });
    }, 40);
  });
});