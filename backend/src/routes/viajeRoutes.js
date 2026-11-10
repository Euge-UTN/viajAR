const express = require('express');
const router = express.Router();

const {
    obtenerViajes,
    obtenerViajePorId,
    crearViaje,
    actualizarViaje,
    eliminarViaje
} = require('../controllers/viajeController');

// Consultar todos los viajes del usuario
router.get('/', obtenerViajes);

// Consultar un viaje por ID
router.get('/:id', obtenerViajePorId);

// Crear un viaje
router.post('/', crearViaje);

// Modificar un viaje
router.put('/:id', actualizarViaje);

// Eliminar un viaje
router.delete('/:id', eliminarViaje);

module.exports = router;