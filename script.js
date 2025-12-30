// Accessible menu toggle
const navToggle = document.querySelector('.nav-toggle');
const navList = document.getElementById('primary-menu');

if (navToggle && navList) {
  navToggle.addEventListener('click', () => {
    const open = navList.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
}

// 3. Close both menu and dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (navList && !navList.contains(e.target) && !navToggle.contains(e.target)) {
    navList.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

// Modal handling
const modal = document.getElementById('appointment-modal');
const openButtons = document.querySelectorAll('[data-open-modal="appointment"]');
const closeEls = modal ? modal.querySelectorAll('[data-close-modal], .modal-close') : [];

function openModal() {
  if (!modal) return;
  modal.hidden = false;
  // focus first field
  const firstInput = modal.querySelector('input, select, textarea, button');
  if (firstInput) firstInput.focus();
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  if (!modal) return;
  modal.hidden = true;
  document.body.style.overflow = '';
}

openButtons.forEach(btn => btn.addEventListener('click', openModal));
closeEls.forEach(el => el.addEventListener('click', closeModal));

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal && !modal.hidden) {
    closeModal();
  }
});

// Contact form basic validation + UX
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const note = contactForm.querySelector('.form-note');
    if (!contactForm.checkValidity()) {
      note.textContent = 'Please fill all required fields correctly.';
      note.style.color = '#B91C1C';
      return;
    }
    // Simulate submission
    note.textContent = 'Thanks! We will get back to you shortly.';
    note.style.color = '#0F6E39';
    contactForm.reset();
  });
}

// Appointment form validation + simulated scheduling
const apForm = document.getElementById('appointment-form');
if (apForm) {
  apForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const note = apForm.querySelector('.form-note');
    if (!apForm.checkValidity()) {
      note.textContent = 'Please complete all required fields.';
      note.style.color = '#B91C1C';
      return;
    }
    const data = Object.fromEntries(new FormData(apForm).entries());
    // Here you can integrate Calendly/Acuity APIs or your backend endpoint
    note.textContent = `Request received for ${data.area} on ${data.date} at ${data.time} (${data.mode}). We’ll confirm via email.`;
    note.style.color = '#0F6E39';
    setTimeout(() => {
      apForm.reset();
      closeModal();
    }, 1500);
  });
}

// News filtering by topic and date (YYYY-MM)
const topicSelect = document.getElementById('filter-topic');
const dateInput = document.getElementById('filter-date');
const newsList = document.getElementById('news-list');

function applyFilters() {
  if (!newsList) return;
  const topic = topicSelect ? topicSelect.value : 'all';
  const month = dateInput ? dateInput.value : '';

  newsList.querySelectorAll('.card').forEach(card => {
    const t = card.getAttribute('data-topic');
    const d = card.getAttribute('data-date') || '';
    const topicMatch = topic === 'all' || t === topic;
    const dateMatch = !month || d === month;
    card.style.display = (topicMatch && dateMatch) ? '' : 'none';
  });
}

if (topicSelect) topicSelect.addEventListener('change', applyFilters);
if (dateInput) dateInput.addEventListener('change', applyFilters);

// Enhance focus outline for keyboard users only
let usingMouse = false;
document.addEventListener('mousedown', () => usingMouse = true);
document.addEventListener('keydown', () => usingMouse = false);
document.body.addEventListener('focusin', (e) => {
  if (usingMouse) e.target.style.outline = 'none';
});
