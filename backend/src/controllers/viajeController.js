const pool = require('../config/database');
const { verificarMedallasViajes } = require('../services/medallaService');

// CONSULTAR TODOS LOS VIAJES DEL USUARIO
const obtenerViajes = async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT
                v.id_viaje,
                v.id_localidad,
                l.nombre AS localidad,
                p.nombre AS provincia,
                v.nombre,
                v.fecha_creacion,
                v.fecha_inicio,
                v.fecha_fin,
                v.presupuesto,
                v.estado
            FROM viaje v
            INNER JOIN localidad l ON v.id_localidad = l.id_localidad
            INNER JOIN provincia p ON l.id_provincia = p.id_provincia
            WHERE v.id_usuario = $1
              AND v.activo = TRUE
            ORDER BY v.fecha_inicio;
        `, [req.usuario.id]);

        res.status(200).json(resultado.rows);

    } catch (error) {
        console.error('Error al consultar viajes:', error);
        res.status(500).json({
            mensaje: 'Error al consultar los viajes'
        });
    }
};

// CONSULTAR UN VIAJE POR ID
const obtenerViajePorId = async (req, res) => {
    try {
        const { id } = req.params;

        const resultado = await pool.query(`
            SELECT
                v.id_viaje,
                v.id_localidad,
                l.nombre AS localidad,
                p.nombre AS provincia,
                v.nombre,
                v.fecha_creacion,
                v.fecha_inicio,
                v.fecha_fin,
                v.presupuesto,
                v.estado
            FROM viaje v
            INNER JOIN localidad l ON v.id_localidad = l.id_localidad
            INNER JOIN provincia p ON l.id_provincia = p.id_provincia
            WHERE v.id_viaje = $1
              AND v.id_usuario = $2
              AND v.activo = TRUE;
        `, [id, req.usuario.id]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                mensaje: 'Viaje no encontrado'
            });
        }

        res.status(200).json(resultado.rows[0]);

    } catch (error) {
        console.error('Error al consultar el viaje:', error);
        res.status(500).json({
            mensaje: 'Error al consultar el viaje'
        });
    }
};

// CREAR UN VIAJE
const crearViaje = async (req, res) => {
    try {
        const {
            id_localidad,
            nombre,
            fecha_inicio,
            fecha_fin,
            presupuesto
        } = req.body;

        if (!id_localidad || !nombre || !nombre.trim() ||
            !fecha_inicio || !fecha_fin) {
            return res.status(400).json({
                mensaje: 'Localidad, nombre y fechas son obligatorios'
            });
        }

        if (fecha_fin < fecha_inicio) {
            return res.status(400).json({
                mensaje: 'La fecha de fin no puede ser anterior a la fecha de inicio'
            });
        }

        if (presupuesto != null && presupuesto < 0) {
            return res.status(400).json({
                mensaje: 'El presupuesto no puede ser negativo'
            });
        }

        const resultado = await pool.query(`
            INSERT INTO viaje (
                id_usuario,
                id_localidad,
                nombre,
                fecha_inicio,
                fecha_fin,
                presupuesto,
                estado
            )
            VALUES ($1, $2, $3, $4, $5, $6, 'Planificado')
            RETURNING *;
        `, [
            req.usuario.id,
            id_localidad,
            nombre.trim(),
            fecha_inicio,
            fecha_fin,
            presupuesto ?? null
        ]);

        res.status(201).json({
            mensaje: 'Viaje creado correctamente',
            viaje: resultado.rows[0]
        });

    } catch (error) {
        console.error('Error al crear viaje:', error);
        res.status(500).json({
            mensaje: 'Error al crear el viaje'
        });
    }
};

// MODIFICAR UN VIAJE
const actualizarViaje = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            id_localidad,
            nombre,
            fecha_inicio,
            fecha_fin,
            presupuesto,
            estado
        } = req.body || {};

        // VERIFICAR SI EL VIAJE YA ESTÁ FINALIZADO
        const viajeExistente = await pool.query(`
            SELECT estado
            FROM viaje
            WHERE id_viaje = $1
            AND id_usuario = $2
            AND activo = TRUE;
        `, [id, req.usuario.id]);

        if (viajeExistente.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Viaje no encontrado' });
        }

        if (viajeExistente.rows[0].estado === 'Finalizado') {
            return res.status(400).json({
                mensaje: 'No se puede modificar un viaje finalizado'
            });
        }

        if (!id_localidad || !nombre || !nombre.trim() ||
            !fecha_inicio || !fecha_fin || !estado) {
            return res.status(400).json({
                mensaje: 'Todos los campos obligatorios deben completarse'
            });
        }

        if (fecha_fin < fecha_inicio) {
            return res.status(400).json({
                mensaje: 'La fecha de fin no puede ser anterior a la fecha de inicio'
            });
        }

        if (presupuesto != null && presupuesto < 0) {
            return res.status(400).json({
                mensaje: 'El presupuesto no puede ser negativo'
            });
        }

        const resultado = await pool.query(`
            UPDATE viaje
            SET
                id_localidad = $1,
                nombre = $2,
                fecha_inicio = $3,
                fecha_fin = $4,
                presupuesto = $5,
                estado = $6,
                fecha_modificacion = CURRENT_TIMESTAMP
            WHERE id_viaje = $7
              AND id_usuario = $8
              AND activo = TRUE
            RETURNING *;
        `, [
            id_localidad,
            nombre.trim(),
            fecha_inicio,
            fecha_fin,
            presupuesto ?? null,
            estado,
            id,
            req.usuario.id
        ]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                mensaje: 'Viaje no encontrado'
            });
        }

        if (resultado.rows[0].estado === 'Finalizado') {
            await verificarMedallasViajes(req.usuario.id);
        }

        res.status(200).json({ mensaje: 'Viaje actualizado correctamente', viaje: resultado.rows[0] });

    } catch (error) {
        console.error('Error al actualizar viaje:', error);
        res.status(500).json({
            mensaje: 'Error al actualizar el viaje'
        });
    }
};

// ELIMINAR UN VIAJE
const eliminarViaje = async (req, res) => {
    try {
        const { id } = req.params;

        // VERIFICAR SI EL VIAJE YA ESTÁ FINALIZADO
        const viajeExistente = await pool.query(`
            SELECT estado
            FROM viaje
            WHERE id_viaje = $1
              AND id_usuario = $2
              AND activo = TRUE;
        `, [id, req.usuario.id]);

        if (viajeExistente.rows.length === 0) {
            return res.status(404).json({
                mensaje: 'Viaje no encontrado'
            });
        }

        if (viajeExistente.rows[0].estado === 'Finalizado') {
            return res.status(400).json({
                mensaje: 'No se puede eliminar un viaje finalizado'
            });
        }

        // ELIMINAR LÓGICAMENTE EL VIAJE
        const resultado = await pool.query(`
            UPDATE viaje
            SET activo = FALSE,
                fecha_modificacion = CURRENT_TIMESTAMP
            WHERE id_viaje = $1
              AND id_usuario = $2
              AND activo = TRUE
            RETURNING id_viaje;
        `, [id, req.usuario.id]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                mensaje: 'Viaje no encontrado'
            });
        }

        res.status(200).json({
            mensaje: 'Viaje eliminado correctamente'
        });

    } catch (error) {
        console.error('Error al eliminar viaje:', error);
        res.status(500).json({
            mensaje: 'Error al eliminar el viaje'
        });
    }
};

module.exports = {
    obtenerViajes,
    obtenerViajePorId,
    crearViaje,
    actualizarViaje,
    eliminarViaje
};
