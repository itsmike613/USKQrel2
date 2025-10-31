// State
let currentIndex = 0;
const n = QUESTIONS.length;
let userAnswers = Array(n).fill(null);

const categories = [...new Set(QUESTIONS.map(q => q.c))];

// Toggles
let allowPartial = true;
let showImages = true;

// Elements shortcuts
const el = id => document.getElementById(id);

function pad4(num) { return String(num).padStart(4, '0'); }

// Home init
function initHome() {
    el('categories-list').textContent = `Categories: ${categories.join(', ')}`;
    el('total-questions').textContent = `Total questions: ${n}`;
    // estimate: each question 15 seconds => total seconds = n*15, convert to minutes approximate
    const estMinutes = Math.max(1, Math.round(n * 15 / 60));
    el('est-time').textContent = `Est. time: ${estMinutes} min`;
    el('avg-score').textContent = `Avg total score: 700 (sample)`;

    // toggle hookup
    el('togglePartial').checked = allowPartial;
    el('toggleImages').checked = showImages;

    el('togglePartial').addEventListener('change', () => {
        allowPartial = el('togglePartial').checked;
    });
    el('toggleImages').addEventListener('change', () => {
        showImages = el('toggleImages').checked;
    });
}

// Render question in TEST view
function renderQuestion() {
    const q = QUESTIONS[currentIndex];
    el('qCategory').textContent = q.c;
    el('qText').textContent = q.q;
    // global count
    el('qGlobalCount').textContent = `${currentIndex + 1} / ${n}`;
    // category counts
    const qsInCat = QUESTIONS.map((x, i) => ({ ...x, i })).filter(x => x.c === q.c);
    const idxInCat = qsInCat.findIndex(x => x.i === currentIndex) + 1;
    el('qCatCount').textContent = `${idxInCat} / ${qsInCat.length}`;
    // category index out of total categories
    const catIdx = categories.indexOf(q.c) + 1;
    el('catIndexDisplay').textContent = `${catIdx} / ${categories.length}`;

    // options
    const oa = el('optionsArea');
    oa.innerHTML = '';
    q.o.forEach((opt, oi) => {
        const div = document.createElement('div');
        div.className = 'option';
        div.dataset.opt = oi;

        if (showImages && opt.i) {
            const img = document.createElement('img');
            img.src = opt.i;
            img.alt = opt.t;
            div.appendChild(img);
        } else {
            // show initial character or just text
            const img = document.createElement('div');
            img.style.width = '36px'; img.style.height = '36px';
            img.style.borderRadius = '4px';
            img.style.background = '#f0f0f0';
            img.style.display = 'flex'; img.style.alignItems = 'center'; img.style.justifyContent = 'center';
            img.textContent = opt.t[0];
            div.appendChild(img);
        }

        const meta = document.createElement('div');
        meta.className = 'meta';
        meta.textContent = opt.t;
        div.appendChild(meta);

        div.addEventListener('click', () => {
            selectOption(oi);
        });

        if (userAnswers[currentIndex] === oi) {
            div.classList.add('selected');
            el('nextBtn').disabled = false;
        }

        oa.appendChild(div);
    });

    // Back button
    el('backBtn').disabled = currentIndex === 0;
    // Next/Submit text
    if (currentIndex === n - 1) {
        el('nextBtn').textContent = 'Submit';
    } else {
        el('nextBtn').textContent = 'Next';
    }
    // disable Next if no answer
    el('nextBtn').disabled = userAnswers[currentIndex] === null;
}

// Option selection
function selectOption(optIndex) {
    userAnswers[currentIndex] = optIndex;
    const opts = Array.from(el('optionsArea').children);
    opts.forEach((d, i) => {
        d.classList.toggle('selected', i === optIndex);
    });
    el('nextBtn').disabled = false;
}

// Next / Submit click handler
function onNext() {
    if (currentIndex === n - 1) {
        // Submit
        if (userAnswers.some(a => a === null)) {
            alert('Please answer all questions before submitting.');
            return;
        }
        showResults();
        return;
    }
    currentIndex++;
    renderQuestion();
}

// Back click handler
function onBack() {
    if (currentIndex === 0) return;
    currentIndex--;
    renderQuestion();
}

// Retry handler
function onRetry() {
    userAnswers = Array(n).fill(null);
    currentIndex = 0;
    el('test').classList.add('hidden');
    el('done').classList.add('hidden');
    el('home').classList.remove('hidden');
    initHome();
}

// Render results
function showResults() {
    // compute total score
    let totalWeight = userAnswers.reduce((acc, sel, qi) => {
        if (sel === null) return acc;
        const w = QUESTIONS[qi].o[sel].w;
        if (!allowPartial && w < 1) {
            return acc; // partial credit disabled: ignore anything <1
        }
        return acc + w;
    }, 0);
    // if no partial credit, any answer that w<1 gets zero => effectively count only w===1
    if (!allowPartial) {
        // adjust totalWeight to count only full credits
        totalWeight = userAnswers.reduce((acc, sel, qi) => {
            if (sel === null) return acc;
            return QUESTIONS[qi].o[sel].w === 1 ? acc + 1 : acc;
        }, 0);
    }
    const effectiveTotal = allowPartial ? n : n; // scale factor is same count
    const avgWeight = totalWeight / effectiveTotal;
    const totalScore = Math.round(avgWeight * 1000);
    el('totalScore').textContent = pad4(totalScore);

    // category scores
    const catContainer = el('categoryScores');
    catContainer.innerHTML = '';
    categories.forEach(cat => {
        const qsInCat = QUESTIONS.map((q, i) => ({ ...q, i })).filter(q => q.c === cat);
        let sumWeight = qsInCat.reduce((s, q) => {
            const sel = userAnswers[q.i];
            if (sel === null) return s;
            const w = QUESTIONS[q.i].o[sel].w;
            if (!allowPartial && w < 1) {
                return s;
            }
            return s + w;
        }, 0);

        if (!allowPartial) {
            sumWeight = qsInCat.reduce((c, q) => {
                const sel = userAnswers[q.i];
                return c + ((sel !== null && QUESTIONS[q.i].o[sel].w === 1) ? 1 : 0);
            }, 0);
        }

        const len = qsInCat.length;
        const percent = Math.round((sumWeight / len) * 100);
        const correctCount = qsInCat.reduce((c, q) => {
            const sel = userAnswers[q.i];
            const w = sel === null ? 0 : QUESTIONS[q.i].o[sel].w;
            if (!allowPartial) {
                return c + ((sel !== null && w === 1) ? 1 : 0);
            } else {
                return c + (w === 1 ? 1 : 0);
            }
        }, 0);

        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `<strong>${cat}</strong>: <span class="percent">${percent}%</span> (${correctCount}/${len})`;
        catContainer.appendChild(div);
    });

    // Render done player at index 0
    renderDonePlayer(0);

    // switch views
    el('home').classList.add('hidden');
    el('test').classList.add('hidden');
    el('done').classList.remove('hidden');
}

// DONE player logic
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

    const optsWrap = document.createElement('div');
    q.o.forEach((opt, oi) => {
        const d = document.createElement('div');
        d.className = 'option';

        const sel = userAnswers[doneIndex] === oi;
        const w = opt.w;
        const correctOpt = w === 1;

        if (sel && correctOpt) d.classList.add('correct');
        if (sel && !correctOpt) d.classList.add('wrong');
        if (!sel && correctOpt) d.classList.add('correct');

        if (showImages && opt.i) {
            const img = document.createElement('img');
            img.src = opt.i;
            img.alt = opt.t;
            d.appendChild(img);
        } else {
            const img = document.createElement('div');
            img.style.width = '36px'; img.style.height = '36px';
            img.style.borderRadius = '4px';
            img.style.background = '#f0f0f0';
            img.style.display = 'flex'; img.style.alignItems = 'center'; img.style.justifyContent = 'center';
            img.textContent = opt.t[0];
            d.appendChild(img);
        }

        const meta = document.createElement('div');
        meta.style.display = 'flex';
        meta.style.alignItems = 'center';
        meta.style.gap = '8px';

        const txt = document.createElement('div');
        txt.textContent = opt.t;

        const worth = document.createElement('div');
        worth.className = 'opt-worth';
        const pts = Math.round(w * 1000);
        worth.textContent = `${pts} pts (${Math.round(w * 100)}%)`;

        meta.appendChild(txt);
        meta.appendChild(worth);

        d.appendChild(meta);
        optsWrap.appendChild(d);
    });
    container.appendChild(optsWrap);

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

// Bind buttons
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

initHome();