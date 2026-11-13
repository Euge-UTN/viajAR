const express = require('express');
const router = express.Router();

const {
    agregarFavorito,
    obtenerFavoritos,
    eliminarFavorito
} = require('../controllers/favoritoController');

// CONSULTAR LOS LUGARES FAVORITOS
router.get('/', obtenerFavoritos);

// AGREGAR UN LUGAR A FAVORITOS
router.post('/:idLugar', agregarFavorito);

// ELIMINAR UN LUGAR DE FAVORITOS
router.delete('/:idLugar', eliminarFavorito);

module.exports = router;