const pool = require('../config/database');

// VALIDAR IDENTIFICADORES
const esIdValido = (id) => {
    return /^[1-9]\d*$/.test(String(id));
};

// CONSULTAR LAS CATEGORÍAS DE GASTOS
const obtenerCategorias = async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT
                id_categoria,
                nombre
            FROM categoria_gasto
            WHERE activo = TRUE
            ORDER BY id_categoria ASC;
        `);

        res.json({
            categorias: resultado.rows
        });

    } catch (error) {
        console.error('Error al obtener las categorías:', error);
        res.status(500).json({
            mensaje: 'Error al obtener las categorías de gastos'
        });
    }
};

// REGISTRAR UN GASTO
const crearGasto = async (req, res) => {
    try {
        const { idViaje } = req.params;

        if (!esIdValido(idViaje)) {
            return res.status(400).json({
                mensaje: 'El ID del viaje no es válido'
            });
        }

        const {
            id_categoria,
            id_itinerario,
            descripcion,
            monto,
            fecha_gasto
        } = req.body;

        // Validar los datos obligatorios
        if (!esIdValido(id_categoria) || !fecha_gasto || monto == null) {
            return res.status(400).json({
                mensaje: 'Categoría, monto y fecha del gasto son obligatorios y deben ser válidos'
            });
        }

        // Validar la descripción
        if (descripcion !== undefined &&
            descripcion !== null &&
            typeof descripcion !== 'string') {
            return res.status(400).json({
                mensaje: 'La descripción debe ser un texto'
            });
        }

        // Validar el monto
        if (!Number.isFinite(Number(monto)) || Number(monto) <= 0) {
            return res.status(400).json({
                mensaje: 'El monto debe ser un número mayor a cero'
            });
        }

        // Validar el formato y la fecha
        const fechaValida = /^\d{4}-\d{2}-\d{2}$/.test(fecha_gasto) &&
            !isNaN(Date.parse(fecha_gasto)) &&
            new Date(fecha_gasto).toISOString().startsWith(fecha_gasto);

        if (!fechaValida) {
            return res.status(400).json({
                mensaje: 'La fecha debe tener el formato YYYY-MM-DD y ser válida'
            });
        }

        // Verificar que el viaje pertenezca al usuario
        const viaje = await pool.query(`
            SELECT
                id_viaje,
                fecha_inicio,
                fecha_fin
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

        // Verificar que la fecha del gasto esté dentro del viaje
        const fechaInicio = viaje.rows[0].fecha_inicio;
        const fechaFin = viaje.rows[0].fecha_fin;

        if (fecha_gasto < fechaInicio || fecha_gasto > fechaFin) {
            return res.status(400).json({
                mensaje: 'La fecha del gasto debe estar dentro del período del viaje'
            });
        }

        // Verificar que la categoría esté activa
        const categoria = await pool.query(`
            SELECT id_categoria
            FROM categoria_gasto
            WHERE id_categoria = $1
              AND activo = TRUE;
        `, [id_categoria]);

        if (categoria.rows.length === 0) {
            return res.status(404).json({
                mensaje: 'Categoría de gasto no encontrada'
            });
        }

        // Verificar el itinerario si se proporcionó uno
        if (id_itinerario != null) {
            if (!esIdValido(id_itinerario)) {
                return res.status(400).json({
                    mensaje: 'El itinerario no es válido'
                });
            }

            const itinerario = await pool.query(`
                SELECT id_itinerario
                FROM itinerario
                WHERE id_itinerario = $1
                  AND id_viaje = $2
                  AND id_usuario = $3
                  AND activo = TRUE;
            `, [id_itinerario, idViaje, req.usuario.id]);

            if (itinerario.rows.length === 0) {
                return res.status(404).json({
                    mensaje: 'Itinerario no encontrado en este viaje'
                });
            }
        }

        // Registrar el gasto
        const resultado = await pool.query(`
            INSERT INTO gasto (
                id_viaje,
                id_categoria,
                id_itinerario,
                id_usuario,
                descripcion,
                monto,
                fecha_gasto
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `, [
            idViaje,
            id_categoria,
            id_itinerario ?? null,
            req.usuario.id,
            descripcion?.trim() || null,
            monto,
            fecha_gasto
        ]);

        res.status(201).json({
            mensaje: 'Gasto registrado correctamente',
            gasto: resultado.rows[0]
        });

    } catch (error) {
        console.error('Error al registrar el gasto:', error);
        res.status(500).json({
            mensaje: 'Error al registrar el gasto'
        });
    }
};

// CONSULTAR LOS GASTOS DE UN VIAJE
const obtenerGastos = async (req, res) => {
    try {
        const { idViaje } = req.params;

        if (!esIdValido(idViaje)) {
            return res.status(400).json({
                mensaje: 'El ID del viaje no es válido'
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

        const resultado = await pool.query(`
            SELECT
                g.*,
                c.nombre AS categoria
            FROM gasto g
            INNER JOIN categoria_gasto c
                ON g.id_categoria = c.id_categoria
            WHERE g.id_viaje = $1
              AND g.id_usuario = $2
              AND g.activo = TRUE
            ORDER BY g.fecha_gasto DESC;
        `, [idViaje, req.usuario.id]);

        res.json({
            gastos: resultado.rows
        });

    } catch (error) {
        console.error('Error al obtener los gastos:', error);
        res.status(500).json({
            mensaje: 'Error al obtener los gastos del viaje'
        });
    }
};

// MODIFICAR UN GASTO
const modificarGasto = async (req, res) => {
    try {
        const { idViaje, idGasto } = req.params;

        if (!esIdValido(idViaje)) {
            return res.status(400).json({
                mensaje: 'El ID del viaje no es válido'
            });
        }

        if (!esIdValido(idGasto)) {
            return res.status(400).json({
                mensaje: 'El ID del gasto no es válido'
            });
        }

        const {
            id_categoria,
            id_itinerario,
            descripcion,
            monto,
            fecha_gasto
        } = req.body;

        // Verificar que el viaje pertenezca al usuario y esté activo
        const viaje = await pool.query(`
            SELECT
                id_viaje,
                fecha_inicio,
                fecha_fin
            FROM viaje
            WHERE id_viaje = $1
            AND id_usuario = $2
            AND activo = TRUE;
        `, [idViaje, req.usuario.id]);

        if (viaje.rows.length === 0) {
            return res.status(404).json({
                mensaje: 'Viaje no encontrado o inactivo'
            });
        }

        // Verificar que el gasto pertenezca al usuario y al viaje
        const gasto = await pool.query(`
            SELECT id_gasto
            FROM gasto
            WHERE id_gasto = $1
              AND id_viaje = $2
              AND id_usuario = $3
              AND activo = TRUE;
        `, [idGasto, idViaje, req.usuario.id]);

        if (gasto.rows.length === 0) {
            return res.status(404).json({
                mensaje: 'Gasto no encontrado'
            });
        }

        // Validar la categoría si se proporcionó
        if (id_categoria !== undefined) {
            if (!esIdValido(id_categoria)) {
                return res.status(400).json({
                    mensaje: 'La categoría no es válida'
                });
            }

            const categoria = await pool.query(`
                SELECT id_categoria
                FROM categoria_gasto
                WHERE id_categoria = $1
                  AND activo = TRUE;
            `, [id_categoria]);

            if (categoria.rows.length === 0) {
                return res.status(404).json({
                    mensaje: 'Categoría de gasto no encontrada'
                });
            }
        }

        // Validar el itinerario si se proporcionó
        if (id_itinerario !== undefined && id_itinerario !== null) {
            if (!esIdValido(id_itinerario)) {
                return res.status(400).json({
                    mensaje: 'El itinerario no es válido'
                });
            }

            const itinerario = await pool.query(`
                SELECT id_itinerario
                FROM itinerario
                WHERE id_itinerario = $1
                  AND id_viaje = $2
                  AND id_usuario = $3
                  AND activo = TRUE;
            `, [id_itinerario, idViaje, req.usuario.id]);

            if (itinerario.rows.length === 0) {
                return res.status(404).json({
                    mensaje: 'Itinerario no encontrado en este viaje'
                });
            }
        }

        // Validar el monto si se proporcionó
        if (monto !== undefined &&
            (!Number.isFinite(Number(monto)) || Number(monto) <= 0)) {
            return res.status(400).json({
                mensaje: 'El monto debe ser un número mayor a cero'
            });
        }

        // Validar la fecha si se proporcionó
        if (fecha_gasto !== undefined) {
            const fechaValida = /^\d{4}-\d{2}-\d{2}$/.test(fecha_gasto) &&
                !isNaN(Date.parse(fecha_gasto)) &&
                new Date(fecha_gasto).toISOString().startsWith(fecha_gasto);

            if (!fechaValida) {
                return res.status(400).json({
                    mensaje: 'La fecha debe tener el formato YYYY-MM-DD y ser válida'
                });
            }

            // Verificar que la fecha esté dentro del período del viaje
            const fechaInicio = viaje.rows[0].fecha_inicio.toISOString().slice(0, 10);
            const fechaFin = viaje.rows[0].fecha_fin.toISOString().slice(0, 10);

            if (fecha_gasto < fechaInicio || fecha_gasto > fechaFin) {
                return res.status(400).json({
                    mensaje: 'La fecha del gasto debe estar dentro del período del viaje'
                });
            }
        }

        // Validar la descripción si se proporcionó
        if (descripcion !== undefined &&
            descripcion !== null &&
            typeof descripcion !== 'string') {
            return res.status(400).json({
                mensaje: 'La descripción debe ser un texto'
            });
        }

        // Actualizar el gasto
        const resultado = await pool.query(`
            UPDATE gasto
            SET
                id_categoria = COALESCE($1, id_categoria),
                id_itinerario = CASE
                    WHEN $2::boolean THEN $3
                    ELSE id_itinerario
                END,
                descripcion = CASE
                    WHEN $4::boolean THEN $5
                    ELSE descripcion
                END,
                monto = COALESCE($6, monto),
                fecha_gasto = COALESCE($7, fecha_gasto),
                fecha_modificacion = CURRENT_TIMESTAMP
            WHERE id_gasto = $8
              AND id_viaje = $9
              AND id_usuario = $10
              AND activo = TRUE
            RETURNING *;
        `, [
            id_categoria ?? null,
            id_itinerario !== undefined,
            id_itinerario ?? null,
            descripcion !== undefined,
            descripcion?.trim() || null,
            monto ?? null,
            fecha_gasto ?? null,
            idGasto,
            idViaje,
            req.usuario.id
        ]);

        res.json({
            mensaje: 'Gasto modificado correctamente',
            gasto: resultado.rows[0]
        });

    } catch (error) {
        console.error('Error al modificar el gasto:', error);
        res.status(500).json({
            mensaje: 'Error al modificar el gasto'
        });
    }
};

// ELIMINAR UN GASTO
const eliminarGasto = async (req, res) => {
    try {
        const { idViaje, idGasto } = req.params;

        if (!esIdValido(idViaje)) {
            return res.status(400).json({
                mensaje: 'El ID del viaje no es válido'
            });
        }

        if (!esIdValido(idGasto)) {
            return res.status(400).json({
                mensaje: 'El ID del gasto no es válido'
            });
        }

        // Verificar que el viaje pertenezca al usuario y esté activo
        const viaje = await pool.query(`
            SELECT id_viaje
            FROM viaje
            WHERE id_viaje = $1
            AND id_usuario = $2
            AND activo = TRUE;
        `, [idViaje, req.usuario.id]);

        if (viaje.rows.length === 0) {
            return res.status(404).json({
                mensaje: 'Viaje no encontrado o inactivo'
            });
        }

        const resultado = await pool.query(`
            UPDATE gasto
            SET
                activo = FALSE,
                fecha_modificacion = CURRENT_TIMESTAMP
            WHERE id_gasto = $1
              AND id_viaje = $2
              AND id_usuario = $3
              AND activo = TRUE
            RETURNING id_gasto;
        `, [idGasto, idViaje, req.usuario.id]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                mensaje: 'Gasto no encontrado'
            });
        }

        res.json({
            mensaje: 'Gasto eliminado correctamente'
        });

    } catch (error) {
        console.error('Error al eliminar el gasto:', error);
        res.status(500).json({
            mensaje: 'Error al eliminar el gasto'
        });
    }
};

// CONSULTAR EL RESUMEN DE GASTOS DE UN VIAJE
const obtenerResumenGastos = async (req, res) => {
    try {
        const { idViaje } = req.params;

        if (!esIdValido(idViaje)) {
            return res.status(400).json({
                mensaje: 'El ID del viaje no es válido'
            });
        }

        // Obtener el presupuesto del viaje y verificar su propietario
        const viaje = await pool.query(`
            SELECT presupuesto
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

        const presupuesto = viaje.rows[0].presupuesto;

        // Calcular el total de gastos activos
        const resultado = await pool.query(`
            SELECT COALESCE(SUM(monto), 0) AS total_gastado
            FROM gasto
            WHERE id_viaje = $1
              AND id_usuario = $2
              AND activo = TRUE;
        `, [idViaje, req.usuario.id]);

        const totalGastado = Number(resultado.rows[0].total_gastado);

        const saldoRestante = presupuesto !== null
            ? Number(presupuesto) - totalGastado
            : null;

        res.json({
            presupuesto: presupuesto !== null
                ? Number(presupuesto)
                : null,
            totalGastado,
            saldoRestante
        });

    } catch (error) {
        console.error('Error al obtener el resumen de gastos:', error);
        res.status(500).json({
            mensaje: 'Error al obtener el resumen de gastos'
        });
    }
};

module.exports = {
    crearGasto,
    obtenerGastos,
    modificarGasto,
    eliminarGasto,
    obtenerResumenGastos,
    obtenerCategorias
};
