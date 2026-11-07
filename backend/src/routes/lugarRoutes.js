const express = require('express');
const router = express.Router();

const {
    obtenerLugares,
    obtenerLugarPorId,
    buscarLugares,
    crearLugar,
    actualizarLugar,
    eliminarLugar,
    consultarClima
} = require('../controllers/lugarController');

// Consultar todos los lugares
router.get('/', obtenerLugares);

// Buscar lugares por nombre, localidad o provincia
router.get('/buscar', buscarLugares);

// Consultar el clima de un lugar turístico para una fecha
router.get('/:id/clima', consultarClima);

router.get('/:id', obtenerLugarPorId);

router.post('/', crearLugar);

router.put('/:id', actualizarLugar);

router.delete('/:id', eliminarLugar);

module.exports = router;