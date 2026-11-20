const fs = require('fs');
const path = require('path');
const pool = require('../src/config/database');

const ejecutarMigraciones = async () => {
    const carpetaMigraciones = path.join(__dirname, '../database/migrations');

    // Obtener archivos SQL ordenados por nombre
    const archivos = fs.readdirSync(carpetaMigraciones)
        .filter(archivo => archivo.endsWith('.sql'))
        .sort();

    const client = await pool.connect();

    try {
        for (const archivo of archivos) {

            // Verificar si la migración ya fue aplicada
            const existente = await client.query(`
                SELECT id_migracion
                FROM migraciones
                WHERE nombre_archivo = $1;
            `, [archivo]);

            if (existente.rows.length > 0) {
                console.log(`Ya aplicada: ${archivo}`);
                continue;
            }

            // Leer el contenido del archivo
            const rutaArchivo = path.join(carpetaMigraciones, archivo);
            const sql = fs.readFileSync(rutaArchivo, 'utf8');

            try {
                await client.query('BEGIN');

                // Ejecutar la migración
                await client.query(sql);

                // Registrar la migración como aplicada
                await client.query(`
                    INSERT INTO migraciones (nombre_archivo)
                    VALUES ($1);
                `, [archivo]);

                await client.query('COMMIT');

                console.log(`Migración aplicada: ${archivo}`);

            } catch (error) {
                await client.query('ROLLBACK');
                throw new Error(`Error en ${archivo}: ${error.message}`);
            }
        }

        console.log('Proceso de migraciones finalizado.');

    } finally {
        client.release();
    }
};

ejecutarMigraciones()
    .catch(error => {
        console.error('Error al ejecutar migraciones:', error.message);
        process.exitCode = 1;
    })
    .finally(async () => {
        await pool.end();
    });