/* ═══════════════════════════════════════
   STUDYHIVE — App Logic
═══════════════════════════════════════ */

// ── THEME ──
function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', next);
  localStorage.setItem('sh-theme', next);
}
(function initTheme() {
  const saved = localStorage.getItem('sh-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
})();

// ── NAV ──
function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
}
function closeMenu() {
  document.getElementById('navLinks').classList.remove('open');
}

// ── PAGE ROUTING ──
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById('page-' + name);
  if (page) { page.classList.add('active'); window.scrollTo(0, 0); }
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.page === name);
  });
  closeMenu();
  if (name === 'courses') renderCourses();
  if (name === 'materials') renderMaterials();
  if (name === 'leaderboard') renderLeaderboard();
}

// ── DATA ──
const COURSES = [
  // CEE
  { exam:'CEE', subject:'Physics', title:'Motion in One & Two Dimensions', chapters:8, mcqs:120, desc:'Kinematics, projectile, relative motion — complete theory + PYQs.' },
  { exam:'CEE', subject:'Chemistry', title:'Atomic Structure & Periodic Table', chapters:6, mcqs:95, desc:'Bohr model, quantum numbers, periodic trends — CEE pattern.' },
  { exam:'CEE', subject:'Biology', title:'Cell Biology & Genetics', chapters:10, mcqs:140, desc:'Cell organelles, Mendelian genetics, DNA replication and more.' },
  { exam:'CEE', subject:'Math', title:'Coordinate Geometry', chapters:7, mcqs:100, desc:'Straight lines, circles, conics — high-yield CEE topics.' },
  { exam:'CEE', subject:'Physics', title:'Waves & Optics', chapters:9, mcqs:110, desc:'SHM, sound waves, geometric and wave optics.' },
  { exam:'CEE', subject:'Biology', title:'Human Physiology — Digestive & Circulatory', chapters:8, mcqs:130, desc:'Digestion, blood, heart, lymph — must-do for CEE Biology.' },
  // IOE
  { exam:'IOE', subject:'Math', title:'Calculus I — Limits, Derivatives', chapters:10, mcqs:150, desc:'Limits, continuity, differentiation rules — IOE Math powerpack.' },
  { exam:'IOE', subject:'Physics', title:'Electricity & Magnetism', chapters:9, mcqs:120, desc:'Coulomb, Gauss, Biot-Savart, EMF — complete IOE coverage.' },
  { exam:'IOE', subject:'Chemistry', title:'Organic Chemistry Basics', chapters:6, mcqs:80, desc:'IUPAC naming, functional groups, reactions — IOE syllabus.' },
  { exam:'IOE', subject:'English', title:'Technical English & Vocabulary', chapters:5, mcqs:60, desc:'Grammar, reading comprehension, IOE English section prep.' },
  { exam:'IOE', subject:'Math', title:'Trigonometry & Complex Numbers', chapters:7, mcqs:115, desc:'Trig identities, inverse, complex plane — IOE favourite.' },
  // NEET
  { exam:'NEET', subject:'Biology', title:'Plant Kingdom & Classification', chapters:12, mcqs:200, desc:'NCERT-aligned. Algae, Bryophytes, Pteridophytes, angiosperms.' },
  { exam:'NEET', subject:'Physics', title:'Laws of Motion & Work-Energy', chapters:8, mcqs:140, desc:'Newton, friction, work-energy theorem — NEET must-do.' },
  { exam:'NEET', subject:'Chemistry', title:'Chemical Bonding & Molecular Structure', chapters:7, mcqs:120, desc:'VSEPR, hybridization, MO theory — NEET Chemistry.' },
  { exam:'NEET', subject:'Biology', title:'Human Reproduction & Reproductive Health', chapters:9, mcqs:160, desc:'Reproductive system, gametogenesis, contraception — NEET.' },
  { exam:'NEET', subject:'Chemistry', title:'Electrochemistry', chapters:6, mcqs:90, desc:'Faraday laws, galvanic cells, batteries — NEET Chemistry.' },
  // JEE
  { exam:'JEE', subject:'Math', title:'Probability & Statistics', chapters:8, mcqs:130, desc:'Conditional probability, Bayes, distributions — JEE Mains + Advanced.' },
  { exam:'JEE', subject:'Physics', title:'Thermodynamics & Kinetic Theory', chapters:9, mcqs:140, desc:'Laws of thermodynamics, entropy, ideal gas — JEE complete.' },
  { exam:'JEE', subject:'Chemistry', title:'Transition Metals & Coordination Compounds', chapters:7, mcqs:100, desc:'d-block, Werner theory, isomerism — JEE Chemistry.' },
  { exam:'JEE', subject:'Math', title:'Integral Calculus', chapters:11, mcqs:180, desc:'Definite, indefinite, area under curve — JEE powerpackage.' },
];

const MATERIALS = [
  { type:'notes', exam:'CEE', subject:'Physics', title:'Complete Physics Notes — CEE', pages:84, icon:'📘', color:'#DBEAFE', iconColor:'#2563EB' },
  { type:'paper', exam:'CEE', subject:'All', title:'CEE 2023 Original Paper + Solutions', pages:12, icon:'📄', color:'#D1FAE5', iconColor:'#059669' },
  { type:'formula', exam:'CEE', subject:'Chemistry', title:'Chemistry Formula Sheet — CEE', pages:6, icon:'🧪', color:'#FEF3C7', iconColor:'#D97706' },
  { type:'notes', exam:'IOE', subject:'Math', title:'Calculus Notes — IOE Complete', pages:70, icon:'📙', color:'#FEE2E2', iconColor:'#DC2626' },
  { type:'paper', exam:'IOE', subject:'All', title:'IOE 2024 Model Set 1 + Answers', pages:10, icon:'📄', color:'#F3E8FF', iconColor:'#7C3AED' },
  { type:'formula', exam:'IOE', subject:'Physics', title:'Physics Formula Digest — IOE', pages:5, icon:'⚡', color:'#DBEAFE', iconColor:'#2563EB' },
  { type:'notes', exam:'NEET', subject:'Biology', title:'NCERT Biology Chapter Summaries', pages:120, icon:'🧬', color:'#D1FAE5', iconColor:'#059669' },
  { type:'paper', exam:'NEET', subject:'All', title:'NEET 2023 Official Paper + Key', pages:24, icon:'📄', color:'#FFE4E6', iconColor:'#E11D48' },
  { type:'formula', exam:'NEET', subject:'Chemistry', title:'Organic Reactions Cheatsheet', pages:4, icon:'⚗️', color:'#FEF3C7', iconColor:'#D97706' },
  { type:'notes', exam:'JEE', subject:'Math', title:'JEE Math Masterclass Notes', pages:96, icon:'📗', color:'#ECFDF5', iconColor:'#065F46' },
  { type:'paper', exam:'JEE', subject:'All', title:'JEE Mains 2024 Jan Paper + Solutions', pages:20, icon:'📄', color:'#FEF9C3', iconColor:'#92400E' },
  { type:'formula', exam:'JEE', subject:'Physics', title:'Physics Derivations Handbook', pages:8, icon:'🔬', color:'#EDE9FE', iconColor:'#6D28D9' },
  { type:'notes', exam:'CEE', subject:'Biology', title:'Human Physiology Master Notes', pages:65, icon:'🫀', color:'#FFE4E6', iconColor:'#E11D48' },
  { type:'notes', exam:'IOE', subject:'Chemistry', title:'Organic Chemistry for IOE', pages:48, icon:'🧫', color:'#ECFDF5', iconColor:'#059669' },
  { type:'paper', exam:'JEE', subject:'All', title:'JEE Advanced 2023 Paper 1 + 2', pages:32, icon:'📄', color:'#F5F3FF', iconColor:'#7C3AED' },
];

const LEADERBOARD_DATA = [
  { name:'Aarav Khatri', init:'AK', exam:'IOE', score:3120, acc:'94%', city:'Kathmandu' },
  { name:'Riya Shrestha', init:'RS', exam:'NEET', score:2840, acc:'91%', city:'Pokhara' },
  { name:'Nisha Maharjan', init:'NM', exam:'CEE', score:2710, acc:'89%', city:'Lalitpur' },
  { name:'Bibek Thapa', init:'BT', exam:'JEE', score:2640, acc:'87%', city:'Bharatpur' },
  { name:'Anita Gurung', init:'AG', exam:'CEE', score:2580, acc:'86%', city:'Butwal' },
  { name:'Rohan Tamang', init:'RT', exam:'IOE', score:2530, acc:'85%', city:'Kathmandu' },
  { name:'Priya Rai', init:'PR', exam:'NEET', score:2490, acc:'84%', city:'Dharan' },
  { name:'Siddharth KC', init:'SK', exam:'JEE', score:2450, acc:'83%', city:'Pokhara' },
  { name:'Maya Poudel', init:'MP', exam:'CEE', score:2400, acc:'82%', city:'Biratnagar' },
  { name:'Kiran Lama', init:'KL', exam:'IOE', score:2360, acc:'81%', city:'Kathmandu' },
];

const EXAM_COLORS = { CEE:'tag-cee', IOE:'tag-ioe', NEET:'tag-neet', JEE:'tag-jee' };
const EXAM_TAG_COLORS = { CEE:'background:#D1FAE5;color:#059669', IOE:'background:#DBEAFE;color:#2563EB', NEET:'background:#FFE4E6;color:#E11D48', JEE:'background:#FEF3C7;color:#D97706' };

// ── COURSES ──
let activeCourseFilter = 'ALL';
function filterCourse(exam) {
  activeCourseFilter = exam;
  document.querySelectorAll('#page-courses .filter-btn').forEach(b => {
    b.classList.toggle('active', b.textContent.trim() === exam || (exam === 'ALL' && b.textContent.trim() === 'All'));
  });
  renderCourses();
}
function renderCourses() {
  const grid = document.getElementById('coursesGrid');
  if (!grid) return;
  const filtered = activeCourseFilter === 'ALL' ? COURSES : COURSES.filter(c => c.exam === activeCourseFilter);
  grid.innerHTML = filtered.map(c => `
    <div class="course-card" onclick="toast('Opening ${c.title}…')">
      <div class="course-card-top cc-${c.exam.toLowerCase()}"></div>
      <div class="course-card-body">
        <span class="course-exam-tag ${EXAM_COLORS[c.exam]}">${c.exam} · ${c.subject}</span>
        <div class="course-title">${c.title}</div>
        <div class="course-desc">${c.desc}</div>
        <div class="course-meta">
          <span>📖 ${c.chapters} Chapters</span>
          <span>🧪 ${c.mcqs} MCQs</span>
        </div>
        <div class="course-free-badge">✓ Free Access</div>
      </div>
    </div>
  `).join('');
}

// ── MATERIALS ──
let activeMatFilter = 'ALL';
let matSearchTerm = '';
function matFilter(type) {
  activeMatFilter = type;
  document.querySelectorAll('#page-materials .filter-btn').forEach(b => {
    b.classList.toggle('active',
      (type === 'ALL' && b.textContent.trim() === 'All Types') ||
      b.textContent.trim().toLowerCase().includes(type.toLowerCase())
    );
  });
  renderMaterials();
}
function filterMaterials(val) { matSearchTerm = val.toLowerCase(); renderMaterials(); }
function renderMaterials() {
  const grid = document.getElementById('materialsGrid');
  if (!grid) return;
  let data = MATERIALS;
  if (activeMatFilter !== 'ALL') data = data.filter(m => m.type === activeMatFilter);
  if (matSearchTerm) data = data.filter(m =>
    m.title.toLowerCase().includes(matSearchTerm) ||
    m.exam.toLowerCase().includes(matSearchTerm) ||
    m.subject.toLowerCase().includes(matSearchTerm)
  );
  grid.innerHTML = data.map(m => `
    <div class="mat-card" onclick="toast('Downloading "${m.title}"…')">
      <div class="mat-icon-wrap" style="background:${m.color}">
        <span style="font-size:1.5rem">${m.icon}</span>
      </div>
      <div class="mat-body">
        <div class="mat-title">${m.title}</div>
        <div class="mat-meta">${m.pages} pages · ${m.exam} · ${m.subject}</div>
        <div class="mat-tags">
          <span class="mat-tag" style="${EXAM_TAG_COLORS[m.exam]}">${m.exam}</span>
          <span class="mat-tag" style="background:var(--bg-muted);color:var(--text-muted)">${m.type === 'notes' ? '📝 Notes' : m.type === 'paper' ? '📄 Paper' : '🗂️ Formula'}</span>
        </div>
      </div>
      <button class="mat-dl">⬇ Free</button>
    </div>
  `).join('');
}

// ── LEADERBOARD ──
let activeLbFilter = 'ALL';
function lbFilter(exam) {
  activeLbFilter = exam;
  document.querySelectorAll('#page-leaderboard .filter-btn').forEach(b => {
    b.classList.toggle('active',
      (exam === 'ALL' && b.textContent.trim() === 'All Exams') ||
      b.textContent.trim() === exam
    );
  });
  renderLeaderboard();
}
function renderLeaderboard() {
  const tbody = document.getElementById('lbTableBody');
  if (!tbody) return;
  let data = activeLbFilter === 'ALL' ? LEADERBOARD_DATA : LEADERBOARD_DATA.filter(r => r.exam === activeLbFilter);
  tbody.innerHTML = data.map((r, i) => `
    <div class="lb-row">
      <span class="lb-rank">${i + 4}</span>
      <span class="lb-student">
        <div class="lb-avatar">${r.init}</div>
        <div>
          <div>${r.name}</div>
          <div style="font-size:0.72rem;color:var(--text-muted);font-weight:400">${r.city}</div>
        </div>
      </span>
      <span><span class="lb-exam-tag" style="${EXAM_TAG_COLORS[r.exam]}">${r.exam}</span></span>
      <span class="lb-pts">${r.score.toLocaleString()} pts</span>
      <span class="lb-acc">${r.acc}</span>
    </div>
  `).join('');
}

// ── QUIZ ENGINE ──
const QUIZ_QUESTIONS = {
  'CEE Full Mock': [
    { q:'A body is thrown vertically upward with velocity u. The maximum height reached is:', opts:['u²/2g','u/2g','2u/g','u²/g'], ans:0, subject:'Physics' },
    { q:'Which of the following is an intensive property?', opts:['Volume','Mass','Temperature','Enthalpy'], ans:2, subject:'Chemistry' },
    { q:'The powerhouse of the cell is:', opts:['Nucleus','Ribosome','Mitochondria','Golgi body'], ans:2, subject:'Biology' },
    { q:'The slope of the tangent to y = x³ at x = 2 is:', opts:['6','12','8','4'], ans:1, subject:'Math' },
    { q:'Speed of light in vacuum is approximately:', opts:['3×10⁸ m/s','3×10⁶ m/s','3×10¹⁰ m/s','3×10⁴ m/s'], ans:0, subject:'Physics' },
    { q:'pH of pure water at 25°C is:', opts:['0','7','14','10'], ans:1, subject:'Chemistry' },
    { q:'DNA replication is:', opts:['Conservative','Semi-conservative','Dispersive','None'], ans:1, subject:'Biology' },
    { q:'∫x dx equals:', opts:['x²/2 + C','x² + C','2x + C','1/x + C'], ans:0, subject:'Math' },
    { q:'Newton\'s second law of motion relates:', opts:['Force and velocity','Force and acceleration','Energy and mass','Momentum and velocity'], ans:1, subject:'Physics' },
    { q:'Which element has atomic number 6?', opts:['Nitrogen','Oxygen','Carbon','Boron'], ans:2, subject:'Chemistry' },
  ],
  'IOE Full Mock': [
    { q:'The value of lim(x→0) sin(x)/x is:', opts:['0','∞','1','undefined'], ans:2, subject:'Math' },
    { q:'Ohm\'s law states that V is proportional to:', opts:['I²','I','√I','1/I'], ans:1, subject:'Physics' },
    { q:'IUPAC name of CH₃CHO is:', opts:['Methanol','Ethanal','Propanol','Ethanol'], ans:1, subject:'Chemistry' },
    { q:'Choose the correct sentence:', opts:['He don\'t know','He doesn\'t knows','He doesn\'t know','He not know'], ans:2, subject:'English' },
    { q:'Derivative of sin(x) is:', opts:['cos(x)','-cos(x)','-sin(x)','tan(x)'], ans:0, subject:'Math' },
    { q:'Unit of electric resistance is:', opts:['Volt','Ampere','Ohm','Watt'], ans:2, subject:'Physics' },
    { q:'Benzene has the molecular formula:', opts:['C₆H₁₂','C₆H₆','C₆H₁₀','C₄H₄'], ans:1, subject:'Chemistry' },
    { q:'Synonym of "Arduous" is:', opts:['Easy','Difficult','Strange','Loud'], ans:1, subject:'English' },
    { q:'∫cos(x)dx equals:', opts:['sin(x)+C','-sin(x)+C','tan(x)+C','-cos(x)+C'], ans:0, subject:'Math' },
    { q:'What is the SI unit of power?', opts:['Joule','Newton','Watt','Pascal'], ans:2, subject:'Physics' },
  ],
  'NEET Full Mock': [
    { q:'Which organelle is involved in lipid synthesis?', opts:['Rough ER','Smooth ER','Golgi apparatus','Lysosome'], ans:1, subject:'Biology' },
    { q:'Velocity of sound is maximum in:', opts:['Air','Water','Steel','Vacuum'], ans:2, subject:'Physics' },
    { q:'Hybridization of carbon in diamond:', opts:['sp','sp²','sp³','dsp²'], ans:2, subject:'Chemistry' },
    { q:'The number of chromosomes in human somatic cells:', opts:['23','46','44','48'], ans:1, subject:'Biology' },
    { q:'First law of thermodynamics is based on:', opts:['Conservation of momentum','Conservation of energy','Conservation of mass','Entropy'], ans:1, subject:'Physics' },
    { q:'Bleaching powder contains:', opts:['Ca(OH)₂','CaCl₂','Ca(OCl)Cl','CaO'], ans:2, subject:'Chemistry' },
    { q:'Photosynthesis takes place in:', opts:['Mitochondria','Ribosome','Chloroplast','Nucleus'], ans:2, subject:'Biology' },
    { q:'Boyle\'s law relates pressure and:', opts:['Temperature','Volume','Mass','Density'], ans:1, subject:'Physics' },
    { q:'Which acid is present in vinegar?', opts:['Citric acid','Acetic acid','Formic acid','Lactic acid'], ans:1, subject:'Chemistry' },
    { q:'Site of protein synthesis in cell:', opts:['Nucleus','Mitochondria','Ribosome','Golgi'], ans:2, subject:'Biology' },
  ],
  'JEE Mains Mock': [
    { q:'∫₀¹ x² dx equals:', opts:['1/3','1/2','1','2/3'], ans:0, subject:'Math' },
    { q:'Work done in a cyclic process is equal to:', opts:['Zero always','Area enclosed by p-V diagram','Change in enthalpy','None'], ans:1, subject:'Physics' },
    { q:'Hybridization of SF₆:', opts:['sp³','sp³d','sp³d²','d²sp³'], ans:2, subject:'Chemistry' },
    { q:'The number of prime numbers less than 10:', opts:['3','4','5','6'], ans:1, subject:'Math' },
    { q:'Photoelectric effect proves:', opts:['Wave nature of light','Particle nature of light','Both','Neither'], ans:1, subject:'Physics' },
    { q:'Which is the most electronegative element?', opts:['Oxygen','Chlorine','Fluorine','Nitrogen'], ans:2, subject:'Chemistry' },
    { q:'Value of sin(30°):', opts:['√3/2','1/2','1/√2','√3'], ans:1, subject:'Math' },
    { q:'Escape velocity of Earth is approximately:', opts:['7.9 km/s','11.2 km/s','9.8 km/s','15 km/s'], ans:1, subject:'Physics' },
    { q:'Smallest particle of element retaining its properties:', opts:['Ion','Atom','Electron','Molecule'], ans:1, subject:'Chemistry' },
    { q:'If f(x) = x², then f\'(3) is:', opts:['3','6','9','12'], ans:1, subject:'Math' },
  ],
  'Quick Physics': [
    { q:'SI unit of force is:', opts:['Watt','Pascal','Newton','Joule'], ans:2, subject:'Physics' },
    { q:'A projectile at its highest point has:', opts:['Zero velocity','Zero KE','Zero horizontal velocity','Zero vertical velocity'], ans:3, subject:'Physics' },
    { q:'Wavelength of visible light is approximately:', opts:['100nm–300nm','400nm–700nm','700nm–1000nm','10nm–100nm'], ans:1, subject:'Physics' },
    { q:'Work done = Force × ?', opts:['Time','Mass','Displacement','Speed'], ans:2, subject:'Physics' },
    { q:'Acceleration due to gravity on earth surface:', opts:['8.9 m/s²','9.8 m/s²','10.8 m/s²','7.9 m/s²'], ans:1, subject:'Physics' },
    { q:'Electric current is measured in:', opts:['Volt','Watt','Ohm','Ampere'], ans:3, subject:'Physics' },
    { q:'Speed of sound in air at 0°C:', opts:['332 m/s','300 m/s','250 m/s','400 m/s'], ans:0, subject:'Physics' },
    { q:'Which mirror is used as rear view mirror in cars?', opts:['Plane','Concave','Convex','Parabolic'], ans:2, subject:'Physics' },
    { q:'Power = Work / ?', opts:['Force','Distance','Time','Mass'], ans:2, subject:'Physics' },
    { q:'Magnetic field unit is:', opts:['Tesla','Ampere','Newton','Coulomb'], ans:0, subject:'Physics' },
  ],
  'Quick Chemistry': [
    { q:'Atomic number of Oxygen:', opts:['6','7','8','9'], ans:2, subject:'Chemistry' },
    { q:'Chemical formula of water:', opts:['H₂O₂','HO','H₂O','H₃O'], ans:2, subject:'Chemistry' },
    { q:'Sodium carbonate formula:', opts:['NaCl','Na₂CO₃','NaHCO₃','NaOH'], ans:1, subject:'Chemistry' },
    { q:'pH < 7 means solution is:', opts:['Neutral','Acidic','Basic','Amphoteric'], ans:1, subject:'Chemistry' },
    { q:'Valency of Nitrogen in NH₃:', opts:['1','2','3','4'], ans:2, subject:'Chemistry' },
    { q:'Noble gases are in group:', opts:['1','7','17','18'], ans:3, subject:'Chemistry' },
    { q:'Which gas causes greenhouse effect?', opts:['O₂','N₂','CO₂','H₂'], ans:2, subject:'Chemistry' },
    { q:'Rusting of iron involves:', opts:['Reduction','Oxidation','Neither','Both'], ans:1, subject:'Chemistry' },
    { q:'Molar mass of CO₂:', opts:['28 g/mol','44 g/mol','32 g/mol','40 g/mol'], ans:1, subject:'Chemistry' },
    { q:'Acid turns litmus:', opts:['Blue','Red','Green','Yellow'], ans:1, subject:'Chemistry' },
  ],
};

let currentQuiz = { name:'', questions:[], current:0, answers:[], timer:null, timeLeft:0 };

function startTest(name) {
  const qs = QUIZ_QUESTIONS[name] || QUIZ_QUESTIONS['Quick Physics'];
  currentQuiz = {
    name, questions: qs, current: 0,
    answers: new Array(qs.length).fill(-1),
    timer: null, timeLeft: name.includes('Full') ? 1200 : 600,
  };
  document.getElementById('tests-landing').style.display = 'none';
  document.getElementById('quiz-panel').style.display = 'block';
  document.getElementById('result-panel').style.display = 'none';
  document.getElementById('quizTitle').textContent = name;
  renderQuizQuestion();
  startTimer();
  window.scrollTo(0, 0);
}

function renderQuizQuestion() {
  const q = currentQuiz.questions[currentQuiz.current];
  const idx = currentQuiz.current;
  const total = currentQuiz.questions.length;
  document.getElementById('quizQNum').textContent = `Question ${idx + 1} of ${total}  ·  ${q.subject}`;
  document.getElementById('quizQuestion').textContent = q.q;
  document.getElementById('quizProgressFill').style.width = `${((idx + 1) / total) * 100}%`;
  document.getElementById('btnPrev').disabled = idx === 0;
  document.getElementById('btnNext').textContent = idx === total - 1 ? 'Submit →' : 'Next →';
  const opts = document.getElementById('quizOptions');
  opts.innerHTML = q.opts.map((o, i) => `
    <button class="quiz-opt ${currentQuiz.answers[idx] === i ? 'selected' : ''}"
      onclick="selectOpt(${i})">${['A','B','C','D'][i]}) ${o}</button>
  `).join('');
}

function selectOpt(i) {
  currentQuiz.answers[currentQuiz.current] = i;
  renderQuizQuestion();
}

function quizNav(dir) {
  const next = currentQuiz.current + dir;
  if (next < 0) return;
  if (next >= currentQuiz.questions.length) { submitQuiz(); return; }
  currentQuiz.current = next;
  renderQuizQuestion();
}

function startTimer() {
  clearInterval(currentQuiz.timer);
  currentQuiz.timer = setInterval(() => {
    currentQuiz.timeLeft--;
    const m = Math.floor(currentQuiz.timeLeft / 60).toString().padStart(2,'0');
    const s = (currentQuiz.timeLeft % 60).toString().padStart(2,'0');
    const el = document.getElementById('quizTimer');
    if (el) {
      el.textContent = `${m}:${s}`;
      if (currentQuiz.timeLeft < 60) el.style.color = 'var(--accent-rose)';
    }
    if (currentQuiz.timeLeft <= 0) submitQuiz();
  }, 1000);
}

function submitQuiz() {
  clearInterval(currentQuiz.timer);
  const qs = currentQuiz.questions;
  let correct = 0;
  qs.forEach((q, i) => { if (currentQuiz.answers[i] === q.ans) correct++; });
  const wrong = qs.filter((q,i) => currentQuiz.answers[i] !== -1 && currentQuiz.answers[i] !== q.ans).length;
  const skipped = qs.filter((q,i) => currentQuiz.answers[i] === -1).length;
  const pct = Math.round((correct / qs.length) * 100);

  document.getElementById('quiz-panel').style.display = 'none';
  document.getElementById('result-panel').style.display = 'block';
  document.getElementById('resultIcon').textContent = pct >= 80 ? '🏆' : pct >= 60 ? '🎉' : '📚';
  document.getElementById('resultTitle').textContent = pct >= 80 ? 'Excellent Performance!' : pct >= 60 ? 'Good Job!' : 'Keep Practicing!';
  document.getElementById('resultScore').textContent = `${pct}%`;
  document.getElementById('resultBreakdown').innerHTML = `
    <div class="result-stat"><strong style="color:var(--accent-green)">${correct}</strong><span>Correct</span></div>
    <div class="result-stat"><strong style="color:var(--accent-rose)">${wrong}</strong><span>Wrong</span></div>
    <div class="result-stat"><strong style="color:var(--text-muted)">${skipped}</strong><span>Skipped</span></div>
    <div class="result-stat"><strong>${qs.length}</strong><span>Total</span></div>
  `;
  window.scrollTo(0, 0);
}

function exitQuiz() {
  clearInterval(currentQuiz.timer);
  document.getElementById('quiz-panel').style.display = 'none';
  document.getElementById('result-panel').style.display = 'none';
  document.getElementById('tests-landing').style.display = 'block';
}

// ── TOAST ──
function toast(msg) {
  const t = document.createElement('div');
  t.style.cssText = `position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(20px);
    background:var(--text-primary);color:var(--bg);padding:10px 22px;border-radius:30px;
    font-size:0.85rem;font-weight:600;z-index:9999;box-shadow:var(--shadow-lg);
    animation:toastIn 0.3s forwards;white-space:nowrap;pointer-events:none;`;
  t.textContent = msg;
  const style = document.createElement('style');
  style.textContent = '@keyframes toastIn{to{transform:translateX(-50%) translateY(0)}}';
  document.head.appendChild(style);
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity 0.3s'; setTimeout(() => t.remove(), 300); }, 2800);
}

// ── SCROLL NAVBAR ──
window.addEventListener('scroll', () => {
  document.getElementById('navbar').style.boxShadow =
    window.scrollY > 10 ? 'var(--shadow-md)' : 'none';
});

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  renderCourses();
  renderMaterials();
  renderLeaderboard();
});
