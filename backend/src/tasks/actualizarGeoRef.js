const {
    importarProvincias,
    importarLocalidades
} = require('../services/georefService');

const actualizarGeoRef = async () => {
    try {
        console.log('Iniciando actualización de datos de GeoRef...');

        await importarProvincias();
        await importarLocalidades();

        console.log('Actualización de GeoRef finalizada correctamente.');
    } catch (error) {
        console.error('Error al actualizar datos de GeoRef:', error.message);
    }
};

module.exports = { actualizarGeoRef };