const pool = require('../config/database');
const { obtenerClima } = require('../services/climaService');

// CONSULTAR TODOS LOS LUGARES
const obtenerLugares = async (req, res) => {
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
                e.nombre AS entorno
            FROM lugar_turistico lt
            INNER JOIN localidad l ON lt.id_localidad = l.id_localidad
            INNER JOIN provincia p ON l.id_provincia = p.id_provincia
            INNER JOIN entorno e ON lt.id_entorno = e.id_entorno
            WHERE lt.activo = TRUE
            ORDER BY lt.nombre;
        `);

        res.status(200).json(resultado.rows);

    } catch (error) {
        console.error('Error al consultar lugares:', error);
        res.status(500).json({ mensaje: 'Error al consultar los lugares turísticos' });
    }
};

// CONSULTAR UN LUGAR POR ID
const obtenerLugarPorId = async (req, res) => {
    try {
        const { id } = req.params;

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
                e.nombre AS entorno
            FROM lugar_turistico lt
            INNER JOIN localidad l ON lt.id_localidad = l.id_localidad
            INNER JOIN provincia p ON l.id_provincia = p.id_provincia
            INNER JOIN entorno e ON lt.id_entorno = e.id_entorno
            WHERE lt.id_lugar = $1 AND lt.activo = TRUE;
        `, [id]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                mensaje: 'Lugar turístico no encontrado'
            });
        }

        res.status(200).json(resultado.rows[0]);

    } catch (error) {
        console.error('Error al consultar el lugar:', error);
        res.status(500).json({ mensaje: 'Error al consultar el lugar turístico' });
    }
};

// BUSCAR LUGARES POR NOMBRE, LOCALIDAD O PROVINCIA
const buscarLugares = async (req, res) => {
    try {
        const { nombre, localidad, provincia } = req.query;

        const resultado = await pool.query(`
            SELECT
                lt.id_lugar,
                lt.nombre,
                lt.descripcion,
                lt.direccion,
                lt.latitud,
                lt.longitud,
                l.nombre AS localidad,
                p.nombre AS provincia,
                e.nombre AS entorno
            FROM lugar_turistico lt
            INNER JOIN localidad l ON lt.id_localidad = l.id_localidad
            INNER JOIN provincia p ON l.id_provincia = p.id_provincia
            INNER JOIN entorno e ON lt.id_entorno = e.id_entorno
            WHERE lt.activo = TRUE
                AND ($1::VARCHAR IS NULL OR lt.nombre ILIKE '%' || $1 || '%')
                AND ($2::VARCHAR IS NULL OR l.nombre ILIKE '%' || $2 || '%')
                AND ($3::VARCHAR IS NULL OR p.nombre ILIKE '%' || $3 || '%')
            ORDER BY lt.nombre;
        `, [nombre || null, localidad || null, provincia || null]);

        res.status(200).json(resultado.rows);

    } catch (error) {
        console.error('Error al buscar lugares:', error);
        res.status(500).json({ mensaje: 'Error al buscar lugares turísticos' });
    }
};

// REGISTRAR UN LUGAR
const crearLugar = async (req, res) => {
    try {
        const {
            id_localidad,
            id_entorno,
            nombre,
            descripcion,
            direccion,
            latitud,
            longitud
        } = req.body;

        if (!id_localidad || !id_entorno || !nombre || !nombre.trim()) {
            return res.status(400).json({
                mensaje: 'Localidad, entorno y nombre son obligatorios'
            });
        }

        const resultado = await pool.query(`
            INSERT INTO lugar_turistico
                (id_localidad, id_entorno, nombre, descripcion,
                 direccion, latitud, longitud)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `, [
            id_localidad,
            id_entorno,
            nombre.trim(),
            descripcion || null,
            direccion || null,
            latitud ?? null,
            longitud ?? null
        ]);

        res.status(201).json({
            mensaje: 'Lugar turístico creado correctamente',
            lugar: resultado.rows[0]
        });

    } catch (error) {
        console.error('Error al crear lugar:', error);
        res.status(500).json({ mensaje: 'Error al crear el lugar turístico' });
    }
};

// MODIFICAR UN LUGAR
const actualizarLugar = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            id_localidad,
            id_entorno,
            nombre,
            descripcion,
            direccion,
            latitud,
            longitud
        } = req.body;

        if (!id_localidad || !id_entorno || !nombre || !nombre.trim()) {
            return res.status(400).json({
                mensaje: 'Localidad, entorno y nombre son obligatorios'
            });
        }

        const resultado = await pool.query(`
            UPDATE lugar_turistico
            SET
                id_localidad = $1,
                id_entorno = $2,
                nombre = $3,
                descripcion = $4,
                direccion = $5,
                latitud = $6,
                longitud = $7,
                fecha_modificacion = CURRENT_TIMESTAMP
            WHERE id_lugar = $8 AND activo = TRUE
            RETURNING *;
        `, [
            id_localidad,
            id_entorno,
            nombre.trim(),
            descripcion || null,
            direccion || null,
            latitud ?? null,
            longitud ?? null,
            id
        ]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                mensaje: 'Lugar turístico no encontrado'
            });
        }

        res.status(200).json({
            mensaje: 'Lugar turístico actualizado correctamente',
            lugar: resultado.rows[0]
        });

    } catch (error) {
        console.error('Error al actualizar lugar:', error);
        res.status(500).json({ mensaje: 'Error al actualizar el lugar turístico' });
    }
};

// DAR DE BAJA UN LUGAR
const eliminarLugar = async (req, res) => {
    try {
        const { id } = req.params;

        const resultado = await pool.query(`
            UPDATE lugar_turistico
            SET activo = FALSE,
                fecha_modificacion = CURRENT_TIMESTAMP
            WHERE id_lugar = $1 AND activo = TRUE
            RETURNING id_lugar;
        `, [id]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                mensaje: 'Lugar turístico no encontrado'
            });
        }

        res.status(200).json({
            mensaje: 'Lugar turístico dado de baja correctamente'
        });

    } catch (error) {
        console.error('Error al eliminar lugar:', error);
        res.status(500).json({ mensaje: 'Error al dar de baja el lugar turístico' });
    }
};

// CONSULTAR CLIMA DE UN LUGAR TURÍSTICO
const consultarClima = async (req, res) => {
    try {
        const { id } = req.params;
        const { fecha } = req.query;

        if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
            return res.status(400).json({
                mensaje: 'Debe proporcionar una fecha válida con formato YYYY-MM-DD'
            });
        }

        const resultado = await pool.query(`
            SELECT latitud, longitud
            FROM lugar_turistico_osm
            WHERE id_osm = $1;
        `, [id]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                mensaje: 'Lugar turístico no encontrado'
            });
        }

        const { latitud, longitud } = resultado.rows[0];

        if (latitud === null || longitud === null) {
            return res.status(400).json({
                mensaje: 'El lugar turístico no tiene coordenadas registradas'
            });
        }

        const clima = await obtenerClima(latitud, longitud, fecha);

        res.status(200).json(clima);

    } catch (error) {
        console.error('Error al consultar el clima:', error.message);
        res.status(500).json({
            mensaje: 'Error al consultar el clima del destino turístico'
        });
    }
};

module.exports = {
    obtenerLugares,
    obtenerLugarPorId,
    buscarLugares,
    crearLugar,
    actualizarLugar,
    eliminarLugar,
    consultarClima
};