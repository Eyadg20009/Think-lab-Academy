const FILTER_OPTIONS = {
  materialTypes: ['all', 'study', 'sat', 'act', 'ielts', 'capstone'],
  subjects: ['all', 'math', 'mechanics', 'biology', 'geology', 'physics', 'chemistry', 'english', 'french'],
  grades: ['all', 'g10', 'g11', 'others'],
  semesters: ['all', 's1', 's2']
};

const activeFilters = { 
  type: 'all', 
  subject: 'all', 
  grade: 'all', 
  semester: 'all', 
  search: '' 
};

function populateSelect(id, options) {
  const sel = document.getElementById(id);
  if (!sel) return;
  sel.innerHTML = '';
  options.forEach(opt => {
    const el = document.createElement('option');
    el.value = opt;
    if (opt === 'all') {
      el.textContent = 'All';
    } else if (opt === 'others') {
      el.textContent = 'Others';
    } else if (opt.startsWith('g') && opt.length <= 3) {
      el.textContent = 'Grade ' + opt.slice(1);
    } else if (opt.length <= 2) {
      el.textContent = opt.toUpperCase();
    } else if (opt === 'study') {
      el.textContent = 'Study Materials';
    } else if (opt === 'sat') {
      el.textContent = 'SAT';
    } else if (opt === 'act') {
      el.textContent = 'ACT';
    } else if (opt === 'ielts') {
      el.textContent = 'IELTS';
    } else if (opt === 'capstone') {
      el.textContent = 'Capstone';
    } else {
      el.textContent = opt.charAt(0).toUpperCase() + opt.slice(1);
    }
    sel.appendChild(el);
  });
}

function updateFilterVisibility() {
  const materialType = document.getElementById('filter-type').value;
  const subjectGroup = document.getElementById('subject-filter-group');
  const gradeGroup = document.getElementById('grade-filter-group');
  const semesterGroup = document.getElementById('semester-filter-group');

  // Reset all filters except type
  activeFilters.subject = 'all';
  activeFilters.grade = 'all';
  activeFilters.semester = 'all';

  // Hide all filter groups
  subjectGroup.style.display = 'none';
  gradeGroup.style.display = 'none';
  semesterGroup.style.display = 'none';

  // Show appropriate filters based on material type
  if (materialType === 'study') {
    subjectGroup.style.display = 'flex';
    gradeGroup.style.display = 'flex';
    semesterGroup.style.display = 'flex';
  } else if (materialType === 'capstone') {
    gradeGroup.style.display = 'flex';
    semesterGroup.style.display = 'flex';
  }
  // SAT, ACT, and IELTS don't need additional filters

  // Reset select values
  document.getElementById('filter-subject').value = 'all';
  document.getElementById('filter-grade').value = 'all';
  document.getElementById('filter-semester').value = 'all';

  applyFilters();
}

function applyFilters() {
  const lessons = Array.from(document.querySelectorAll('.lesson'));
  let visible = 0;

  lessons.forEach(lesson => {
    const type = (lesson.dataset.type || '').toLowerCase();
    const subject = (lesson.dataset.subject || '').toLowerCase();
    const grade = (lesson.dataset.grade || '').toLowerCase();
    const semester = (lesson.dataset.semester || '').toLowerCase();
    const text = (lesson.textContent || '').toLowerCase();

    const matchType = (activeFilters.type === 'all' || type === activeFilters.type);
    const matchSubject = (activeFilters.subject === 'all' || subject === activeFilters.subject);
    const matchGrade = (activeFilters.grade === 'all' || grade === activeFilters.grade);
    const matchSemester = (activeFilters.semester === 'all' || semester === activeFilters.semester);
    const matchSearch = (!activeFilters.search || text.includes(activeFilters.search));

    if (matchType && matchSubject && matchGrade && matchSemester && matchSearch) {
      lesson.classList.remove('hidden');
      visible++;
    } else {
      lesson.classList.add('hidden');
      const materials = lesson.querySelector('.lesson-materials');
      if (materials) { 
        materials.style.maxHeight = null; 
        materials.classList.remove('open');
        const arrow = lesson.querySelector('.arrow'); 
        if (arrow) arrow.style.transform = 'rotate(0deg)'; 
      }
    }
  });

  document.getElementById('count-visible').textContent = visible;
  document.getElementById('count-total').textContent = lessons.length;
}

function initFilterControls() {
  populateSelect('filter-type', FILTER_OPTIONS.materialTypes);
  populateSelect('filter-subject', FILTER_OPTIONS.subjects);
  populateSelect('filter-grade', FILTER_OPTIONS.grades);
  populateSelect('filter-semester', FILTER_OPTIONS.semesters);

  const typeFilter = document.getElementById('filter-type');
  const subjectFilter = document.getElementById('filter-subject');
  const gradeFilter = document.getElementById('filter-grade');
  const semesterFilter = document.getElementById('filter-semester');
  const searchInput = document.getElementById('search-input');

  typeFilter.value = activeFilters.type;
  subjectFilter.value = activeFilters.subject;
  gradeFilter.value = activeFilters.grade;
  semesterFilter.value = activeFilters.semester;

  if (typeFilter) typeFilter.addEventListener('change', (e) => {
    activeFilters.type = e.target.value;
    updateFilterVisibility();
  });

  if (subjectFilter) subjectFilter.addEventListener('change', (e) => {
    activeFilters.subject = e.target.value;
    applyFilters();
  });

  if (gradeFilter) gradeFilter.addEventListener('change', (e) => {
    activeFilters.grade = e.target.value;
    applyFilters();
  });

  if (semesterFilter) semesterFilter.addEventListener('change', (e) => {
    activeFilters.semester = e.target.value;
    applyFilters();
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      activeFilters.search = e.target.value.trim().toLowerCase();
      applyFilters();
    });
  }

  // Initialize filter visibility
  updateFilterVisibility();
}

function setupLessonsInteraction() {
  document.querySelectorAll('.lesson').forEach(lesson => {
    const header = lesson.querySelector('.lesson-header');
    const materials = lesson.querySelector('.lesson-materials');
    const arrow = lesson.querySelector('.arrow');
    if (!header || !materials) return;

    function toggle() {
      const isOpen = materials.style.maxHeight && materials.style.maxHeight !== '0px';
      document.querySelectorAll('.lesson .lesson-materials').forEach(m => { 
        if (m !== materials) { 
          m.style.maxHeight = null; 
          m.classList.remove('open');
          const ar = m.parentElement.querySelector('.arrow'); 
          if (ar) ar.style.transform = 'rotate(0deg)'; 
        }
      });
      if (isOpen) {
        materials.style.maxHeight = null;
        materials.classList.remove('open');
        if (arrow) arrow.style.transform = 'rotate(0deg)';
      } else {
        materials.style.maxHeight = materials.scrollHeight + 'px';
        materials.classList.add('open');
        if (arrow) arrow.style.transform = 'rotate(180deg)';
      }
    }

    header.addEventListener('click', toggle);
    header.addEventListener('keydown', (e) => { 
      if (e.key === 'Enter' || e.key === ' ') { 
        e.preventDefault(); 
        toggle(); 
      } 
    });
  });
}

function setupModalViewers() {
  const modal = document.getElementById('modal');
  const closeBtn = document.getElementById('close-modal');
  const viewer = document.getElementById('document-viewer');
  const loading = document.getElementById('loading');
  const downloadBtn = document.getElementById('download-btn');
  const modalTitle = document.getElementById('modal-title');
  const fileTabsContainer = document.getElementById('file-tabs');

  let currentFiles = [];
  let currentFileIndex = 0;

  document.querySelectorAll('.material-button').forEach(btn => {
    btn.addEventListener('click', () => {
      const filesData = btn.dataset.files;
      try {
        currentFiles = JSON.parse(filesData);
        currentFileIndex = 0;
        openModal();
      } catch (e) {
        console.error('Invalid file data', e);
      }
    });
  });

  function openModal() {
    if (currentFiles.length === 0) return;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    fileTabsContainer.innerHTML = '';
    if (currentFiles.length > 1) {
      currentFiles.forEach((file, index) => {
        const tab = document.createElement('button');
        tab.className = 'file-tab' + (index === currentFileIndex ? ' active' : '');
        tab.textContent = file.name;
        tab.addEventListener('click', () => {
          currentFileIndex = index;
          loadFile();
          document.querySelectorAll('.file-tab').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
        });
        fileTabsContainer.appendChild(tab);
      });
    }
    
    loadFile();
  }

  function loadFile() {
    const file = currentFiles[currentFileIndex];
    modalTitle.textContent = file.name;
    
    loading.style.display = 'block';
    viewer.style.display = 'none';
    
    // Check if it's a YouTube video
    if (file.type === 'youtube') {
      const youtubeId = file.id;
      const embedUrl = `https://www.youtube.com/embed/${youtubeId}?autoplay=1`;
      viewer.src = embedUrl;
      downloadBtn.style.display = 'none';
      loading.style.display = 'none';
      viewer.style.display = 'block';
    } else {
      // Google Drive document
      const embedUrl = `https://drive.google.com/file/d/${file.id}/preview`;
      viewer.src = embedUrl;
      downloadBtn.style.display = 'block';
      downloadBtn.href = `https://drive.google.com/uc?export=download&id=${file.id}`;
      
      viewer.onload = () => {
        loading.style.display = 'none';
        viewer.style.display = 'block';
      };
    }
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    viewer.src = '';
    currentFiles = [];
    currentFileIndex = 0;
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

function handleScroll() {
  const header = document.querySelector('header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initFilterControls();
  setupLessonsInteraction();
  setupModalViewers();
  applyFilters();
  handleScroll();
});

window.addEventListener('scroll', handleScroll);
