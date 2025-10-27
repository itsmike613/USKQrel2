// state
let currentIndex = 0; // index across full test
const n = QUESTIONS.length;
const userAnswers = Array(n).fill(null); // stores selected option index
// derived category mapping
const categories = [...new Set(QUESTIONS.map(q => q.c))];

const el = id => document.getElementById(id);

function pad4(num) { return String(num).padStart(4, '0'); }

// Home init
function initHome() {
    el('categories-list').textContent = `Categories: ${categories.join(', ')}`;
    el('total-questions').textContent = `Total questions: ${n}`;
    // estimate: 30s per question
    const est = Math.max(1, Math.round(n * (1/3))); // minutes roughly
    el('est-time').textContent = `Est. time: ${est} min`;
    // average total score: use sample historical mean (placeholder)
    el('avg-score').textContent = `Avg total score: 700 (sample)`;
}

// Render test screen info for currentIndex
function renderQuestion() {
    const q = QUESTIONS[currentIndex];
    el('qCategory').textContent = q.c;
    el('qText').textContent = q.q;
    // counts: question X of category
    const catQuestions = QUESTIONS.map((x, i) => ({ ...x, i })).filter(x => x.c === q.c);
    const idxInCat = catQuestions.findIndex(x => x.i === currentIndex) + 1;
    el('qCounts').textContent = `Category: ${idxInCat} / ${catQuestions.length}`;
    el('globalCount').textContent = `${currentIndex + 1} / ${n}`;
    // options
    const oa = el('optionsArea');
    oa.innerHTML = '';
    q.o.forEach((opt, oi) => {
        const div = document.createElement('div');
        div.className = 'option';
        div.dataset.opt = oi;
        // image (placeholder circle)
        const img = document.createElement('div');
        img.style.width = '36px'; img.style.height = '36px';
        img.style.borderRadius = '6px';
        img.style.background = '#f0f0f0';
        img.style.display = 'flex'; img.style.alignItems = 'center'; img.style.justifyContent = 'center';
        img.textContent = opt.i ? '' : opt.t[0];
        const meta = document.createElement('div');
        meta.className = 'meta';
        meta.textContent = opt.t;
        div.appendChild(img);
        div.appendChild(meta);
        div.addEventListener('click', () => {
            selectOption(oi);
        });
        // mark selected if previously chosen
        if (userAnswers[currentIndex] === oi) {
            div.classList.add('selected');
            el('nextBtn').disabled = false;
        }
        oa.appendChild(div);
    });
    // Back disabled on first question
    el('backBtn').disabled = currentIndex === 0;
    // Next text and disabled logic
    if (currentIndex === n - 1) {
        el('nextBtn').textContent = 'Submit';
    } else {
        el('nextBtn').textContent = 'Next';
    }
    // if no selection on this q, disable next
    el('nextBtn').disabled = userAnswers[currentIndex] === null;
}

// select option for current question
function selectOption(optIndex) {
    userAnswers[currentIndex] = optIndex;
    // update UI
    const opts = Array.from(el('optionsArea').children);
    opts.forEach((d, i) => {
        d.classList.toggle('selected', i === optIndex);
    });
    el('nextBtn').disabled = false;
}

// Next/Submit handler
function onNext() {
    if (currentIndex === n - 1) {
        // Submit
        if (userAnswers.some(a => a === null)) {
            // shouldn't happen because Next disabled until chosen, but safe.
            alert('Please answer all questions before submitting.');
            return;
        }
        showResults();
        return;
    }
    currentIndex++;
    renderQuestion();
}

// Back handler
function onBack() {
    if (currentIndex === 0) return;
    currentIndex--;
    renderQuestion();
}

// Retry: reset and go home
function onRetry() {
    for (let i = 0; i < n; i++) userAnswers[i] = null;
    currentIndex = 0;
    el('test').classList.add('hidden');
    el('done').classList.add('hidden');
    el('home').classList.remove('hidden');
    initHome();
}

// Results calculation and render done view
function showResults() {
    // compute total score 0000-1000
    const totalWeight = userAnswers.reduce((acc, sel, qi) => acc + (sel === null ? 0 : QUESTIONS[qi].o[sel].w), 0);
    const avgWeight = totalWeight / n; // 0..1
    const totalScore = Math.round(avgWeight * 1000);
    el('totalScore').textContent = pad4(totalScore);

    // category percent and counts
    const catContainer = el('categoryScores');
    catContainer.innerHTML = '';
    categories.forEach(cat => {
        const qsInCat = QUESTIONS.map((q, i) => ({ ...q, i })).filter(q => q.c === cat);
        const sumWeight = qsInCat.reduce((s, q) => {
            const sel = userAnswers[q.i];
            return s + (sel === null ? 0 : QUESTIONS[q.i].o[sel].w);
        }, 0);
        const percent = Math.round((sumWeight / qsInCat.length) * 100);
        const correctCount = qsInCat.reduce((c, q) => {
            const sel = userAnswers[q.i];
            return c + ((sel !== null && QUESTIONS[q.i].o[sel].w === 1) ? 1 : 0);
        }, 0);
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `<strong>${cat}</strong>: <span class="percent">${percent}%</span> (${correctCount}/${qsInCat.length})`;
        catContainer.appendChild(div);
    });

    // Render done player
    renderDonePlayer(0);

    // switch views
    el('home').classList.add('hidden');
    el('test').classList.add('hidden');
    el('done').classList.remove('hidden');
}

// DONE player render with infinite nav
let doneIndex = 0;
function renderDonePlayer(idx) {
    doneIndex = idx;
    const q = QUESTIONS[doneIndex];
    const container = el('donePlayer');
    container.innerHTML = '';
    const header = document.createElement('div');
    header.className = 'header';
    header.innerHTML = `<div><div class="category">${q.c}</div><div class="question">${q.q}</div><div class="small-muted">${doneIndex + 1} / ${n}</div></div>`;
    container.appendChild(header);

    // options with correctness coloring and worth
    const optsWrap = document.createElement('div');
    q.o.forEach((opt, oi) => {
        const d = document.createElement('div');
        d.className = 'option';
        const isSelected = (userAnswers[doneIndex] === oi);
        const correctOpt = opt.w === 1;
        // style: if selected & correct -> correct; if selected & wrong -> wrong + show correct green
        if (isSelected && correctOpt) d.classList.add('correct');
        if (isSelected && !correctOpt) d.classList.add('wrong');

        // if not selected but is correct, show correct green
        if (!isSelected && correctOpt) {
            d.classList.add('correct');
        }

        const img = document.createElement('div');
        img.style.width = '36px'; img.style.height = '36px';
        img.style.borderRadius = '6px';
        img.style.background = '#f0f0f0';
        img.style.display = 'flex'; img.style.alignItems = 'center'; img.style.justifyContent = 'center';
        img.textContent = opt.i ? '' : opt.t[0];

        const meta = document.createElement('div');
        meta.style.display = 'flex';
        meta.style.alignItems = 'center';
        meta.style.gap = '8px';
        const txt = document.createElement('div');
        txt.textContent = opt.t;

        const worth = document.createElement('div');
        worth.className = 'opt-worth';
        const pts = Math.round(opt.w * 1000);
        worth.textContent = `${pts} pts (${Math.round(opt.w * 100)}%)`;

        meta.appendChild(txt);
        meta.appendChild(worth);

        d.appendChild(img);
        d.appendChild(meta);
        optsWrap.appendChild(d);
    });
    container.appendChild(optsWrap);

    // explanation
    const expl = document.createElement('div');
    expl.className = 'explanation';
    expl.textContent = q.e;
    container.appendChild(expl);
}

// Done nav infinite
function doneNext() {
    const ni = (doneIndex + 1) % n;
    renderDonePlayer(ni);
}
function doneBack() {
    const pi = (doneIndex - 1 + n) % n;
    renderDonePlayer(pi);
}

// Wire up buttons
el('startBtn').addEventListener('click', () => {
    el('home').classList.add('hidden');
    el('test').classList.remove('hidden');
    currentIndex = 0;
    renderQuestion();
});
el('nextBtn').addEventListener('click', onNext);
el('backBtn').addEventListener('click', onBack);
el('retryBtn').addEventListener('click', onRetry);
el('doneRetry').addEventListener('click', onRetry);
el('doneNext').addEventListener('click', doneNext);
el('doneBack').addEventListener('click', doneBack);

// init
initHome();