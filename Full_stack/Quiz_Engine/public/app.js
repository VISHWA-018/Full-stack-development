// ES6 — CSE Quiz Engine App Logic
document.addEventListener('DOMContentLoaded', () => {
    const API = 'http://localhost:3000/api';

    // ── DOM ──
    const sections = { register: 'register-section', quiz: 'quiz-section', result: 'result-section', leaderboard: 'leaderboard-section' };

    const $ = id => document.getElementById(id);
    const showSection = key => {
        Object.values(sections).forEach(id => { const el = $(id); el.classList.remove('active'); el.classList.add('hidden'); });
        const el = $(sections[key]);
        el.classList.remove('hidden');
        el.classList.add('active');
    };

    // ── State ──
    let userName = '', questions = [], currentIndex = 0;
    let userAnswers = {}, streak = 0, maxStreak = 0;
    let finalScore = 0, finalTotal = 0, finalPercent = 0, finalStreak = 0;
    let timerInterval = null, timeLeft = 30;

    // ── Event Listeners ──
    $('start-btn').addEventListener('click', startQuiz);
    $('next-btn').addEventListener('click', nextQuestion);
    $('download-btn').addEventListener('click', downloadCertificate);
    $('leaderboard-btn').addEventListener('click', showLeaderboard);
    $('leaderboard-nav-btn').addEventListener('click', showLeaderboard);
    $('back-btn').addEventListener('click', () => showSection('result'));

    // ── Start Quiz ──
    async function startQuiz() {
        userName = $('username').value.trim();
        if (!userName) { $('username').focus(); return; }
        $('start-btn').textContent = 'Loading…';
        try {
            const res = await fetch(`${API}/questions`);
            questions = await res.json();
            if (questions.error) throw new Error(questions.error);
            showSection('quiz');
            $('q-total').textContent = questions.length;
            loadQuestion();
        } catch (e) {
            alert('Could not connect to server or database.\nMake sure MySQL is running and schema.sql is imported!');
            $('start-btn').textContent = 'Start Quiz →';
        }
    }

    // ── Load Question ──
    function loadQuestion() {
        clearTimer();
        $('next-btn').classList.add('hidden');
        const q = questions[currentIndex];

        // Meta badges
        $('category-badge').textContent = q.category;
        $('difficulty-badge').textContent = q.difficulty;
        $('q-current').textContent = currentIndex + 1;
        $('progress-bar').style.width = `${(currentIndex / questions.length) * 100}%`;
        $('question-text').textContent = q.question_text;
        $('streak-count').textContent = streak;

        // Options
        const opts = [{ k: 'A', v: q.option_a }, { k: 'B', v: q.option_b }, { k: 'C', v: q.option_c }, { k: 'D', v: q.option_d }];
        $('options-container').innerHTML = opts.map(o => `
            <div class="option" data-opt="${o.k}" onclick="window.__selectOption(this, '${o.k}', ${q.id})">
                <div class="opt-label">${o.k}</div>
                <span>${o.v}</span>
            </div>`).join('');

        startTimer(q.id);
    }

    // ── Timer ──
    function startTimer(questionId) {
        timeLeft = 30;
        $('timer-text').textContent = timeLeft;
        $('timer-bar').style.width = '100%';
        timerInterval = setInterval(() => {
            timeLeft--;
            $('timer-text').textContent = timeLeft;
            $('timer-bar').style.width = `${(timeLeft / 30) * 100}%`;
            if (timeLeft <= 0) { clearTimer(); autoSkip(questionId); }
        }, 1000);
    }

    function clearTimer() { clearInterval(timerInterval); timerInterval = null; }

    function autoSkip(questionId) {
        // mark as skipped
        userAnswers[questionId] = null;
        streak = 0;
        $('streak-count').textContent = streak;
        disableOptions();
        $('next-btn').classList.remove('hidden');
        if (currentIndex === questions.length - 1) $('next-btn').textContent = 'Submit Quiz';
    }

    // ── Select Option ──
    window.__selectOption = function(el, optionKey, questionId) {
        if ($('next-btn').classList.contains('hidden') === false && userAnswers[questionId]) return;
        document.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
        el.classList.add('selected');
        userAnswers[questionId] = optionKey;
        $('next-btn').classList.remove('hidden');
        if (currentIndex === questions.length - 1) $('next-btn').textContent = 'Submit Quiz';
    };

    function disableOptions() {
        document.querySelectorAll('.option').forEach(o => { o.style.pointerEvents = 'none'; });
    }

    // ── Next / Submit ──
    async function nextQuestion() {
        clearTimer();
        if (currentIndex < questions.length - 1) {
            currentIndex++;
            loadQuestion();
        } else {
            await submitQuiz();
        }
    }

    async function submitQuiz() {
        try {
            const res = await fetch(`${API}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userName, answers: userAnswers })
            });
            const data = await res.json();
            if (!data.success) throw new Error('Submit failed');

            finalScore = data.score;
            finalTotal = data.total;
            finalPercent = data.percentage;
            finalStreak = data.streak;
            showResult();
        } catch (e) {
            alert('Error submitting quiz: ' + e.message);
        }
    }

    // ── Show Result ──
    function showResult() {
        const grade = finalPercent >= 90 ? 'A+' : finalPercent >= 75 ? 'A' : finalPercent >= 60 ? 'B' : 'C';
        const emoji = finalPercent >= 80 ? '🎉' : finalPercent >= 50 ? '😊' : '💪';
        $('result-emoji').textContent = emoji;
        $('result-name').textContent = `Well done, ${userName}!`;
        $('res-score').textContent = `${finalScore}/${finalTotal}`;
        $('res-percent').textContent = `${finalPercent}%`;
        $('res-grade').textContent = grade;
        $('res-streak').textContent = `${finalStreak} 🔥`;
        showSection('result');
    }

    // ── Download Certificate ──
    async function downloadCertificate() {
        const btn = $('download-btn');
        btn.textContent = '⏳ Generating…';
        btn.disabled = true;
        try {
            const res = await fetch(`${API}/certificate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userName, score: finalScore, total: finalTotal, streak: finalStreak, percentage: finalPercent })
            });
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            Object.assign(document.createElement('a'), { href: url, download: `Certificate_${userName}.pdf` }).click();
            URL.revokeObjectURL(url);
        } catch (e) {
            alert('Failed to generate certificate');
        } finally {
            btn.textContent = '📄 Download Certificate';
            btn.disabled = false;
        }
    }

    // ── Leaderboard ──
    async function showLeaderboard() {
        try {
            const res = await fetch(`${API}/leaderboard`);
            const data = await res.json();
            const rankEmoji = ['🥇', '🥈', '🥉'];
            $('leaderboard-body').innerHTML = data.map((r, i) => `
                <tr>
                    <td><span class="rank-badge ${i < 3 ? `rank-${i+1}` : ''}">${rankEmoji[i] || i + 1}</span></td>
                    <td><strong>${r.user_name}</strong></td>
                    <td>${r.score}/${r.total}</td>
                    <td>${r.percentage}%</td>
                    <td>${r.streak} 🔥</td>
                </tr>`).join('');
            showSection('leaderboard');
        } catch (e) {
            alert('Could not load leaderboard');
        }
    }
});
