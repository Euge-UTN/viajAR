
const pool = require('../config/database');

// VALIDAR IDENTIFICADORES
const esIdValido = (id) => {
    const numero = Number(id);

    return /^[1-9]\d*$/.test(String(id)) &&
        Number.isSafeInteger(numero) &&
        numero <= 2147483647;
};

// AGREGAR UN LUGAR A FAVORITOS
const agregarFavorito = async (req, res) => {
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

        // Registrar el favorito y evitar duplicados
        const resultado = await pool.query(`
            INSERT INTO favorito (
                id_usuario,
                id_lugar
            )
            VALUES ($1, $2)
            ON CONFLICT (id_usuario, id_lugar) DO NOTHING
            RETURNING *;
        `, [req.usuario.id, idLugar]);

        if (resultado.rows.length === 0) {
            return res.status(409).json({
                mensaje: 'El lugar ya se encuentra en favoritos'
            });
        }

        res.status(201).json({
            mensaje: 'Lugar agregado a favoritos correctamente',
            favorito: resultado.rows[0]
        });

    } catch (error) {
        console.error('Error al agregar favorito:', error);
        res.status(500).json({
            mensaje: 'Error al agregar el lugar a favoritos'
        });
    }
};

// CONSULTAR LOS LUGARES FAVORITOS DEL USUARIO
const obtenerFavoritos = async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT
                lt.id_lugar,
                lt.nombre,
                lt.descripcion,
                lt.direccion,
                lt.latitud,
                lt.longitud,
                l.id_localidad,
                l.nombre AS localidad,
                p.id_provincia,
                p.nombre AS provincia,
                e.id_entorno,
                e.nombre AS entorno,
                f.fecha_agregado
            FROM favorito f
            INNER JOIN lugar_turistico lt
                ON f.id_lugar = lt.id_lugar
            INNER JOIN localidad l
                ON lt.id_localidad = l.id_localidad
            INNER JOIN provincia p
                ON l.id_provincia = p.id_provincia
            INNER JOIN entorno e
                ON lt.id_entorno = e.id_entorno
            WHERE f.id_usuario = $1
              AND lt.activo = TRUE
            ORDER BY f.fecha_agregado DESC;
        `, [req.usuario.id]);

        res.status(200).json({
            favoritos: resultado.rows
        });

    } catch (error) {
        console.error('Error al consultar favoritos:', error);
        res.status(500).json({
            mensaje: 'Error al consultar los lugares favoritos'
        });
    }
};

// ELIMINAR UN LUGAR DE FAVORITOS
const eliminarFavorito = async (req, res) => {
    try {
        const { idLugar } = req.params;

        // Validar el identificador del lugar
        if (!esIdValido(idLugar)) {
            return res.status(400).json({
                mensaje: 'El ID del lugar no es válido'
            });
        }

        // Eliminar únicamente el favorito del usuario autenticado
        const resultado = await pool.query(`
            DELETE FROM favorito
            WHERE id_usuario = $1
              AND id_lugar = $2
            RETURNING id_lugar;
        `, [req.usuario.id, idLugar]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                mensaje: 'El lugar no se encuentra en tus favoritos'
            });
        }

        res.status(200).json({
            mensaje: 'Lugar eliminado de favoritos correctamente'
        });

    } catch (error) {
        console.error('Error al eliminar favorito:', error);
        res.status(500).json({
            mensaje: 'Error al eliminar el lugar de favoritos'
        });
    }
};

module.exports = {
    agregarFavorito,
    obtenerFavoritos,
    eliminarFavorito
};
