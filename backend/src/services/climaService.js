const obtenerClima = async (latitud, longitud, fecha) => {
    // Validar formato y existencia de la fecha
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
        const error = new Error('La fecha debe tener el formato YYYY-MM-DD');
        error.statusCode = 400;
        throw error;
    }

    const fechaSolicitada = new Date(`${fecha}T00:00:00Z`);

    if (
        Number.isNaN(fechaSolicitada.getTime()) ||
        fechaSolicitada.toISOString().slice(0, 10) !== fecha
    ) {
        const error = new Error('La fecha ingresada no es válida');
        error.statusCode = 400;
        throw error;
    }

    // Obtener la fecha actual de Argentina
    const partes = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Argentina/Buenos_Aires',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).formatToParts(new Date());

    const hoy = partes
        .filter(parte => ['year', 'month', 'day'].includes(parte.type))
        .map(parte => parte.value)
        .join('-');

    const diferenciaDias = Math.round(
        (fechaSolicitada.getTime() - new Date(`${hoy}T00:00:00Z`).getTime())
        / (1000 * 60 * 60 * 24)
    );

    if (diferenciaDias < -92 || diferenciaDias > 16) {
        const error = new Error(
            'La fecha está fuera del rango disponible para consultar el clima'
        );
        error.statusCode = 400;
        throw error;
    }

    const url = new URL('https://api.open-meteo.com/v1/forecast');

    url.search = new URLSearchParams({
        latitude: latitud,
        longitude: longitud,
        daily: 'temperature_2m_max,temperature_2m_min,apparent_temperature_max,precipitation_probability_max,weather_code',
        timezone: 'auto',
        start_date: fecha,
        end_date: fecha
    });

    // Realizar hasta 3 intentos ante fallos de la API
    const maxIntentos = 3;

    for (let intento = 1; intento <= maxIntentos; intento++) {
        try {
            const respuesta = await fetch(url, {
                signal: AbortSignal.timeout(10000)
            });

            if (!respuesta.ok) {
                // No repetir errores de solicitud (4xx), pero sí errores temporales (429 y 5xx).
                if (respuesta.status !== 429 && respuesta.status < 500) {
                    const error = new Error(
                        `Error de Open-Meteo: ${respuesta.status}`
                    );
                    error.statusCode = 502;
                    throw error;
                }

                throw new Error(`Error temporal de Open-Meteo: ${respuesta.status}`);
            }

            const datos = await respuesta.json();

            if (datos.error) {
                const error = new Error(datos.reason || 'Error de Open-Meteo');
                error.statusCode = 502;
                throw error;
            }

            if (!datos.daily || !datos.daily.time || !datos.daily.time.length) {
                throw new Error('No hay pronóstico disponible para esa fecha');
            }

            return {
                fecha: datos.daily.time[0],
                temperaturaMaxima: datos.daily.temperature_2m_max[0],
                temperaturaMinima: datos.daily.temperature_2m_min[0],
                sensacionTermicaMaxima: datos.daily.apparent_temperature_max[0],
                probabilidadLluvia: datos.daily.precipitation_probability_max[0],
                descripcion: obtenerDescripcionClima(datos.daily.weather_code[0])
            };

        } catch (error) {
            console.error(
                `Error al consultar el clima (intento ${intento}/${maxIntentos}):`,
                error.message
            );
            if (error.statusCode === 400 || error.statusCode === 502) {
                throw error;
            }

            if (intento === maxIntentos) {
                const errorFinal = new Error(
                    'No se pudo obtener la información del clima. Intentá nuevamente más tarde.'
                );
                errorFinal.statusCode = 503;
                throw errorFinal;
            }

            // Espera antes de volver a intentar
            await new Promise(resolve =>
                setTimeout(resolve, intento * 1000)
            );
        }
    }
};

const obtenerDescripcionClima = (codigo) => {
    const descripciones = {
        0: 'Despejado',
        2: 'Parcialmente nublado',
        3: 'Nublado',
        45: 'Niebla',
        51: 'Llovizna ligera',
        53: 'Llovizna moderada',
        55: 'Llovizna intensa',
        61: 'Lluvia ligera',
        63: 'Lluvia moderada',
        65: 'Lluvia intensa',
        71: 'Nevada ligera',
        73: 'Nevada moderada',
        75: 'Nevada intensa',
        80: 'Chaparrones ligeros',
        81: 'Chaparrones moderados',
        82: 'Chaparrones intensos',
        95: 'Tormenta'
    };

    return descripciones[codigo] || 'Condición meteorológica no disponible';
};

module.exports = { obtenerClima };
