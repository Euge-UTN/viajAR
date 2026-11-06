const pool = require('../config/database');

// GUARDAR LUGARES TURÍSTICOS EN LA TABLA TEMPORAL
const guardarLugaresOSM = async (elementos) => {
    const conexion = await pool.connect();

    let cantidadGuardada = 0;

    try {
        await conexion.query('BEGIN');

        for (const elemento of elementos) {
            const nombre = elemento.tags?.name;

            const latitud = elemento.lat ?? elemento.center?.lat;
            const longitud = elemento.lon ?? elemento.center?.lon;

            if (!nombre || latitud == null || longitud == null) {
                continue;
            }

            await conexion.query(`
                INSERT INTO lugar_turistico_osm (
                    osm_tipo,
                    osm_id,
                    nombre,
                    tipo_turismo,
                    latitud,
                    longitud,
                    etiquetas
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                ON CONFLICT (osm_tipo, osm_id)
                DO UPDATE SET
                    nombre = EXCLUDED.nombre,
                    tipo_turismo = EXCLUDED.tipo_turismo,
                    latitud = EXCLUDED.latitud,
                    longitud = EXCLUDED.longitud,
                    etiquetas = EXCLUDED.etiquetas,
                    fecha_consulta = CURRENT_TIMESTAMP;
            `, [
                elemento.type,
                elemento.id,
                nombre.trim(),
                elemento.tags.tourism || null,
                latitud,
                longitud,
                JSON.stringify(elemento.tags)
            ]);

            cantidadGuardada++;
        }

        await conexion.query('COMMIT');

        return cantidadGuardada;

    } catch (error) {
        await conexion.query('ROLLBACK');
        console.error('Error al guardar lugares de OSM:', error.message);
        throw error;

    } finally {
        conexion.release();
    }
};

// CONSULTAR Y GUARDAR LOS LUGARES DE UNA PROVINCIA
const importarLugaresProvincia = async (codigoProvincia) => {
    const { obtenerLugaresOSM } = require('./overpassService');

    const lugares = await obtenerLugaresOSM(codigoProvincia);

    const cantidad = await guardarLugaresOSM(lugares);

    console.log(
        `Provincia ${codigoProvincia}: ${cantidad} lugares guardados`
    );

    return cantidad;
};

// JURISDICCIONES DE ARGENTINA
const provincias = [
    { nombre: 'Ciudad Autónoma de Buenos Aires', codigo: 'AR-C' },
    { nombre: 'Catamarca', codigo: 'AR-K' },
    { nombre: 'Chaco', codigo: 'AR-H' },
    { nombre: 'Chubut', codigo: 'AR-U' },
    { nombre: 'Córdoba', codigo: 'AR-X' },
    { nombre: 'Corrientes', codigo: 'AR-W' },
    { nombre: 'Entre Ríos', codigo: 'AR-E' },
    { nombre: 'Formosa', codigo: 'AR-P' },
    { nombre: 'Jujuy', codigo: 'AR-Y' },
    { nombre: 'La Pampa', codigo: 'AR-L' },
    { nombre: 'La Rioja', codigo: 'AR-F' },
    { nombre: 'Mendoza', codigo: 'AR-M' },
    { nombre: 'Misiones', codigo: 'AR-N' },
    { nombre: 'Neuquén', codigo: 'AR-Q' },
    { nombre: 'Río Negro', codigo: 'AR-R' },
    { nombre: 'Salta', codigo: 'AR-A' },
    { nombre: 'San Juan', codigo: 'AR-J' },
    { nombre: 'San Luis', codigo: 'AR-D' },
    { nombre: 'Santa Cruz', codigo: 'AR-Z' },
    { nombre: 'Santa Fe', codigo: 'AR-S' },
    { nombre: 'Santiago del Estero', codigo: 'AR-G' },
    { nombre: 'Tierra del Fuego', codigo: 'AR-V' },
    { nombre: 'Tucumán', codigo: 'AR-T' }
];

// IMPORTAR TODAS LAS JURISDICCIONES DE FORMA SECUENCIAL
const importarProvinciasDesde = async (codigoInicio = 'AR-C') => {
    const indiceInicio = provincias.findIndex(
        provincia => provincia.codigo === codigoInicio
    );

    if (indiceInicio === -1) {
        throw new Error('Código de provincia inválido');
    }

    let total = 0;

    for (let i = indiceInicio; i < provincias.length; i++) {
        const provincia = provincias[i];

        console.log(
            `Importando ${provincia.nombre} (${provincia.codigo})...`
        );

        try {
            const cantidad = await importarLugaresProvincia(
                provincia.codigo
            );

            total += cantidad;

        } catch (error) {
            throw new Error(
                `La importación se detuvo en ${provincia.nombre} (${provincia.codigo}). ` +
                `Podés reanudar desde ese código. ${error.message}`
            );
        }

        // Esperar 20 segundos antes de consultar la siguiente jurisdicción
        if (i < provincias.length - 1) {
            console.log('Esperando 20 segundos...');
            await new Promise(resolve => setTimeout(resolve, 20000));
        }
    }

    console.log(`Importación finalizada. Total procesado: ${total}`);

    return total;
};

module.exports = {
    guardarLugaresOSM,
    importarLugaresProvincia,
    importarProvinciasDesde
};