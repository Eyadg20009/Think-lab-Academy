const FILTER_OPTIONS = {
  educationSystems: ['all', 'secondary', 'stem', 'stemseeker'],
  grades: ['all', 'g10', 'g11', 'others'],
  subjects: ['all', 'math', 'mechanics', 'biology', 'geology', 'physics', 'chemistry', 'english', 'french', 'science', 'iq', 'scholarships', 'revisions'],
  semesters: ['all', 's1', 's2']
};

const activeFilters = { 
  education: 'all', 
  grade: 'all', 
  subject: 'all', 
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
    } else if (opt === 'secondary') {
      el.textContent = 'Secondary';
    } else if (opt === 'stem') {
      el.textContent = 'STEM';
    } else {
      el.textContent = opt.charAt(0).toUpperCase() + opt.slice(1);
    }
    sel.appendChild(el);
  });
}

function updateFilterVisibility() {
  const educationSystem = document.getElementById('filter-education').value;
  const gradeGroup = document.getElementById('grade-filter-group');
  const subjectGroup = document.getElementById('subject-filter-group');
  const semesterGroup = document.getElementById('semester-filter-group');

  // Reset filters
  activeFilters.grade = 'all';
  activeFilters.subject = 'all';
  activeFilters.semester = 'all';

  // Hide all filters by default
  gradeGroup.style.display = 'none';
  subjectGroup.style.display = 'none';
  semesterGroup.style.display = 'none';

  // Show filters if Secondary or STEM is selected
  if (educationSystem === 'secondary' || educationSystem === 'stem') {
    gradeGroup.style.display = 'flex';
    subjectGroup.style.display = 'flex';
    semesterGroup.style.display = 'flex';
  }

  // Reset select values
  document.getElementById('filter-grade').value = 'all';
  document.getElementById('filter-subject').value = 'all';
  document.getElementById('filter-semester').value = 'all';

  applyFilters();
}

function applyFilters() {
  const lessons = Array.from(document.querySelectorAll('.lesson'));
  let visible = 0;

  lessons.forEach(lesson => {
    const education = (lesson.dataset.education || '').toLowerCase();
    const grade = (lesson.dataset.grade || '').toLowerCase();
    const subject = (lesson.dataset.subject || '').toLowerCase();
    const semester = (lesson.dataset.semester || '').toLowerCase();
    const text = (lesson.textContent || '').toLowerCase();

    const matchEducation = (activeFilters.education === 'all' || education === activeFilters.education);
    const matchGrade = (activeFilters.grade === 'all' || grade === activeFilters.grade);
    const matchSubject = (activeFilters.subject === 'all' || subject === activeFilters.subject);
    const matchSemester = (activeFilters.semester === 'all' || semester === activeFilters.semester);
    const matchSearch = (!activeFilters.search || text.includes(activeFilters.search));

    if (matchEducation && matchGrade && matchSubject && matchSemester && matchSearch) {
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
  populateSelect('filter-grade', FILTER_OPTIONS.grades);
  populateSelect('filter-subject', FILTER_OPTIONS.subjects);
  populateSelect('filter-semester', FILTER_OPTIONS.semesters);

  const educationFilter = document.getElementById('filter-education');
  const gradeFilter = document.getElementById('filter-grade');
  const subjectFilter = document.getElementById('filter-subject');
  const semesterFilter = document.getElementById('filter-semester');
  const searchInput = document.getElementById('search-input');

  educationFilter.value = activeFilters.education;
  gradeFilter.value = activeFilters.grade;
  subjectFilter.value = activeFilters.subject;
  semesterFilter.value = activeFilters.semester;

  if (educationFilter) educationFilter.addEventListener('change', (e) => {
    activeFilters.education = e.target.value;
    updateFilterVisibility();
  });

  if (gradeFilter) gradeFilter.addEventListener('change', (e) => {
    activeFilters.grade = e.target.value;
    applyFilters();
  });

  if (subjectFilter) subjectFilter.addEventListener('change', (e) => {
    activeFilters.subject = e.target.value;
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

// Optional JSON loader
async function tryLoadFromJSON() {
  try {
    const res = await fetch('videos.json', { cache: 'no-store' });
    if (!res.ok) return;
    const list = await res.json();
    const container = document.getElementById('materials-list');
    container.innerHTML = '';
    list.forEach(item => {
      const lesson = document.createElement('div'); 
      lesson.className = 'lesson';
      lesson.dataset.education = item.education || '';
      lesson.dataset.grade = item.grade || '';
      lesson.dataset.subject = item.subject || '';
      lesson.dataset.semester = item.semester || '';

      const header = document.createElement('div'); 
      header.className = 'lesson-header'; 
      header.tabIndex = 0;
      header.innerHTML = `${item.icon ? item.icon + ' ' : ''}${item.title}<span class="arrow">▼</span>`;
      lesson.appendChild(header);

      const materialsDiv = document.createElement('div'); 
      materialsDiv.className = 'lesson-materials';
      if (item.description) { 
        const p = document.createElement('p'); 
        p.textContent = item.description; 
        materialsDiv.appendChild(p); 
      }
      (item.materials || []).forEach(m => {
        const mat = document.createElement('div'); 
        mat.className = 'material';
        const a = document.createElement('a'); 
        a.href = m.href || '#'; 
        a.target = m.targetBlank ? '_blank' : '_self'; 
        a.rel = m.targetBlank ? 'noopener noreferrer' : '';
        a.textContent = m.label || 'Open';
        mat.appendChild(a);
        materialsDiv.appendChild(mat);
      });

      lesson.appendChild(materialsDiv);
      container.appendChild(lesson);
    });
  } catch (e) { 
    /* ignore -> fallback to hard-coded lessons */ 
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await tryLoadFromJSON();
  initFilterControls();
  setupLessonsInteraction();
  applyFilters();
});