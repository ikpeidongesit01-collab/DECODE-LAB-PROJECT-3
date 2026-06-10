'use strict';

/* ═══════════════════════════════════════════════════════════════
   1. DARK MODE TOGGLE
   INPUT:  click on #js-theme-toggle
   PROCESS: read current theme, flip it, save to localStorage
   OUTPUT: update data-theme attribute, swap SVG icon markup
═══════════════════════════════════════════════════════════════ */
const html        = document.documentElement;
const themeToggle = document.querySelector('#js-theme-toggle');
const themeIcon   = document.querySelector('#theme-icon');

// Raw SVG Definitions inheriting CSS text variables
const sunIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 transition-transform duration-300">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
  </svg>
`;

const moonIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 transition-transform duration-300">
    <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
  </svg>
`;

// State: restore from localStorage on load
let isDark = localStorage.getItem('theme') === 'dark';
applyTheme(isDark);

function applyTheme(dark) {
  html.dataset.theme = dark ? 'dark' : 'light';
  // Mutate innerHTML to mount the correct SVG asset node
  themeIcon.innerHTML = dark ? moonIcon : sunIcon;
}

themeToggle.addEventListener('click', () => {
  isDark = !isDark;                                         // PROCESS: flip state
  applyTheme(isDark);                                       // OUTPUT: mutate DOM
  localStorage.setItem('theme', isDark ? 'dark' : 'light'); // persist
});


/* ═══════════════════════════════════════════════════════════════
   2. HAMBURGER / MOBILE DRAWER
   INPUT:  click ham button or backdrop
   PROCESS: toggle is-open class on button + drawer + backdrop
   OUTPUT: drawer slides in, backdrop fades in
═══════════════════════════════════════════════════════════════ */
const hamBtn   = document.querySelector('#js-ham-btn');
const drawer   = document.querySelector('#mobile-drawer');
const backdrop = document.querySelector('#drawer-backdrop');
const drawerClose = document.querySelector('#js-drawer-close');

function openDrawer() {
  drawer.classList.add('is-open');
  backdrop.classList.add('is-open');
  hamBtn.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  drawer.classList.remove('is-open');
  backdrop.classList.remove('is-open');
  hamBtn.classList.remove('is-open');
  document.body.style.overflow = '';
}

hamBtn.addEventListener('click', openDrawer);
backdrop.addEventListener('click', closeDrawer);
drawerClose.addEventListener('click', closeDrawer);


/* ═══════════════════════════════════════════════════════════════
   3. COUNTER
   STATE: let count (mutable — must reassign)
   INPUT:  click +, -, reset buttons
   PROCESS: clamp value 0–10, update state
   OUTPUT: textContent + progress bar + label
═══════════════════════════════════════════════════════════════ */
let count = 0;   // let: this value must mutate

const countDisplay  = document.querySelector('#js-count-display');
const countLabel    = document.querySelector('#js-count-label');
const countPct      = document.querySelector('#js-count-pct');
const progressBar   = document.querySelector('#js-progress-bar');
const btnPlus       = document.querySelector('#js-btn-plus');
const btnMinus      = document.querySelector('#js-btn-minus');
const btnReset      = document.querySelector('#js-btn-reset');

function renderCount() {
  countDisplay.textContent = count;           // OUTPUT: safe textContent
  const pct = (count / 10) * 100;
  progressBar.style.width = pct + '%';
  countPct.textContent    = pct + '%';

  // Label logic
  if (count === 0)  countLabel.textContent = '// start counting';
  else if (count === 10) countLabel.textContent = '// max reached!';
  else if (count > 6)    countLabel.textContent = '// getting close to max';
  else countLabel.textContent = '';

  // Colour feedback
  if (count >= 10) progressBar.style.background = 'var(--green)';
  else if (count >= 6) progressBar.style.background = 'var(--accent2)';
  else progressBar.style.background = 'var(--accent)';

  // Bump animation — classList
  countDisplay.classList.add('is-bump');
  setTimeout(() => countDisplay.classList.remove('is-bump'), 150);
}

function increment() {
  if (count < 10) { count++; renderCount(); }   // PROCESS: guard + mutate
}
function decrement() {
  if (count > 0)  { count--; renderCount(); }
}
function reset() {
  count = 0; renderCount();
}

btnPlus.addEventListener('click', increment);
btnMinus.addEventListener('click', decrement);
btnReset.addEventListener('click', reset);

// Also support keyboard (ArrowUp / ArrowDown)
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp')   increment();
  if (e.key === 'ArrowDown') decrement();
});

renderCount(); // initial render


/* ═══════════════════════════════════════════════════════════════
   4. TAB SWITCHER
   INPUT:  click any .js-tab button
   PROCESS: find active tab, remove is-active, add to clicked
   OUTPUT: show correct panel
═══════════════════════════════════════════════════════════════ */
const tabBtns   = document.querySelectorAll('.js-tab');
const tabPanels = document.querySelectorAll('.tab-panel');

function switchTab(e) {
  const clicked = e.currentTarget;
  const target  = clicked.dataset.target;   // PROCESS: read data attribute

  // Remove active from all
  tabBtns.forEach(b   => b.classList.remove('is-active'));
  tabPanels.forEach(p => p.classList.remove('is-active'));

  // Add active to selected
  clicked.classList.add('is-active');
  document.querySelector('#' + target).classList.add('is-active');  // OUTPUT
}

tabBtns.forEach(btn => btn.addEventListener('click', switchTab));


/* ═══════════════════════════════════════════════════════════════
   5. TODO LIST
   STATE: array of todo objects
   INPUT:  click Add, checkbox, delete, clear-done
   PROCESS: mutate array
   OUTPUT: re-render list with createElement + appendChild
═══════════════════════════════════════════════════════════════ */
let todos = [
  { id: 1, text: 'Add the viewport meta tag', done: true  },
  { id: 2, text: 'Write mobile-first CSS',    done: true  },
  { id: 3, text: 'Implement IPO loop',         done: false },
  { id: 4, text: 'Build the todo list',        done: false },
];
let nextId = 5;

const todoInput  = document.querySelector('#js-todo-input');
const todoAddBtn = document.querySelector('#js-todo-add');
const todoList   = document.querySelector('#js-todo-list');
const todoClear  = document.querySelector('#js-todo-clear');
const todoCount  = document.querySelector('#js-todo-count');

function renderTodos() {
  todoList.innerHTML = '';   // clear (safe here — no user data)

  todos.forEach(todo => {
    // createElement — the professional pattern
    const li       = document.createElement('li');
    li.className   = 'todo-item' + (todo.done ? ' is-done' : '');
    li.dataset.id  = todo.id;

    const check = document.createElement('div');
    check.className = 'todo-checkbox js-todo-check';
    if (todo.done) check.textContent = '✓';

    const span = document.createElement('span');
    span.className   = 'todo-text flex-1 text-sm';
    span.textContent = todo.text;          // textContent: safe from XSS

    const del = document.createElement('button');
    del.className   = 'todo-delete js-todo-delete';
    del.textContent = '×';
    del.setAttribute('aria-label', 'Delete task');

    li.appendChild(check);
    li.appendChild(span);
    li.appendChild(del);
    todoList.appendChild(li);              // OUTPUT: append to DOM
  });

  const remaining = todos.filter(t => !t.done).length;
  todoCount.textContent = `${remaining} item${remaining !== 1 ? 's' : ''} remaining`;
}

function addTodo() {
  const text = todoInput.value.trim();
  if (!text) return;
  todos.push({ id: nextId++, text, done: false });  // PROCESS: mutate state
  todoInput.value = '';
  renderTodos();                                      // OUTPUT: re-render
}

// Event delegation — one listener on the parent
todoList.addEventListener('click', (e) => {
  const item = e.target.closest('.todo-item');
  if (!item) return;
  const id = Number(item.dataset.id);

  if (e.target.classList.contains('js-todo-check') ||
      e.target.classList.contains('todo-text')) {
    const todo = todos.find(t => t.id === id);
    if (todo) todo.done = !todo.done;
    renderTodos();
  }
  if (e.target.classList.contains('js-todo-delete')) {
    todos = todos.filter(t => t.id !== id);
    renderTodos();
  }
});

todoAddBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keydown', e => { if (e.key === 'Enter') addTodo(); });
todoClear.addEventListener('click', () => {
  todos = todos.filter(t => !t.done);
  renderTodos();
});

renderTodos();


/* ═══════════════════════════════════════════════════════════════
   6. QUIZ — STATE MACHINE
   STATE: currentQ, score, answered
   INPUT:  click option or next button
   PROCESS: evaluate answer, advance state
   OUTPUT: highlight correct/wrong, update score, show results
═══════════════════════════════════════════════════════════════ */
const quizData = [
  { q: 'Which keyword should you use by default for variable declarations?',
    options: ['var', 'let', 'const', 'function'],
    answer: 2, hint: 'Signals immutable binding intent.' },
  { q: 'What does IPO stand for in the context of web interactivity?',
    options: ['Internet Protocol Output', 'Input-Process-Output', 'Internal Page Object', 'Indexed Page Order'],
    answer: 1, hint: 'Think about the universal law of software engineering.' },
  { q: 'Which method safely injects text data into the DOM without XSS risk?',
    options: ['innerHTML', 'innerText', 'textContent', 'insertAdjacentHTML'],
    answer: 2, hint: 'It treats the value as plain text, never markup.' },
  { q: 'What is the correct way to attach an event listener?',
    options: ['element.onclick = fn', 'element.addEvent(fn)', 'element.addEventListener("click", fn)', 'element.on("click", fn)'],
    answer: 2, hint: 'The modern, recommended method.' },
  { q: 'What prefix marks a class as a JavaScript hook (not for CSS styling)?',
    options: ['data-', 'is-', 'js-', 'fn-'],
    answer: 2, hint: 'It signals the engineering contract between HTML and JS.' },
];

let currentQ  = 0;
let score     = 0;
let answered  = false;

const qText       = document.querySelector('#js-quiz-question');
const optsCont    = document.querySelector('#js-quiz-options');
const feedback    = document.querySelector('#js-quiz-feedback');
const nextBtn     = document.querySelector('#js-quiz-next');
const progBar     = document.querySelector('#js-quiz-prog-bar');
const progLabel   = document.querySelector('#js-quiz-progress');
const scoreLive   = document.querySelector('#js-quiz-score-live');
const hintEl      = document.querySelector('#js-quiz-hint');
const resultsEl   = document.querySelector('#js-quiz-results');
const finalScore = document.querySelector('#js-quiz-final-score');
const restartBtn = document.querySelector('#js-quiz-restart');

function renderQuiz() {
  const q = quizData[currentQ];
  answered = false;
  feedback.classList.add('hidden');
  nextBtn.classList.add('hidden');
  hintEl.textContent = '';

  qText.textContent   = q.q;
  progLabel.textContent = `Question ${currentQ + 1} / ${quizData.length}`;
  progBar.style.width   = ((currentQ) / quizData.length * 100) + '%';

  optsCont.innerHTML = '';
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className   = 'quiz-option js-quiz-opt';
    btn.textContent = opt;
    btn.dataset.index = i;
    optsCont.appendChild(btn);
  });
}

optsCont.addEventListener('click', (e) => {
  if (answered) return;
  const btn = e.target.closest('.js-quiz-opt');
  if (!btn) return;

  answered = true;
  const chosen  = Number(btn.dataset.index);
  const correct = quizData[currentQ].answer;
  const isRight = chosen === correct;

  if (isRight) score++;
  scoreLive.textContent = `Score: ${score}`;

  // Visual feedback via classList (not inline styles)
  document.querySelectorAll('.js-quiz-opt').forEach((b, i) => {
    b.disabled = true;
    if (i === correct) b.classList.add('is-correct');
    else if (i === chosen && !isRight) b.classList.add('is-wrong');
  });

  feedback.textContent  = isRight ? ' Correct!' : ` Not quite. ${quizData[currentQ].hint}`;
  feedback.style.background = isRight
    ? 'color-mix(in srgb, var(--green) 15%, transparent)'
    : 'color-mix(in srgb, var(--accent) 10%, transparent)';
  feedback.style.color  = isRight ? 'var(--green)' : 'var(--accent)';
  feedback.classList.remove('hidden');
  nextBtn.classList.remove('hidden');
  nextBtn.textContent = currentQ < quizData.length - 1 ? 'Next →' : 'See Results';
  hintEl.textContent = `Hint: ${quizData[currentQ].hint}`;
});

nextBtn.addEventListener('click', () => {
  currentQ++;
  if (currentQ < quizData.length) {
    renderQuiz();
  } else {
    // Show results
    qText.textContent  = '';
    optsCont.innerHTML = '';
    feedback.classList.add('hidden');
    nextBtn.classList.add('hidden');
    hintEl.textContent = '';
    progBar.style.width = '100%';
    progLabel.textContent = 'Complete!';
    finalScore.textContent = `You scored ${score} out of ${quizData.length}. ${score >= 4 ? 'Excellent!' : score >= 3 ? ' Good work!' : ' Keep studying!'}`;
    resultsEl.classList.remove('hidden');
  }
});

restartBtn.addEventListener('click', () => {
  currentQ = 0; score = 0; answered = false;
  resultsEl.classList.add('hidden');
  scoreLive.textContent = 'Score: 0';
  renderQuiz();
});

renderQuiz();


/* ═══════════════════════════════════════════════════════════════
   7. ACCORDION
   INPUT:  click any .js-accordion-btn
   PROCESS: toggle is-open on parent .accordion-item
   OUTPUT: CSS max-height transition expands/collapses body
═══════════════════════════════════════════════════════════════ */
document.querySelector('#js-accordion').addEventListener('click', (e) => {
  const btn  = e.target.closest('.js-accordion-btn');
  if (!btn) return;
  const item = btn.closest('.accordion-item');
  const isCurrentlyOpen = item.classList.contains('is-open');

  // Close all (one-open-at-a-time behaviour)
  document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('is-open'));

  // Toggle clicked
  if (!isCurrentlyOpen) item.classList.add('is-open');   // OUTPUT
});


/* ═══════════════════════════════════════════════════════════════
   8. IMAGE GALLERY
   INPUT:  click thumbnail (.js-thumb)
   PROCESS: read data-src + data-caption attributes
   OUTPUT: update src on main image, fade transition
═══════════════════════════════════════════════════════════════ */
const galleryMain    = document.querySelector('#gallery-main');
const galleryImg     = document.querySelector('#js-gallery-img');
const galleryCaption = document.querySelector('#js-gallery-caption');
const thumbContainer = document.querySelector('#js-gallery-thumbs');

// Event delegation — one listener on parent
thumbContainer.addEventListener('click', (e) => {
  const thumb = e.target.closest('.js-thumb');
  if (!thumb) return;

  const newSrc     = thumb.dataset.src;
  const newCaption = thumb.dataset.caption;

  // Fade out → update → fade in
  galleryMain.classList.add('is-fading');
  setTimeout(() => {
    galleryImg.src          = newSrc;         // OUTPUT: attribute mutation
    galleryCaption.textContent = newCaption;  // OUTPUT: textContent
    galleryMain.classList.remove('is-fading');
  }, 250);

  // Update active thumb
  document.querySelectorAll('.js-thumb').forEach(t => t.classList.remove('is-active'));
  thumb.classList.add('is-active');
});


/* ═══════════════════════════════════════════════════════════════
   9. SCROLL REVEAL — IntersectionObserver
═══════════════════════════════════════════════════════════════ */
const revealObserver = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.1 }
);
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));