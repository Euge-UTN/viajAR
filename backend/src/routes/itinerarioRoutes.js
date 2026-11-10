const express = require('express');
const router = express.Router();

const {
    obtenerItinerarios,
    obtenerItinerarioPorId,
    crearItinerario,
    actualizarItinerario,
    eliminarItinerario
} = require('../controllers/itinerarioController');

// Consultar los itinerarios de un viaje
router.get('/viaje/:idViaje', obtenerItinerarios);

// Agregar un lugar al itinerario de un viaje
router.post('/viaje/:idViaje', crearItinerario);

// Consultar un itinerario por ID
router.get('/:id', obtenerItinerarioPorId);

// Modificar un itinerario
router.put('/:id', actualizarItinerario);

// Eliminar un itinerario
router.delete('/:id', eliminarItinerario);

module.exports = router;