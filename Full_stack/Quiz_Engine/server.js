const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const PDFDocument = require('pdfkit');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const dbConfig = { host: 'localhost', port: 3306, user: 'root', password: 'vtu24465', database: 'quiz_engine' };
const getConn = () => mysql.createConnection(dbConfig);

// ─── Auto-create mistakes table if not exists ────────────────────────────────
(async () => {
    try {
        const conn = await getConn();
        await conn.execute(`CREATE TABLE IF NOT EXISTS mistakes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            attempt_id INT NOT NULL,
            question_id INT NOT NULL,
            user_answer CHAR(1),
            correct_answer CHAR(1),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (attempt_id) REFERENCES attempts(id),
            FOREIGN KEY (question_id) REFERENCES questions(id)
        )`);
        await conn.end();
    } catch(e) { console.error('mistakes table init:', e.message); }
})();

// ─── Helper: generate unique cert code ───────────────────────────────────────
const genCertCode = () => 'CERT-' + crypto.randomBytes(4).toString('hex').toUpperCase();

// ════════════════════════════════════════════════════════════════════════════════
// AUTH ROUTES
// ════════════════════════════════════════════════════════════════════════════════

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields required.' });
    try {
        const conn = await getConn();
        const [existing] = await conn.execute('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) { await conn.end(); return res.status(409).json({ error: 'Email already registered.' }); }
        const hashed = await bcrypt.hash(password, 10);
        const [result] = await conn.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashed]);
        await conn.end();
        res.json({ success: true, user: { id: result.insertId, name, email, role: 'student' } });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required.' });
    try {
        const conn = await getConn();
        const [users] = await conn.execute('SELECT * FROM users WHERE email = ?', [email]);
        await conn.end();
        if (users.length === 0) return res.status(401).json({ error: 'Invalid credentials.' });
        const user = users[0];
        // Allow plain text for admin default, otherwise bcrypt compare
        const match = user.password === password || await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: 'Invalid credentials.' });
        res.json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ════════════════════════════════════════════════════════════════════════════════
// QUIZ ROUTES
// ════════════════════════════════════════════════════════════════════════════════

// GET /api/questions?limit=10&difficulty=all&category=all
app.get('/api/questions', async (req, res) => {
    const { difficulty = 'all', limit = 10, category = 'all' } = req.query;
    const safeLimit = Math.max(1, Math.min(100, parseInt(limit) || 10));
    try {
        const conn = await getConn();
        let sql = `SELECT id, question_text, question_type, option_a, option_b, option_c, option_d, category, difficulty, points FROM questions`;
        const params = [];
        const conds = [];
        if (difficulty !== 'all') { conds.push('difficulty = ?'); params.push(difficulty); }
        if (category !== 'all') {
            const cats = category.split(',');
            conds.push(`category IN (${cats.map(() => '?').join(',')})`);
            params.push(...cats);
        }
        if (conds.length) sql += ' WHERE ' + conds.join(' AND ');
        sql += ` ORDER BY RAND() LIMIT ${safeLimit}`;
        const [rows] = await conn.execute(sql, params);
        await conn.end();
        res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/submit
app.post('/api/submit', async (req, res) => {
    const { userId, answers, timeTaken } = req.body;
    try {
        const conn = await getConn();
        // Only score the questions the user actually saw
        const answeredIds = Object.keys(answers || {}).map(id => parseInt(id)).filter(id => !isNaN(id));
        let score = 0, maxScore = 0, streak = 0, maxStreak = 0;
        if (answeredIds.length > 0) {
            const ph = answeredIds.map(() => '?').join(',');
            const [questions] = await conn.execute(`SELECT id, correct_option, points FROM questions WHERE id IN (${ph})`, answeredIds);
            questions.forEach(q => {
                maxScore += q.points;
                if (answers[q.id] === q.correct_option) {
                    score += q.points; streak++; maxStreak = Math.max(maxStreak, streak);
                } else { streak = 0; }
            });
        }
        const total = maxScore;
        const percent = total > 0 ? +((score / total) * 100).toFixed(2) : 0;
        const [ins] = await conn.execute(
            'INSERT INTO attempts (user_id, score, total, streak, percentage, time_taken) VALUES (?,?,?,?,?,?)',
            [userId, score, total, maxStreak, percent, timeTaken || 0]
        );
        const attemptId = ins.insertId;
        // Record mistakes for flashcard review
        if (answeredIds.length > 0) {
            const ph2 = answeredIds.map(() => '?').join(',');
            const [allQs] = await conn.execute(`SELECT id, correct_option FROM questions WHERE id IN (${ph2})`, answeredIds);
            for (const q of allQs) {
                const userAns = answers[q.id];
                if (userAns !== q.correct_option) {
                    try {
                        await conn.execute(
                            'INSERT INTO mistakes (user_id, attempt_id, question_id, user_answer, correct_answer) VALUES (?,?,?,?,?)',
                            [userId, attemptId, q.id, userAns || null, q.correct_option]
                        );
                    } catch(e) { /* skip dup */ }
                }
            }
        }
        await conn.end();
        res.json({ success: true, score, total, streak: maxStreak, percentage: percent, attemptId });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/history/:userId
app.get('/api/history/:userId', async (req, res) => {
    try {
        const conn = await getConn();
        const [rows] = await conn.execute(
            'SELECT a.*, c.cert_code FROM attempts a LEFT JOIN certificates c ON c.attempt_id = a.id WHERE a.user_id = ? ORDER BY a.date_taken DESC LIMIT 20',
            [req.params.userId]
        );
        await conn.end();
        res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/flashcards/:userId — returns distinct wrong questions for review
app.get('/api/flashcards/:userId', async (req, res) => {
    try {
        const conn = await getConn();
        const [rows] = await conn.execute(`
            SELECT q.id, q.question_text, q.question_type,
                   q.option_a, q.option_b, q.option_c, q.option_d,
                   q.correct_option, q.category, q.difficulty,
                   ANY_VALUE(m.user_answer) as user_answer,
                   MAX(m.created_at) as last_mistake
            FROM mistakes m
            JOIN questions q ON q.id = m.question_id
            WHERE m.user_id = ?
            GROUP BY q.id, q.question_text, q.question_type,
                     q.option_a, q.option_b, q.option_c, q.option_d,
                     q.correct_option, q.category, q.difficulty
            ORDER BY last_mistake DESC
            LIMIT 50`, [req.params.userId]);
        await conn.end();
        res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/leaderboard
app.get('/api/leaderboard', async (req, res) => {
    try {
        const conn = await getConn();
        const [rows] = await conn.execute(
            `SELECT u.name, MAX(a.score) as score, MAX(a.total) as total,
             MAX(a.streak) as streak, MAX(a.percentage) as percentage
             FROM attempts a JOIN users u ON u.id = a.user_id
             GROUP BY u.id, u.name ORDER BY percentage DESC, streak DESC LIMIT 10`
        );
        await conn.end();
        res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/stats/:userId  — for analytics charts
app.get('/api/stats/:userId', async (req, res) => {
    try {
        const conn = await getConn();
        const [attempts] = await conn.execute(
            'SELECT score, total, percentage, streak, time_taken, date_taken FROM attempts WHERE user_id = ? ORDER BY date_taken ASC LIMIT 10',
            [req.params.userId]
        );
        const [cats] = await conn.execute(`
            SELECT q.category, COUNT(*) as total,
            SUM(CASE WHEN q.correct_option IS NOT NULL THEN 1 ELSE 0 END) as attempted
            FROM questions q GROUP BY q.category`
        );
        await conn.end();
        res.json({ attempts, categories: cats });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/admin/stats — for admin dashboard
app.get('/api/admin/stats', async (req, res) => {
    try {
        const conn = await getConn();
        const [[{totalUsers}]] = await conn.execute('SELECT COUNT(*) as totalUsers FROM users WHERE role="student"');
        const [[{totalAttempts}]] = await conn.execute('SELECT COUNT(*) as totalAttempts FROM attempts');
        const [[{avgScore}]] = await conn.execute('SELECT AVG(percentage) as avgScore FROM attempts');
        const [recent] = await conn.execute(
            'SELECT u.name, a.score, a.total, a.percentage, a.date_taken FROM attempts a JOIN users u ON u.id=a.user_id ORDER BY a.date_taken DESC LIMIT 5'
        );
        await conn.end();
        res.json({ totalUsers, totalAttempts, avgScore: (parseFloat(avgScore)||0).toFixed(1), recentAttempts: recent });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/certificate
app.post('/api/certificate', async (req, res) => {
    const { userName, score, total, streak, percentage, attemptId, userId } = req.body;
    const grade = percentage >= 80 ? 'S' : percentage >= 65 ? 'A' : percentage >= 50 ? 'B' : percentage >= 35 ? 'C' : 'F';
    let certCode = genCertCode();

    try {
        const conn = await getConn();
        const [existing] = await conn.execute('SELECT cert_code FROM certificates WHERE attempt_id = ?', [attemptId]);
        if (existing.length > 0) { certCode = existing[0].cert_code; }
        else { await conn.execute('INSERT INTO certificates (attempt_id, user_id, cert_code) VALUES (?,?,?)', [attemptId, userId, certCode]); }
        await conn.end();
    } catch (e) { /* skip cert saving errors */ }

    // ────── Realistic Academic Certificate Design ──────
    const doc = new PDFDocument({ layout: 'landscape', size: 'A4', margin: 0 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Certificate_${userName.replace(/[^a-zA-Z0-9]/g,'_')}.pdf`);
    doc.pipe(res);

    const W = doc.page.width, H = doc.page.height;
    
    // Background
    doc.rect(0, 0, W, H).fill('#ffffff');
    
    // Outer Border (Classic Academic)
    doc.rect(20, 20, W - 40, H - 40).lineWidth(4).stroke('#1e293b');
    doc.rect(26, 26, W - 52, H - 52).lineWidth(1).stroke('#334155');
    
    // Corner accents
    const cz = 10;
    doc.moveTo(26, 40).lineTo(40, 26).stroke('#1e293b');
    doc.moveTo(W - 26, 40).lineTo(W - 40, 26).stroke('#1e293b');
    doc.moveTo(26, H - 40).lineTo(40, H - 26).stroke('#1e293b');
    doc.moveTo(W - 26, H - 40).lineTo(W - 40, H - 26).stroke('#1e293b');

    // Header Element
    doc.fillColor('#0f172a').font('Times-Bold').fontSize(38)
        .text('CERTIFICATE OF EXCELLENCE', 0, 80, { align: 'center', width: W });
        
    // Platform branding line
    doc.fillColor('#334155').font('Helvetica').fontSize(11)
        .text('CSE Quiz Engine — Online Assessment Platform', 0, 125, { align: 'center', width: W, characterSpacing: 1 });
    
    // Decorative lines
    doc.moveTo((W - 300)/2, 145).lineTo((W + 300)/2, 145).lineWidth(1).stroke('#cbd5e1');
    doc.moveTo((W - 200)/2, 148).lineTo((W + 200)/2, 148).lineWidth(0.5).stroke('#cbd5e1');

    doc.fillColor('#475569').font('Times-Roman').fontSize(16).text('This is to certify that', 0, 190, { align: 'center', width: W });
    
    // Student Name
    doc.fillColor('#000000').font('Times-Italic').fontSize(46).text(userName, 0, 230, { align: 'center', width: W });
    
    // Line under name
    doc.moveTo((W - 400)/2, 285).lineTo((W + 400)/2, 285).lineWidth(1).stroke('#94a3b8');

    doc.fillColor('#475569').font('Times-Roman').fontSize(15)
        .text('has successfully completed the comprehensive online assessment in Computer Science fundamentals', 0, 310, { align: 'center', width: W, lineGap: 6 });
    
    // Stats Block
    const statsY = 370;
    const statBoxes = [
        { label: 'SCORE', value: `${score}/${total}` },
        { label: 'PERCENTAGE', value: `${percentage}%` },
        { label: 'GRADE', value: grade },
        { label: 'MAX STREAK', value: `${streak}` }
    ];
    
    const bw = 140, gap = 20;
    const totalBW = statBoxes.length * bw + (statBoxes.length - 1) * gap;
    const startX = (W - totalBW) / 2;
    
    statBoxes.forEach((s, i) => {
        const bx = startX + i * (bw + gap);
        doc.rect(bx, statsY, bw, 65).fill('#f8fafc').stroke('#e2e8f0');
        doc.fillColor('#64748b').font('Helvetica-Bold').fontSize(8).text(s.label, bx, statsY + 12, { width: bw, align: 'center', characterSpacing: 1 });
        doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(22).text(s.value, bx, statsY + 30, { width: bw, align: 'center' });
    });

    // Clean platform footer — no fake names
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    doc.moveTo(60, H - 60).lineTo(W - 60, H - 60).lineWidth(0.5).stroke('#e2e8f0');
    doc.fillColor('#94a3b8').font('Helvetica').fontSize(9)
        .text(`Issued: ${date}   |   Certificate ID: ${certCode}   |   csequiz.app/verify/${certCode}`, 0, H - 44, { align: 'center', width: W, characterSpacing: 0.5 });

    doc.end();
});

app.listen(PORT, () => {
    console.log(`\n🚀 Quiz Platform → http://localhost:${PORT}`);
    console.log('Admin Login: admin@quiz.com / admin123\n');
});
