const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const config = { host: 'localhost', port: 3306, user: 'root', password: 'vtu24465', multipleStatements: true };

async function init() {
    try {
        const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
        const conn = await mysql.createConnection(config);
        console.log('Connected to MySQL.');
        
        await conn.query(sql);
        console.log('Database and tables initialized successfully!');
        
        await conn.end();
    } catch (e) {
        console.error('Initialization failed:', e.message);
    }
}
init();
