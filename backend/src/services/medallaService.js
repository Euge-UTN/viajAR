const pool = require('../config/database');

// VERIFICAR MEDALLAS POR VIAJES COMPLETADOS
const verificarMedallasViajes = async (idUsuario) => {
    try {
        // Contar los viajes finalizados del usuario
        const resultado = await pool.query(`
            SELECT COUNT(*) AS cantidad
            FROM viaje
            WHERE id_usuario = $1
              AND estado = 'Finalizado'
              AND activo = TRUE;
        `, [idUsuario]);

        const cantidadViajes = Number(resultado.rows[0].cantidad);

        // Buscar las medallas que cumple el usuario
        const medallas = await pool.query(`
            SELECT id_medalla
            FROM medalla
            WHERE tipo_condicion = 'VIAJES_COMPLETADOS'
              AND valor_objetivo <= $1
              AND activo = TRUE;
        `, [cantidadViajes]);

        // Registrar las medallas desbloqueadas
        for (const medalla of medallas.rows) {
            await pool.query(`
                INSERT INTO usuario_medalla (
                    id_usuario,
                    id_medalla
                )
                VALUES ($1, $2)
                ON CONFLICT (id_usuario, id_medalla) DO NOTHING;
            `, [idUsuario, medalla.id_medalla]);
        }

    } catch (error) {
        console.error('Error al verificar medallas por viajes:', error);
        throw error;
    }
};

// VERIFICAR MEDALLAS POR LUGARES VISITADOS
const verificarMedallasVisitas = async (idUsuario) => {
    try {
        const resultado = await pool.query(`
            SELECT COUNT(DISTINCT id_lugar) AS cantidad
            FROM resena
            WHERE id_usuario = $1;
        `, [idUsuario]);

        const cantidadLugares = Number(resultado.rows[0].cantidad);

        const medallas = await pool.query(`
            SELECT id_medalla
            FROM medalla
            WHERE tipo_condicion = 'LUGARES_VISITADOS'
              AND valor_objetivo <= $1
              AND activo = TRUE;
        `, [cantidadLugares]);

        for (const medalla of medallas.rows) {
            await pool.query(`
                INSERT INTO usuario_medalla (id_usuario, id_medalla)
                VALUES ($1, $2)
                ON CONFLICT (id_usuario, id_medalla) DO NOTHING;
            `, [idUsuario, medalla.id_medalla]);
        }
    } catch (error) {
        console.error('Error al verificar medallas por visitas:', error);
        throw error;
    }
};

// VERIFICAR MEDALLAS POR RESEÑAS PUBLICADAS
const verificarMedallasResenas = async (idUsuario) => {
    try {
        const resultado = await pool.query(`
            SELECT COUNT(*) AS cantidad
            FROM resena
            WHERE id_usuario = $1;
        `, [idUsuario]);

        const cantidadResenas = Number(resultado.rows[0].cantidad);

        const medallas = await pool.query(`
            SELECT id_medalla
            FROM medalla
            WHERE tipo_condicion = 'RESENAS_PUBLICADAS'
              AND valor_objetivo <= $1
              AND activo = TRUE;
        `, [cantidadResenas]);

        for (const medalla of medallas.rows) {
            await pool.query(`
                INSERT INTO usuario_medalla (id_usuario, id_medalla)
                VALUES ($1, $2)
                ON CONFLICT (id_usuario, id_medalla) DO NOTHING;
            `, [idUsuario, medalla.id_medalla]);
        }
    } catch (error) {
        console.error('Error al verificar medallas por reseñas:', error);
        throw error;
    }
};

module.exports = {
    verificarMedallasViajes,
    verificarMedallasVisitas,
    verificarMedallasResenas
};