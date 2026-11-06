const obtenerLugaresOSM = async (codigoProvincia) => {
    try {
        if (!/^AR-[A-Z]{1,2}$/.test(codigoProvincia)) {
            throw new Error('Código de provincia inválido');
        }

        const consulta = `
            [out:json][timeout:180];

            area["ISO3166-2"="${codigoProvincia}"]["admin_level"="4"]->.provincia;

            nwr["tourism"~"^(attraction|museum|viewpoint|theme_park|zoo|aquarium|gallery|artwork|picnic_site)$"]["name"](area.provincia);

            out center tags 20;
        `;

        const esperas = [0, 10000, 20000, 40000];

        for (let intento = 0; intento < esperas.length; intento++) {

            if (esperas[intento] > 0) {
                console.log(
                    `Reintentando consulta en ${esperas[intento] / 1000} segundos...`
                );

                await new Promise(resolve =>
                    setTimeout(resolve, esperas[intento])
                );
            }

            const respuesta = await fetch(
                'https://overpass-api.de/api/interpreter',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'User-Agent': 'ViajAR/1.0 (proyecto educativo)',
                        'Accept': 'application/json'
                    },
                    body: new URLSearchParams({
                        data: consulta
                    })
                }
            );

            if (respuesta.ok) {
                const datos = await respuesta.json();
                return datos.elements;
            }

            const detalle = await respuesta.text();

            const puedeReintentar = [429, 502, 503, 504]
                .includes(respuesta.status);

            if (!puedeReintentar || intento === esperas.length - 1) {
                throw new Error(
                    `Error de Overpass API: ${respuesta.status} - ${detalle}`
                );
            }

            console.log(
                `Overpass respondió ${respuesta.status}. Se volverá a intentar.`
            );
        }

    } catch (error) {
        console.error('Error al consultar Overpass API:', error.message);
        throw error;
    }
};

module.exports = {
    obtenerLugaresOSM
};