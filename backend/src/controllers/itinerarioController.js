const pool = require('../config/database');

// CONSULTAR LOS ITINERARIOS DE UN VIAJE
const obtenerItinerarios = async (req, res) => {
    try {
        const { idViaje } = req.params;

        const resultado = await pool.query(`
            SELECT
                i.id_itinerario,
                i.id_lugar,
                lt.nombre AS lugar,
                i.id_categoria,
                cg.nombre AS categoria,
                i.fecha_visita,
                i.estado_visita,
                i.observaciones
            FROM itinerario i
            INNER JOIN viaje v ON i.id_viaje = v.id_viaje
            INNER JOIN lugar_turistico lt ON i.id_lugar = lt.id_lugar
            INNER JOIN categoria_gasto cg ON i.id_categoria = cg.id_categoria
            WHERE i.id_viaje = $1
              AND i.id_usuario = $2
              AND v.id_usuario = $2
              AND i.activo = TRUE
              AND v.activo = TRUE
            ORDER BY i.fecha_visita;
        `, [idViaje, req.usuario.id]);

        res.status(200).json(resultado.rows);

    } catch (error) {
        console.error('Error al consultar itinerarios:', error);
        res.status(500).json({
            mensaje: 'Error al consultar los itinerarios'
        });
    }
};

// CONSULTAR UN ITINERARIO POR ID
const obtenerItinerarioPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const resultado = await pool.query(`
            SELECT
                i.id_itinerario,
                i.id_viaje,
                i.id_lugar,
                lt.nombre AS lugar,
                i.id_categoria,
                cg.nombre AS categoria,
                i.fecha_visita,
                i.estado_visita,
                i.observaciones
            FROM itinerario i
            INNER JOIN viaje v ON i.id_viaje = v.id_viaje
            INNER JOIN lugar_turistico lt ON i.id_lugar = lt.id_lugar
            INNER JOIN categoria_gasto cg ON i.id_categoria = cg.id_categoria
            WHERE i.id_itinerario = $1
              AND i.id_usuario = $2
              AND v.id_usuario = $2
              AND i.activo = TRUE
              AND v.activo = TRUE;
        `, [id, req.usuario.id]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                mensaje: 'Itinerario no encontrado'
            });
        }

        res.status(200).json(resultado.rows[0]);

    } catch (error) {
        console.error('Error al consultar el itinerario:', error);
        res.status(500).json({
            mensaje: 'Error al consultar el itinerario'
        });
    }
};

// AGREGAR UN LUGAR AL ITINERARIO
const crearItinerario = async (req, res) => {
    try {
        const { idViaje } = req.params;

        const {
            id_lugar,
            id_categoria,
            fecha_visita,
            estado_visita,
            observaciones
        } = req.body;

        if (!id_lugar || !id_categoria || !fecha_visita ||
            !estado_visita || !estado_visita.trim()) {
            return res.status(400).json({
                mensaje: 'Lugar, categoría, fecha y estado de visita son obligatorios'
            });
        }

        // Verificar que el viaje pertenezca al usuario
        const viaje = await pool.query(`
            SELECT id_viaje
            FROM viaje
            WHERE id_viaje = $1
              AND id_usuario = $2
              AND activo = TRUE;
        `, [idViaje, req.usuario.id]);

        if (viaje.rows.length === 0) {
            return res.status(404).json({
                mensaje: 'Viaje no encontrado'
            });
        }

        // Verificar que el lugar esté activo
        const lugar = await pool.query(`
            SELECT id_lugar
            FROM lugar_turistico
            WHERE id_lugar = $1 AND activo = TRUE;
        `, [id_lugar]);

        if (lugar.rows.length === 0) {
            return res.status(404).json({
                mensaje: 'Lugar turístico no encontrado'
            });
        }

        // Verificar que la categoría esté activa
        const categoria = await pool.query(`
            SELECT id_categoria
            FROM categoria_gasto
            WHERE id_categoria = $1 AND activo = TRUE;
        `, [id_categoria]);

        if (categoria.rows.length === 0) {
            return res.status(404).json({
                mensaje: 'Categoría de gasto no encontrada'
            });
        }

        const resultado = await pool.query(`
            INSERT INTO itinerario (
                id_lugar,
                id_categoria,
                id_usuario,
                id_viaje,
                fecha_visita,
                estado_visita,
                observaciones
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `, [
            id_lugar,
            id_categoria,
            req.usuario.id,
            idViaje,
            fecha_visita,
            estado_visita.trim(),
            observaciones || null
        ]);

        res.status(201).json({
            mensaje: 'Lugar agregado al itinerario correctamente',
            itinerario: resultado.rows[0]
        });

    } catch (error) {
        console.error('Error al crear itinerario:', error);
        res.status(500).json({
            mensaje: 'Error al agregar el lugar al itinerario'
        });
    }
};

// MODIFICAR UN ITINERARIO
const actualizarItinerario = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            id_lugar,
            id_categoria,
            fecha_visita,
            estado_visita,
            observaciones
        } = req.body;

        if (!id_lugar || !id_categoria || !fecha_visita ||
            !estado_visita || !estado_visita.trim()) {
            return res.status(400).json({
                mensaje: 'Lugar, categoría, fecha y estado de visita son obligatorios'
            });
        }

        // Verificar que el lugar esté activo
        const lugar = await pool.query(`
            SELECT id_lugar
            FROM lugar_turistico
            WHERE id_lugar = $1 AND activo = TRUE;
        `, [id_lugar]);

        if (lugar.rows.length === 0) {
            return res.status(404).json({
                mensaje: 'Lugar turístico no encontrado'
            });
        }

        // Verificar que la categoría esté activa
        const categoria = await pool.query(`
            SELECT id_categoria
            FROM categoria_gasto
            WHERE id_categoria = $1 AND activo = TRUE;
        `, [id_categoria]);

        if (categoria.rows.length === 0) {
            return res.status(404).json({
                mensaje: 'Categoría de gasto no encontrada'
            });
        }

        const resultado = await pool.query(`
            UPDATE itinerario
            SET
                id_lugar = $1,
                id_categoria = $2,
                fecha_visita = $3,
                estado_visita = $4,
                observaciones = $5,
                fecha_modificacion = CURRENT_TIMESTAMP
            WHERE id_itinerario = $6
              AND id_usuario = $7
              AND activo = TRUE
              AND EXISTS (
                  SELECT 1
                  FROM viaje v
                  WHERE v.id_viaje = itinerario.id_viaje
                    AND v.id_usuario = $7
                    AND v.activo = TRUE
              )
            RETURNING *;
        `, [
            id_lugar,
            id_categoria,
            fecha_visita,
            estado_visita.trim(),
            observaciones || null,
            id,
            req.usuario.id
        ]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                mensaje: 'Itinerario no encontrado'
            });
        }

        res.status(200).json({
            mensaje: 'Itinerario actualizado correctamente',
            itinerario: resultado.rows[0]
        });

    } catch (error) {
        console.error('Error al actualizar itinerario:', error);
        res.status(500).json({
            mensaje: 'Error al actualizar el itinerario'
        });
    }
};

// ELIMINAR UN ITINERARIO
const eliminarItinerario = async (req, res) => {
    try {
        const { id } = req.params;

        const resultado = await pool.query(`
            UPDATE itinerario
            SET
                activo = FALSE,
                fecha_modificacion = CURRENT_TIMESTAMP
            WHERE id_itinerario = $1
              AND id_usuario = $2
              AND activo = TRUE
              AND EXISTS (
                  SELECT 1
                  FROM viaje v
                  WHERE v.id_viaje = itinerario.id_viaje
                    AND v.id_usuario = $2
              )
            RETURNING id_itinerario;
        `, [id, req.usuario.id]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                mensaje: 'Itinerario no encontrado'
            });
        }

        res.status(200).json({
            mensaje: 'Itinerario eliminado correctamente'
        });

    } catch (error) {
        console.error('Error al eliminar itinerario:', error);
        res.status(500).json({
            mensaje: 'Error al eliminar el itinerario'
        });
    }
};

module.exports = {
    obtenerItinerarios,
    obtenerItinerarioPorId,
    crearItinerario,
    actualizarItinerario,
    eliminarItinerario
};