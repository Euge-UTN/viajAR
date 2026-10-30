const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

pool.on('connect', () => {
    console.log('Conexión con PostgreSQL establecida');
});

pool.on('error', (error) => {
    console.error('Error inesperado en PostgreSQL:', error.message);
});

module.exports = pool;