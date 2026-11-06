const express = require('express');
const router = express.Router();

const {
    obtenerLugares,
    obtenerLugarPorId,
    buscarLugares,
    crearLugar,
    actualizarLugar,
    eliminarLugar
} = require('../controllers/lugarController');

// Consultar todos los lugares
router.get('/', obtenerLugares);

// Buscar lugares por nombre, localidad o provincia
router.get('/buscar', buscarLugares);

router.get('/:id', obtenerLugarPorId);

router.post('/', crearLugar);

router.put('/:id', actualizarLugar);

router.delete('/:id', eliminarLugar);

module.exports = router;