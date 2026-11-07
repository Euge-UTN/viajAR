const obtenerClima = async (latitud, longitud, fecha) => {
    try {
        const url = new URL('https://api.open-meteo.com/v1/forecast');

        url.search = new URLSearchParams({
            latitude: latitud,
            longitude: longitud,
            daily: 'temperature_2m_max,temperature_2m_min,apparent_temperature_max,precipitation_probability_max,weather_code',
            timezone: 'auto',
            start_date: fecha,
            end_date: fecha
        });

        const respuesta = await fetch(url);

        if (!respuesta.ok) {
            throw new Error(`Error de Open-Meteo: ${respuesta.status}`);
        }

        const datos = await respuesta.json();

        if (!datos.daily || !datos.daily.time.length) {
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
        console.error('Error al consultar el clima:', error.message);
        throw error;
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