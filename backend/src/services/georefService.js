const URL_GEOREF = 'https://apis.datos.gob.ar/georef/api';
const pool = require('../config/database');

// Consultar provincias en GeoRef
const obtenerProvinciasGeoRef = async () => {
    const respuesta = await fetch(
        `${URL_GEOREF}/provincias?campos=id,nombre&max=100`
    );

    if (!respuesta.ok) {
        throw new Error('Error al consultar las provincias en GeoRef');
    }

    const datos = await respuesta.json();

    return datos.provincias;
};

// Consultar todas las localidades en GeoRef
const obtenerLocalidadesGeoRef = async () => {
    const localidades = [];
    const limite = 5000;
    let inicio = 0;
    let total = 0;

    do {
        const url = new URL(`${URL_GEOREF}/localidades`);

        url.searchParams.set('campos', 'id,nombre,provincia.id');
        url.searchParams.set('max', limite);
        url.searchParams.set('inicio', inicio);

        const respuesta = await fetch(url);

        if (!respuesta.ok) {
            throw new Error('Error al consultar las localidades en GeoRef');
        }

        const datos = await respuesta.json();

        total = datos.total;
        localidades.push(...datos.localidades);

        inicio += datos.localidades.length;

        console.log(`Localidades consultadas: ${localidades.length} de ${total}`);

    } while (inicio < total);

    return localidades;
};

// Guardar localidades en PostgreSQL
const importarLocalidades = async () => {
    const localidades = await obtenerLocalidadesGeoRef();
    const conexion = await pool.connect();

    try {
        await conexion.query('BEGIN');

        // Obtener las provincias ya importadas
        const resultado = await conexion.query(
            `SELECT id_provincia, id_georef
             FROM provincia
             WHERE id_georef IS NOT NULL`
        );

        // Relacionar cada ID oficial con el ID interno
        const provincias = new Map(
            resultado.rows.map(provincia => [
                String(provincia.id_georef),
                provincia.id_provincia
            ])
        );

        // Insertar las localidades en grupos de 500
        const tamanoLote = 500;

        for (let i = 0; i < localidades.length; i += tamanoLote) {
            const lote = localidades.slice(i, i + tamanoLote);
            const valores = [];
            const parametros = [];

            for (const localidad of lote) {
                // Normalizar el ID de provincia para contemplar ceros iniciales
                const idProvinciaGeoRef = String(
                    Number(localidad.provincia.id)
                );

                const idProvincia = provincias.get(idProvinciaGeoRef);

                if (!idProvincia) {
                    throw new Error(
                        `No se encontró la provincia de ${localidad.nombre}`
                    );
                }

                const posicion = parametros.length;

                valores.push(
                    `($${posicion + 1}, $${posicion + 2}, $${posicion + 3}, TRUE)`
                );

                parametros.push(
                    localidad.nombre,
                    idProvincia,
                    localidad.id
                );
            }

            await conexion.query(
                `INSERT INTO localidad
                    (nombre, id_provincia, id_georef, activo)
                 VALUES ${valores.join(', ')}
                 ON CONFLICT (id_georef)
                 DO UPDATE SET
                    nombre = EXCLUDED.nombre,
                    id_provincia = EXCLUDED.id_provincia,
                    activo = TRUE`,
                parametros
            );

            console.log(
                `Localidades guardadas: ${Math.min(i + tamanoLote, localidades.length)} de ${localidades.length}`
            );
        }

        await conexion.query('COMMIT');

        return localidades.length;

    } catch (error) {
        await conexion.query('ROLLBACK');
        throw error;

    } finally {
        conexion.release();
    }
};

// Guardar provincias en PostgreSQL
const importarProvincias = async () => {
    const provincias = await obtenerProvinciasGeoRef();
    const conexion = await pool.connect();

    try {
        await conexion.query('BEGIN');

        for (const provincia of provincias) {
            await conexion.query(
                `INSERT INTO provincia (nombre, id_georef, activo)
                 VALUES ($1, $2, TRUE)
                 ON CONFLICT (id_georef)
                 DO UPDATE SET
                    nombre = EXCLUDED.nombre,
                    activo = TRUE`,
                [provincia.nombre, provincia.id]
            );
        }

        await conexion.query('COMMIT');

        return provincias.length;

    } catch (error) {
        await conexion.query('ROLLBACK');
        throw error;

    } finally {
        conexion.release();
    }
};

module.exports = {
    obtenerProvinciasGeoRef,
    importarProvincias,
    obtenerLocalidadesGeoRef,
    importarLocalidades
};