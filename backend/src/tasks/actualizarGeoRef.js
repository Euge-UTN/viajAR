const {
    importarProvincias,
    importarLocalidades
} = require('../services/georefService');

const {
    importarProvinciasDesde
} = require('../services/overpassImportService');

const actualizarGeoRef = async () => {
    try {
        console.log('Iniciando actualización de datos de GeoRef...');

        await importarProvincias();
        await importarLocalidades();

        console.log('Actualización de GeoRef finalizada correctamente.');

    } catch (error) {
        console.error('Error al actualizar GeoRef:', error.message);
    }

    try {
        console.log('Iniciando actualización de lugares turísticos de Overpass...');

        await importarProvinciasDesde();

        console.log('Actualización de Overpass finalizada correctamente.');

    } catch (error) {
        console.error('Error al actualizar Overpass:', error.message);
    }
};

module.exports = { actualizarGeoRef };