const pool = require('../config/database');

// VALIDAR IDENTIFICADORES
const esIdValido = (id) => {
    return /^[1-9]\d*$/.test(String(id));
};

// PUBLICAR UNA RESEÑA
const crearResena = async (req, res) => {
    try {
        const { idLugar } = req.params;
        const { puntuacion, comentario } = req.body;

        // Validar el identificador del lugar
        if (!esIdValido(idLugar)) {
            return res.status(400).json({
                mensaje: 'El ID del lugar no es válido'
            });
        }

        // Validar la puntuación
        const valorPuntuacion = Number(puntuacion);

        if (
            puntuacion === undefined ||
            puntuacion === null ||
            puntuacion === '' ||
            !Number.isInteger(valorPuntuacion) ||
            valorPuntuacion < 1 ||
            valorPuntuacion > 5
        ) {
            return res.status(400).json({
                mensaje: 'La puntuación debe ser un número entero entre 1 y 5'
            });
        }

        // Validar el comentario
        if (
            comentario !== undefined &&
            comentario !== null &&
            typeof comentario !== 'string'
        ) {
            return res.status(400).json({
                mensaje: 'El comentario debe ser un texto válido'
            });
        }

        // Verificar que el lugar exista y esté activo
        const lugar = await pool.query(`
            SELECT id_lugar
            FROM lugar_turistico
            WHERE id_lugar = $1
              AND activo = TRUE;
        `, [idLugar]);

        if (lugar.rows.length === 0) {
            return res.status(404).json({
                mensaje: 'Lugar turístico no encontrado'
            });
        }

        // Registrar la reseña
        const resultado = await pool.query(`
            INSERT INTO resena (
                id_usuario,
                id_lugar,
                puntuacion,
                comentario
            )
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (id_usuario, id_lugar) DO NOTHING
            RETURNING *;
        `, [
            req.usuario.id,
            idLugar,
            valorPuntuacion,
            comentario?.trim() || null
        ]);

        if (resultado.rows.length === 0) {
            return res.status(409).json({
                mensaje: 'Ya publicaste una reseña para este lugar'
            });
        }

        res.status(201).json({
            mensaje: 'Reseña publicada correctamente',
            resena: resultado.rows[0]
        });

    } catch (error) {
        console.error('Error al publicar reseña:', error);
        res.status(500).json({
            mensaje: 'Error al publicar la reseña'
        });
    }
};

// CONSULTAR LAS RESEÑAS DE UN LUGAR
const obtenerResenasPorLugar = async (req, res) => {
    try {
        const { idLugar } = req.params;

        // Validar el identificador del lugar
        if (!esIdValido(idLugar)) {
            return res.status(400).json({
                mensaje: 'El ID del lugar no es válido'
            });
        }

        // Verificar que el lugar exista y esté activo
        const lugar = await pool.query(`
            SELECT id_lugar
            FROM lugar_turistico
            WHERE id_lugar = $1
              AND activo = TRUE;
        `, [idLugar]);

        if (lugar.rows.length === 0) {
            return res.status(404).json({
                mensaje: 'Lugar turístico no encontrado'
            });
        }

        // Consultar las reseñas del lugar
        const resultado = await pool.query(`
            SELECT
                r.id_resena,
                r.id_usuario,
                u.nombre AS usuario,
                r.puntuacion,
                r.comentario,
                r.fecha_creacion
            FROM resena r
            INNER JOIN usuario u
                ON r.id_usuario = u.id_usuario
            WHERE r.id_lugar = $1
            ORDER BY r.fecha_creacion DESC;
        `, [idLugar]);

        // Calcular la valoración promedio
        const promedio = await pool.query(`
            SELECT
                ROUND(AVG(puntuacion), 2) AS valoracion_promedio,
                COUNT(*) AS cantidad_resenas
            FROM resena
            WHERE id_lugar = $1;
        `, [idLugar]);

        res.status(200).json({
            resenas: resultado.rows,
            valoracion: promedio.rows[0]
        });

    } catch (error) {
        console.error('Error al consultar reseñas:', error);
        res.status(500).json({
            mensaje: 'Error al consultar las reseñas'
        });
    }
};

// CONSULTAR LAS RESEÑAS DEL USUARIO
const obtenerResenas = async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT
                r.id_resena,
                r.id_lugar,
                lt.nombre AS lugar,
                r.puntuacion,
                r.comentario,
                r.fecha_creacion
            FROM resena r
            INNER JOIN lugar_turistico lt
                ON r.id_lugar = lt.id_lugar
            WHERE r.id_usuario = $1
            ORDER BY r.fecha_creacion DESC;
        `, [req.usuario.id]);

        res.status(200).json({
            resenas: resultado.rows
        });

    } catch (error) {
        console.error('Error al consultar reseñas del usuario:', error);
        res.status(500).json({
            mensaje: 'Error al consultar tus reseñas'
        });
    }
};

// ELIMINAR UNA RESEÑA
const eliminarResena = async (req, res) => {
    let client;
    let transaccionIniciada = false;

    try {
        const { idResena } = req.params;

        // Validar el identificador de la reseña
        if (!esIdValido(idResena)) {
            return res.status(400).json({
                mensaje: 'El ID de la reseña no es válido'
            });
        }

        client = await pool.connect();

        await client.query('BEGIN');
        transaccionIniciada = true;

        // Verificar que la reseña pertenezca al usuario
        const resena = await client.query(`
            SELECT id_resena
            FROM resena
            WHERE id_resena = $1
              AND id_usuario = $2;
        `, [idResena, req.usuario.id]);

        if (resena.rows.length === 0) {
            await client.query('ROLLBACK');
            transaccionIniciada = false;

            return res.status(404).json({
                mensaje: 'Reseña no encontrada'
            });
        }

        // Eliminar las fotos asociadas
        await client.query(`
            DELETE FROM foto_resena
            WHERE id_resena = $1;
        `, [idResena]);

        // Eliminar la reseña
        await client.query(`
            DELETE FROM resena
            WHERE id_resena = $1
              AND id_usuario = $2;
        `, [idResena, req.usuario.id]);

        await client.query('COMMIT');
        transaccionIniciada = false;

        res.status(200).json({
            mensaje: 'Reseña eliminada correctamente'
        });

    } catch (error) {
        if (client && transaccionIniciada) {
            await client.query('ROLLBACK');
        }

        console.error('Error al eliminar reseña:', error);
        res.status(500).json({
            mensaje: 'Error al eliminar la reseña'
        });

    } finally {
        if (client) {
            client.release();
        }
    }
};

module.exports = {
    crearResena,
    obtenerResenasPorLugar,
    obtenerResenas,
    eliminarResena
};
