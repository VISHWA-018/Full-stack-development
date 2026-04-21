const mysql = require('mysql2/promise');
const config = { host: 'localhost', port: 3306, user: 'root', password: 'vtu24465' };

async function test() {
    try {
        const conn = await mysql.createConnection(config);
        console.log('Connected successfully!');
        const [rows] = await conn.execute('SHOW DATABASES LIKE "quiz_engine"');
        console.log('Database quiz_engine exists:', rows.length > 0);
        await conn.end();
    } catch (e) {
        console.error('Connection failed:', e.message);
    }
}
test();
