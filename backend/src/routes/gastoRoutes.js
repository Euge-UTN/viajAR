const express = require('express');
const router = express.Router();

const {
    crearGasto,
    obtenerGastos,
    modificarGasto,
    eliminarGasto,
    obtenerResumenGastos
} = require('../controllers/gastoController');

// Registrar un gasto en un viaje
router.post('/viaje/:idViaje', crearGasto);

// Consultar los gastos de un viaje
router.get('/viaje/:idViaje', obtenerGastos);

// Consultar el resumen de gastos de un viaje
router.get('/viaje/:idViaje/resumen', obtenerResumenGastos);

// Modificar un gasto
router.put('/viaje/:idViaje/:idGasto', modificarGasto);

// Eliminar un gasto
router.delete('/viaje/:idViaje/:idGasto', eliminarGasto);


module.exports = router;
