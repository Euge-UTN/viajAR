const express = require('express');
const router = express.Router();

const {
    crearResena,
    obtenerResenasPorLugar,
    obtenerResenas,
    eliminarResena
} = require('../controllers/resenaController');

// CONSULTAR LAS RESEÑAS DEL USUARIO
router.get('/', obtenerResenas);

// CONSULTAR LAS RESEÑAS DE UN LUGAR
router.get('/lugar/:idLugar', obtenerResenasPorLugar);

// PUBLICAR UNA RESEÑA
router.post('/:idLugar', crearResena);

// ELIMINAR UNA RESEÑA
router.delete('/:idResena', eliminarResena);

module.exports = router;